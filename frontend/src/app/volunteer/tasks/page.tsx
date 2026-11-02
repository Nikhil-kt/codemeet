'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import {
  CheckSquare,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { triggerConfetti } from '@/components/motion/Confetti';

export default function VolunteerTasksPage() {
  const [tasks, setTasks] = useState<any[]>([
    {
      id: 't0000000-0000-0000-0000-000000000001',
      title: 'North Promenade Coastal Plastic Clearance',
      eventTitle: 'Marina Beach Mega Coastal Cleanup & Segregation Drive',
      priority: 'HIGH',
      status: 'ASSIGNED',
      deadline: '2026-11-14 09:30 AM',
      instructions: 'Work in pairs. Photograph the weighing scale when bags are filled.',
      evidence_requirements: 'Photo of collected sacks and geo-tagged shoreline area.'
    }
  ]);

  const [selectedTask, setSelectedTask] = useState<any>(tasks[0]);
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const handleSubmitEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !evidenceDesc) return;

    setSubmitting(true);
    setSubmissionResult(null);

    const res = await api.submitTaskEvidence(selectedTask.id, {
      description: evidenceDesc,
      file_url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=600',
      file_name: 'beach_cleanup_sacks.jpg'
    });
    setSubmitting(false);

    if (res.success && res.data) {
      setSubmissionResult(res.data);
      triggerConfetti();
      // Update local task status
      setTasks(prev =>
        prev.map(t => (t.id === selectedTask.id ? { ...t, status: 'SUBMITTED' } : t))
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E8] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        <div>
          <Badge variant="orange" size="sm">Civic Deliverables</Badge>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#7A2E0E] mt-2">
            Assigned Tasks & Evidence
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B53] mt-1 font-medium">
            Submit task documentation verified by our automated AI anomaly & duplicate detection engine.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Task List */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">Your Action Items</h2>
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-6 rounded-[28px] border cursor-pointer transition-all ${
                  selectedTask?.id === task.id
                    ? 'border-[#FF6B1A] bg-[#FFE3CC] shadow-md ring-2 ring-[#FF6B1A]/20'
                    : 'bg-white border-[#FF6B1A]/15 hover:border-[#FF6B1A]/50 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    {task.priority} PRIORITY
                  </span>
                  <span className="text-[11px] font-bold text-[#6B5B53]">{task.status}</span>
                </div>
                <h3 className="font-heading font-bold text-sm text-[#7A2E0E]">{task.title}</h3>
                <p className="text-xs text-[#6B5B53] mt-1.5 font-medium">{task.eventTitle}</p>
              </div>
            ))}
          </div>

          {/* Evidence Submission Area */}
          <div className="md:col-span-2 space-y-6">
            {selectedTask && (
              <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#FF6B1A]/15 shadow-sm space-y-6">
                <div>
                  <Badge variant="orange" size="sm">Task ID: {selectedTask.id.slice(0, 8)}</Badge>
                  <h2 className="text-2xl font-heading font-extrabold text-[#7A2E0E] mt-2">{selectedTask.title}</h2>
                  <p className="text-xs text-[#6B5B53] mt-1 font-medium">{selectedTask.eventTitle}</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFF4E8] border border-[#FF6B1A]/15 space-y-2 text-xs">
                  <div className="font-bold text-[#FF6B1A]">Instructions:</div>
                  <div className="text-[#6B5B53] font-medium leading-relaxed">{selectedTask.instructions}</div>
                  <div className="font-bold text-[#FF6B1A] pt-2">Evidence Required:</div>
                  <div className="text-[#6B5B53] font-medium leading-relaxed">{selectedTask.evidence_requirements}</div>
                </div>

                {/* AI Duplicate Flag Warning if triggered */}
                {submissionResult?.ai_duplicate_analysis && (
                  <div
                    className={`p-5 rounded-2xl border text-xs space-y-2 ${
                      submissionResult.ai_duplicate_analysis.is_potential_duplicate
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-medium'
                        : 'bg-[#FFE3CC] border-[#FF6B1A]/20 text-[#7A2E0E]'
                    }`}
                  >
                    <div className="font-bold flex items-center space-x-2">
                      {submissionResult.ai_duplicate_analysis.is_potential_duplicate ? (
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      <span>AI Verification Inspection Result</span>
                    </div>
                    <p>{submissionResult.ai_duplicate_analysis.explanation}</p>
                    <div className="text-[11px] opacity-80">
                      Highest similarity score: {submissionResult.ai_duplicate_analysis.highest_similarity_score} | Flag: {submissionResult.ai_duplicate_analysis.flag}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmitEvidence} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-[#7A2E0E] mb-2">
                      Completion Report & Work Done Summary
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={evidenceDesc}
                      onChange={e => setEvidenceDesc(e.target.value)}
                      placeholder="Describe specific work completed, bags collected, or tasks fulfilled..."
                      className="w-full p-4 text-xs rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] placeholder-[#6B5B53]/60 focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all font-medium"
                    />
                  </div>

                  <div className="p-8 border-2 border-dashed border-[#FF6B1A]/25 rounded-2xl text-center space-y-2 bg-[#FFF4E8]/40 hover:border-[#FF6B1A] transition-colors">
                    <Upload className="w-8 h-8 text-[#FF6B1A] mx-auto" />
                    <div className="text-xs font-bold text-[#7A2E0E]">Attach Geo-Tagged Photo / Evidence</div>
                    <div className="text-[11px] text-[#6B5B53]">JPG, PNG or PDF under 10MB</div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl bg-[#FF6B1A] hover:bg-[#E8590C] hover:scale-[1.01] active:scale-[0.99] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>{submitting ? 'Analyzing & Uploading Evidence...' : 'Submit Evidence for Verification'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
