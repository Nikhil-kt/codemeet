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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Assigned Tasks & Evidence</h1>
        <p className="text-sm text-slate-500 mt-1">
          Submit task documentation verified by our automated AI anomaly & duplicate detection engine.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Task List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Your Action Items</h2>
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedTask?.id === task.id
                  ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                  {task.priority} PRIORITY
                </span>
                <span className="text-[11px] font-semibold text-slate-500">{task.status}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">{task.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{task.eventTitle}</p>
            </div>
          ))}
        </div>

        {/* Evidence Submission Area */}
        <div className="md:col-span-2 space-y-6">
          {selectedTask && (
            <div className="bg-stone-900/85 backdrop-blur-xl p-8 rounded-3xl border border-amber-500/25 shadow-xl space-y-6 text-stone-100">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Task ID: {selectedTask.id.slice(0, 8)}
                </span>
                <h2 className="text-xl font-bold text-white mt-2">{selectedTask.title}</h2>
                <p className="text-xs text-stone-400 mt-1 font-medium">{selectedTask.eventTitle}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2 text-xs">
                <div className="font-bold text-amber-400">Instructions:</div>
                <div className="text-stone-300 font-light">{selectedTask.instructions}</div>
                <div className="font-bold text-amber-400 pt-1">Evidence Required:</div>
                <div className="text-stone-300 font-light">{selectedTask.evidence_requirements}</div>
              </div>

              {/* AI Duplicate Flag Warning if triggered */}
              {submissionResult?.ai_duplicate_analysis && (
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    submissionResult.ai_duplicate_analysis.is_potential_duplicate
                      ? 'bg-rose-500/15 border-rose-400/30 text-rose-300'
                      : 'bg-amber-500/15 border-amber-400/30 text-amber-300'
                  }`}
                >
                  <div className="font-bold flex items-center space-x-1.5">
                    {submissionResult.ai_duplicate_analysis.is_potential_duplicate ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
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
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Completion Report & Work Done Summary
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={evidenceDesc}
                    onChange={e => setEvidenceDesc(e.target.value)}
                    placeholder="Describe specific work completed, bags collected, or tasks fulfilled..."
                    className="w-full p-3.5 text-xs rounded-xl bg-stone-800/90 border border-stone-700/80 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="p-6 border-2 border-dashed border-stone-800 rounded-2xl text-center space-y-2 bg-stone-950/60 hover:border-amber-500/30 transition-colors">
                  <Upload className="w-8 h-8 text-amber-400/70 mx-auto" />
                  <div className="text-xs font-semibold text-stone-200">Attach Geo-Tagged Photo / Evidence</div>
                  <div className="text-[11px] text-stone-500">JPG, PNG or PDF under 10MB</div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-stone-950" />
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

