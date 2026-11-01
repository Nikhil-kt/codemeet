'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  CheckSquare,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  FileText,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Camera,
  MapPin,
  Check
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
      instructions: 'Work in pairs along grid sectors A-4 to A-9. Collect non-biodegradable debris and photograph the weighing scale when sacks are filled.',
      evidence_requirements: 'Geo-tagged photograph of collected debris sacks and shoreline sector timestamp.'
    },
    {
      id: 't0000000-0000-0000-0000-000000000002',
      title: 'Community Mangrove Seedling Tagging & Audit',
      eventTitle: 'Estuary Restoration & Biodiversity Initiative',
      priority: 'MEDIUM',
      status: 'ASSIGNED',
      deadline: '2026-11-20 04:00 PM',
      instructions: 'Affix biodegradable identification tags to newly planted saplings and count surviving saplings per quadrant.',
      evidence_requirements: 'Photo of tagged batch with legible quadrant numbering.'
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
    <ProtectedRoute allowedRoles={['VOLUNTEER', 'TEAM_LEADER', 'ADMIN']}>
      <div className="leaf-pattern max-w-5xl mx-auto space-y-6 pb-16">
        {/* Navigation & Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            href="/volunteer/dashboard"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-400 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Volunteer Console</span>
          </Link>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-900 border border-forest-700/40 text-forest-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span>Active Assignments Engine</span>
          </div>
        </div>

        {/* Hero Editorial Card */}
        <div className="forest-card bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 border border-forest-700/30 p-8 rounded-2xl shadow-xl text-stone-100 relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-gold-400/15 text-gold-400 border border-gold-400/30 rounded-full text-xs font-bold tracking-wide">
              <span>🌱 Field Verification & Tasks</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-stone-100">
              Assigned Field Actions & Evidence
            </h1>
            <div className="w-12 h-0.5 bg-gold-400/70 rounded-full" />
            <p className="text-xs sm:text-sm text-stone-300/90 leading-relaxed font-normal">
              Submit verified field documentation, geo-tagged photographic evidence, and work logs certified by our automated AI anomaly and anti-duplicate audit engine.
            </p>
          </div>

          {/* Decorative subtle badge */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 text-right">
            <div className="p-4 rounded-xl bg-forest-950/70 border border-forest-700/40 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-forest-300/70 block">Active Backlog</span>
              <span className="text-2xl font-black text-gold-400">{tasks.length} Action Items</span>
              <span className="text-[10px] text-stone-400 block">Civic Impact Verified</span>
            </div>
          </div>
        </div>

        {/* 3-Column Work Area */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Task List (Left 1 col) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-forest-300/70 flex items-center space-x-1.5">
                <span>🌱 Your Action Items</span>
              </h2>
              <span className="text-[11px] font-mono text-gold-400 bg-gold-400/15 px-2 py-0.5 rounded-full border border-gold-400/20">
                {tasks.length} Assigned
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map((task, idx) => {
                const isSelected = selectedTask?.id === task.id;
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-forest-900 border-gold-400/60 ring-1 ring-gold-400/30 shadow-lg'
                        : 'forest-card bg-forest-900/60 border-forest-700/25 hover:border-forest-600/50 hover:bg-forest-900/80'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-950 text-gold-400 border border-gold-400/30">
                        No - 0{idx + 1}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          task.status === 'SUBMITTED'
                            ? 'bg-forest-400/20 text-forest-300 border border-forest-400/30'
                            : task.priority === 'HIGH'
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : 'bg-gold-400/15 text-gold-400 border border-gold-400/30'
                        }`}
                      >
                        {task.status === 'SUBMITTED' ? '✓ SUBMITTED' : `${task.priority} PRIORITY`}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-stone-100 leading-snug">{task.title}</h3>
                    <p className="text-xs text-forest-300/70 mt-1.5 line-clamp-1">{task.eventTitle}</p>

                    <div className="mt-3 pt-3 border-t border-forest-700/25 flex items-center justify-between text-[11px] text-stone-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gold-400/70" />
                        <span>{task.deadline}</span>
                      </span>
                      <span className="text-gold-400 font-semibold group-hover:underline flex items-center space-x-0.5">
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence Submission Area (Right 2 cols) */}
          <div className="md:col-span-2 space-y-6">
            {selectedTask ? (
              <div className="forest-card bg-forest-900/90 backdrop-blur-xl p-7 rounded-2xl border border-forest-700/30 shadow-xl space-y-6 text-stone-100">
                {/* Task Heading in Focus */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-forest-700/30">
                  <div>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-gold-400/15 text-gold-400 border border-gold-400/30">
                      Task ID: {selectedTask.id.slice(0, 8)}
                    </span>
                    <h2 className="text-xl font-display font-bold text-stone-100 mt-2">{selectedTask.title}</h2>
                    <p className="text-xs text-forest-300/80 mt-0.5">{selectedTask.eventTitle}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedTask.status === 'SUBMITTED'
                        ? 'bg-forest-400/20 text-forest-300 border border-forest-400/30'
                        : 'bg-gold-400/15 text-gold-400 border border-gold-400/30'
                    }`}
                  >
                    {selectedTask.status === 'SUBMITTED' ? '✓ Evidence Under Review' : '● Action Required'}
                  </span>
                </div>

                {/* Instructions & Requirements Cards */}
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-forest-950/80 border border-forest-700/30 space-y-1.5">
                    <div className="font-bold text-gold-400 flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-gold-400" />
                      <span>Field Instructions</span>
                    </div>
                    <div className="text-stone-300 leading-relaxed font-normal">{selectedTask.instructions}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-forest-950/80 border border-forest-700/30 space-y-1.5">
                    <div className="font-bold text-gold-400 flex items-center space-x-1.5">
                      <Camera className="w-3.5 h-3.5 text-gold-400" />
                      <span>Evidence Required</span>
                    </div>
                    <div className="text-stone-300 leading-relaxed font-normal">{selectedTask.evidence_requirements}</div>
                  </div>
                </div>

                {/* AI Duplicate Flag Warning if triggered */}
                {submissionResult?.ai_duplicate_analysis && (
                  <div
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      submissionResult.ai_duplicate_analysis.is_potential_duplicate
                        ? 'bg-rose-500/15 border-rose-400/30 text-rose-300'
                        : 'bg-forest-400/15 border-forest-400/30 text-forest-300'
                    }`}
                  >
                    <div className="font-bold flex items-center space-x-1.5">
                      {submissionResult.ai_duplicate_analysis.is_potential_duplicate ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-gold-400" />
                      )}
                      <span>AI Verification Inspection Result</span>
                    </div>
                    <p className="leading-relaxed">{submissionResult.ai_duplicate_analysis.explanation}</p>
                    <div className="text-[11px] opacity-80 font-mono">
                      Similarity Score: {submissionResult.ai_duplicate_analysis.highest_similarity_score} | Flag: {submissionResult.ai_duplicate_analysis.flag}
                    </div>
                  </div>
                )}

                {/* Submission Form */}
                <form onSubmit={handleSubmitEvidence} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-forest-300/70 mb-1.5">
                      Completion Report & Work Done Summary
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={evidenceDesc}
                      onChange={e => setEvidenceDesc(e.target.value)}
                      placeholder="Describe specific work completed, waste volume segregated, saplings tagged, or ground activities fulfilled..."
                      className="w-full p-3.5 text-xs rounded-xl bg-forest-950/80 border border-forest-700/40 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-gold-400"
                    />
                  </div>

                  <div className="p-6 border-2 border-dashed border-forest-700/40 rounded-xl text-center space-y-2 bg-forest-950/60 hover:border-gold-400/40 transition-colors">
                    <Upload className="w-8 h-8 text-gold-400/70 mx-auto" />
                    <div className="text-xs font-semibold text-stone-200">Attach Geo-Tagged Photo / Evidence</div>
                    <div className="text-[11px] text-stone-400">JPG, PNG or PDF under 10MB</div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-forest-950 font-bold text-xs shadow-lg shadow-gold-400/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-forest-950" />
                    <span>{submitting ? 'Analyzing & Uploading Evidence...' : 'Submit Evidence for Verification'}</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-stone-400 forest-card rounded-2xl border border-forest-700/25">
                Select an assigned task from the left column to view instructions and submit evidence.
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
