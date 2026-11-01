import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/store';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { MLClientService } from '../services/mlClientService';
import { GeminiService } from '../services/geminiService';
import { TrustService } from '../services/trustService';

export class OrganizationController {
  private static resolveOrg(req: AuthenticatedRequest) {
    if (req.user?.role !== 'ORGANIZATION' && req.user?.role !== 'ADMIN') {
      return null;
    }
    return db.organizations.find(
      o => o.profile_id === req.user?.profileId || o.id === req.user?.orgId || o.email === req.user?.email
    ) || null;
  }

  public static async getMyOrg(req: AuthenticatedRequest, res: Response): Promise<void> {
    const org = OrganizationController.resolveOrg(req);
    if (!org) {
      res.status(404).json({ success: false, message: 'Organization profile not found.' });
      return;
    }

    const documents = db.organization_documents.filter(d => d.organization_id === org.id);
    const trustData = TrustService.calculateOrgTrustScore(org.id);

    res.json({
      success: true,
      organization: {
        ...org,
        trust_factors: trustData.factors,
        documents
      }
    });
  }

  public static async updateMyOrg(req: AuthenticatedRequest, res: Response): Promise<void> {
    const org = OrganizationController.resolveOrg(req);
    if (!org) {
      res.status(404).json({ success: false, message: 'Organization profile not found.' });
      return;
    }

    const { name, category, website, phone, address, operating_location, description, representative_name, representative_contact } = req.body;
    
    if (name) org.name = name;
    if (category) org.category = category;
    if (website) org.website = website;
    if (phone) org.phone = phone;
    if (address) org.address = address;
    if (operating_location) org.operating_location = operating_location;
    if (description) org.description = description;
    if (representative_name) org.representative_name = representative_name;
    if (representative_contact) org.representative_contact = representative_contact;
    org.updated_at = new Date().toISOString();

    res.json({ success: true, message: 'Organization updated successfully.', organization: org });
  }

  public static async uploadDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
    const org = OrganizationController.resolveOrg(req);
    if (!org) {
      res.status(404).json({ success: false, message: 'Organization profile not found.' });
      return;
    }

    const { document_type, document_name, file_url, document_text } = req.body;
    if (!document_type || !document_name) {
      res.status(400).json({ success: false, message: 'Document type and name are required.' });
      return;
    }

    // Call Gemini AI document analysis with ML service fallback
    const rawText = document_text || `Document: ${document_name}\nOrg: ${org.name}\nRepresentative: ${org.representative_name}\nContact: ${org.phone}`;
    let aiAnalysis: any = await GeminiService.analyzeDocument(rawText, document_type, org);

    if (!aiAnalysis || aiAnalysis.model_used === 'rule-based-fallback') {
      aiAnalysis = await MLClientService.analyzeDocument(rawText, document_type, org);
    }

    const docRecord = {
      id: uuidv4(),
      organization_id: org.id,
      document_type,
      document_name,
      file_url: file_url || `https://storage.impactlink.org/documents/${uuidv4()}.pdf`,
      file_size: 1024 * 350,
      mime_type: 'application/pdf',
      status: 'ANALYZED',
      extracted_data: aiAnalysis.extracted_data || {},
      ai_risk_score: aiAnalysis.ai_risk_score || 0.0,
      ai_notes: aiAnalysis.explanation || 'Verified using AI document parser',
      created_at: new Date().toISOString()
    };
    db.organization_documents.push(docRecord);

    // If org status was PENDING or MORE_INFO_REQUIRED, set to UNDER_REVIEW
    if (org.verification_status === 'PENDING' || org.verification_status === 'MORE_INFO_REQUIRED') {
      org.verification_status = 'UNDER_REVIEW';
    }

    res.status(201).json({
      success: true,
      message: 'Document uploaded and analyzed by AI verification engine.',
      document: docRecord,
      ai_analysis: aiAnalysis
    });
  }

  public static async getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    const org = OrganizationController.resolveOrg(req);
    if (!org) {
      res.status(404).json({ success: false, message: 'Organization profile not found.' });
      return;
    }

    const orgEvents = db.events.filter(e => e.organization_id === org.id);
    const eventIds = orgEvents.map(e => e.id);
    
    const registrations = db.event_registrations.filter(r => eventIds.includes(r.event_id));
    const attendance = db.attendance_records.filter(a => eventIds.includes(a.event_id));
    const tasks = db.event_tasks.filter(t => eventIds.includes(t.event_id));

    const totalEvents = orgEvents.length;
    const upcomingEvents = orgEvents.filter(e => e.status === 'PUBLISHED' || e.status === 'REGISTRATION_OPEN').length;
    const completedEvents = orgEvents.filter(e => e.status === 'COMPLETED').length;
    const totalRegistrations = registrations.length;
    const confirmedVolunteers = registrations.filter(r => r.status === 'CONFIRMED').length;
    const totalAttended = attendance.filter(a => a.status === 'PRESENT' || a.status === 'MANUALLY_VERIFIED').length;
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;

    res.json({
      success: true,
      stats: {
        totalEvents,
        upcomingEvents,
        completedEvents,
        totalRegistrations,
        confirmedVolunteers,
        totalAttended,
        completedTasks,
        trustScore: org.trust_score,
        depositExempt: org.deposit_exempt,
        verificationStatus: org.verification_status
      }
    });
  }
}

