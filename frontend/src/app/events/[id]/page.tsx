'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import {
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  Sparkles,
  Phone,
  User,
  X
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/motion/ProgressBar';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  // Skill matching evaluation state
  const [skillMatchState, setSkillMatchState] = useState<{ isMatched: boolean; missingSkills: string[] }>({
    isMatched: true,
    missingSkills: []
  });

  // Check-In modal state
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [scannedToken, setScannedToken] = useState('');
  const [checkInMsg, setCheckInMsg] = useState<{ success: boolean; text: string } | null>(null);

  const evaluateSkills = (requirements: any[], skills: any[]) => {
    if (!requirements || requirements.length === 0) {
      setSkillMatchState({ isMatched: true, missingSkills: [] });
      return;
    }

    const userSkillIds = skills.map((s: any) => s.skill_id || s.id);
    const userSkillNames = skills.map((s: any) => (s.name || '').toLowerCase());

    const mandatory = requirements.filter((r: any) => r.is_mandatory);
    if (mandatory.length > 0) {
      const missing = mandatory.filter(
        (r: any) => !userSkillIds.includes(r.skill_id) && !userSkillNames.includes((r.skill_name || '').toLowerCase())
      );
      if (missing.length > 0) {
        setSkillMatchState({
          isMatched: false,
          missingSkills: missing.map((r: any) => r.skill_name || 'Required Skill')
        });
        return;
      }
    } else {
      const hasAny = requirements.some(
        (r: any) => userSkillIds.includes(r.skill_id) || userSkillNames.includes((r.skill_name || '').toLowerCase())
      );
      if (!hasAny) {
        setSkillMatchState({
          isMatched: false,
          missingSkills: requirements.map((r: any) => r.skill_name || 'Required Skill')
        });
        return;
      }
    }

    setSkillMatchState({ isMatched: true, missingSkills: [] });
  };

  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);

    const rawUser = typeof window !== 'undefined' ? localStorage.getItem('impactlink_user') : null;
    let loggedUser: any = null;
    let userVolunteerSkills: any[] = [];

    if (rawUser) {
      try {
        loggedUser = JSON.parse(rawUser);
        setCurrentUser(loggedUser);
      } catch (e) {}
    }

    const [evRes, profRes] = await Promise.all([
      api.getEvent(eventId),
      loggedUser && (loggedUser.role === 'VOLUNTEER' || loggedUser.role === 'TEAM_LEADER')
        ? api.getVolunteerProfile()
        : Promise.resolve({ success: false, data: null })
    ]);

    setLoading(false);

    if (profRes.success && profRes.data?.volunteer) {
      userVolunteerSkills = profRes.data.volunteer.skills || [];
    }

    if (evRes.success && evRes.data) {
      const loadedEvent = evRes.data.event;
      setEvent(loadedEvent);
      if (loggedUser && (loggedUser.role === 'VOLUNTEER' || loggedUser.role === 'TEAM_LEADER')) {
        evaluateSkills(loadedEvent.requirements || [], userVolunteerSkills);
      }
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleRegister = async () => {
    const rawUser = localStorage.getItem('impactlink_user');
    if (!rawUser) {
      router.push('/login');
      return;
    }

    const maxCap = event?.max_capacity || event?.volunteers_required || 0;
    if (event?.status === 'REGISTRATION_CLOSED' || (maxCap > 0 && (event?.confirmed_count || 0) >= maxCap)) {
      setRegError('Registration is closed. Maximum volunteer capacity has been reached.');
      return;
    }

    if (!skillMatchState.isMatched) {
      setRegError(
        `Skill requirement not met: The organization requires verified competency in [${skillMatchState.missingSkills.join(', ')}]. Only volunteers with matching skills are allowed to register.`
      );
      return;
    }

    setRegistering(true);
    setRegSuccess(null);
    setRegError(null);

    const res = await api.registerForEvent(eventId, 'Excited to contribute to this campaign!');
    setRegistering(false);

    if (res.success) {
      setRegSuccess(res.data?.message || 'Registration confirmed!');
      fetchEvent();
    } else {
      setRegError(res.message || 'Registration failed.');
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedToken) return;

    const res = await api.checkInQR({
      eventId,
      token: scannedToken.trim()
    });

    if (res.success) {
      setCheckInMsg({ success: true, text: res.data?.message || 'Check-in confirmed!' });
      fetchEvent();
    } else {
      setCheckInMsg({ success: false, text: res.message || 'Check-in failed.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-[#FF6B1A] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#6B5B53] font-semibold text-sm">Loading campaign details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center py-24 px-4 text-center space-y-4">
        <h2 className="text-2xl font-black text-[#7A2E0E]">Campaign Not Found</h2>
        <p className="text-sm text-[#6B5B53]">The requested campaign does not exist or has been removed.</p>
        <button
          onClick={() => router.push('/events')}
          className="px-6 py-3 rounded-full bg-[#FF6B1A] hover:bg-[#E8590C] text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20"
        >
          Return to Campaigns
        </button>
      </div>
    );
  }

  const maxCap = event.max_capacity || event.volunteers_required || 15;
  const confirmed = event.confirmed_count || 1;
  const isFull = event.status === 'REGISTRATION_CLOSED' || confirmed >= maxCap;
  const fillPct = Math.min(100, Math.round((confirmed / maxCap) * 100));

  return (
    <div className="min-h-screen bg-[#FFF4E8] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#6B5B53] hover:text-[#FF6B1A] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Campaigns</span>
        </button>

        {/* Hero Header Card */}
        <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#FF6B1A]/15 shadow-[0_4px_24px_rgba(255,107,26,0.08)] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#FF6B1A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Top Badges */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <Badge variant="orange" size="md">
              {event.category.replace('_', ' ')}
            </Badge>
            <div className="flex items-center space-x-2 bg-[#FFE3CC] px-4 py-1.5 rounded-full border border-[#FF6B1A]/20 text-xs font-bold text-[#7A2E0E]">
              <ShieldCheck className="w-4 h-4 text-[#FF6B1A]" />
              <span>Organizer Trust: <strong className="text-[#7A2E0E]">{event.organization?.trust_score || 78}/100</strong></span>
            </div>
          </div>

          {/* Heading */}
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#7A2E0E] leading-tight">
              {event.title}
            </h1>
            <p className="text-sm font-semibold text-[#6B5B53]">
              Organized by <span className="text-[#FF6B1A] font-bold">{event.organization?.name || 'Community Organization'}</span>
            </p>
          </div>

          {/* Action Alerts */}
          {regSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
              <span>{regSuccess}</span>
            </div>
          )}

          {regError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <span>{regError}</span>
            </div>
          )}

          {/* Skill Requirement Match Notice */}
          {event.requirements && event.requirements.length > 0 && currentUser && (currentUser.role === 'VOLUNTEER' || currentUser.role === 'TEAM_LEADER') && (
            <div className="relative z-10">
              {skillMatchState.isMatched ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <strong className="block font-bold">Skills Matched & Verified Eligible</strong>
                    <span>Your profile competencies match the organizer&apos;s required skills for this initiative. You are authorized to register!</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#FFE3CC] rounded-2xl border-2 border-[#FF6B1A]/40 text-xs space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-[#7A2E0E]">
                    <AlertTriangle className="w-4 h-4 text-[#FF6B1A] flex-shrink-0" />
                    <span>Organizer Skill Match Requirement</span>
                  </div>
                  <p className="text-[#6B5B53] leading-relaxed">
                    Only volunteers possessing the specific skills requested by the organization can register. Missing required skill(s): <strong className="text-[#7A2E0E] underline">{skillMatchState.missingSkills.join(', ')}</strong>.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/volunteer/profile"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#FF6B1A] hover:bg-[#E8590C] text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 transition-all"
                    >
                      <span>Add Matching Skill to Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logistics Grid */}
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-[#FFF4E8] border border-[#FF6B1A]/15 space-y-1.5">
              <div className="flex items-center space-x-2 text-[#6B5B53] text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-[#FF6B1A]" />
                <span>Date & Schedule</span>
              </div>
              <div className="font-heading font-extrabold text-[#7A2E0E] text-base">{event.event_date}</div>
              <div className="text-xs text-[#6B5B53]">{event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF4E8] border border-[#FF6B1A]/15 space-y-1.5">
              <div className="flex items-center space-x-2 text-[#6B5B53] text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#FF6B1A]" />
                <span>Location</span>
              </div>
              <div className="font-heading font-extrabold text-[#7A2E0E] text-base truncate">{event.location_name}</div>
              <div className="text-xs text-[#6B5B53] truncate">{event.address}, {event.city}</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF4E8] border border-[#FF6B1A]/15 space-y-1.5">
              <div className="flex items-center space-x-2 text-[#6B5B53] text-xs font-bold uppercase tracking-wider">
                <Users className="w-4 h-4 text-[#FF6B1A]" />
                <span>Capacity</span>
              </div>
              <div className="font-heading font-extrabold text-[#7A2E0E] text-base">
                {confirmed} / {event.volunteers_required} Needed
              </div>
              <div className="text-xs text-[#6B5B53]">{maxCap} Max Slot Limit</div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#FF6B1A]/10">
            {isFull ? (
              <div className="px-5 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Registration Closed — Maximum Capacity Reached ({confirmed}/{maxCap} Volunteers)</span>
              </div>
            ) : !skillMatchState.isMatched ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  onClick={() =>
                    setRegError(
                      `Skill requirement not met: The organization requires verified competency in [${skillMatchState.missingSkills.join(', ')}]. Only volunteers with matching skills are allowed to register.`
                    )
                  }
                  className="px-6 py-3.5 rounded-2xl bg-[#FFE3CC] border border-[#FF6B1A]/30 text-[#7A2E0E] font-bold text-xs shadow-xs hover:bg-[#FFE3CC]/80 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4 text-[#FF6B1A]" />
                  <span>Skill Match Required to Register</span>
                </button>
                <Link
                  href="/volunteer/profile"
                  className="px-5 py-3.5 rounded-2xl border border-[#FF6B1A]/20 bg-white hover:bg-[#FFF4E8] text-[#7A2E0E] font-bold text-xs transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <span>Add Skill in Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering}
                className="px-8 py-3.5 rounded-2xl bg-[#FF6B1A] hover:bg-[#E8590C] hover:scale-105 active:scale-95 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{registering ? 'Processing Registration...' : 'Register for Campaign'}</span>
              </button>
            )}

            <button
              onClick={() => setShowCheckInModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-white border border-[#FF6B1A]/20 hover:border-[#FF6B1A] hover:bg-[#FFF4E8] text-[#7A2E0E] font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
            >
              <QrCode className="w-4 h-4 text-[#FF6B1A]" />
              <span>QR Attendance Check-In</span>
            </button>
          </div>
        </div>

        {/* Detailed Grid: 2 Cols Left + 1 Col Right */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white p-8 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-4">
              <h2 className="text-xl font-heading font-bold text-[#7A2E0E]">Campaign Overview</h2>
              <p className="text-xs sm:text-sm text-[#6B5B53] leading-relaxed whitespace-pre-line font-medium">
                {event.description}
              </p>
            </div>

            {/* Safety & Guidelines */}
            <div className="bg-white p-8 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-4">
              <h2 className="text-xl font-heading font-bold text-[#7A2E0E] flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-[#FF6B1A]" />
                <span>Safety Briefing & Guidelines</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#6B5B53] leading-relaxed font-medium">
                {event.safety_instructions}
              </p>
              <div className="pt-2 text-xs font-semibold text-[#6B5B53]">
                Eligibility Criteria: <span className="font-bold text-[#7A2E0E]">{event.eligibility_requirements}</span>
              </div>
            </div>

            {/* Tasks in Event */}
            {event.tasks && event.tasks.length > 0 && (
              <div className="bg-white p-8 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-5">
                <h2 className="text-xl font-heading font-bold text-[#7A2E0E] flex items-center space-x-2">
                  <CheckSquare className="w-5 h-5 text-[#FF6B1A]" />
                  <span>Assigned Tasks & Deliverables</span>
                </h2>

                <div className="space-y-3">
                  {event.tasks.map((task: any) => (
                    <div
                      key={task.id}
                      className="p-5 rounded-2xl border border-[#FF6B1A]/15 bg-[#FFF4E8]/50 hover:bg-[#FFE3CC]/40 transition-all space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-heading font-bold text-sm text-[#7A2E0E]">{task.title}</div>
                        <Badge variant="peach" size="sm">{task.status}</Badge>
                      </div>
                      <p className="text-[#6B5B53]">{task.description}</p>
                      <div className="text-[11px] text-[#6B5B53] pt-1 border-t border-[#FF6B1A]/10">
                        <strong className="text-[#7A2E0E]">Evidence required:</strong> {task.evidence_requirements}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Skills & Contact */}
          <div className="space-y-6">
            {/* Required Skills */}
            <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-4">
              <h3 className="text-base font-heading font-bold text-[#7A2E0E] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#FF6B1A]" />
                <span>Required Skills</span>
              </h3>

              {event.requirements && event.requirements.length > 0 ? (
                <div className="space-y-2.5">
                  {event.requirements.map((req: any) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-2xl bg-[#FFF4E8] border border-[#FF6B1A]/15 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#7A2E0E]">{req.skill_name}</span>
                        {req.is_mandatory && (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full text-[10px] font-bold">
                            Mandatory
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#6B5B53]">{req.category}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#6B5B53]">No strict skill requirements. Enthusiastic newcomers welcome!</p>
              )}
            </div>

            {/* Coordinator Card */}
            <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-3 text-xs">
              <h3 className="text-base font-heading font-bold text-[#7A2E0E]">Event Coordinator</h3>
              <div className="flex items-center space-x-2 font-bold text-[#7A2E0E] text-sm">
                <User className="w-4 h-4 text-[#FF6B1A]" />
                <span>{event.contact_person}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#6B5B53] font-medium">
                <Phone className="w-3.5 h-3.5 text-[#FF6B1A]" />
                <span>{event.contact_phone}</span>
              </div>
            </div>

            {/* Capacity Meter */}
            <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#7A2E0E]">Capacity Occupancy</span>
                <span className="font-extrabold text-[#FF6B1A]">{fillPct}%</span>
              </div>
              <ProgressBar value={fillPct} variant={isFull ? 'peach' : 'orange'} />
              <p className="text-[11px] text-[#6B5B53] text-center">
                {confirmed} registered out of {maxCap} maximum spots
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Check-In Modal */}
        <AnimatePresence>
          {showCheckInModal && (
            <div className="fixed inset-0 bg-[#7A2E0E]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[32px] max-w-md w-full p-8 shadow-2xl border border-[#FF6B1A]/20 space-y-6"
              >
                <div className="flex justify-between items-center pb-3 border-b border-[#FF6B1A]/10">
                  <h3 className="font-heading font-bold text-lg text-[#7A2E0E] flex items-center space-x-2">
                    <QrCode className="w-5 h-5 text-[#FF6B1A]" />
                    <span>Verify Attendance</span>
                  </h3>
                  <button
                    onClick={() => setShowCheckInModal(false)}
                    className="w-8 h-8 rounded-full bg-[#FFF4E8] text-[#6B5B53] hover:text-[#7A2E0E] flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#6B5B53] leading-relaxed">
                  Scan the dynamic QR code displayed on the organizer screen or paste the cryptographic session token below.
                </p>

                {checkInMsg && (
                  <div
                    className={`p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 ${
                      checkInMsg.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {checkInMsg.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                    <span>{checkInMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleCheckIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">
                      Scanned Token or Special Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Paste scanned QR token payload"
                      value={scannedToken}
                      onChange={e => setScannedToken(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-mono rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] placeholder-[#6B5B53]/60 focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCheckInModal(false)}
                      className="flex-1 py-3 rounded-2xl text-xs font-bold border border-[#FF6B1A]/20 text-[#7A2E0E] hover:bg-[#FFF4E8] transition-all cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-2xl text-xs font-bold bg-[#FF6B1A] hover:bg-[#E8590C] text-white shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Confirm Check-In
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
