import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/store';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { QueueService } from '../services/queueService';
import { RegistrationStatus } from '../types';
import { FirestoreSync } from '../db/firestoreSync';

export class RegistrationController {
  public static async registerForEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const { notes } = req.body;

      let vol = db.volunteer_profiles.find(
        v => v.profile_id === req.user?.profileId || v.id === req.user?.volunteerId
      );

      // Auto-create volunteer record if missing for a user with VOLUNTEER or TEAM_LEADER role
      if (!vol && (req.user?.role === 'VOLUNTEER' || req.user?.role === 'TEAM_LEADER')) {
        vol = {
          id: uuidv4(),
          profile_id: req.user.profileId,
          bio: 'Community volunteer',
          city: 'Chennai',
          district: 'Chennai',
          state: 'Tamil Nadu',
          postal_code: '600001',
          latitude: 13.0827,
          longitude: 80.2707,
          location_preference_enabled: true,
          reliability_score: 70.00,
          is_provisional: true,
          total_hours_volunteered: 0.0,
          preferred_categories: ['COMMUNITY_WELFARE'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        db.volunteer_profiles.push(vol);
      }

      if (!vol) {
        res.status(403).json({ success: false, message: 'Only volunteers can register for events.' });
        return;
      }

      const event = db.events.find(e => e.id === eventId);
      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found.' });
        return;
      }

      // Check existing registration
      const existing = db.event_registrations.find(
        r => r.event_id === eventId && r.volunteer_id === vol.id
      );
      if (existing) {
        res.status(400).json({
          success: false,
          message: `Already registered with status: ${existing.status}`,
          registration: existing
        });
        return;
      }

      // Check capacity
      const maxLimit = event.max_capacity || event.volunteers_required || 15;
      const confirmedCount = db.event_registrations.filter(
        r => r.event_id === eventId && r.status === 'CONFIRMED'
      ).length;

      if (confirmedCount >= maxLimit || event.status === 'REGISTRATION_CLOSED') {
        event.status = 'REGISTRATION_CLOSED';
        await FirestoreSync.setDoc('events', event.id, event);
        res.status(400).json({
          success: false,
          message: `Registration is closed. Maximum capacity (${maxLimit} volunteers) has been reached.`,
          registrationClosed: true
        });
        return;
      }

      const status: RegistrationStatus = 'CONFIRMED';
      event.confirmed_count = confirmedCount + 1;
      if (event.confirmed_count >= maxLimit) {
        event.status = 'REGISTRATION_CLOSED';
        await FirestoreSync.setDoc('events', event.id, event);
      }

      const regRecord = {
        id: uuidv4(),
        event_id: eventId,
        volunteer_id: vol.id,
        status,
        registered_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString(),
        notes: notes || null
      };
      db.event_registrations.push(regRecord);
      await FirestoreSync.setDoc('event_registrations', regRecord.id, regRecord);

      // Send confirmation notification
      await QueueService.dispatchNotification({
        userId: vol.profile_id,
        title: `Registration Confirmed: ${event.title}`,
        message: `You are confirmed for "${event.title}" on ${event.event_date}. See you there!`,
        notificationType: 'REGISTRATION_CONFIRMED',
        actionLink: `/events/${event.id}`
      });

      res.status(201).json({
        success: true,
        message: 'Registration confirmed successfully!',
        registration: regRecord,
        spotsRemaining: Math.max(0, maxLimit - event.confirmed_count)
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
    }
  }

  public static async cancelRegistration(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const vol = db.volunteer_profiles.find(v => v.profile_id === req.user?.profileId);

      const reg = db.event_registrations.find(r => r.id === id);
      if (!reg) {
        res.status(404).json({ success: false, message: 'Registration not found.' });
        return;
      }

      if (reg.volunteer_id !== vol?.id && req.user?.role !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'Unauthorized cancellation.' });
        return;
      }

      const wasConfirmed = reg.status === 'CONFIRMED';
      reg.status = 'CANCELLED';

      // If a confirmed volunteer cancelled, promote the first waitlisted volunteer!
      if (wasConfirmed) {
        const event = db.events.find(e => e.id === reg.event_id);
        if (event) {
          event.confirmed_count = Math.max(0, event.confirmed_count - 1);
        }

        const nextWaitlisted = db.waitlists
          .filter(w => w.event_id === reg.event_id && w.status === 'WAITING')
          .sort((a, b) => a.position - b.position)[0];

        if (nextWaitlisted) {
          nextWaitlisted.status = 'OFFERED';
          const waitlistedReg = db.event_registrations.find(
            r => r.event_id === reg.event_id && r.volunteer_id === nextWaitlisted.volunteer_id
          );
          if (waitlistedReg) {
            waitlistedReg.status = 'CONFIRMED';
            waitlistedReg.confirmed_at = new Date().toISOString();
            if (event) event.confirmed_count += 1;

            const nextVol = db.volunteer_profiles.find(v => v.id === nextWaitlisted.volunteer_id);
            if (nextVol) {
              await QueueService.dispatchNotification({
                userId: nextVol.profile_id,
                title: `Spot Available! Promoted from Waitlist`,
                message: `A spot opened for "${event?.title}"! Your registration is now confirmed.`,
                notificationType: 'WAITLIST_PROMOTED',
                actionLink: `/events/${event?.id}`
              });
            }
          }
        }
      }

      res.json({ success: true, message: 'Registration cancelled successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Cancellation failed', error: err.message });
    }
  }

  public static async getEventRegistrations(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { eventId } = req.params;
    const event = db.events.find(e => e.id === eventId);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found.' });
      return;
    }

    const org = db.organizations.find(o => o.profile_id === req.user?.profileId);
    if (req.user?.role !== 'ADMIN' && event.organization_id !== org?.id) {
      res.status(403).json({ success: false, message: 'Unauthorized to view volunteer details for this campaign.' });
      return;
    }

    const registrations = db.event_registrations
      .filter(r => r.event_id === eventId)
      .map(r => {
        const vol = db.volunteer_profiles.find(v => v.id === r.volunteer_id);
        const profile = db.profiles.find(p => p.id === vol?.profile_id);
        const attendance = db.attendance_records.find(
          a => a.event_id === eventId && a.volunteer_id === vol?.id
        );
        const skills = db.volunteer_skills
          .filter(vs => vs.volunteer_id === vol?.id)
          .map(vs => {
            const skill = db.skills.find(s => s.id === vs.skill_id);
            return skill?.name || vs.skill_id;
          });

        return {
          id: r.id,
          registration_id: r.id,
          event_id: r.event_id,
          volunteer_id: r.volunteer_id,
          status: r.status,
          registered_at: r.registered_at,
          confirmed_at: r.confirmed_at,
          notes: r.notes,
          volunteer_name: profile?.full_name || 'Volunteer',
          volunteer_email: profile?.email || 'N/A',
          volunteer_phone: profile?.phone || 'N/A',
          city: vol?.city || 'N/A',
          district: vol?.district || '',
          state: vol?.state || '',
          reliability_score: vol?.reliability_score || 70.0,
          total_hours: vol?.total_hours_volunteered || 0,
          skills,
          attendance_status: attendance ? attendance.status : 'NOT_CHECKED_IN',
          checked_in_at: attendance?.checked_in_at || null
        };
      });

    const maxLimit = event.max_capacity || event.volunteers_required || 15;
    const confirmedCount = registrations.filter(r => r.status === 'CONFIRMED').length;

    res.json({
      success: true,
      event_title: event.title,
      max_capacity: maxLimit,
      volunteers_required: event.volunteers_required,
      confirmed_count: confirmedCount,
      is_registration_closed: event.status === 'REGISTRATION_CLOSED' || confirmedCount >= maxLimit,
      spots_remaining: Math.max(0, maxLimit - confirmedCount),
      registrations
    });
  }
}

