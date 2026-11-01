'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  ShieldCheck,
  Building2,
  Calendar,
  Users,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Cpu,
  Sparkles,
  FileCheck,
  TrendingUp,
  Plus,
  Mail,
  Phone,
  MapPin,
  Award,
  CheckCircle,
  X,
  FileText,
  Copy,
  RefreshCw,
  Clock
} from 'lucide-react';

export default function OrganizationDashboard() {
  const [org, setOrg] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Matching state
  const [matchingEventId, setMatchingEventId] = useState<string | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState<string | null>(null);

  // QR & Special Code Modal state
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [selectedEventForQr, setSelectedEventForQr] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Registered Volunteers state & modal
  const [volunteersModalOpen, setVolunteersModalOpen] = useState(false);
  const [selectedEventForVolunteers, setSelectedEventForVolunteers] = useState<any>(null);
  const [registeredVolunteers, setRegisteredVolunteers] = useState<any[]>([]);
  const [volunteersLoading, setVolunteersLoading] = useState(false);
  const [volunteersMeta, setVolunteersMeta] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [orgRes, statsRes, evRes] = await Promise.all([
      api.getMyOrg(),
      api.getOrgStats(),
      api.getEvents({ includeClosed: 'true' })
    ]);
    setLoading(false);

    if (orgRes.success && orgRes.data) setOrg(orgRes.data.organization);
    if (statsRes.success && statsRes.data) setStats(statsRes.data.stats);
    if (evRes.success && evRes.data) setEvents(evRes.data.events || []);
  };

  const handleRunMatching = async (eventId: string) => {
    setMatchingEventId(eventId);
    setMatchingLoading(true);
    setNotifySuccess(null);
    const res = await api.matchVolunteers(eventId);
    setMatchingLoading(false);
    if (res.success && res.data) {
      const matchArr = res.data.matches || (Array.isArray(res.data) ? res.data : []);
      setMatches(matchArr);
    } else {
      setMatches([]);
    }
  };

  const handleNotifyMatches = async (eventId: string) => {
    const res = await api.notifyMatches(eventId);
    if (res.success) {
      setNotifySuccess('Notified top matched candidates.');
    }
  };

  const handleGenerateQR = async (eventId: string) => {
    const ev = events.find(e => e.id === eventId);
    setSelectedEventForQr(ev);
    setQrModalOpen(true);
    setQrLoading(true);
    setCopiedCode(false);
    const res = await api.generateQR(eventId, 60);
    setQrLoading(false);
    if (res.success && res.data) {
      setQrData(res.data);
    }
  };

  const handleViewVolunteers = async (event: any) => {
    setSelectedEventForVolunteers(event);
    setVolunteersModalOpen(true);
    setVolunteersLoading(true);
    setRegisteredVolunteers([]);
    setVolunteersMeta(null);

    const res = await api.getEventVolunteers(event.id);
    setVolunteersLoading(false);
    if (res.success && res.data) {
      setRegisteredVolunteers(res.data.registrations || []);
      setVolunteersMeta(res.data);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-slate-400">Loading organizer console...</div>;
  }

  return (
    <ProtectedRoute allowedRoles={['ORGANIZATION']}>
      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#1c1815] via-stone-900 to-[#231b14] border border-amber-500/25 text-white p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-xs font-bold text-amber-300">
              <Building2 className="w-3.5 h-3.5" />
              <span>{org?.category || 'Community Organization'}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{org?.name || 'Organizer Console'}</h1>
            <p className="text-xs text-stone-300/90 max-w-xl font-light">
              Coordinate public initiatives, manage volunteer registrations, oversee live attendance check-ins, and inspect candidate trust metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/organization/events/create"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center space-x-1.5 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 text-stone-950" />
              <span>Create Campaign</span>
            </Link>
            <Link
              href="/organization/verification"
              className="px-4 py-2.5 bg-stone-800/80 hover:bg-stone-700 text-stone-200 font-semibold text-xs rounded-xl border border-stone-700 transition-all flex items-center space-x-1.5"
            >
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span>KYC Status</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-stone-900/80 p-6 rounded-3xl border border-stone-800/80 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Campaigns</span>
            <div className="text-3xl font-extrabold text-white">{stats?.totalEvents || events.length}</div>
            <div className="text-xs text-stone-400">{stats?.completedEvents || 0} successfully completed</div>
          </div>

          <div className="bg-stone-900/80 p-6 rounded-3xl border border-stone-800/80 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Confirmed Volunteers</span>
            <div className="text-3xl font-extrabold text-amber-400">{stats?.confirmedVolunteers || 1}</div>
            <div className="text-xs text-stone-400">Across active initiatives</div>
          </div>

          <div className="bg-stone-900/80 p-6 rounded-3xl border border-stone-800/80 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Organization Trust</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-amber-400">{org?.trust_score || 78.5}</span>
              <span className="text-stone-400 text-xs font-semibold">/ 100</span>
            </div>
            <div className="text-xs text-amber-400/90 font-semibold">Verified Community Organizer</div>
          </div>

          <div className="bg-stone-900/80 p-6 rounded-3xl border border-stone-800/80 shadow-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Campaign Operations</span>
            <div className="text-3xl font-extrabold text-white">{events.length}</div>
            <div className="text-xs text-amber-400/90 font-semibold">100% Free Public Initiatives</div>
          </div>
        </div>

        {/* Active Campaigns Management & Live Tools */}
        <div className="bg-stone-900/80 rounded-3xl border border-stone-800/80 shadow-xl overflow-hidden space-y-6 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Active Campaign Operations</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage registered volunteers, live check-ins, tasks, and AI matching</p>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-slate-500 text-xs">No active campaigns found. Create your first campaign above!</p>
            </div>
          ) : (
            events.map(event => {
              const maxCap = event.max_capacity || event.volunteers_required || 15;
              const isClosed = event.status === 'REGISTRATION_CLOSED' || ((event.confirmed_count || 0) >= maxCap);

              return (
                <div key={event.id} className="p-6 rounded-3xl bg-stone-950/80 border border-stone-800 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {event.status === 'UNDER_REVIEW' ? (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center space-x-1.5 shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                            <span>Application in Review</span>
                          </span>
                        ) : isClosed ? (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Registration Closed (Full)
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            {event.status}
                          </span>
                        )}
                        <span className="text-xs text-stone-500">•</span>
                        <span className="text-xs font-semibold text-stone-300">
                          {event.confirmed_count || 0} / {maxCap} Slots Filled
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">{event.title}</h3>
                      <div className="flex items-center space-x-3 text-xs text-stone-400">
                        <span>{event.event_date}</span>
                        <span>•</span>
                        <span>{event.location_name}, {event.city}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {event.status === 'UNDER_REVIEW' ? (
                        <div className="flex items-center space-x-2">
                          <span className="px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center space-x-2">
                            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            <span>Pending Admin Moderation & Approval</span>
                          </span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleViewVolunteers(event)}
                            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            <Users className="w-4 h-4 text-amber-400" />
                            <span>Registered Volunteers ({event.confirmed_count || 0})</span>
                          </button>

                          <button
                            onClick={() => handleRunMatching(event.id)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                          >
                            <Cpu className="w-4 h-4 text-stone-950" />
                            <span>AI Match Volunteers</span>
                          </button>

                          <button
                            onClick={() => handleGenerateQR(event.id)}
                            className="px-4 py-2 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            <QrCode className="w-4 h-4" />
                            <span>Attendance QR</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* AI Matching Recommendations Section */}
                  {matchingEventId === event.id && (
                    <div className="p-6 bg-stone-900 rounded-3xl border border-amber-500/30 shadow-2xl space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-800 pb-3">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 text-amber-400" />
                          <h4 className="text-sm font-bold text-white">
                            AI Matched Volunteers ({matches.length} Candidates Ranked)
                          </h4>
                        </div>
                        {matches.length > 0 && (
                          <button
                            onClick={() => handleNotifyMatches(event.id)}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-stone-950" />
                            <span>Notify Top Candidates</span>
                          </button>
                        )}
                      </div>

                      {notifySuccess && (
                        <div className="p-3 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-xl text-xs flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                          <span>{notifySuccess}</span>
                        </div>
                      )}

                      {matchingLoading ? (
                        <div className="py-8 text-center text-xs text-stone-400">Running multi-factor matching model...</div>
                      ) : matches.length === 0 ? (
                        <div className="py-6 text-center text-xs text-stone-400">
                          No matching profiles identified yet. Try updating required skills.
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {matches.map(m => {
                            const fitScore = m.overall_fit_score || m.match_score || 0;
                            const isHighMatch = fitScore >= 85;
                            return (
                              <div key={m.volunteer_id} className="p-4 bg-stone-950/80 border border-stone-800 hover:border-amber-500/40 rounded-2xl space-y-3 text-xs shadow-xl transition-all">
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <div className="font-bold text-white text-sm flex items-center space-x-1.5">
                                      <span>{m.volunteer_name || 'Volunteer'}</span>
                                    </div>
                                    {m.volunteer_city && (
                                      <span className="text-[11px] text-stone-400">
                                        📍 {m.volunteer_city}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                                      isHighMatch ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-stone-800 text-stone-300 border border-stone-700'
                                    }`}>
                                      {fitScore}% Fit
                                    </span>
                                    {m.recommendation_category && (
                                      <span className="text-[9px] uppercase font-bold text-amber-400/80">
                                        {m.recommendation_category.replace(/_/g, ' ')}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Matched Certified Skills Tags */}
                                {m.matched_skills && m.matched_skills.length > 0 && (
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                                      Matched Certified Skills
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {m.matched_skills.map((skill: string, idx: number) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-0.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-md text-[10px] font-bold flex items-center space-x-1"
                                        >
                                          <span>✓</span>
                                          <span>{skill}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Multi-Factor Match Explanation */}
                                <div className="space-y-1 pt-2 border-t border-stone-800/80">
                                  {Array.isArray(m.explanation) ? (
                                    m.explanation.map((exp: string, idx: number) => (
                                      <div key={idx} className="flex items-start space-x-1.5 text-[11px] text-stone-300">
                                        <span className="text-amber-400 font-bold leading-none mt-0.5">•</span>
                                        <span className="leading-tight">{exp}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-stone-300 text-[11px]">{m.explanation}</div>
                                  )}
                                </div>

                                {/* Metrics strip */}
                                <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-800/80">
                                  <span>Reliability: <strong className="text-amber-400">{m.reliability_score || 90}/100</strong></span>
                                  <span>Skill Fit: <strong className="text-amber-400">{m.skill_score || 85}%</strong></span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal: Registered Volunteers Information */}
        {volunteersModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-stone-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-amber-500/25 text-stone-100">
              <div className="flex justify-between items-start border-b border-stone-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Registered Volunteers Roster
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {selectedEventForVolunteers?.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-xs text-stone-400 mt-1">
                    <span>Date: {selectedEventForVolunteers?.event_date}</span>
                    <span>•</span>
                    <span className="font-semibold text-stone-300">
                      Capacity: {volunteersMeta?.confirmed_count || registeredVolunteers.length} / {volunteersMeta?.max_capacity || selectedEventForVolunteers?.max_capacity || 15}
                    </span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      volunteersMeta?.is_registration_closed
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {volunteersMeta?.is_registration_closed ? 'Registration Closed (Full)' : 'Registration Open'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setVolunteersModalOpen(false)}
                  className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {volunteersLoading ? (
                <div className="py-20 text-center text-xs text-stone-400">Loading registered volunteer details...</div>
              ) : registeredVolunteers.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <Users className="w-10 h-10 text-stone-600 mx-auto" />
                  <p className="text-stone-300 font-semibold text-sm">No Volunteers Registered Yet</p>
                  <p className="text-stone-500 text-xs">
                    When volunteers register for this campaign, their names, contact details, trust scores, and notes will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {registeredVolunteers.map(v => (
                      <div key={v.id} className="p-5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-3 text-xs hover:border-amber-500/40 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-extrabold text-sm text-white">{v.volunteer_name}</div>
                            <div className="text-[11px] text-stone-400 flex items-center space-x-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-amber-400" />
                              <span>{v.city} {v.district ? `• ${v.district}` : ''}</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            Trust: {v.reliability_score || 70}/100
                          </span>
                        </div>

                        {/* Contact Information */}
                        <div className="pt-2 border-t border-stone-800/80 space-y-1.5 text-stone-300">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                            <a href={`mailto:${v.volunteer_email}`} className="text-amber-400 hover:underline truncate">
                              {v.volunteer_email}
                            </a>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                            <a href={`tel:${v.volunteer_phone}`} className="text-stone-200 font-mono hover:underline">
                              {v.volunteer_phone}
                            </a>
                          </div>
                        </div>

                        {/* Skills */}
                        {v.skills && v.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {v.skills.map((s: string, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[10px] font-medium text-amber-300/90">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Status & Notes */}
                        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            v.attendance_status === 'PRESENT'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-stone-800 text-stone-400'
                          }`}>
                            {v.attendance_status === 'PRESENT' ? '✓ Checked In (Present)' : 'Registered'}
                          </span>
                          <span className="text-[10px] text-stone-500">
                            {new Date(v.registered_at).toLocaleDateString()}
                          </span>
                        </div>

                        {v.notes && (
                          <div className="p-2 bg-stone-900/90 rounded-xl border border-stone-800 text-[11px] text-stone-400 italic">
                            &quot;{v.notes}&quot;
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-stone-800">
                <button
                  onClick={() => setVolunteersModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-all"
                >
                  Close Roster
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Display Live Attendance QR Code & Special Code */}
        {qrModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl border border-amber-500/30 text-stone-100">
              <div className="flex justify-between items-start border-b border-stone-800 pb-4">
                <div className="text-left space-y-1">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-500/30">
                    <QrCode className="w-3.5 h-3.5 text-amber-400" />
                    <span>Live Attendance Station</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedEventForQr?.title || 'Event Check-In Station'}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Volunteers can check in either by entering the special code or scanning the QR code.
                  </p>
                </div>
                <button
                  onClick={() => setQrModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {qrLoading ? (
                <div className="py-16 text-stone-400 text-xs flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating cryptographic QR token & special check-in code...</span>
                </div>
              ) : qrData ? (
                <div className="space-y-6">
                  {/* Special Check-In Code Callout */}
                  <div className="p-5 bg-gradient-to-r from-amber-950/40 via-stone-900 to-orange-950/40 rounded-2xl border-2 border-amber-500/40 text-center space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 block">
                      Special Check-In Code
                    </span>
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-amber-300 bg-stone-950 px-4 py-1.5 rounded-xl border border-amber-500/40 shadow-inner select-all">
                        {qrData.specialCode || qrData.data?.specialCode || 'IMP-2026'}
                      </span>
                      <button
                        onClick={() => {
                          const code = qrData.specialCode || qrData.data?.specialCode;
                          if (code && typeof navigator !== 'undefined') {
                            navigator.clipboard.writeText(code);
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2500);
                          }
                        }}
                        className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 rounded-xl shadow-md transition-all flex items-center space-x-1 text-xs font-bold cursor-pointer"
                        title="Copy Special Code"
                      >
                        {copiedCode ? <CheckCircle className="w-4 h-4 text-stone-950" /> : <Copy className="w-4 h-4" />}
                        <span className="hidden sm:inline">{copiedCode ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-300 font-light">
                      Announce this code or display it on site. Volunteers enter it on their dashboard to instantly record attendance and unlock their Gemini AI Certificate!
                    </p>
                  </div>

                  {/* Scannable QR Code */}
                  <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 flex flex-col items-center justify-center space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Or Scan QR Code with Smartphone Camera
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrData.qrDataUrl || qrData.data?.qrDataUrl}
                      alt="Attendance QR Code"
                      className="w-48 h-48 rounded-xl shadow-inner border border-amber-500/30 bg-white p-2"
                    />
                    <div className="text-[10px] text-stone-500 pt-1">
                      Token valid until: {new Date(qrData.expiresAt || qrData.data?.expiresAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex gap-3">
                {selectedEventForQr && (
                  <button
                    onClick={() => handleGenerateQR(selectedEventForQr.id)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-700 text-xs font-semibold text-stone-300 hover:bg-stone-800 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh Code & QR</span>
                  </button>
                )}
                <button
                  onClick={() => setQrModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
