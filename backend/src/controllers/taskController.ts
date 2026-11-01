import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/store';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { MLClientService } from '../services/mlClientService';
import { GeminiService } from '../services/geminiService';
import { SocketService } from '../services/socketService';
import { TaskStatus } from '../types';

export class TaskController {
  public static async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const {
        title,
        description,
        required_skills,
        volunteers_needed,
        assigned_volunteers,
        deadline,
        priority,
        instructions,
        evidence_requirements
      } = req.body;

      if (!title) {
        res.status(400).json({ success: false, message: 'Task title is required.' });
        return;
      }

      const taskRecord = {
        id: uuidv4(),
        event_id: eventId,
        title,
        description: description || '',
        required_skills: required_skills || [],
        volunteers_needed: volunteers_needed || 1,
        assigned_volunteers: assigned_volunteers || [],
        deadline: deadline || null,
        priority: priority || 'MEDIUM',
        instructions: instructions || '',
        evidence_requirements: evidence_requirements || 'Upload photo proof and brief description.',
        status: (assigned_volunteers && assigned_volunteers.length > 0 ? 'ASSIGNED' : 'OPEN') as TaskStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.event_tasks.push(taskRecord);

      res.status(201).json({ success: true, message: 'Task created.', task: taskRecord });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Task creation failed', error: err.message });
    }
  }

  public static async submitEvidence(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { description, file_url, file_name } = req.body;

      const vol = db.volunteer_profiles.find(v => v.profile_id === req.user?.profileId);
      if (!vol) {
        res.status(403).json({ success: false, message: 'Only volunteers can submit task evidence.' });
        return;
      }

      const task = db.event_tasks.find(t => t.id === id);
      if (!task) {
        res.status(404).json({ success: false, message: 'Task not found.' });
        return;
      }

      const submissionId = uuidv4();
      const newSubmission = {
        id: submissionId,
        task_id: task.id,
        volunteer_id: vol.id,
        description: description || 'Task completed as requested.',
        status: 'SUBMITTED' as TaskStatus,
        reviewer_notes: null,
        submitted_at: new Date().toISOString(),
        reviewed_at: null
      };

      // Check AI Duplicate Evidence & Authenticity with Gemini and ML service
      const existingTaskSubmissions = db.task_submissions.filter(s => s.task_id === task.id);
      const priorTexts = existingTaskSubmissions.map(s => s.description || '');

      const [similarityAnalysis, geminiEvaluation] = await Promise.all([
        MLClientService.checkReportSimilarity(newSubmission, existingTaskSubmissions),
        GeminiService.evaluateTaskEvidence(task.instructions || task.title, newSubmission.description, priorTexts)
      ]);

      const isDuplicate = similarityAnalysis.is_potential_duplicate || geminiEvaluation.is_duplicate;

      db.task_submissions.push(newSubmission);

      // Create Evidence file record
      const evidenceRecord = {
        id: uuidv4(),
        submission_id: submissionId,
        file_url: file_url || `https://storage.impactlink.org/evidence/${uuidv4()}.jpg`,
        file_type: 'IMAGE',
        file_name: file_name || 'proof.jpg',
        file_size: 1024 * 450,
        ai_duplicate_flag: isDuplicate,
        ai_similarity_score: Math.max(similarityAnalysis.highest_similarity_score, geminiEvaluation.similarity_score),
        ai_extracted_metadata: {
          ...similarityAnalysis,
          gemini: geminiEvaluation
        },
        created_at: new Date().toISOString()
      };
      db.evidence_files.push(evidenceRecord);

      // Update task status
      task.status = 'SUBMITTED';
      task.updated_at = new Date().toISOString();

      // Notify organizer in real-time
      SocketService.broadcastTaskUpdate(task.event_id, {
        taskId: task.id,
        status: 'SUBMITTED',
        volunteerId: vol.id,
        hasDuplicateFlag: similarityAnalysis.is_potential_duplicate
      });

      res.status(201).json({
        success: true,
        message: 'Evidence submitted for organizer review.',
        submission: newSubmission,
        ai_duplicate_analysis: similarityAnalysis
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Evidence submission failed', error: err.message });
    }
  }

  public static async reviewSubmission(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params; // submissionId
      const { verdict, comments } = req.body; // verdict: APPROVED or REJECTED

      const submission = db.task_submissions.find(s => s.id === id);
      if (!submission) {
        res.status(404).json({ success: false, message: 'Submission not found.' });
        return;
      }

      const task = db.event_tasks.find(t => t.id === submission.task_id);
      if (!task) {
        res.status(404).json({ success: false, message: 'Associated task not found.' });
        return;
      }

      submission.status = verdict === 'APPROVED' ? 'COMPLETED' : 'REJECTED';
      submission.reviewer_notes = comments || null;
      submission.reviewed_at = new Date().toISOString();

      task.status = verdict === 'APPROVED' ? 'COMPLETED' : 'REOPENED';
      task.updated_at = new Date().toISOString();

      db.verification_reviews.push({
        id: uuidv4(),
        submission_id: submission.id,
        reviewer_id: req.user?.profileId || '',
        verdict,
        comments: comments || '',
        created_at: new Date().toISOString()
      });

      // Update volunteer hours if approved
      if (verdict === 'APPROVED') {
        const vol = db.volunteer_profiles.find(v => v.id === submission.volunteer_id);
        if (vol) {
          vol.total_hours_volunteered = (vol.total_hours_volunteered || 0) + 2.0;
        }
      }

      res.json({
        success: true,
        message: `Task submission ${verdict.toLowerCase()} successfully.`,
        task_status: task.status
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Review failed', error: err.message });
    }
  }

  public static async getTasksForEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { eventId } = req.params;
    const tasks = db.event_tasks.filter(t => t.event_id === eventId);
    res.json({ success: true, tasks });
  }
}

