import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/store';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { QueueService } from '../services/queueService';
import { OrgVerificationStatus, EventStatus } from '../types';
import { FirestoreSync } from '../db/firestoreSync';

export class AdminController {
  public static async getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    const totalOrgs = db.organizations.length;
    const verifiedOrgs = db.organizations.filter(o => ['VERIFIED_NEW', 'ESTABLISHED_TRUSTED'].includes(o.verification_status)).length;
    const pendingVerifications = db.organizations.filter(o => ['PENDING', 'UNDER_REVIEW'].includes(o.verification_status)).length;
    
    const totalEvents = db.events.length;
    const pendingEvents = db.events.filter(e => e.status === 'UNDER_REVIEW').length;
    const activeEvents = db.events.filter(e => ['PUBLISHED', 'REGISTRATION_OPEN', 'EVENT_IN_PROGRESS'].includes(e.status)).length;
    
    const totalVolunteers = db.volunteer_profiles.length;
    
    // Governance metrics
    const openDisputes = db.disputes.filter(d => d.status === 'OPEN').length;

    res.json({
      success: true,
      stats: {
        totalOrgs,
        verifiedOrgs,
        pendingVerifications,
        totalEvents,
        pendingEvents,
        activeEvents,
        totalVolunteers,
        openDisputes
      }
    });
  }

  public static async listOrganizations(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { status, pendingOnly } = req.query;
    let orgs = db.organizations;
    if (pendingOnly === 'true') {
      orgs = orgs.filter(o => ['PENDING', 'MORE_INFO_REQUIRED', 'UNDER_REVIEW'].includes(o.verification_status));
    } else if (status) {
      orgs = orgs.filter(o => o.verification_status === status);
    }

    const enriched = orgs.map(o => {
      const docs = db.organization_documents.filter(d => d.organization_id === o.id);
      return {
        ...o,
        documents_count: docs.length,
        documents: docs
      };
    });

    res.json({ success: true, count: enriched.length, organizations: enriched });
  }

  public static async reviewOrganization(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, notes } = req.body; // status: VERIFIED_NEW, ESTABLISHED_TRUSTED, MORE_INFO_REQUIRED, REJECTED

      const org = db.organizations.find(o => o.id === id);
      if (!org) {
        res.status(404).json({ success: false, message: 'Organization not found.' });
        return;
      }

      org.verification_status = status as OrgVerificationStatus;
      org.updated_at = new Date().toISOString();

      // Sync updated organization status to Firestore
      await FirestoreSync.setDoc('organizations', org.id, org, req.headers.authorization);

      // Record verification
      db.audit_logs.push({
        id: uuidv4(),
        user_id: req.user?.profileId || null,
        action: `ORG_VERIFICATION_${status}`,
        resource: `org:${org.id}`,
        ip_address: req.ip || null,
        user_agent: req.headers['user-agent'] || null,
        created_at: new Date().toISOString()
      });

      // Send notification to organization representative
      await QueueService.dispatchNotification({
        userId: org.profile_id,
        title: `Verification Status Updated: ${status}`,
        message: notes || `Your organization verification status has been updated to ${status}.`,
        notificationType: 'VERIFICATION_UPDATE',
        actionLink: '/organization/verification'
      });

      res.json({
        success: true,
        message: `Organization status set to ${status}.`,
        organization: org
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Review failed', error: err.message });
    }
  }

  public static async listEvents(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { status, pendingOnly } = req.query;
    let events = db.events;
    if (pendingOnly === 'true') {
      events = events.filter(e => ['UNDER_REVIEW', 'DRAFT'].includes(e.status));
    } else if (status) {
      events = events.filter(e => e.status === status);
    }
    res.json({ success: true, count: events.length, events });
  }

  public static async reviewEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, notes } = req.body; // APPROVED or REJECTED

      const event = db.events.find(e => e.id === id);
      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found.' });
        return;
      }

      const finalStatus: EventStatus = status === 'APPROVED' ? 'PUBLISHED' : 'REJECTED';
      event.status = finalStatus;
      event.updated_at = new Date().toISOString();

      // Sync approved/rejected event status to Firestore
      await FirestoreSync.setDoc('events', event.id, event, req.headers.authorization);

      res.json({
        success: true,
        message: `Event has been marked as ${finalStatus}.`,
        event
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Event review failed', error: err.message });
    }
  }

  public static async getAuditLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    res.json({
      success: true,
      count: db.audit_logs.length,
      audit_logs: db.audit_logs.slice(0, 100)
    });
  }

  public static async checkGeminiStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { GeminiService } = await import('../services/geminiService');
      const testResult = await GeminiService.moderateEventRisk({
        title: 'Community Tree Planting and Waste Cleanup',
        category: 'ENVIRONMENTAL',
        volunteers_required: 15,
        city: 'Chennai',
        location_name: 'Guindy National Park Edge',
        description: 'Planting native neem and banyan saplings along perimeter road.',
        safety_instructions: 'Gloves and safety gear provided.'
      });

      res.json({
        success: true,
        message: 'Gemini AI API connection verified and active.',
        ai_moderation_sample: testResult
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: 'Gemini API test failed',
        error: err.message
      });
    }
  }
}

