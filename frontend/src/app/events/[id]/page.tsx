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
    return <div className="py-24 text-center text-[#F97316] font-medium">Loading campaign details...</div>;
  }

  if (!event) {
    return (
      <div className="py-24 text-center space-y-3">
        <p className="text-[#7C2D12] font-semibold">Event not found.</p>
        <button onClick={() => router.push('/events')} className="text-[#F97316] text-sm font-semibold hover:underline cursor-pointer">
          Return to campaigns
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#78716C] hover:text-[#F97316] hover:-translate-x-1 transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </button>

      {/* Main Campaign Header */}
      <div className="bg-white p-8 rounded-3xl border border-[#FED7AA] hover:border-[#F97316]/50 shadow-xs hover:shadow-md transition-all space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] hover:scale-105 transition-transform uppercase tracking-wide cursor-default">
            {event.category.replace('_', ' ')}
          </span>
          <div className="flex items-center space-x-2 bg-[#FFEDD5]/60 hover:bg-[#FFEDD5] px-3 py-1.5 rounded-xl border border-[#FED7AA] text-xs text-[#7C2D12] font-medium transition-colors cursor-default">
            <ShieldCheck className="w-4 h-4 text-[#F97316]" />
            <span>Organizer Trust: <strong className="text-[#431407]">{event.organization?.trust_score || 78}/100</strong></span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-[#7C2D12] leading-tight">{event.title}</h1>
          <p className="text-sm text-[#78716C] mt-1 font-medium">
            Organized by <span className="text-[#9A3412] font-semibold">{event.organization?.name || 'Community Organization'}</span>
          </p>
        </div>

        {/* Action alerts */}
        {regSuccess && (
          <div className="p-4 bg-orange-50 border border-[#FED7AA] rounded-2xl text-[#7C2D12] text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#F97316]" />
            <span>{regSuccess}</span>
          </div>
        )}

        {regError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{regError}</span>
          </div>
        )}

        {/* Skill Requirement Match Notice */}
        {event.requirements && event.requirements.length > 0 && currentUser && (currentUser.role === 'VOLUNTEER' || currentUser.role === 'TEAM_LEADER') && (
          <div>
            {skillMatchState.isMatched ? (
              <div className="p-4 bg-orange-50 rounded-2xl border border-[#FED7AA] text-xs text-[#7C2D12] flex items-center space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                <div>
                  <strong className="block text-[#7C2D12] font-bold">Skills Matched & Verified Eligible</strong>
                  <span>Your profile competencies match the organizer&apos;s required skills for this initiative. You are authorized to register!</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#FFEDD5] rounded-2xl border-2 border-[#F97316]/50 text-xs space-y-2">
                <div className="flex items-center space-x-2 font-bold text-[#7C2D12]">
                  <AlertTriangle className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                  <span>Organizer Skill Match Requirement</span>
                </div>
                <p className="text-[#431407] leading-relaxed">
                  Only volunteers possessing the specific skills requested by the organization can register. Missing required skill(s): <strong className="text-[#7C2D12] underline">{skillMatchState.missingSkills.join(', ')}</strong>.
                </p>
                <div className="pt-1">
                  <Link
                    href="/volunteer/profile"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 active:scale-95 text-white rounded-xl font-bold text-[11px] shadow-sm transition-all"
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
        <div className="grid sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FFEDD5]/40 border border-[#FED7AA] text-xs text-[#431407]">
          <div className="space-y-1 p-2 rounded-xl hover:bg-[#FFEDD5]/80 hover:scale-[1.02] transition-all cursor-default">
            <div className="flex items-center space-x-1.5 text-[#78716C] font-semibold uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-[#F97316]" />
              <span>Event Date</span>
            </div>
            <div className="font-bold text-[#7C2D12] text-sm">{event.event_date}</div>
            <div className="text-[#78716C]">{event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}</div>
          </div>

          <div className="space-y-1 p-2 rounded-xl hover:bg-[#FFEDD5]/80 hover:scale-[1.02] transition-all cursor-default">
            <div className="flex items-center space-x-1.5 text-[#78716C] font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#F97316]" />
              <span>Location</span>
            </div>
            <div className="font-bold text-[#7C2D12] text-sm">{event.location_name}</div>
            <div className="text-[#78716C] truncate">{event.address}, {event.city}</div>
          </div>

          <div className="space-y-1 p-2 rounded-xl hover:bg-[#FFEDD5]/80 hover:scale-[1.02] transition-all cursor-default">
            <div className="flex items-center space-x-1.5 text-[#78716C] font-semibold uppercase tracking-wider">
              <Users className="w-4 h-4 text-[#F97316]" />
              <span>Capacity</span>
            </div>
            <div className="font-bold text-[#7C2D12] text-sm">
              {event.confirmed_count} / {event.volunteers_required} Volunteers
            </div>
            <div className="text-[#78716C]">{event.max_capacity} Maximum Slot Limit</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {event.status === 'REGISTRATION_CLOSED' || (event.confirmed_count >= (event.max_capacity || event.volunteers_required) && (event.max_capacity || event.volunteers_required) > 0) ? (
            <div className="px-5 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
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
                className="px-6 py-3 rounded-xl bg-[#FFEDD5] border border-[#FED7AA] hover:border-[#F97316] hover:bg-[#FED7AA] text-[#7C2D12] font-semibold text-sm shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-[#F97316]" />
                <span>Skill Match Required to Register</span>
              </button>
              <Link
                href="/volunteer/profile"
                className="px-4 py-3 rounded-xl border border-[#FED7AA] bg-white hover:bg-[#FFEDD5] hover:border-[#F97316] text-[#7C2D12] font-semibold text-xs transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span>Add Skill in Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <button
              onClick={handleRegister}
              disabled={registering}
              className="px-6 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 active:scale-95 text-white font-bold text-sm shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{registering ? 'Processing Registration...' : 'Register for Campaign'}</span>
            </button>
          )}

          <button
            onClick={() => setShowCheckInModal(true)}
            className="px-5 py-3 rounded-xl bg-white border border-[#FED7AA] hover:bg-[#FFEDD5] hover:border-[#F97316] hover:scale-105 active:scale-95 text-[#7C2D12] font-semibold text-sm transition-all flex items-center space-x-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#F97316]" />
            <span>QR Attendance Check-In</span>
          </button>
        </div>
      </div>

      {/* Campaign Details & Responsibilities */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#FED7AA] hover:border-[#F97316]/50 shadow-xs hover:shadow-md transition-all space-y-3">
            <h2 className="text-lg font-bold text-[#7C2D12]">Campaign Overview</h2>
            <p className="text-sm text-[#431407] leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          {/* Safety & Instructions */}
          <div className="bg-white p-6 rounded-2xl border border-[#FED7AA] hover:border-[#F97316]/50 shadow-xs hover:shadow-md transition-all space-y-3">
            <h2 className="text-lg font-bold text-[#7C2D12] flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-[#F97316]" />
              <span>Safety Briefing & Guidelines</span>
            </h2>
            <p className="text-sm text-[#431407] leading-relaxed">{event.safety_instructions}</p>
            <div className="pt-2 text-xs font-semibold text-[#78716C]">
              Eligibility: <span className="font-normal text-[#431407]">{event.eligibility_requirements}</span>
            </div>
          </div>

          {/* Tasks in this Event */}
          {event.tasks && event.tasks.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-[#FED7AA] hover:border-[#F97316]/50 shadow-xs hover:shadow-md transition-all space-y-4">
              <h2 className="text-lg font-bold text-[#7C2D12] flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-[#F97316]" />
                <span>Assigned Tasks & Deliverables</span>
              </h2>

              <div className="space-y-3">
                {event.tasks.map((task: any) => (
                  <div key={task.id} className="p-4 rounded-xl border border-[#FED7AA] bg-[#FFEDD5]/40 hover:bg-[#FFEDD5]/70 hover:border-[#F97316]/50 transition-all space-y-2 text-xs cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-sm text-[#7C2D12]">{task.title}</div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA]">
                        {task.status}
                      </span>
                    </div>
                    <p className="text-[#431407]">{task.description}</p>
                    <div className="text-[11px] text-[#78716C]">
                      <strong className="text-[#7C2D12]">Evidence required:</strong> {task.evidence_requirements}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Skills & Verification Criteria */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#FED7AA] hover:border-[#F97316]/50 shadow-xs hover:shadow-md transition-all space-y-4">
            <h3 className="text-sm font-bold text-[#7C2D12] flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#F97316]" />
              <span>Required Skills</span>
            </h3>

            {event.requirements && event.requirements.length > 0 ? (
              <div className="space-y-2">
                {event.requirements.map((req: any) => (
                  <div key={req.id} className="p-2.5 rounded-xl bg-[#FFEDD5]/40 hover:bg-[#FFEDD5]/70 hover:border-[#F97316]/50 border border-[#FED7AA] text-xs transition-all cursor-default">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#7C2D12]">{req.skill_name}</span>
                      {req.is_mandatory && (
                        <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 rounded text-[10px] font-bold">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#78716C] mt-0.5">{req.category}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#78716C]">No strict skill requirements. Enthusiastic newcomers welcome!</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#FED7AA] hover:border-[#F97316]/50 shadow-xs hover:shadow-md transition-all space-y-3 text-xs">
            <h3 className="text-sm font-bold text-[#7C2D12]">Event Coordinator</h3>
            <div className="text-[#9A3412] font-semibold">{event.contact_person}</div>
            <div className="text-[#78716C]">{event.contact_phone}</div>
          </div>
        </div>
      </div>

      {/* Attendance Check-In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-[#431407]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#FED7AA] space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#FED7AA]">
              <h3 className="font-bold text-base text-[#7C2D12] flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-[#F97316]" />
                <span>Verify Attendance</span>
              </h3>
              <button onClick={() => setShowCheckInModal(false)} className="text-[#78716C] hover:text-[#7C2D12] text-sm cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-[#78716C] leading-relaxed">
              Scan the dynamic QR code displayed on the organizer screen or enter the cryptographic session token below.
            </p>

            {checkInMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                  checkInMsg.success
                    ? 'bg-orange-50 text-[#7C2D12] border border-[#FED7AA]'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {checkInMsg.success ? <CheckCircle2 className="w-4 h-4 text-[#F97316]" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                <span>{checkInMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleCheckIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] mb-1">
                  Scanned Token or Hex Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="Paste scanned QR token payload"
                  value={scannedToken}
                  onChange={e => setScannedToken(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-mono rounded-xl bg-white border border-[#FED7AA] hover:border-[#F97316] text-[#431407] placeholder-[#78716C] focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-all"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold border border-[#FED7AA] text-[#7C2D12] hover:bg-[#FFEDD5] transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 active:scale-95 text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer"
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
