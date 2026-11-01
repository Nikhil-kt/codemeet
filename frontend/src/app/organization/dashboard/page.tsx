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
    return <div className="py-24 text-center text-[#78716C]">Loading organizer console...</div>;
  }

  return (
    <ProtectedRoute allowedRoles={['ORGANIZATION']}>
      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-white via-[#FFEDD5]/30 to-white border border-[#FED7AA] text-[#431407] p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#FFEDD5] border border-[#FED7AA] rounded-full text-xs font-bold text-[#9A3412]">
              <Building2 className="w-3.5 h-3.5" />
              <span>{org?.category || 'Community Organization'}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{org?.name || 'Organizer Console'}</h1>
            <p className="text-xs text-[#431407]/90 max-w-xl font-light">
              Coordinate public initiatives, manage volunteer registrations, oversee live attendance check-ins, and inspect candidate trust metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/organization/events/create"
              className="px-5 py-2.5 bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center space-x-1.5 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Create Campaign</span>
            </Link>
            <Link
              href="/organization/verification"
              className="px-4 py-2.5 bg-white hover:bg-[#FFEDD5] text-[#7C2D12] font-semibold text-xs rounded-xl border border-[#FED7AA] interactive-btn flex items-center space-x-1.5 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-[#F97316]" />
              <span>KYC Status</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#FED7AA] shadow-sm hover:border-[#F97316] hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Total Campaigns</span>
            <div className="text-3xl font-extrabold text-[#7C2D12]">{stats?.totalEvents || events.length}</div>
            <div className="text-xs text-[#78716C]">{stats?.completedEvents || 0} successfully completed</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#FED7AA] shadow-sm hover:border-[#F97316] hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Confirmed Volunteers</span>
            <div className="text-3xl font-extrabold text-[#F97316]">{stats?.confirmedVolunteers || 1}</div>
            <div className="text-xs text-[#78716C]">Across active initiatives</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#FED7AA] shadow-sm hover:border-[#F97316] hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Organization Trust</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-[#F97316]">{org?.trust_score || 78.5}</span>
              <span className="text-[#78716C] text-xs font-semibold">/ 100</span>
            </div>
            <div className="text-xs text-[#F97316]/90 font-semibold">Verified Community Organizer</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#FED7AA] shadow-sm hover:border-[#F97316] hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Campaign Operations</span>
            <div className="text-3xl font-extrabold text-[#7C2D12]">{events.length}</div>
            <div className="text-xs text-[#F97316]/90 font-semibold">100% Free Public Initiatives</div>
          </div>
        </div>

        {/* Active Campaigns Management & Live Tools */}
        <div className="bg-white rounded-3xl border border-[#FED7AA] shadow-sm hover:border-[#F97316] hover:shadow-md hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden space-y-6 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#FED7AA] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#7C2D12]">Active Campaign Operations</h2>
              <p className="text-xs text-[#78716C] mt-0.5">Manage registered volunteers, live check-ins, tasks, and AI matching</p>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-[#78716C] text-xs">No active campaigns found. Create your first campaign above!</p>
            </div>
          ) : (
            events.map(event => {
              const maxCap = event.max_capacity || event.volunteers_required || 15;
              const isClosed = event.status === 'REGISTRATION_CLOSED' || ((event.confirmed_count || 0) >= maxCap);

              return (
                <div key={event.id} className="p-6 rounded-3xl bg-[#FFEDD5]/20/80 border border-[#FED7AA] space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {event.status === 'UNDER_REVIEW' ? (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] hover:scale-105 hover:bg-[#FED7AA] transition-transform cursor-default flex items-center space-x-1.5 shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-[#F97316] animate-spin" />
                            <span>Application in Review</span>
                          </span>
                        ) : isClosed ? (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-300">
                            Registration Closed (Full)
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] hover:scale-105 hover:bg-[#FED7AA] transition-transform cursor-default">
                            {event.status}
                          </span>
                        )}
                        <span className="text-xs text-[#78716C]">•</span>
                        <span className="text-xs font-semibold text-[#431407]">
                          {event.confirmed_count || 0} / {maxCap} Slots Filled
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#7C2D12] mt-1">{event.title}</h3>
                      <div className="flex items-center space-x-3 text-xs text-[#78716C]">
                        <span>{event.event_date}</span>
                        <span>•</span>
                        <span>{event.location_name}, {event.city}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {event.status === 'UNDER_REVIEW' ? (
                        <div className="flex items-center space-x-2">
                          <span className="px-3.5 py-2 rounded-xl bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] hover:scale-105 hover:bg-[#FED7AA] transition-transform cursor-default text-xs font-semibold flex items-center space-x-2">
                            <Clock className="w-3.5 h-3.5 text-[#F97316] animate-pulse" />
                            <span>Pending Admin Moderation & Approval</span>
                          </span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleViewVolunteers(event)}
                            className="px-4 py-2 rounded-xl bg-white hover:bg-[#FFEDD5] text-[#7C2D12] border border-[#FED7AA] text-xs font-semibold flex items-center space-x-1.5 shadow-sm interactive-btn cursor-pointer"
                          >
                            <Users className="w-4 h-4 text-[#F97316]" />
                            <span>Registered Volunteers ({event.confirmed_count || 0})</span>
                          </button>

                          <button
                            onClick={() => handleRunMatching(event.id)}
                            className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                          >
                            <Cpu className="w-4 h-4 text-white" />
                            <span>AI Match Volunteers</span>
                          </button>

                          <button
                            onClick={() => handleGenerateQR(event.id)}
                            className="px-4 py-2 rounded-xl bg-[#FFEDD5] hover:bg-orange-500/25 border border-orange-500/30 text-[#9A3412] text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
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
                    <div className="p-6 bg-white rounded-3xl border border-[#FED7AA] shadow-2xl space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#FED7AA] pb-3">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 text-[#F97316]" />
                          <h4 className="text-sm font-bold text-[#7C2D12]">
                            AI Matched Volunteers ({matches.length} Candidates Ranked)
                          </h4>
                        </div>
                        {matches.length > 0 && (
                          <button
                            onClick={() => handleNotifyMatches(event.id)}
                            className="px-3.5 py-1.5 bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-white" />
                            <span>Notify Top Candidates</span>
                          </button>
                        )}
                      </div>

                      {notifySuccess && (
                        <div className="p-3 bg-[#FFEDD5] border border-[#FED7AA] text-[#9A3412] rounded-xl text-xs flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-[#F97316]" />
                          <span>{notifySuccess}</span>
                        </div>
                      )}

                      {matchingLoading ? (
                        <div className="py-8 text-center text-xs text-[#78716C]">Running multi-factor matching model...</div>
                      ) : matches.length === 0 ? (
                        <div className="py-6 text-center text-xs text-[#78716C]">
                          No matching profiles identified yet. Try updating required skills.
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {matches.map(m => {
                            const fitScore = m.overall_fit_score || m.match_score || 0;
                            const isHighMatch = fitScore >= 85;
                            return (
                              <div key={m.volunteer_id} className="p-4 bg-[#FFEDD5]/20/80 border border-[#FED7AA] hover:border-[#FED7AA] rounded-2xl space-y-3 text-xs shadow-xl transition-all">
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <div className="font-bold text-[#7C2D12] text-sm flex items-center space-x-1.5">
                                      <span>{m.volunteer_name || 'Volunteer'}</span>
                                    </div>
                                    {m.volunteer_city && (
                                      <span className="text-[11px] text-[#78716C]">
                                        📍 {m.volunteer_city}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                                      isHighMatch ? 'bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] hover:scale-105 hover:bg-[#FED7AA] transition-transform cursor-default' : 'bg-white text-[#431407] border border-[#FED7AA]'
                                    }`}>
                                      {fitScore}% Fit
                                    </span>
                                    {m.recommendation_category && (
                                      <span className="text-[9px] uppercase font-bold text-[#F97316]/80">
                                        {m.recommendation_category.replace(/_/g, ' ')}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Matched Certified Skills Tags */}
                                {m.matched_skills && m.matched_skills.length > 0 && (
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-semibold text-[#78716C] uppercase tracking-wider block">
                                      Matched Certified Skills
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {m.matched_skills.map((skill: string, idx: number) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-0.5 bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] hover:scale-105 hover:bg-[#FED7AA] transition-transform cursor-default rounded-md text-[10px] font-bold flex items-center space-x-1"
                                        >
                                          <span>✓</span>
                                          <span>{skill}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Multi-Factor Match Explanation */}
                                <div className="space-y-1 pt-2 border-t border-[#FED7AA]">
                                  {Array.isArray(m.explanation) ? (
                                    m.explanation.map((exp: string, idx: number) => (
                                      <div key={idx} className="flex items-start space-x-1.5 text-[11px] text-[#431407]">
                                        <span className="text-[#F97316] font-bold leading-none mt-0.5">•</span>
                                        <span className="leading-tight">{exp}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-[#431407] text-[11px]">{m.explanation}</div>
                                  )}
                                </div>

                                {/* Metrics strip */}
                                <div className="flex items-center justify-between text-[10px] text-[#78716C] pt-1 border-t border-[#FED7AA]">
                                  <span>Reliability: <strong className="text-[#F97316]">{m.reliability_score || 90}/100</strong></span>
                                  <span>Skill Fit: <strong className="text-[#F97316]">{m.skill_score || 85}%</strong></span>
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
          <div className="fixed inset-0 z-50 bg-[#431407]/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-[#FED7AA] text-[#431407]">
              <div className="flex justify-between items-start border-b border-[#FED7AA] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
                    Registered Volunteers Roster
                  </span>
                  <h3 className="text-xl font-bold text-[#7C2D12] mt-1">
                    {selectedEventForVolunteers?.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-xs text-[#78716C] mt-1">
                    <span>Date: {selectedEventForVolunteers?.event_date}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#431407]">
                      Capacity: {volunteersMeta?.confirmed_count || registeredVolunteers.length} / {volunteersMeta?.max_capacity || selectedEventForVolunteers?.max_capacity || 15}
                    </span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      volunteersMeta?.is_registration_closed
                        ? 'bg-rose-50 text-rose-800 border border-rose-300 font-bold'
                        : 'bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] hover:scale-105 hover:bg-[#FED7AA] transition-transform cursor-default'
                    }`}>
                      {volunteersMeta?.is_registration_closed ? 'Registration Closed (Full)' : 'Registration Open'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setVolunteersModalOpen(false)}
                  className="p-2 text-[#78716C] hover:text-[#7C2D12] rounded-xl hover:bg-[#FFEDD5] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {volunteersLoading ? (
                <div className="py-20 text-center text-xs text-[#78716C]">Loading registered volunteer details...</div>
              ) : registeredVolunteers.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <Users className="w-10 h-10 text-[#78716C] mx-auto" />
                  <p className="text-[#431407] font-semibold text-sm">No Volunteers Registered Yet</p>
                  <p className="text-[#78716C] text-xs">
                    When volunteers register for this campaign, their names, contact details, trust scores, and notes will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {registeredVolunteers.map(v => (
                      <div key={v.id} className="p-5 bg-[#FFEDD5]/20/80 rounded-2xl border border-[#FED7AA] space-y-3 text-xs hover:border-[#FED7AA] transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-extrabold text-sm text-[#7C2D12]">{v.volunteer_name}</div>
                            <div className="text-[11px] text-[#78716C] flex items-center space-x-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#F97316]" />
                              <span>{v.city} {v.district ? `• ${v.district}` : ''}</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] hover:scale-105 hover:bg-[#FED7AA] transition-transform cursor-default">
                            Trust: {v.reliability_score || 70}/100
                          </span>
                        </div>

                        {/* Contact Information */}
                        <div className="pt-2 border-t border-[#FED7AA] space-y-1.5 text-[#431407]">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3.5 h-3.5 text-[#78716C] flex-shrink-0" />
                            <a href={`mailto:${v.volunteer_email}`} className="text-[#F97316] hover:underline truncate">
                              {v.volunteer_email}
                            </a>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3.5 h-3.5 text-[#78716C] flex-shrink-0" />
                            <a href={`tel:${v.volunteer_phone}`} className="text-[#431407] font-mono hover:underline">
                              {v.volunteer_phone}
                            </a>
                          </div>
                        </div>

                        {/* Skills */}
                        {v.skills && v.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {v.skills.map((s: string, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 bg-white border border-[#FED7AA] rounded text-[10px] font-medium text-[#9A3412]/90">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Status & Notes */}
                        <div className="pt-2 border-t border-[#FED7AA] flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            v.attendance_status === 'PRESENT'
                              ? 'bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] hover:scale-105 hover:bg-[#FED7AA] transition-transform cursor-default'
                              : 'bg-white text-[#78716C]'
                          }`}>
                            {v.attendance_status === 'PRESENT' ? '✓ Checked In (Present)' : 'Registered'}
                          </span>
                          <span className="text-[10px] text-[#78716C]">
                            {new Date(v.registered_at).toLocaleDateString()}
                          </span>
                        </div>

                        {v.notes && (
                          <div className="p-2 bg-white/90 rounded-xl border border-[#FED7AA] text-[11px] text-[#78716C] italic">
                            &quot;{v.notes}&quot;
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-[#FED7AA]">
                <button
                  onClick={() => setVolunteersModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold interactive-btn shadow-md shadow-orange-500/20 cursor-pointer transition-all"
                >
                  Close Roster
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Display Live Attendance QR Code & Special Code */}
        {qrModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#431407]/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl border border-[#FED7AA] text-[#431407]">
              <div className="flex justify-between items-start border-b border-[#FED7AA] pb-4">
                <div className="text-left space-y-1">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#9A3412] text-[11px] font-bold uppercase tracking-wider border border-[#FED7AA]">
                    <QrCode className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>Live Attendance Station</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#7C2D12]">
                    {selectedEventForQr?.title || 'Event Check-In Station'}
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    Volunteers can check in either by entering the special code or scanning the QR code.
                  </p>
                </div>
                <button
                  onClick={() => setQrModalOpen(false)}
                  className="p-1.5 text-[#78716C] hover:text-[#7C2D12] rounded-lg hover:bg-[#FFEDD5] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {qrLoading ? (
                <div className="py-16 text-[#78716C] text-xs flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating cryptographic QR token & special check-in code...</span>
                </div>
              ) : qrData ? (
                <div className="space-y-6">
                  {/* Special Check-In Code Callout */}
                  <div className="p-5 bg-gradient-to-r from-[#FFF3E8] via-[#FFEDD5] to-[#FFF3E8] rounded-2xl border-2 border-[#FED7AA] text-center space-y-2 shadow-sm">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7C2D12] block">
                      Special Check-In Code
                    </span>
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-[#7C2D12] bg-white px-4 py-1.5 rounded-xl border-2 border-[#FED7AA] shadow-sm select-all">
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
                        className="p-2.5 bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer text-white rounded-xl shadow-md transition-all flex items-center space-x-1 text-xs font-bold cursor-pointer"
                        title="Copy Special Code"
                      >
                        {copiedCode ? <CheckCircle className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                        <span className="hidden sm:inline">{copiedCode ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-[#431407] font-light">
                      Announce this code or display it on site. Volunteers enter it on their dashboard to instantly record attendance and unlock their Gemini AI Certificate!
                    </p>
                  </div>

                  {/* Scannable QR Code */}
                  <div className="p-4 bg-[#FFEDD5]/20 rounded-2xl border border-[#FED7AA] flex flex-col items-center justify-center space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                      Or Scan QR Code with Smartphone Camera
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrData.qrDataUrl || qrData.data?.qrDataUrl}
                      alt="Attendance QR Code"
                      className="w-48 h-48 rounded-xl shadow-inner border border-[#FED7AA] bg-white p-2"
                    />
                    <div className="text-[10px] text-[#78716C] pt-1">
                      Token valid until: {new Date(qrData.expiresAt || qrData.data?.expiresAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex gap-3">
                {selectedEventForQr && (
                  <button
                    onClick={() => handleGenerateQR(selectedEventForQr.id)}
                    className="flex-1 py-2.5 rounded-xl border border-[#FED7AA] text-xs font-semibold text-[#431407] hover:bg-white transition-all flex items-center justify-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh Code & QR</span>
                  </button>
                )}
                <button
                  onClick={() => setQrModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold interactive-btn shadow-md shadow-orange-500/20 cursor-pointer transition-all"
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
