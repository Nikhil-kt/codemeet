'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  CheckSquare,
  Sparkles
} from 'lucide-react';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  // Check-In modal state
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [scannedToken, setScannedToken] = useState('');
  const [checkInMsg, setCheckInMsg] = useState<{ success: boolean; text: string } | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    const res = await api.getEvent(eventId);
    setLoading(false);
    if (res.success && res.data) {
      setEvent(res.data.event);
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
    return <div className="py-24 text-center text-slate-400">Loading campaign details...</div>;
  }

  if (!event) {
    return (
      <div className="py-24 text-center space-y-3">
        <p className="text-slate-600 font-semibold">Event not found.</p>
        <button onClick={() => router.push('/events')} className="text-emerald-600 text-sm font-semibold hover:underline">
          Return to campaigns
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </button>

      {/* Main Campaign Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
            {event.category.replace('_', ' ')}
          </span>
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Organizer Trust: <strong className="text-slate-900">{event.organization?.trust_score || 78}/100</strong></span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">{event.title}</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Organized by <span className="text-slate-800 font-semibold">{event.organization?.name || 'Community Organization'}</span>
          </p>
        </div>

        {/* Action alerts */}
        {regSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{regSuccess}</span>
          </div>
        )}

        {regError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{regError}</span>
          </div>
        )}

        {/* Logistics Grid */}
        <div className="grid sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Event Date</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">{event.event_date}</div>
            <div className="text-slate-500">{event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">{event.location_name}</div>
            <div className="text-slate-500 truncate">{event.address}, {event.city}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Capacity</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">
              {event.confirmed_count} / {event.volunteers_required} Volunteers
            </div>
            <div className="text-slate-500">{event.max_capacity} Maximum Slot Limit</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {event.status === 'REGISTRATION_CLOSED' || (event.confirmed_count >= (event.max_capacity || event.volunteers_required) && (event.max_capacity || event.volunteers_required) > 0) ? (
            <div className="px-5 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Registration Closed — Maximum Capacity Reached ({event.confirmed_count}/{event.max_capacity || event.volunteers_required} Volunteers)</span>
            </div>
          ) : (
            <button
              onClick={handleRegister}
              disabled={registering}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{registering ? 'Processing Registration...' : 'Register for Campaign'}</span>
            </button>
          )}

          <button
            onClick={() => setShowCheckInModal(true)}
            className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-all flex items-center space-x-2"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>QR Attendance Check-In</span>
          </button>
        </div>
      </div>

      {/* Campaign Details & Responsibilities */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Campaign Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          {/* Safety & Instructions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Safety Briefing & Guidelines</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{event.safety_instructions}</p>
            <div className="pt-2 text-xs font-semibold text-slate-500">
              Eligibility: <span className="font-normal text-slate-700">{event.eligibility_requirements}</span>
            </div>
          </div>

          {/* Tasks in this Event */}
          {event.tasks && event.tasks.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <span>Assigned Tasks & Deliverables</span>
              </h2>

              <div className="space-y-3">
                {event.tasks.map((task: any) => (
                  <div key={task.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-sm text-slate-900">{task.title}</div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {task.status}
                      </span>
                    </div>
                    <p className="text-slate-600">{task.description}</p>
                    <div className="text-[11px] text-slate-500">
                      <strong>Evidence required:</strong> {task.evidence_requirements}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Skills & Verification Criteria */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Required Skills</span>
            </h3>

            {event.requirements && event.requirements.length > 0 ? (
              <div className="space-y-2">
                {event.requirements.map((req: any) => (
                  <div key={req.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{req.skill_name}</span>
                      {req.is_mandatory && (
                        <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-bold">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{req.category}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No strict skill requirements. Enthusiastic newcomers welcome!</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Event Coordinator</h3>
            <div className="text-slate-700 font-semibold">{event.contact_person}</div>
            <div className="text-slate-500">{event.contact_phone}</div>
          </div>
        </div>
      </div>

      {/* Attendance Check-In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <span>Verify Attendance</span>
              </h3>
              <button onClick={() => setShowCheckInModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Scan the dynamic QR code displayed on the organizer screen or enter the cryptographic session token below.
            </p>

            {checkInMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scanned Token or Hex Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="Paste scanned QR token payload"
                  value={scannedToken}
                  onChange={e => setScannedToken(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
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

