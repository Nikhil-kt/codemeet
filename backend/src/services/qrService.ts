import QRCode from 'qrcode';
import crypto from 'crypto';
import { db } from '../db/store';
import { v4 as uuidv4 } from 'uuid';
import { FirestoreSync } from '../db/firestoreSync';

export interface QRTokenData {
  tokenId: string;
  eventId: string;
  tokenHash: string;
  qrDataUrl: string;
  specialCode: string;
  expiresAt: string;
}

export class QRService {
  /**
   * Deterministically generates a unique 4-digit code e.g. "IMP-4829" from an event ID
   */
  public static generateStaticCodeForId(eventId: string): string {
    if (!eventId) return 'IMP-2026';
    const hash = crypto.createHash('sha256').update(String(eventId)).digest('hex');
    const num = (parseInt(hash.slice(0, 8), 16) % 9000) + 1000;
    return `IMP-${num}`;
  }

  /**
   * Returns the static secret check-in code for an event.
   * Guaranteed to be static, identical for all volunteers of that event, and unique per event.
   */
  public static getEventSecretCode(event: any): string {
    if (!event) return 'IMP-2026';

    if (event.secret_code) {
      return String(event.secret_code).trim().toUpperCase();
    }
    if (event.check_in_code) {
      event.secret_code = String(event.check_in_code).trim().toUpperCase();
      return event.secret_code;
    }

    let candidateCode = this.generateStaticCodeForId(event.id);

    // Ensure collision-free uniqueness across events
    let attempts = 0;
    while (
      db.events.some(
        e => e.id !== event.id && (e.secret_code === candidateCode || e.check_in_code === candidateCode)
      ) &&
      attempts < 100
    ) {
      const altHash = crypto.createHash('sha256').update(`${event.id}_salt_${attempts}`).digest('hex');
      const altNum = (parseInt(altHash.slice(0, 8), 16) % 9000) + 1000;
      candidateCode = `IMP-${altNum}`;
      attempts++;
    }

    event.secret_code = candidateCode;
    event.check_in_code = candidateCode;
    (event as any).active_check_in_code = candidateCode;

    return candidateCode;
  }

  /**
   * Generates or retrieves the static attendance token & QR code for an event.
   * The code is static and same for all volunteers of this event.
   */
  public static async generateAttendanceQR(eventId: string, validityMinutes: number = 60 * 24 * 365): Promise<QRTokenData> {
    const event = db.events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');

    const specialCode = this.getEventSecretCode(event);

    // Reuse existing active token record if already created to ensure 100% static stability
    let tokenRecord = db.attendance_tokens.find(t => t.event_id === eventId && t.is_active);

    if (tokenRecord) {
      tokenRecord.special_code = specialCode;
      (event as any).active_check_in_code = specialCode;

      const payload = JSON.stringify({
        impactlink_qr: true,
        type: 'ATTENDANCE_CHECK_IN',
        eventId,
        token: tokenRecord.raw_token,
        specialCode,
        expiresAt: tokenRecord.expires_at
      });

      const qrDataUrl = await QRCode.toDataURL(payload, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 340,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });

      return {
        tokenId: tokenRecord.id,
        eventId,
        tokenHash: tokenRecord.token_hash,
        qrDataUrl,
        specialCode,
        expiresAt: tokenRecord.expires_at
      };
    }

    // Create a static token for this event valid across the campaign lifecycle
    const rawSecret = crypto.createHash('sha256').update(`token_secret_${eventId}`).digest('hex').slice(0, 32);
    const tokenHash = crypto.createHash('sha256').update(rawSecret).digest('hex');
    const tokenId = `token-${eventId}`;
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    tokenRecord = {
      id: tokenId,
      event_id: eventId,
      token_hash: tokenHash,
      raw_token: rawSecret,
      special_code: specialCode,
      expires_at: expiresAt,
      is_active: true,
      created_at: new Date().toISOString()
    };
    db.attendance_tokens.push(tokenRecord);

    (event as any).active_check_in_code = specialCode;

    // Payload embedded in the QR image
    const payload = JSON.stringify({
      impactlink_qr: true,
      type: 'ATTENDANCE_CHECK_IN',
      eventId,
      token: rawSecret,
      specialCode,
      expiresAt
    });

    const qrDataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 340,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });

    // Sync active token to Firestore
    FirestoreSync.setDoc('attendance_tokens', tokenId, tokenRecord).catch(() => {});
    FirestoreSync.setDoc('events', eventId, event).catch(() => {});

    return {
      tokenId,
      eventId,
      tokenHash,
      qrDataUrl,
      specialCode,
      expiresAt
    };
  }

  /**
   * Validates scanned token or manual special code and checks in the volunteer.
   * Matches against the event's static code or token.
   */
  public static verifyAndCheckIn(
    eventId: string | undefined,
    volunteerId: string,
    inputCodeOrToken: string,
    coordinates?: { latitude?: number; longitude?: number }
  ): { success: boolean; message: string; record?: any; eventId?: string; alreadyCheckedIn?: boolean } {
    let cleanInput = (inputCodeOrToken || '').trim();

    // In case the input is a full JSON string from a QR code scanner
    if (cleanInput.startsWith('{') && cleanInput.endsWith('}')) {
      try {
        const parsed = JSON.parse(cleanInput);
        if (parsed.specialCode) cleanInput = parsed.specialCode;
        else if (parsed.token) cleanInput = parsed.token;
        if (!eventId && parsed.eventId) eventId = parsed.eventId;
      } catch (e) {
        // Continue with raw string
      }
    }

    const upperInput = cleanInput.toUpperCase();
    const cleanNumbersOnly = upperInput.replace(/[^0-9A-Z]/g, '').replace(/^IMP/, '');

    // 1. First, match against static secret code of events
    let targetEvent = db.events.find(e => {
      if (eventId && e.id !== eventId) return false;
      const eventCode = QRService.getEventSecretCode(e);
      const eventNumbersOnly = eventCode.replace(/^IMP-/, '');

      return (
        eventCode === upperInput ||
        eventCode === `IMP-${upperInput}` ||
        `IMP-${cleanNumbersOnly}` === eventCode ||
        eventNumbersOnly === upperInput ||
        (cleanNumbersOnly.length >= 3 && eventNumbersOnly === cleanNumbersOnly)
      );
    });

    // 2. If not matched directly on event code, match against attendance_tokens
    let matchedToken: any = null;
    if (!targetEvent) {
      matchedToken = db.attendance_tokens.find(t => {
        if (!t.is_active) return false;
        if (eventId && t.event_id !== eventId) return false;

        const codeMatches =
          t.special_code?.toUpperCase() === upperInput ||
          t.special_code?.toUpperCase() === `IMP-${upperInput}` ||
          (t.special_code && upperInput.length >= 4 && t.special_code.endsWith(upperInput));

        const tokenMatches =
          t.raw_token === cleanInput ||
          t.token_hash === cleanInput ||
          t.id === cleanInput;

        return codeMatches || tokenMatches;
      });

      if (matchedToken) {
        targetEvent = db.events.find(e => e.id === matchedToken.event_id);
      }
    }

    if (!targetEvent) {
      if (eventId) {
        const selectedEvent = db.events.find(e => e.id === eventId);
        return {
          success: false,
          message: `Invalid check-in code for "${selectedEvent?.title || 'this event'}". Please verify the static code announced by the organizer.`
        };
      }
      return {
        success: false,
        message: 'Invalid check-in code or QR token. Please enter the secret code provided by your event organizer.'
      };
    }

    const resolvedEventId = targetEvent.id;

    // Check if volunteer is registered and confirmed for this event
    const registration = db.event_registrations.find(
      r => r.event_id === resolvedEventId && r.volunteer_id === volunteerId
    );
    if (!registration) {
      return {
        success: false,
        message: `You have not registered for "${targetEvent.title}". Only registered volunteers can check in.`
      };
    }
    if (registration.status !== 'CONFIRMED') {
      return {
        success: false,
        message: `Your registration for "${targetEvent.title}" is ${registration.status}. Only confirmed volunteers can check in.`
      };
    }

    // Check for existing attendance record
    const existing = db.attendance_records.find(
      a => a.event_id === resolvedEventId && a.volunteer_id === volunteerId
    );
    if (existing) {
      return {
        success: true,
        alreadyCheckedIn: true,
        message: `Attendance already verified for "${targetEvent.title}"! Your certificate is available below.`,
        record: existing,
        eventId: resolvedEventId
      };
    }

    // Record new attendance
    const attendanceRecord = {
      id: uuidv4(),
      event_id: resolvedEventId,
      volunteer_id: volunteerId,
      status: 'PRESENT',
      checked_in_at: new Date().toISOString(),
      check_in_method: (upperInput.startsWith('IMP-') || upperInput.length <= 8) ? 'SPECIAL_CODE' : 'QR_SCAN',
      latitude: coordinates?.latitude || null,
      longitude: coordinates?.longitude || null,
      token_used: matchedToken?.id || `static-${resolvedEventId}`
    };
    db.attendance_records.push(attendanceRecord);

    // Update registration attendance status
    (registration as any).attendance_status = 'PRESENT';
    (registration as any).checked_in_at = attendanceRecord.checked_in_at;

    // Update volunteer total hours
    const vol = db.volunteer_profiles.find(v => v.id === volunteerId);
    if (vol) {
      vol.total_hours_volunteered = (vol.total_hours_volunteered || 0) + 4.0;
    }

    // Sync to Firestore
    FirestoreSync.setDoc('attendance_records', attendanceRecord.id, attendanceRecord).catch(() => {});
    FirestoreSync.setDoc('event_registrations', registration.id, registration).catch(() => {});

    return {
      success: true,
      message: `Attendance successfully confirmed for "${targetEvent.title}"! Welcome to the event.`,
      record: attendanceRecord,
      eventId: resolvedEventId
    };
  }
}
