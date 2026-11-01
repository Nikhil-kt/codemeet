'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  Sparkles
} from 'lucide-react';

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
    return <div className="py-24 text-center text-amber-500/80 font-medium">Loading campaign details...</div>;
  }

  if (!event) {
    return (
      <div className="py-24 text-center space-y-3">
        <p className="text-stone-300 font-semibold">Event not found.</p>
        <button onClick={() => router.push('/events')} className="text-amber-400 text-sm font-semibold hover:underline">
          Return to campaigns
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-400 hover:text-amber-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </button>

      {/* Main Campaign Header */}
      <div className="bg-stone-900/80 backdrop-blur-xl p-8 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase tracking-wide">
            {event.category.replace('_', ' ')}
          </span>
          <div className="flex items-center space-x-2 bg-stone-950/70 px-3 py-1.5 rounded-xl border border-stone-800 text-xs text-stone-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Organizer Trust: <strong className="text-white">{event.organization?.trust_score || 78}/100</strong></span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white leading-tight">{event.title}</h1>
          <p className="text-sm text-stone-400 mt-1 font-medium">
            Organized by <span className="text-amber-300 font-semibold">{event.organization?.name || 'Community Organization'}</span>
          </p>
        </div>

        {/* Action alerts */}
        {regSuccess && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-200 text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <span>{regSuccess}</span>
          </div>
        )}

        {regError && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-2xl text-rose-300 text-sm flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <span>{regError}</span>
          </div>
        )}

        {/* Skill Requirement Match Notice */}
        {event.requirements && event.requirements.length > 0 && currentUser && (currentUser.role === 'VOLUNTEER' || currentUser.role === 'TEAM_LEADER') && (
          <div>
            {skillMatchState.isMatched ? (
              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-xs text-amber-200 flex items-center space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <strong className="block text-amber-300 font-bold">Skills Matched & Verified Eligible</strong>
                  <span>Your profile competencies match the organizer&apos;s required skills for this initiative. You are authorized to register!</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-950/30 rounded-2xl border-2 border-amber-500/50 text-xs space-y-2">
                <div className="flex items-center space-x-2 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Organizer Skill Match Requirement</span>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  Only volunteers possessing the specific skills requested by the organization can register. Missing required skill(s): <strong className="text-amber-300 underline">{skillMatchState.missingSkills.join(', ')}</strong>.
                </p>
                <div className="pt-1">
                  <Link
                    href="/volunteer/profile"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 rounded-xl font-bold text-[11px] shadow-sm transition-all"
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
        <div className="grid sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-stone-950/60 border border-stone-800 text-xs text-stone-300">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-stone-400 font-semibold uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Event Date</span>
            </div>
            <div className="font-bold text-white text-sm">{event.event_date}</div>
            <div className="text-stone-400">{event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-stone-400 font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Location</span>
            </div>
            <div className="font-bold text-white text-sm">{event.location_name}</div>
            <div className="text-stone-400 truncate">{event.address}, {event.city}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-stone-400 font-semibold uppercase tracking-wider">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Capacity</span>
            </div>
            <div className="font-bold text-white text-sm">
              {event.confirmed_count} / {event.volunteers_required} Volunteers
            </div>
            <div className="text-stone-400">{event.max_capacity} Maximum Slot Limit</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {event.status === 'REGISTRATION_CLOSED' || (event.confirmed_count >= (event.max_capacity || event.volunteers_required) && (event.max_capacity || event.volunteers_required) > 0) ? (
            <div className="px-5 py-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 font-semibold text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Registration Closed — Maximum Capacity Reached ({event.confirmed_count}/{event.max_capacity || event.volunteers_required} Volunteers)</span>
            </div>
          ) : !skillMatchState.isMatched ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={() =>
                  setRegError(
                    `Skill requirement not met: The organization requires verified competency in [${skillMatchState.missingSkills.join(', ')}]. Only volunteers with matching skills are allowed to register.`
                  )
                }
                className="px-6 py-3 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 font-semibold text-sm shadow-md transition-all flex items-center space-x-2"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Skill Match Required to Register</span>
              </button>
              <Link
                href="/volunteer/profile"
                className="px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-xs transition-all flex items-center space-x-1"
              >
                <span>Add Skill in Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <button
              onClick={handleRegister}
              disabled={registering}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{registering ? 'Processing Registration...' : 'Register for Campaign'}</span>
            </button>
          )}

          <button
            onClick={() => setShowCheckInModal(true)}
            className="px-5 py-3 rounded-xl bg-stone-800/90 border border-stone-700 hover:border-amber-500/50 text-stone-200 hover:text-white font-semibold text-sm hover:bg-stone-800 transition-all flex items-center space-x-2"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>QR Attendance Check-In</span>
          </button>
        </div>
      </div>

      {/* Campaign Details & Responsibilities */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-stone-900/80 backdrop-blur-xl p-6 rounded-2xl border border-stone-800 shadow-xl space-y-3">
            <h2 className="text-lg font-bold text-white">Campaign Overview</h2>
            <p className="text-sm text-stone-300 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          {/* Safety & Instructions */}
          <div className="bg-stone-900/80 backdrop-blur-xl p-6 rounded-2xl border border-stone-800 shadow-xl space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Safety Briefing & Guidelines</span>
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">{event.safety_instructions}</p>
            <div className="pt-2 text-xs font-semibold text-stone-400">
              Eligibility: <span className="font-normal text-stone-200">{event.eligibility_requirements}</span>
            </div>
          </div>

          {/* Tasks in this Event */}
          {event.tasks && event.tasks.length > 0 && (
            <div className="bg-stone-900/80 backdrop-blur-xl p-6 rounded-2xl border border-stone-800 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-amber-400" />
                <span>Assigned Tasks & Deliverables</span>
              </h2>

              <div className="space-y-3">
                {event.tasks.map((task: any) => (
                  <div key={task.id} className="p-4 rounded-xl border border-stone-800 bg-stone-950/60 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-sm text-white">{task.title}</div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {task.status}
                      </span>
                    </div>
                    <p className="text-stone-300">{task.description}</p>
                    <div className="text-[11px] text-stone-400">
                      <strong className="text-amber-300/90">Evidence required:</strong> {task.evidence_requirements}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Skills & Verification Criteria */}
        <div className="space-y-6">
          <div className="bg-stone-900/80 backdrop-blur-xl p-6 rounded-2xl border border-stone-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Required Skills</span>
            </h3>

            {event.requirements && event.requirements.length > 0 ? (
              <div className="space-y-2">
                {event.requirements.map((req: any) => (
                  <div key={req.id} className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-200">{req.skill_name}</span>
                      {req.is_mandatory && (
                        <span className="px-1.5 py-0.5 bg-rose-950/60 text-rose-300 border border-rose-800/50 rounded text-[10px] font-bold">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{req.category}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400">No strict skill requirements. Enthusiastic newcomers welcome!</p>
            )}
          </div>

          <div className="bg-stone-900/80 backdrop-blur-xl p-6 rounded-2xl border border-stone-800 shadow-xl space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white">Event Coordinator</h3>
            <div className="text-amber-300 font-semibold">{event.contact_person}</div>
            <div className="text-stone-400">{event.contact_phone}</div>
          </div>
        </div>
      </div>

      {/* Attendance Check-In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-500/30 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-amber-400" />
                <span>Verify Attendance</span>
              </h3>
              <button onClick={() => setShowCheckInModal(false)} className="text-stone-400 hover:text-stone-100 text-sm">
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Scan the dynamic QR code displayed on the organizer screen or enter the cryptographic session token below.
            </p>

            {checkInMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                  checkInMsg.success
                    ? 'bg-amber-500/10 text-amber-200 border border-amber-500/30'
                    : 'bg-rose-950/40 text-rose-300 border border-rose-800/60'
                }`}
              >
                {checkInMsg.success ? <CheckCircle2 className="w-4 h-4 text-amber-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                <span>{checkInMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleCheckIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Scanned Token or Hex Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="Paste scanned QR token payload"
                  value={scannedToken}
                  onChange={e => setScannedToken(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-mono rounded-xl bg-stone-800/90 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold border border-stone-700 text-stone-300 hover:bg-stone-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 shadow-lg shadow-amber-500/25"
                >
                  Confirm Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

