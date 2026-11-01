'use client';

import React, { useState } from 'react';
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
      // Update local task status
      setTasks(prev =>
        prev.map(t => (t.id === selectedTask.id ? { ...t, status: 'SUBMITTED' } : t))
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-[#7C2D12]">Assigned Tasks & Evidence</h1>
        <p className="text-sm text-[#78716C] mt-1">
          Submit task documentation verified by our automated AI anomaly & duplicate detection engine.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Task List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#78716C]">Your Action Items</h2>
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedTask?.id === task.id
                  ? 'border-[#F97316] bg-[#FFEDD5] ring-2 ring-orange-500/20 shadow-md'
                  : 'bg-white border-[#FED7AA] hover:border-[#F97316] interactive-card'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                  {task.priority} PRIORITY
                </span>
                <span className="text-[11px] font-semibold text-[#78716C]">{task.status}</span>
              </div>
              <h3 className="font-bold text-sm text-[#7C2D12]">{task.title}</h3>
              <p className="text-xs text-[#78716C] mt-1">{task.eventTitle}</p>
            </div>
          ))}
        </div>

        {/* Evidence Submission Area */}
        <div className="md:col-span-2 space-y-6">
          {selectedTask && (
            <div className="bg-white backdrop-blur-xl p-8 rounded-3xl border border-[#FED7AA] shadow-sm hover:border-[#F97316] hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300 space-y-6 text-[#431407]">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] hover:scale-105 hover:bg-[#FED7AA] transition-transform cursor-default">
                  Task ID: {selectedTask.id.slice(0, 8)}
                </span>
                <h2 className="text-xl font-bold text-[#7C2D12] mt-2">{selectedTask.title}</h2>
                <p className="text-xs text-[#78716C] mt-1 font-medium">{selectedTask.eventTitle}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFEDD5]/20/80 border border-[#FED7AA] space-y-2 text-xs">
                <div className="font-bold text-[#F97316]">Instructions:</div>
                <div className="text-[#431407] font-light">{selectedTask.instructions}</div>
                <div className="font-bold text-[#F97316] pt-1">Evidence Required:</div>
                <div className="text-[#431407] font-light">{selectedTask.evidence_requirements}</div>
              </div>

              {/* AI Duplicate Flag Warning if triggered */}
              {submissionResult?.ai_duplicate_analysis && (
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    submissionResult.ai_duplicate_analysis.is_potential_duplicate
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-medium'
                      : 'bg-[#FFEDD5] border-[#FED7AA] text-[#9A3412]'
                  }`}
                >
                  <div className="font-bold flex items-center space-x-1.5">
                    {submissionResult.ai_duplicate_analysis.is_potential_duplicate ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-[#F97316]" />
                    )}
                    <span>AI Verification Inspection Result</span>
                  </div>
                  <p>{submissionResult.ai_duplicate_analysis.explanation}</p>
                  <div className="text-[11px] opacity-80">
                    Highest similarity score: {submissionResult.ai_duplicate_analysis.highest_similarity_score} | Flag: {submissionResult.ai_duplicate_analysis.flag}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitEvidence} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#431407] mb-1.5">
                    Completion Report & Work Done Summary
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={evidenceDesc}
                    onChange={e => setEvidenceDesc(e.target.value)}
                    placeholder="Describe specific work completed, bags collected, or tasks fulfilled..."
                    className="w-full p-3.5 text-xs rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#78716C] focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                  />
                </div>

                <div className="p-6 border-2 border-dashed border-[#FED7AA] rounded-2xl text-center space-y-2 bg-[#FFEDD5]/40 hover:border-[#F97316] transition-colors">
                  <Upload className="w-8 h-8 text-[#F97316]/70 mx-auto" />
                  <div className="text-xs font-semibold text-[#431407]">Attach Geo-Tagged Photo / Evidence</div>
                  <div className="text-[11px] text-[#78716C]">JPG, PNG or PDF under 10MB</div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
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
  );
}

