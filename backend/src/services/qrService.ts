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
   * Generates a signed, short-lived attendance token & QR code for an event,
   * along with an easily shareable special human check-in code.
   */
  public static async generateAttendanceQR(eventId: string, validityMinutes: number = 60): Promise<QRTokenData> {
    const event = db.events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');

    const rawSecret = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + validityMinutes * 60 * 1000).toISOString();
    
    // Hash token for database storage
    const tokenHash = crypto.createHash('sha256').update(rawSecret).digest('hex');
    const tokenId = uuidv4();

    // Generate a memorable 6-character special check-in code e.g. "IMP-4829"
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const specialCode = `IMP-${randomNum}`;

    // Deactivate prior tokens for this event
    db.attendance_tokens.forEach(t => {
      if (t.event_id === eventId) t.is_active = false;
    });

    const tokenRecord = {
      id: tokenId,
      event_id: eventId,
      token_hash: tokenHash,
      raw_token: rawSecret, // for fast lookup match
      special_code: specialCode,
      expires_at: expiresAt,
      is_active: true,
      created_at: new Date().toISOString()
    };
    db.attendance_tokens.push(tokenRecord);

    // Keep active special check-in code on event object for instant organizer display
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
   * Validates scanned token or manual special code and checks in the volunteer
   */
  public static verifyAndCheckIn(
    eventId: string | undefined,
    volunteerId: string,
    inputCodeOrToken: string,
    coordinates?: { latitude?: number; longitude?: number }
  ): { success: boolean; message: string; record?: any; eventId?: string } {
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

    // Match against active tokens
    const matchedToken = db.attendance_tokens.find(t => {
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

    if (!matchedToken) {
      return { success: false, message: 'Invalid or expired check-in code or QR token. Please check the code with the event organizer.' };
    }

    const resolvedEventId = matchedToken.event_id;
    const event = db.events.find(e => e.id === resolvedEventId);
    if (!event) return { success: false, message: 'Event associated with this token does not exist.' };

    if (new Date() > new Date(matchedToken.expires_at)) {
      matchedToken.is_active = false;
      return { success: false, message: 'Attendance code or QR has expired. Please ask the organizer to refresh the code.' };
    }

    // Check if volunteer is registered and confirmed
    const registration = db.event_registrations.find(
      r => r.event_id === resolvedEventId && r.volunteer_id === volunteerId
    );
    if (!registration) {
      return { success: false, message: `Volunteer has not registered for this event ("${event.title}").` };
    }
    if (registration.status !== 'CONFIRMED') {
      return { success: false, message: `Registration is not confirmed (Status: ${registration.status}).` };
    }

    // Check for duplicate attendance record
    const existing = db.attendance_records.find(
      a => a.event_id === resolvedEventId && a.volunteer_id === volunteerId
    );
    if (existing) {
      return {
        success: false,
        message: `Volunteer already checked in at ${new Date(existing.checked_in_at).toLocaleTimeString()}`,
        record: existing,
        eventId: resolvedEventId
      };
    }

    // Record attendance
    const attendanceRecord = {
      id: uuidv4(),
      event_id: resolvedEventId,
      volunteer_id: volunteerId,
      status: 'PRESENT',
      checked_in_at: new Date().toISOString(),
      check_in_method: (upperInput.startsWith('IMP-') || upperInput.length <= 8) ? 'SPECIAL_CODE' : 'QR_SCAN',
      latitude: coordinates?.latitude || null,
      longitude: coordinates?.longitude || null,
      token_used: matchedToken.id
    };
    db.attendance_records.push(attendanceRecord);

    // Update volunteer total hours
    const vol = db.volunteer_profiles.find(v => v.id === volunteerId);
    if (vol) {
      vol.total_hours_volunteered = (vol.total_hours_volunteered || 0) + 4.0;
    }

    // Sync to Firestore
    FirestoreSync.setDoc('attendance_records', attendanceRecord.id, attendanceRecord).catch(() => {});

    return {
      success: true,
      message: `Attendance successfully confirmed for "${event.title}"! Welcome to the event.`,
      record: attendanceRecord,
      eventId: resolvedEventId
    };
  }
}

