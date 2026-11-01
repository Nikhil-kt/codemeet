import { Response } from 'express';
import { db } from '../db/store';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { QRService } from '../services/qrService';
import { SocketService } from '../services/socketService';
import { GeminiService } from '../services/geminiService';
import { FirestoreSync } from '../db/firestoreSync';

export class AttendanceController {
  public static async generateToken(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const eventId = req.params.eventId || req.body.eventId;
      const validityMinutes = req.body.validityMinutes || (req.body.validitySeconds ? Math.ceil(req.body.validitySeconds / 60) : 60);

      if (!eventId) {
        res.status(400).json({ success: false, message: 'Event ID is required.' });
        return;
      }

      const event = db.events.find(e => e.id === eventId);
      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found.' });
        return;
      }

      const qrResult = await QRService.generateAttendanceQR(eventId, validityMinutes);

      res.json({
        success: true,
        message: 'Attendance QR and Special Check-In Code generated successfully.',
        data: qrResult,
        token: qrResult
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'QR generation failed', error: err.message });
    }
  }

  public static async checkIn(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const eventId = req.body.eventId;
      const tokenInput = req.body.token || req.body.code || req.body.specialCode;
      const { latitude, longitude } = req.body;

      const vol = db.volunteer_profiles.find(v => v.profile_id === req.user?.profileId);
      if (!vol) {
        res.status(403).json({ success: false, message: 'Only registered volunteers can check in.' });
        return;
      }

      if (!tokenInput) {
        res.status(400).json({ success: false, message: 'Attendance check-in code or QR token is required.' });
        return;
      }

      const checkInResult = QRService.verifyAndCheckIn(eventId, vol.id, tokenInput, { latitude, longitude });

      if (!checkInResult.success) {
        res.status(400).json(checkInResult);
        return;
      }

      const targetEventId = checkInResult.eventId || eventId;
      const event = db.events.find(e => e.id === targetEventId);
      const org = db.organizations.find(o => o.id === event?.organization_id);
      const profile = db.profiles.find(p => p.id === vol.profile_id);

      // 1. Generate or fetch official Gemini AI-Endorsed Certificate
      let certificate = db.certificates.find(
        c => c.event_id === targetEventId && c.volunteer_id === vol.id
      );

      if (!certificate && event) {
        // Fetch volunteer skills names
        const volSkills = db.volunteer_skills
          .filter(vs => vs.volunteer_id === vol.id)
          .map(vs => {
            const skillObj = db.skills.find(s => s.id === vs.skill_id);
            return skillObj?.name || 'Community Service';
          });

        // Call Gemini AI for personalized commendation
        const aiCommendation = await GeminiService.generateCertificateCommendation({
          volunteerName: profile?.full_name || 'ImpactLink Volunteer',
          eventTitle: event.title,
          category: event.category || 'COMMUNITY_DEVELOPMENT',
          orgName: org?.name || 'Community Impact Partner',
          city: event.city || event.location_name,
          skills: volSkills.length > 0 ? volSkills : ['Community Volunteering', 'Civic Action']
        });

        const certId = `IL-CERT-${targetEventId.slice(0, 4).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

        certificate = {
          id: certId,
          certificate_id: certId,
          certificate_number: certId,
          event_id: targetEventId,
          event_title: event.title,
          event_category: event.category,
          event_date: event.event_date,
          volunteer_id: vol.id,
          volunteer_name: profile?.full_name || 'Community Volunteer',
          organization_id: org?.id,
          organization_name: org?.name || 'Community Partner Organization',
          hours_awarded: 4.0,
          issued_at: new Date().toISOString(),
          checked_in_at: checkInResult.record?.checked_in_at,
          gemini_commendation: aiCommendation.commendation,
          highlighted_skills: aiCommendation.highlighted_skills,
          impact_summary: aiCommendation.impact_summary,
          ai_badge: aiCommendation.ai_badge,
          model_used: aiCommendation.model_used,
          verification_status: 'AI_VERIFIED',
          status: 'ISSUED'
        };

        db.certificates.push(certificate);

        // Sync Certificate to Firestore
        FirestoreSync.setDoc('certificates', certId, certificate).catch(() => {});
      }

      // Broadcast attendance to active organizer dashboard
      SocketService.broadcastAttendanceCheckIn(targetEventId, {
        volunteerId: vol.id,
        volunteerName: profile?.full_name,
        checkedInAt: checkInResult.record?.checked_in_at,
        status: 'PRESENT'
      });

      res.json({
        ...checkInResult,
        certificate
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Check-in failed', error: err.message });
    }
  }

  public static async getMyCertificates(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const vol = db.volunteer_profiles.find(v => v.profile_id === req.user?.profileId);
      if (!vol) {
        res.status(403).json({ success: false, message: 'Volunteer profile not found.' });
        return;
      }

      const certs = db.certificates.filter(c => c.volunteer_id === vol.id);
      res.json({ success: true, count: certs.length, certificates: certs });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve certificates', error: err.message });
    }
  }

  public static async getEventCertificate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const vol = db.volunteer_profiles.find(v => v.profile_id === req.user?.profileId);
      if (!vol) {
        res.status(403).json({ success: false, message: 'Volunteer profile not found.' });
        return;
      }

      const cert = db.certificates.find(c => c.event_id === eventId && c.volunteer_id === vol.id);
      if (!cert) {
        res.status(404).json({ success: false, message: 'Certificate not found for this event. Please verify attendance first.' });
        return;
      }

      res.json({ success: true, certificate: cert });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve certificate', error: err.message });
    }
  }

  public static async getEventAttendance(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { eventId } = req.params;
    const records = db.attendance_records
      .filter(a => a.event_id === eventId)
      .map(a => {
        const vol = db.volunteer_profiles.find(v => v.id === a.volunteer_id);
        const profile = db.profiles.find(p => p.id === vol?.profile_id);
        return {
          ...a,
          volunteer_name: profile?.full_name,
          volunteer_email: profile?.email,
          volunteer_phone: profile?.phone
        };
      });

    res.json({ success: true, count: records.length, attendance: records });
  }
}

