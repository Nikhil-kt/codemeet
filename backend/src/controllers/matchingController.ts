import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/store';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { MLClientService } from '../services/mlClientService';
import { QueueService } from '../services/queueService';

export class MatchingController {
  public static async matchVolunteersForEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const event = db.events.find(e => e.id === eventId);

      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found.' });
        return;
      }

      // Gather Event requirements with skill names
      const requirements = db.event_requirements
        .filter(r => r.event_id === event.id)
        .map(r => {
          const s = db.skills.find(sk => sk.id === r.skill_id);
          return {
            skill_id: r.skill_id,
            skill_name: s?.name || '',
            is_mandatory: r.is_mandatory,
            min_experience_months: r.min_experience_months
          };
        });

      // Prepare Event object for ML
      const eventPayload = {
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.category,
        city: event.city,
        latitude: event.latitude,
        longitude: event.longitude,
        event_date: event.event_date,
        day_of_week: new Date(event.event_date).getDay(),
        requirements
      };

      // Gather candidate volunteers with skills and availability
      const candidateVolunteers = db.volunteer_profiles.map(vol => {
        const profile = db.profiles.find(p => p.id === vol.profile_id);
        const vSkills = db.volunteer_skills
          .filter(vs => vs.volunteer_id === vol.id)
          .map(vs => {
            const s = db.skills.find(sk => sk.id === vs.skill_id);
            return {
              skill_id: vs.skill_id,
              name: s?.name || '',
              category: s?.category || '',
              proficiency: vs.proficiency_level,
              years_experience: vs.years_experience
            };
          });

        const vAvailability = db.volunteer_availability.filter(va => va.volunteer_id === vol.id);

        return {
          id: vol.id,
          profile_id: vol.profile_id,
          full_name: profile?.full_name || 'Volunteer',
          email: profile?.email,
          city: vol.city,
          latitude: vol.latitude,
          longitude: vol.longitude,
          skills: vSkills,
          availability: vAvailability,
          total_hours_volunteered: vol.total_hours_volunteered,
          reliability_score: vol.reliability_score,
          is_provisional: vol.is_provisional,
          location_preference_enabled: vol.location_preference_enabled,
          preferred_categories: vol.preferred_categories || []
        };
      });

      // Execute ML Matching
      const matched = await MLClientService.matchEventVolunteers(eventPayload, candidateVolunteers);

      // Store in match_results and optionally notify volunteers
      const enrichedMatches = [];
      for (const m of matched) {
        const volRecord = candidateVolunteers.find(v => v.id === m.volunteer_id);

        // Upsert in match_results
        const existingIdx = db.match_results.findIndex(r => r.event_id === event.id && r.volunteer_id === m.volunteer_id);
        const record = {
          id: uuidv4(),
          event_id: event.id,
          volunteer_id: m.volunteer_id,
          match_score: m.match_score,
          skill_score: m.skill_score,
          location_score: m.location_score,
          availability_score: m.availability_score,
          experience_score: m.experience_score,
          reliability_score: m.reliability_score,
          explanation: m.explanation,
          recommendation_category: m.recommendation_category,
          notified: false,
          created_at: new Date().toISOString()
        };

        if (existingIdx >= 0) {
          db.match_results[existingIdx] = record;
        } else {
          db.match_results.push(record);
        }

        enrichedMatches.push({
          ...record,
          overall_fit_score: m.overall_fit_score || m.match_score,
          volunteer_name: volRecord?.full_name,
          volunteer_email: volRecord?.email,
          volunteer_city: volRecord?.city,
          matched_skills: m.matched_skills || [],
          skills: volRecord?.skills || [],
          distance_km: m.distance_km
        });
      }

      res.json({
        success: true,
        event_id: event.id,
        candidates_evaluated: candidateVolunteers.length,
        matched_count: enrichedMatches.length,
        matches: enrichedMatches
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Matching process failed', error: err.message });
    }
  }

  public static async notifyMatchedVolunteers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const { minScore = 70 } = req.body;

      const event = db.events.find(e => e.id === eventId);
      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found.' });
        return;
      }

      const matches = db.match_results.filter(m => m.event_id === eventId && m.match_score >= minScore);
      let notificationsSent = 0;

      for (const match of matches) {
        const vol = db.volunteer_profiles.find(v => v.id === match.volunteer_id);
        if (!vol) continue;

        await QueueService.dispatchNotification({
          userId: vol.profile_id,
          title: `New Event Match: ${event.title}`,
          message: `You matched ${Math.round(match.match_score)}% for "${event.title}" on ${event.event_date}. Tap to view responsibilities and register.`,
          notificationType: 'NEW_MATCHING_EVENT',
          actionLink: `/events/${event.id}`
        });

        match.notified = true;
        notificationsSent++;
      }

      res.json({
        success: true,
        message: `Successfully dispatched notifications to ${notificationsSent} matched volunteers.`,
        notifications_sent: notificationsSent
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to notify volunteers', error: err.message });
    }
  }
}

