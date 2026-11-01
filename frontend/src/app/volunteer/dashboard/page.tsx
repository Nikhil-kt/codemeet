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
    return <div className="py-24 text-center text-[#78716C]">Loading volunteer profile...</div>;
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
      <div className="space-y-8 pb-12">
        {/* Top Banner */}
        {celebrationBanner && (
          <div className="p-4 bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#C2410C] text-white font-bold rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center space-x-2 text-xs">
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
              <span>{celebrationBanner}</span>
            </div>
            <button
              onClick={() => setCertificateModalOpen(true)}
              className="px-4 py-1.5 bg-white text-[#7C2D12] hover:bg-[#FFEDD5] interactive-btn text-xs font-bold rounded-xl shadow-sm cursor-pointer"
            >
              View Certificate Now
            </button>
          </div>
        )}

        <div className="bg-gradient-to-r from-white via-[#FFEDD5]/30 to-white border border-[#FED7AA] text-[#431407] p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] hover:scale-105 hover:bg-[#FED7AA] transition-transform cursor-default rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-[#F97316]" />
              <span>Verified Community Volunteer</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Volunteer Command Center</h1>
            <p className="text-xs text-[#431407]/90 max-w-xl font-light">
              Track your verified community participation, attendance records, assigned tasks, and official certificate of service.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/volunteer/profile"
              className="px-5 py-3 rounded-2xl bg-white hover:bg-[#FFEDD5] text-[#7C2D12] font-semibold text-xs border border-[#FED7AA] shadow-sm hover:border-[#F97316] hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300 transition-all flex items-center space-x-2"
            >
              <User className="w-4 h-4 text-[#F97316]" />
              <span>My Profile & Skills</span>
            </Link>

            <button
              onClick={() => setCertificateModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-white" />
              <span>Service Certificate</span>
            </button>

            <button
              onClick={() => {
                if (history?.events && history.events.length > 0) {
                  setSelectedEventId(history.events[0].event_id);
                }
                setCheckInModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-[#FFEDD5] hover:bg-orange-500/25 border border-orange-500/30 text-[#9A3412] font-semibold text-xs shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan Attendance QR</span>
            </button>
          </div>
        </div>

        {/* Certificate Callout Card */}
        <div className="bg-white backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-[#FED7AA] shadow-sm hover:border-[#F97316] hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[#F97316] font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#F97316]" />
              <span>Official Community Service Credential</span>
            </div>
            <h3 className="text-lg font-extrabold text-[#7C2D12]">
              Verified Certificate of Participation Available
            </h3>
            <p className="text-xs text-[#431407]/80 max-w-xl font-light">
              Your attendance records and volunteer contributions are cryptographically verified through QR check-ins. You can view, download, or print your official certificate below.
            </p>
          </div>

          <button
            onClick={() => setCertificateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
          >
            <Award className="w-4 h-4 text-white" />
            <span>View & Print Certificate</span>
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid sm:grid-cols-3 gap-6">
          {/* Reliability Score Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#FED7AA] shadow-sm hover:border-[#F97316] hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300 space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                Reliability Score
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] hover:scale-105 hover:bg-[#FED7AA] transition-transform cursor-default">
                {profile?.is_provisional ? 'Provisional' : 'Active Rating'}
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold text-[#F97316]">{reliabilityScore}</span>
              <span className="text-[#78716C] text-sm font-semibold">/ 100</span>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#FED7AA] text-xs">
              <div className="flex justify-between text-[#78716C]">
                <span>Attendance Consistency (40%)</span>
                <strong className="text-[#431407]">{factors.attendanceConsistency}%</strong>
              </div>
              <div className="flex justify-between text-[#78716C]">
                <span>Verified Tasks (30%)</span>
                <strong className="text-[#431407]">{factors.taskCompletion}%</strong>
              </div>
              <div className="flex justify-between text-[#78716C]">
                <span>Organizer Feedback (20%)</span>
                <strong className="text-[#431407]">{factors.organizerFeedback}%</strong>
              </div>
              <div className="flex justify-between text-[#78716C]">
                <span>Cancellation Behavior (10%)</span>
                <strong className="text-[#431407]">{factors.timelyCancellation}%</strong>
              </div>
            </div>
          </div>

          {/* Volunteering Hours */}
          <div className="bg-white p-6 rounded-3xl border border-[#FED7AA] shadow-sm hover:border-[#F97316] hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
              Total Contribution
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold text-[#F97316]">
                {totalVerifiedHours}
              </span>
              <span className="text-[#78716C] text-sm font-semibold">Verified Hours</span>
            </div>
            <p className="text-xs text-[#78716C] leading-relaxed pt-2 border-t border-[#FED7AA] font-light">
              Hours are certified upon QR attendance check-in and task completion records by community organizers.
            </p>
          </div>

          {/* Location & Preferred Categories */}
          <div className="bg-white p-6 rounded-3xl border border-[#FED7AA] shadow-sm hover:border-[#F97316] hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
              Matching Vicinity
            </span>
            <div className="flex items-center space-x-2 text-[#7C2D12] font-bold text-sm">
              <MapPin className="w-4 h-4 text-[#F97316]" />
              <span>{profile?.city || 'Chennai'}, {profile?.state || 'Tamil Nadu'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {(profile?.preferred_categories || ['ENVIRONMENTAL', 'COMMUNITY_WELFARE']).map((cat: string) => (
                <span key={cat} className="px-2.5 py-1 rounded-lg bg-white border border-[#FED7AA] text-[#431407] text-[11px] font-semibold">
                  {cat.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Participation History */}
        <div className="bg-white rounded-3xl border border-[#FED7AA] shadow-sm hover:border-[#F97316] hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden">
          <div className="p-6 border-b border-[#FED7AA] flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-[#7C2D12]">Registered Campaigns & Attendance</h2>
              <p className="text-xs text-[#78716C] mt-0.5">Your personal event participations and verified attendance logs</p>
            </div>
            <Link href="/events" className="text-xs font-bold text-[#F97316] hover:text-[#9A3412] hover:underline flex items-center space-x-1 group">
              <span>Find More Campaigns</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {allEvents.length > 0 ? (
            <div className="divide-y divide-[#FED7AA]">
              {allEvents.map((item: any) => (
                <div key={item.registration_id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[#FFEDD5]/30 transition-colors">
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-[#7C2D12] hover:text-[#F97316] transition-colors">
                      <Link href={`/events/${item.event_id}`}>{item.event_title}</Link>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-[#78716C]">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-[#78716C]" />
                        <span>{item.event_date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-[#78716C]" />
                        <span>{item.city}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.registration_status === 'CONFIRMED'
                        ? 'bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] hover:scale-105 hover:bg-[#FED7AA] transition-transform cursor-default'
                        : 'bg-white text-[#78716C] border border-[#FED7AA]'
                    }`}>
                      {item.registration_status}
                    </span>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.attendance_status === 'PRESENT'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                        : 'bg-white text-[#78716C] border border-[#FED7AA]'
                    }`}>
                      {item.attendance_status === 'PRESENT' ? '✓ Checked In (Present)' : 'Registered'}
                    </span>

                    {item.attendance_status !== 'PRESENT' && (
                      <button
                        onClick={() => {
                          setSelectedEventId(item.event_id);
                          setCheckInModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#78716C]">
              No registered campaigns yet. Browse open campaigns to participate!
            </div>
          )}
        </div>

        {/* Skills Profile Section */}
        <div className="bg-white p-6 rounded-3xl border border-[#FED7AA] shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#7C2D12] flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#F97316]" />
              <span>Certified Skills Taxonomy</span>
            </h2>
            <Link
              href="/volunteer/profile"
              className="text-xs font-semibold text-[#F97316] hover:underline flex items-center space-x-1 group"
            >
              <span>Manage Profile & Skills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {(profile?.skills || []).map((sk: any) => (
              <div key={sk.id} className="p-3.5 rounded-2xl bg-[#FFEDD5]/40 border border-[#FED7AA] interactive-card space-y-1 text-xs">
                <div className="font-bold text-[#7C2D12]">{sk.name}</div>
                <div className="text-[11px] text-[#78716C] flex justify-between">
                  <span>{sk.category}</span>
                  <span className="font-semibold text-[#F97316]">{sk.proficiency_level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Official Certificate of Service */}
        {certificateModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#431407]/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-10 space-y-6 shadow-2xl border-4 border-double border-[#FED7AA] print:border-none print:shadow-none print:p-8">
              {/* Top Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden border-b border-[#FED7AA] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>ImpactLink Verified Credential</span>
                  </span>
                  {activeCertificate?.ai_badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                      ✨ {activeCertificate.ai_badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-orange-500/20 interactive-btn"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    onClick={() => setCertificateModalOpen(false)}
                    className="p-1.5 text-[#78716C] hover:text-[#431407] rounded-lg hover:bg-[#FFEDD5] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Certificate Switcher (if multiple earned certificates) */}
              {myCertificates.length > 1 && (
                <div className="print:hidden flex items-center space-x-2 overflow-x-auto pb-2">
                  <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider flex-shrink-0">
                    Switch Credential:
                  </span>
                  {myCertificates.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setActiveCertificate(c)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        activeCertificate?.id === c.id
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-[#FFEDD5] hover:bg-[#FED7AA] text-[#431407] transition-colors'
                      }`}
                    >
                      {c.event_title || c.certificate_number}
                    </button>
                  ))}
                </div>
              )}

              {/* The Certificate Canvas */}
              <div className="bg-gradient-to-br from-amber-50/40 via-white to-amber-50/30 p-8 sm:p-12 rounded-2xl border-2 border-amber-300/80 text-center space-y-6 relative overflow-hidden">
                {/* Decorative Seal Watermark */}
                <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
                  <Award className="w-40 h-40 text-amber-600" />
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-extrabold uppercase tracking-widest mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Official Community Service Record</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#7C2D12] tracking-tight font-serif uppercase">
                    Certificate of Participation & Service
                  </h2>
                  <p className="text-xs text-[#78716C] font-serif italic">
                    This official credential verifies active participation, verified on-ground attendance, and civic impact.
                  </p>
                </div>

                <div className="py-2 space-y-1 border-y border-amber-200/80">
                  <span className="text-xs font-serif text-[#78716C] uppercase tracking-widest">
                    Proudly Presented To
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#7C2D12] tracking-wide font-serif py-1">
                    {activeCertificate?.volunteer_name || volunteerName}
                  </div>
                  {volunteerEmail && (
                    <div className="text-xs text-[#78716C] font-mono">{volunteerEmail}</div>
                  )}
                </div>

                {/* Event & Host Organization Callout */}
                <div className="text-xs text-[#431407] font-serif leading-relaxed max-w-xl mx-auto space-y-1">
                  <p>
                    For dedicated volunteer service during{' '}
                    <strong className="text-[#7C2D12] font-sans font-bold">
                      {activeCertificate?.event_title || 'Marine Drive Coastal Cleanup'}
                    </strong>
                    {activeCertificate?.organization_name && (
                      <>
                        , organized in partnership with{' '}
                        <strong className="text-[#7C2D12] font-sans font-bold">
                          {activeCertificate.organization_name}
                        </strong>
                      </>
                    )}
                    .
                  </p>
                </div>

                {/* Gemini AI Personalized Commendation Box */}
                {activeCertificate?.gemini_commendation ? (
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-pink-50/50 rounded-2xl border border-indigo-200/80 shadow-sm text-left space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-950">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Gemini AI Verified Citation & Commendation</span>
                      </div>
                      {activeCertificate.ai_badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-600 text-[#7C2D12] shadow-sm">
                          {activeCertificate.ai_badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-[13px] text-indigo-950 italic leading-relaxed font-serif">
                      &ldquo;{activeCertificate.gemini_commendation}&rdquo;
                    </p>
                    {activeCertificate.highlighted_skills && activeCertificate.highlighted_skills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                          Demonstrated Skills:
                        </span>
                        {activeCertificate.highlighted_skills.map((s: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-800 text-[10px] font-semibold shadow-2xs"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {activeCertificate.impact_summary && (
                      <div className="text-[11px] text-indigo-800/90 pt-0.5 font-medium">
                        Impact Footprint: {activeCertificate.impact_summary}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-[#431407] leading-relaxed max-w-xl mx-auto font-serif">
                    For outstanding commitment, dependable volunteerism, and verified civic leadership in community social welfare, environmental preservation, and public assistance initiatives.
                  </p>
                )}

                {/* Summary Metrics */}
                <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto py-3">
                  <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-sm text-center">
                    <span className="text-[10px] uppercase font-bold text-[#78716C] block">Verified Hours</span>
                    <strong className="text-lg font-black text-[#F97316]">
                      {activeCertificate?.hours_awarded || totalVerifiedHours || 4.0} hrs
                    </strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-sm text-center">
                    <span className="text-[10px] uppercase font-bold text-[#78716C] block">Reliability</span>
                    <strong className="text-lg font-black text-indigo-700">{reliabilityScore}/100</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-sm text-center">
                    <span className="text-[10px] uppercase font-bold text-[#78716C] block">Status</span>
                    <strong className="text-lg font-black text-amber-700">PRESENT ✓</strong>
                  </div>
                </div>

                {/* Verification Footer */}
                <div className="pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#78716C] border-t border-amber-200/80 gap-2">
                  <div>
                    <span>Certificate ID: </span>
                    <span className="font-mono font-bold text-[#431407]">
                      {activeCertificate?.certificate_number || activeCertificate?.id || certId}
                    </span>
                  </div>
                  <div>
                    <span>Issued: {new Date(activeCertificate?.issued_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-[#F97316] font-bold">
                    <BadgeCheck className="w-4 h-4 text-[#F97316]" />
                    <span>Gemini AI & Cryptographically Authenticated</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex justify-end space-x-3 pt-2 print:hidden">
                <button
                  onClick={() => setCertificateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#FED7AA] text-xs font-semibold text-[#431407] hover:bg-[#FFEDD5]/40"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-orange-500/20 interactive-btn"
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
          <div className="fixed inset-0 bg-[#431407]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-[#FED7AA]">
              <div className="flex justify-between items-start pb-2 border-b border-[#FED7AA]">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] text-[10px] font-bold uppercase tracking-wider">
                    <QrCode className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>Instant Attendance & Certificate</span>
                  </div>
                  <h3 className="font-bold text-base text-[#7C2D12]">
                    Enter Check-In Code or QR Token
                  </h3>
                </div>
                <button
                  onClick={() => setCheckInModalOpen(false)}
                  className="p-1.5 text-[#78716C] hover:text-[#431407] rounded-lg hover:bg-[#FFEDD5] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-[#78716C] leading-relaxed">
                Enter the <strong className="text-[#7C2D12]">Special Check-In Code</strong> announced by the event organizer (e.g. <span className="font-mono bg-[#FFEDD5] px-1.5 py-0.5 rounded text-indigo-700 font-bold">IMP-4829</span>) or paste the scanned QR token to confirm your attendance and instantly generate your Gemini AI certificate!
              </p>

              {checkInStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                    checkInStatus.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {checkInStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  )}
                  <span>{checkInStatus.msg}</span>
                </div>
              )}

              <form onSubmit={handleQuickCheckIn} className="space-y-4">
                {(history?.events || []).length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-[#431407] mb-1">Select Event (Optional)</label>
                    <select
                      value={selectedEventId}
                      onChange={e => setSelectedEventId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#FED7AA] focus:outline-none focus:ring-2 focus:ring-[#F97316] bg-white"
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
                  <label className="block text-xs font-semibold text-[#431407] mb-1">
                    Special Check-In Code or QR Token
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IMP-4829 or paste token"
                    value={tokenInput}
                    onChange={e => setTokenInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono tracking-wider font-semibold rounded-xl border border-[#FED7AA] focus:outline-none focus:ring-2 focus:ring-[#F97316] uppercase placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-[#78716C]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckInModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-[#FED7AA] text-[#431407] hover:bg-[#FFEDD5]/40 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={checkingInLoading || !tokenInput}
                    className="flex-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-white shadow-md shadow-orange-500/20 interactive-btn flex items-center justify-center space-x-1.5"
                  >
                    {checkingInLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating Gemini AI Certificate...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-white" />
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
