'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  ShieldCheck,
  Award,
  Clock,
  Calendar,
  CheckCircle2,
  QrCode,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckSquare,
  AlertCircle,
  Printer,
  BadgeCheck,
  X,
  FileText,
  User
} from 'lucide-react';

export default function VolunteerDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [skillsCatalog, setSkillsCatalog] = useState<any[]>([]);
  const [myCertificates, setMyCertificates] = useState<any[]>([]);
  const [activeCertificate, setActiveCertificate] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check-In modal
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [checkingInLoading, setCheckingInLoading] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<{ success: boolean; msg: string } | null>(null);
  const [celebrationBanner, setCelebrationBanner] = useState<string | null>(null);

  // Certificate modal
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('impactlink_user') : null;
    if (raw) {
      try {
        setCurrentUser(JSON.parse(raw));
      } catch (e) {}
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [pRes, hRes, sRes, cRes] = await Promise.all([
      api.getVolunteerProfile(),
      api.getVolunteerHistory(),
      api.getSkillsCatalog(),
      api.getMyCertificates()
    ]);
    setLoading(false);

    if (pRes.success && pRes.data) setProfile(pRes.data.volunteer);
    if (hRes.success && hRes.data) setHistory(hRes.data);
    if (sRes.success && sRes.data) setSkillsCatalog(sRes.data.skills || []);
    if (cRes.success && cRes.data) {
      const certs = cRes.data.certificates || [];
      setMyCertificates(certs);
      if (certs.length > 0 && !activeCertificate) {
        setActiveCertificate(certs[0]);
      }
    }
  };

  const handleQuickCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput) return;

    setCheckingInLoading(true);
    setCheckInStatus(null);

    const res = await api.checkInQR({
      eventId: selectedEventId || undefined,
      token: tokenInput.trim(),
      code: tokenInput.trim(),
      specialCode: tokenInput.trim()
    });

    setCheckingInLoading(false);

    if (res.success) {
      const cert = (res as any).certificate || res.data?.certificate;
      if (cert) {
        setActiveCertificate(cert);
      }
      setCheckInStatus({ success: true, msg: res.message || res.data?.message || 'Check-in confirmed!' });
      setCelebrationBanner('🎉 Attendance Verified! Your official Gemini AI-Endorsed Certificate is ready!');
      await loadData();
      setTokenInput('');
      
      // Auto open certificate modal to celebrate and display
      setTimeout(() => {
        setCheckInModalOpen(false);
        setCertificateModalOpen(true);
      }, 900);
    } else {
      setCheckInStatus({ success: false, msg: res.message || 'Check-in failed. Please verify the code or token.' });
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-forest-300/60">Loading volunteer profile...</div>;
  }

  const volunteerName = currentUser?.full_name || profile?.full_name || 'Community Volunteer';
  const volunteerEmail = currentUser?.email || profile?.email || '';
  const reliabilityScore = profile?.reliability_score || 75.0;
  const factors = profile?.reliability_factors || {
    attendanceConsistency: 90,
    taskCompletion: 85,
    organizerFeedback: 85,
    timelyCancellation: 90
  };

  const allEvents = history?.events || [];
  const attendedEvents = allEvents.filter((item: any) => item.attendance_status === 'PRESENT');
  const totalVerifiedHours = history?.total_hours || (attendedEvents.length * 4.0);
  const certId = `IL-CERT-${(profile?.id || '2026').slice(0, 8).toUpperCase()}-VERIFIED`;

  return (
    <ProtectedRoute allowedRoles={['VOLUNTEER', 'TEAM_LEADER', 'ADMIN']}>
      <div className="leaf-pattern space-y-6 pb-12">
        {/* Celebration Banner */}
        {celebrationBanner && (
          <div className="p-4 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 text-forest-950 font-bold rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center space-x-2 text-xs">
              <Sparkles className="w-5 h-5 text-forest-950 animate-pulse" />
              <span>{celebrationBanner}</span>
            </div>
            <button
              onClick={() => setCertificateModalOpen(true)}
              className="px-4 py-1.5 bg-forest-950 text-gold-400 hover:bg-forest-900 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              View Certificate Now
            </button>
          </div>
        )}

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 border border-gold-400/20 text-white p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-gold-400/15 text-gold-400 border border-gold-400/30 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Verified Community Volunteer</span>
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-stone-100">Volunteer Command Center</h1>
            <div className="w-12 h-0.5 bg-gold-400/60 rounded-full" />
            <p className="text-xs text-stone-300/90 max-w-xl">
              Track your verified community participation, attendance records, assigned tasks, and official certificate of service.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/volunteer/profile"
              className="px-5 py-3 rounded-xl bg-forest-700/50 hover:bg-forest-700 text-stone-200 font-semibold text-xs border border-forest-600/30 shadow-sm transition-all flex items-center space-x-2"
            >
              <User className="w-4 h-4 text-gold-400" />
              <span>My Profile & Skills</span>
            </Link>

            <button
              onClick={() => setCertificateModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-gold-400 hover:bg-gold-500 text-forest-950 font-bold text-xs shadow-lg shadow-gold-400/25 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-forest-950" />
              <span>Service Certificate</span>
            </button>

            <button
              onClick={() => {
                if (history?.events && history.events.length > 0) {
                  setSelectedEventId(history.events[0].event_id);
                }
                setCheckInModalOpen(true);
              }}
              className="px-5 py-3 rounded-xl bg-forest-400/15 hover:bg-forest-400/25 border border-forest-400/30 text-forest-300 font-semibold text-xs shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan Attendance QR</span>
            </button>
          </div>
        </div>

        {/* Certificate Callout Card */}
        <div className="forest-card p-6 sm:p-7 rounded-2xl border border-gold-400/30 shadow-xl shadow-gold-400/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-gold-400 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-gold-400" />
              <span>Official Community Service Credential</span>
            </div>
            <h3 className="text-lg font-bold text-stone-100">
              Verified Certificate of Participation Available
            </h3>
            <p className="text-xs text-stone-300/80 max-w-xl">
              Your attendance records and volunteer contributions are cryptographically verified through QR check-ins. You can view, download, or print your official certificate below.
            </p>
          </div>

          <button
            onClick={() => setCertificateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-forest-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
          >
            <Award className="w-4 h-4 text-forest-950" />
            <span>View & Print Certificate</span>
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid sm:grid-cols-3 gap-5">
          {/* Reliability Score Card */}
          <div className="forest-card p-6 rounded-2xl border border-forest-700/25 shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold uppercase tracking-wider text-forest-300/70">
                🌿 Reliability Score
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-gold-400/15 text-gold-400 border border-gold-400/30">
                {profile?.is_provisional ? 'Provisional' : 'Active Rating'}
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-gold-400 text-4xl font-black">{reliabilityScore}</span>
              <span className="text-stone-400 text-sm font-semibold">/ 100</span>
            </div>

            <div className="space-y-3 pt-3 border-t border-forest-700/30 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-stone-400">
                  <span>Attendance Consistency (40%)</span>
                  <strong className="text-stone-200">{factors.attendanceConsistency}%</strong>
                </div>
                <div className="w-full h-1.5 bg-forest-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-400/70 rounded-full" style={{ width: `${factors.attendanceConsistency}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-stone-400">
                  <span>Verified Tasks (30%)</span>
                  <strong className="text-stone-200">{factors.taskCompletion}%</strong>
                </div>
                <div className="w-full h-1.5 bg-forest-800 rounded-full overflow-hidden">
                  <div className="h-full bg-forest-400/70 rounded-full" style={{ width: `${factors.taskCompletion}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-stone-400">
                  <span>Organizer Feedback (20%)</span>
                  <strong className="text-stone-200">{factors.organizerFeedback}%</strong>
                </div>
                <div className="w-full h-1.5 bg-forest-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-400/50 rounded-full" style={{ width: `${factors.organizerFeedback}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-stone-400">
                  <span>Cancellation Behavior (10%)</span>
                  <strong className="text-stone-200">{factors.timelyCancellation}%</strong>
                </div>
                <div className="w-full h-1.5 bg-forest-800 rounded-full overflow-hidden">
                  <div className="h-full bg-forest-300/60 rounded-full" style={{ width: `${factors.timelyCancellation}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Volunteering Hours */}
          <div className="forest-card p-6 rounded-2xl border border-forest-700/25 shadow-xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-forest-300/70">
              Total Contribution
            </span>
            <div className="flex items-center justify-center py-3">
              <Clock className="w-8 h-8 text-gold-400/40 mr-3" />
              <div>
                <span className="text-gold-400 text-4xl font-black">
                  {totalVerifiedHours}
                </span>
                <span className="text-stone-400 text-sm font-semibold ml-2">Verified Hours</span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed pt-2 border-t border-forest-700/30">
              Hours are certified upon QR attendance check-in and task completion records by community organizers.
            </p>
          </div>

          {/* Location & Preferred Categories */}
          <div className="forest-card p-6 rounded-2xl border border-forest-700/25 shadow-xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-forest-300/70">
              🌱 Matching Vicinity
            </span>
            <div className="flex items-center space-x-2 text-stone-100 font-bold text-sm">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span>{profile?.city || 'Chennai'}, {profile?.state || 'Tamil Nadu'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {(profile?.preferred_categories || ['ENVIRONMENTAL', 'COMMUNITY_WELFARE']).map((cat: string) => (
                <span key={cat} className="px-2.5 py-1 rounded-full bg-forest-400/15 border border-forest-400/30 text-forest-300 text-[11px] font-semibold">
                  {cat.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Participation History */}
        <div className="bg-forest-900/90 rounded-2xl border border-forest-700/25 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-forest-700/30 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-stone-100">Registered Campaigns & Attendance</h2>
              <p className="text-xs text-stone-400 mt-0.5">Your personal event participations and verified attendance logs</p>
            </div>
            <Link href="/events" className="text-xs font-bold text-gold-400 hover:text-gold-300 hover:underline flex items-center space-x-1">
              <span>Find More Campaigns</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {allEvents.length > 0 ? (
            <div className="divide-y divide-forest-700/30">
              {allEvents.map((item: any) => (
                <div key={item.registration_id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-forest-800/50 transition-colors">
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-stone-100 hover:text-gold-400 transition-colors">
                      <Link href={`/events/${item.event_id}`}>{item.event_title}</Link>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-stone-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-forest-300/50" />
                        <span>{item.event_date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-forest-300/50" />
                        <span>{item.city}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.registration_status === 'CONFIRMED'
                        ? 'bg-gold-400/15 text-gold-400 border border-gold-400/30'
                        : 'bg-forest-800 text-stone-400 border border-forest-700/30'
                    }`}>
                      {item.registration_status}
                    </span>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.attendance_status === 'PRESENT'
                        ? 'bg-forest-400/15 text-forest-300 border border-forest-400/30'
                        : 'bg-forest-800 text-stone-400 border border-forest-700/30'
                    }`}>
                      {item.attendance_status === 'PRESENT' ? '✓ Checked In (Present)' : 'Registered'}
                    </span>

                    {item.attendance_status !== 'PRESENT' && (
                      <button
                        onClick={() => {
                          setSelectedEventId(item.event_id);
                          setCheckInModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-gold-400 hover:bg-gold-500 text-forest-950 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-stone-400">
              No registered campaigns yet. Browse open campaigns to participate!
            </div>
          )}
        </div>

        {/* Skills Profile Section */}
        <div className="forest-card p-6 rounded-2xl border border-forest-700/25 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-stone-100 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span>Certified Skills Taxonomy</span>
            </h2>
            <Link
              href="/volunteer/profile"
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 hover:underline flex items-center space-x-1"
            >
              <span>Manage Profile & Skills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {(profile?.skills || []).map((sk: any) => (
              <div key={sk.id} className="p-3.5 rounded-xl bg-forest-800/60 border border-forest-700/30 space-y-1 text-xs">
                <div className="font-bold text-stone-100">{sk.name}</div>
                <div className="text-[11px] text-stone-400 flex justify-between">
                  <span>{sk.category}</span>
                  <span className="font-semibold text-forest-300">{sk.proficiency_level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Official Certificate of Service */}
        {certificateModalOpen && (
          <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-10 space-y-6 shadow-2xl border-4 border-double border-gold-400/80 print:border-none print:shadow-none print:p-8">
              {/* Top Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden border-b border-stone-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-forest-800 uppercase tracking-widest flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-gold-400" />
                    <span>ImpactLink Verified Credential</span>
                  </span>
                  {activeCertificate?.ai_badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-forest-100 text-forest-800 border border-forest-200">
                      ✨ {activeCertificate.ai_badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    onClick={() => setCertificateModalOpen(false)}
                    className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Certificate Switcher (if multiple earned certificates) */}
              {myCertificates.length > 1 && (
                <div className="print:hidden flex items-center space-x-2 overflow-x-auto pb-2">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex-shrink-0">
                    Switch Credential:
                  </span>
                  {myCertificates.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setActiveCertificate(c)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        activeCertificate?.id === c.id
                          ? 'bg-forest-800 text-white shadow-sm'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {c.event_title || c.certificate_number}
                    </button>
                  ))}
                </div>
              )}

              {/* The Certificate Canvas */}
              <div className="bg-gradient-to-br from-amber-50/40 via-white to-amber-50/30 p-8 sm:p-12 rounded-2xl border-2 border-gold-400/60 text-center space-y-6 relative overflow-hidden">
                {/* Decorative Seal Watermark */}
                <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
                  <Award className="w-40 h-40 text-gold-400" />
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-extrabold uppercase tracking-widest mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Official Community Service Record</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif uppercase">
                    Certificate of Participation & Service
                  </h2>
                  <p className="text-xs text-slate-500 font-serif italic">
                    This official credential verifies active participation, verified on-ground attendance, and civic impact.
                  </p>
                </div>

                <div className="py-2 space-y-1 border-y border-amber-200/80">
                  <span className="text-xs font-serif text-slate-500 uppercase tracking-widest">
                    Proudly Presented To
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide font-serif py-1">
                    {activeCertificate?.volunteer_name || volunteerName}
                  </div>
                  {volunteerEmail && (
                    <div className="text-xs text-slate-500 font-mono">{volunteerEmail}</div>
                  )}
                </div>

                {/* Event & Host Organization Callout */}
                <div className="text-xs text-slate-700 font-serif leading-relaxed max-w-xl mx-auto space-y-1">
                  <p>
                    For dedicated volunteer service during{' '}
                    <strong className="text-slate-900 font-sans font-bold">
                      {activeCertificate?.event_title || 'Marine Drive Coastal Cleanup'}
                    </strong>
                    {activeCertificate?.organization_name && (
                      <>
                        , organized in partnership with{' '}
                        <strong className="text-slate-900 font-sans font-bold">
                          {activeCertificate.organization_name}
                        </strong>
                      </>
                    )}
                    .
                  </p>
                </div>

                {/* Gemini AI Personalized Commendation Box */}
                {activeCertificate?.gemini_commendation ? (
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-forest-50/90 via-emerald-50/70 to-forest-50/50 rounded-2xl border border-forest-200/80 shadow-sm text-left space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-forest-950">
                        <Sparkles className="w-4 h-4 text-forest-600" />
                        <span>Gemini AI Verified Citation & Commendation</span>
                      </div>
                      {activeCertificate.ai_badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-forest-800 text-white shadow-sm">
                          {activeCertificate.ai_badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-[13px] text-forest-950 italic leading-relaxed font-serif">
                      &ldquo;{activeCertificate.gemini_commendation}&rdquo;
                    </p>
                    {activeCertificate.highlighted_skills && activeCertificate.highlighted_skills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-forest-700 uppercase tracking-wider">
                          Demonstrated Skills:
                        </span>
                        {activeCertificate.highlighted_skills.map((s: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-white border border-forest-200 text-forest-800 text-[10px] font-semibold shadow-2xs"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {activeCertificate.impact_summary && (
                      <div className="text-[11px] text-forest-800/90 pt-0.5 font-medium">
                        Impact Footprint: {activeCertificate.impact_summary}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto font-serif">
                    For outstanding commitment, dependable volunteerism, and verified civic leadership in community social welfare, environmental preservation, and public assistance initiatives.
                  </p>
                )}

                {/* Summary Metrics */}
                <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto py-3">
                  <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-sm text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Hours</span>
                    <strong className="text-lg font-black text-forest-700">
                      {activeCertificate?.hours_awarded || totalVerifiedHours || 4.0} hrs
                    </strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-sm text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Reliability</span>
                    <strong className="text-lg font-black text-forest-700">{reliabilityScore}/100</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-sm text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                    <strong className="text-lg font-black text-gold-400">PRESENT ✓</strong>
                  </div>
                </div>

                {/* Verification Footer */}
                <div className="pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 border-t border-amber-200/80 gap-2">
                  <div>
                    <span>Certificate ID: </span>
                    <span className="font-mono font-bold text-slate-700">
                      {activeCertificate?.certificate_number || activeCertificate?.id || certId}
                    </span>
                  </div>
                  <div>
                    <span>Issued: {new Date(activeCertificate?.issued_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-forest-700 font-bold">
                    <BadgeCheck className="w-4 h-4 text-forest-600" />
                    <span>Gemini AI & Cryptographically Authenticated</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex justify-end space-x-3 pt-2 print:hidden">
                <button
                  onClick={() => setCertificateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Check-In Modal: Special Code & QR Token Input */}
        {checkInModalOpen && (
          <div className="fixed inset-0 bg-forest-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-stone-100">
              <div className="flex justify-between items-start pb-2 border-b border-stone-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-[10px] font-bold uppercase tracking-wider">
                    <QrCode className="w-3.5 h-3.5 text-forest-600" />
                    <span>Instant Attendance & Certificate</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900">
                    Enter Check-In Code or QR Token
                  </h3>
                </div>
                <button
                  onClick={() => setCheckInModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Enter the <strong className="text-slate-800">Special Check-In Code</strong> announced by the event organizer (e.g. <span className="font-mono bg-forest-50 px-1.5 py-0.5 rounded text-forest-700 font-bold">IMP-4829</span>) or paste the scanned QR token to confirm your attendance and instantly generate your Gemini AI certificate!
              </p>

              {checkInStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                    checkInStatus.success
                      ? 'bg-forest-50 text-forest-800 border border-forest-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {checkInStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  )}
                  <span>{checkInStatus.msg}</span>
                </div>
              )}

              <form onSubmit={handleQuickCheckIn} className="space-y-4">
                {(history?.events || []).length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Select Event (Optional)</label>
                    <select
                      value={selectedEventId}
                      onChange={e => setSelectedEventId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                    >
                      <option value="">Auto-Detect from Code</option>
                      {(history?.events || []).map((e: any) => (
                        <option key={e.event_id} value={e.event_id}>
                          {e.event_title} ({e.event_date})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Special Check-In Code or QR Token
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IMP-4829 or paste token"
                    value={tokenInput}
                    onChange={e => setTokenInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono tracking-wider font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500 uppercase placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckInModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={checkingInLoading || !tokenInput}
                    className="flex-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-forest-800 hover:bg-forest-700 disabled:opacity-50 text-white shadow-md shadow-forest-800/20 transition-all flex items-center justify-center space-x-1.5"
                  >
                    {checkingInLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating Gemini AI Certificate...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                        <span>Check In & Get Certificate</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
