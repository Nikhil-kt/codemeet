import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/store';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { TrustService } from '../services/trustService';
import { FirestoreSync } from '../db/firestoreSync';

export class VolunteerController {
  private static resolveVolunteer(req: AuthenticatedRequest) {
    if (req.user?.role !== 'VOLUNTEER' && req.user?.role !== 'TEAM_LEADER' && req.user?.role !== 'ADMIN') {
      return null;
    }
    return db.volunteer_profiles.find(
      v => v.profile_id === req.user?.profileId || v.id === req.user?.volunteerId
    ) || null;
  }

  public static async getMyProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const vol = VolunteerController.resolveVolunteer(req);
    if (!vol) {
      res.status(404).json({ success: false, message: 'Volunteer profile not found.' });
      return;
    }

    const profile = db.profiles.find(p => p.id === vol.profile_id);

    const skills = db.volunteer_skills
      .filter(vs => vs.volunteer_id === vol.id)
      .map(vs => {
        const skill = db.skills.find(s => s.id === vs.skill_id);
        return {
          ...vs,
          name: skill?.name,
          category: skill?.category
        };
      });

    const availability = db.volunteer_availability.filter(va => va.volunteer_id === vol.id);
    const reliability = TrustService.calculateVolunteerReliability(vol.id);

    res.json({
      success: true,
      volunteer: {
        ...vol,
        full_name: profile?.full_name,
        email: profile?.email,
        phone: profile?.phone,
        skills,
        availability,
        reliability_factors: reliability.factors
      }
    });
  }

  public static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const vol = VolunteerController.resolveVolunteer(req);
    if (!vol) {
      res.status(404).json({ success: false, message: 'Volunteer profile not found.' });
      return;
    }

    const profile = db.profiles.find(p => p.id === vol.profile_id);
    if (profile) {
      if (req.body.full_name !== undefined) profile.full_name = req.body.full_name;
      if (req.body.phone !== undefined) profile.phone = req.body.phone;
    }

    const { bio, city, district, state, postal_code, latitude, longitude, location_preference_enabled, preferred_categories } = req.body;

    if (bio !== undefined) vol.bio = bio;
    if (city !== undefined) vol.city = city;
    if (district !== undefined) vol.district = district;
    if (state !== undefined) vol.state = state;
    if (postal_code !== undefined) vol.postal_code = postal_code;
    if (latitude !== undefined) vol.latitude = latitude;
    if (longitude !== undefined) vol.longitude = longitude;
    if (location_preference_enabled !== undefined) vol.location_preference_enabled = location_preference_enabled;
    if (preferred_categories !== undefined) vol.preferred_categories = preferred_categories;
    vol.updated_at = new Date().toISOString();

    // Sync to Firestore
    FirestoreSync.setDoc('volunteer_profiles', vol.id, vol).catch(() => {});

    res.json({
      success: true,
      message: 'Volunteer profile updated successfully.',
      volunteer: {
        ...vol,
        full_name: profile?.full_name,
        email: profile?.email,
        phone: profile?.phone
      }
    });
  }

  public static async setSkills(req: AuthenticatedRequest, res: Response): Promise<void> {
    const vol = VolunteerController.resolveVolunteer(req);
    if (!vol) {
      res.status(404).json({ success: false, message: 'Volunteer profile not found.' });
      return;
    }

    const { skills } = req.body; // array of { skill_id, proficiency_level, years_experience }
    if (!Array.isArray(skills)) {
      res.status(400).json({ success: false, message: 'Skills must be an array.' });
      return;
    }

    // Replace volunteer skills
    db.volunteer_skills = db.volunteer_skills.filter(vs => vs.volunteer_id !== vol.id);

    for (const item of skills) {
      db.volunteer_skills.push({
        id: uuidv4(),
        volunteer_id: vol.id,
        skill_id: item.skill_id,
        proficiency_level: item.proficiency_level || 'INTERMEDIATE',
        years_experience: item.years_experience || 1.0,
        created_at: new Date().toISOString()
      });
    }

    // Sync to Firestore
    FirestoreSync.setDoc('volunteer_skills', vol.id, { volunteer_id: vol.id, skills }).catch(() => {});

    res.json({ success: true, message: 'Skills updated successfully.' });
  }

  public static async setAvailability(req: AuthenticatedRequest, res: Response): Promise<void> {
    const vol = VolunteerController.resolveVolunteer(req);
    if (!vol) {
      res.status(404).json({ success: false, message: 'Volunteer profile not found.' });
      return;
    }

    const { slots } = req.body; // array of { day_of_week, start_time, end_time, is_recurring }
    if (!Array.isArray(slots)) {
      res.status(400).json({ success: false, message: 'Slots must be an array.' });
      return;
    }

    db.volunteer_availability = db.volunteer_availability.filter(va => va.volunteer_id !== vol.id);

    for (const slot of slots) {
      db.volunteer_availability.push({
        id: uuidv4(),
        volunteer_id: vol.id,
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_recurring: slot.is_recurring ?? true,
        temporary_unavailable: false,
        created_at: new Date().toISOString()
      });
    }

    res.json({ success: true, message: 'Availability schedule updated.' });
  }

  public static async getHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    const vol = VolunteerController.resolveVolunteer(req);
    if (!vol) {
      res.status(404).json({ success: false, message: 'Volunteer profile not found.' });
      return;
    }

    const registrations = db.event_registrations
      .filter(r => r.volunteer_id === vol.id)
      .map(r => {
        const event = db.events.find(e => e.id === r.event_id);
        const attendance = db.attendance_records.find(a => a.event_id === r.event_id && a.volunteer_id === vol.id);
        return {
          registration_id: r.id,
          event_id: r.event_id,
          event_title: event?.title,
          event_date: event?.event_date,
          city: event?.city,
          registration_status: r.status,
          attendance_status: attendance ? attendance.status : 'NOT_CHECKED_IN',
          checked_in_at: attendance?.checked_in_at || null
        };
      });

    res.json({
      success: true,
      total_hours: vol.total_hours_volunteered,
      reliability_score: vol.reliability_score,
      is_provisional: vol.is_provisional,
      events: registrations
    });
  }

  public static async getSkillsCatalog(req: AuthenticatedRequest, res: Response): Promise<void> {
    res.json({
      success: true,
      skills: db.skills.filter(s => s.is_approved)
    });
  }
}

