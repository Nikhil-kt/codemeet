import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/store';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { config } from '../config';
import { EventStatus, EventCategory, DepositStatus } from '../types';
import { GeminiService } from '../services/geminiService';
import { FirestoreSync } from '../db/firestoreSync';

export class EventController {
  public static async createEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const org = db.organizations.find(o => o.profile_id === req.user?.profileId);
      if (!org) {
        res.status(403).json({ success: false, message: 'Only registered organizations can create events.' });
        return;
      }

      if (org.verification_status === 'REJECTED' || org.verification_status === 'SUSPENDED') {
        res.status(403).json({ success: false, message: `Organization is ${org.verification_status} and cannot create events.` });
        return;
      }

      const {
        title,
        description,
        category,
        event_date,
        start_time,
        end_time,
        location_name,
        address,
        city,
        latitude,
        longitude,
        volunteers_required,
        max_capacity,
        contact_person,
        contact_phone,
        safety_instructions,
        eligibility_requirements,
        banner_url,
        requirements // [{ skill_id, is_mandatory, min_experience_months }]
      } = req.body;

      if (!title || !description || !event_date || !start_time || !end_time || !location_name || !city || !contact_person || !contact_phone) {
        res.status(400).json({ success: false, message: 'Missing required event fields.' });
        return;
      }

      const eventId = uuidv4();

      const newEvent = {
        id: eventId,
        organization_id: org.id,
        title,
        description,
        category: (category as EventCategory) || 'COMMUNITY_WELFARE',
        event_date,
        start_time,
        end_time,
        location_name,
        address: address || location_name,
        city,
        latitude: latitude || 13.0827,
        longitude: longitude || 80.2707,
        volunteers_required: parseInt(volunteers_required || '10', 10),
        max_capacity: parseInt(max_capacity || '15', 10),
        confirmed_count: 0,
        status: 'UNDER_REVIEW' as EventStatus,
        contact_person,
        contact_phone,
        safety_instructions: safety_instructions || 'Follow organizers safety briefing on site.',
        eligibility_requirements: eligibility_requirements || 'Open to all willing volunteers.',
        banner_url: banner_url || null,
        deposit_required_amount: 0,
        deposit_status: 'EXEMPTED' as DepositStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.events.push(newEvent);
      await FirestoreSync.setDoc('events', eventId, newEvent, req.headers.authorization);

      // Create event requirements if provided
      if (Array.isArray(requirements)) {
        for (const reqItem of requirements) {
          db.event_requirements.push({
            id: uuidv4(),
            event_id: eventId,
            skill_id: reqItem.skill_id,
            is_mandatory: reqItem.is_mandatory ?? false,
            min_experience_months: reqItem.min_experience_months ?? 0
          });
        }
      }

      res.status(201).json({
        success: true,
        message: 'Event created and submitted for administrator review.',
        event: newEvent
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to create event', error: err.message });
    }
  }

  public static async submitEventForApproval(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const org = db.organizations.find(o => o.profile_id === req.user?.profileId);
      const event = db.events.find(e => e.id === id);

      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found.' });
        return;
      }

      if (event.organization_id !== org?.id && req.user?.role !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'Unauthorized event operation.' });
        return;
      }

      // Hybrid AI event safety review with Gemini (PRD 4.3):
      const geminiModeration = await GeminiService.moderateEventRisk(event);

      // Event is submitted for administrator moderation & review
      event.status = 'UNDER_REVIEW';
      (event as any).ai_moderation = geminiModeration;
      (event as any).updated_at = new Date().toISOString();

      await FirestoreSync.setDoc('events', event.id, event, req.headers.authorization);

      res.json({
        success: true,
        message: 'Campaign application submitted successfully and is currently under administrator review.',
        status: 'UNDER_REVIEW',
        event,
        ai_moderation: geminiModeration
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Approval submission failed', error: err.message });
    }
  }

  public static async listEvents(req: Request, res: Response): Promise<void> {
    const { category, city, status, orgId, includeClosed } = req.query;

    let filtered = db.events;

    if (orgId) {
      // Organizers see all their events (even when full/closed) to view volunteer info until the event ends
      filtered = filtered.filter(e => e.organization_id === orgId);
    } else if (includeClosed !== 'true') {
      // Volunteers / Public view: Disappear events that reached maximum capacity or closed
      filtered = filtered.filter(e => {
        const maxCap = e.max_capacity || e.volunteers_required || 15;
        const isFull = (e.confirmed_count || 0) >= maxCap;
        const isClosed = e.status === 'REGISTRATION_CLOSED';
        return !isFull && !isClosed;
      });
    }

    if (category) {
      filtered = filtered.filter(e => e.category === category);
    }
    if (city) {
      filtered = filtered.filter(e => e.city.toLowerCase() === (city as string).toLowerCase());
    }
    if (status) {
      filtered = filtered.filter(e => e.status === status);
    } else if (!orgId && includeClosed !== 'true') {
      // By default show active open events to public/volunteers
      filtered = filtered.filter(e => ['PUBLISHED', 'REGISTRATION_OPEN', 'EVENT_IN_PROGRESS'].includes(e.status));
    }

    const enriched = filtered.map(e => {
      const org = db.organizations.find(o => o.id === e.organization_id);
      return {
        ...e,
        organization_name: org?.name || 'Community Organization',
        organization_trust_score: org?.trust_score || 50.0
      };
    });

    res.json({ success: true, count: enriched.length, events: enriched });
  }

  public static async getEventDetails(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const event = db.events.find(e => e.id === id);

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found.' });
      return;
    }

    const org = db.organizations.find(o => o.id === event.organization_id);
    const requirements = db.event_requirements
      .filter(r => r.event_id === event.id)
      .map(r => {
        const skill = db.skills.find(s => s.id === r.skill_id);
        return {
          ...r,
          skill_name: skill?.name,
          category: skill?.category
        };
      });

    const tasks = db.event_tasks.filter(t => t.event_id === event.id);
    const registrations = db.event_registrations.filter(r => r.event_id === event.id);

    res.json({
      success: true,
      event: {
        ...event,
        organization: org,
        requirements,
        tasks,
        total_registered: registrations.length,
        confirmed_count: registrations.filter(r => r.status === 'CONFIRMED').length
      }
    });
  }
}

