'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/motion/ProgressBar';
import CountUp from '@/components/motion/CountUp';
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
  Clock,
  Check
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
    return (
      <div className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-[#FF6B1A] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#6B5B53] font-semibold text-sm">Loading organizer console...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['ORGANIZATION']}>
      <div className="w-full min-h-screen bg-[#FFF4E8] text-[#7A2E0E]">
        {/* ======================================================================
            FULL-WIDTH HERO SECTION: Background covers the WHOLE hero section like photo 2
            ====================================================================== */}
        <section className="relative w-full min-h-[480px] sm:min-h-[520px] md:min-h-[580px] flex items-center justify-center overflow-hidden bg-black">
          {/* Photographic Background (Photo 3: Children) covering 100% full width and height */}
          <Image
            src="/images/organizer-hero-bg.jpg"
            alt="Community Organization Initiatives"
            fill
            priority
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.1]"
            sizes="100vw"
          />

          {/* Cinematic Dark Gradient Scrim (identical to photo 2) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85 backdrop-blur-[0.5px]" />

          {/* Centered Floating Hero Content (identical to photo 2) */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
            {/* Eyebrow Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold uppercase tracking-wider shadow-md"
            >
              <Building2 className="w-3.5 h-3.5 text-[#FF9A4D]" />
              <span>{org?.category || 'Community Organization'}</span>
            </motion.div>

            {/* Main Heading: Bold White with Orange Highlight (like Photo 2) */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight drop-shadow-lg"
            >
              {org?.name ? (
                org.name
              ) : (
                <>
                  Organizer{' '}
                  <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">
                    Console
                  </span>
                </>
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-light drop-shadow"
            >
              Coordinate public initiatives, manage volunteer registrations, oversee live attendance check-ins, and inspect candidate trust metrics.
            </motion.p>

            {/* Action Buttons (like Photo 2: Orange CTA + Clean White Secondary Button) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3"
            >
              <Link href="/organization/events/create">
                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B1A] to-[#E8590C] hover:from-[#F06A1D] hover:to-[#C74B0D] text-white font-bold text-sm shadow-xl shadow-orange-500/35 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer">
                  <Plus className="w-4 h-4 text-white" />
                  <span>Create Campaign</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </Link>

              <Link href="/organization/verification">
                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/95 hover:bg-white text-[#7A2E0E] font-bold text-sm border border-white shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 backdrop-blur-md cursor-pointer">
                  <FileCheck className="w-4 h-4 text-[#FF6B1A]" />
                  <span>KYC Status</span>
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ======================================================================
            MAIN DASHBOARD CONTENT: Max-W-7xl below the Full-Width Hero
            ====================================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-20">
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-7 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-2 hover:-translate-y-1 transition-transform">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">Total Campaigns</span>
              <div className="text-4xl font-heading font-black text-[#7A2E0E]">
                <CountUp end={stats?.totalEvents || events.length} />
              </div>
              <div className="text-xs text-[#6B5B53] font-medium">{stats?.completedEvents || 0} successfully completed</div>
            </div>

            <div className="bg-white p-7 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-2 hover:-translate-y-1 transition-transform">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">Confirmed Volunteers</span>
              <div className="text-4xl font-heading font-black text-[#FF6B1A]">
                <CountUp end={stats?.confirmedVolunteers || 1} />
              </div>
              <div className="text-xs text-[#6B5B53] font-medium">Across active initiatives</div>
            </div>

            <div className="bg-white p-7 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-2 hover:-translate-y-1 transition-transform">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">Organization Trust</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-heading font-black text-[#FF6B1A]">
                  <CountUp end={Math.round(org?.trust_score || 78.5)} />
                </span>
                <span className="text-[#6B5B53] text-xs font-bold">/ 100</span>
              </div>
              <div className="text-xs text-[#7A2E0E] font-bold">Verified Community Organizer</div>
            </div>

            <div className="bg-white p-7 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-2 hover:-translate-y-1 transition-transform">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">Platform Standing</span>
              <div className="text-4xl font-heading font-black text-[#7A2E0E]">
                <CountUp end={events.length} />
              </div>
              <div className="text-xs text-[#FF6B1A] font-bold">100% Free Public Initiatives</div>
            </div>
          </div>

          {/* Active Campaigns Management & Live Tools */}
          <div className="bg-white rounded-[32px] border border-[#FF6B1A]/15 shadow-[0_4px_24px_rgba(255,107,26,0.06)] p-8 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#FF6B1A]/10 pb-6">
              <div>
                <h2 className="text-2xl font-heading font-extrabold text-[#7A2E0E]">Active Campaign Operations</h2>
                <p className="text-xs sm:text-sm text-[#6B5B53] mt-1 font-medium">
                  Manage registered volunteers, live check-ins, tasks, and AI matching
                </p>
              </div>
            </div>

            {events.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <p className="text-[#6B5B53] text-sm font-medium">No active campaigns found. Create your first campaign above!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {events.map(event => {
                  const maxCap = event.max_capacity || event.volunteers_required || 15;
                  const confirmed = event.confirmed_count || 0;
                  const isClosed = event.status === 'REGISTRATION_CLOSED' || confirmed >= maxCap;
                  const fillPct = Math.min(100, Math.round((confirmed / maxCap) * 100));

                  return (
                    <div
                      key={event.id}
                      className="p-7 sm:p-8 rounded-[28px] bg-[#FFF4E8]/50 border border-[#FF6B1A]/15 hover:border-[#FF6B1A]/40 transition-all space-y-6"
                    >
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            {event.status === 'UNDER_REVIEW' ? (
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFE3CC] text-[#7A2E0E] border border-[#FF6B1A]/20 flex items-center space-x-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#FF6B1A] animate-spin" />
                                <span>Application in Review</span>
                              </span>
                            ) : isClosed ? (
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                                Registration Closed (Full)
                              </span>
                            ) : (
                              <Badge variant="orange" size="sm">
                                {event.status}
                              </Badge>
                            )}
                            <span className="text-xs text-[#6B5B53]">•</span>
                            <span className="text-xs font-bold text-[#7A2E0E]">
                              {confirmed} / {maxCap} Slots Filled ({fillPct}%)
                            </span>
                          </div>

                          <h3 className="text-xl font-heading font-extrabold text-[#7A2E0E]">{event.title}</h3>
                          <div className="flex items-center space-x-3 text-xs text-[#6B5B53] font-medium">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5 text-[#FF6B1A]" />
                              <span>{event.event_date}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-[#FF6B1A]" />
                              <span>{event.location_name}, {event.city}</span>
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          {event.status === 'UNDER_REVIEW' ? (
                            <span className="px-4 py-2.5 rounded-2xl bg-[#FFE3CC] text-[#7A2E0E] border border-[#FF6B1A]/20 text-xs font-bold flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-[#FF6B1A] animate-pulse" />
                              <span>Pending Admin Review</span>
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleViewVolunteers(event)}
                                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FFE3CC] text-[#7A2E0E] border border-[#FF6B1A]/20 text-xs font-bold flex items-center space-x-2 shadow-xs transition-all cursor-pointer"
                              >
                                <Users className="w-4 h-4 text-[#FF6B1A]" />
                                <span>Volunteers ({confirmed})</span>
                              </button>

                              <button
                                onClick={() => handleRunMatching(event.id)}
                                className="px-4 py-2.5 rounded-2xl bg-[#FF6B1A] hover:bg-[#E8590C] hover:scale-105 active:scale-95 text-white text-xs font-bold flex items-center space-x-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                              >
                                <Cpu className="w-4 h-4 text-white" />
                                <span>AI Match Volunteers</span>
                              </button>

                              <button
                                onClick={() => handleGenerateQR(event.id)}
                                className="px-4 py-2.5 rounded-2xl bg-[#FFE3CC] hover:bg-[#FFE3CC]/80 border border-[#FF6B1A]/20 text-[#7A2E0E] text-xs font-bold flex items-center space-x-2 shadow-xs transition-all cursor-pointer"
                              >
                                <QrCode className="w-4 h-4 text-[#FF6B1A]" />
                                <span>Attendance QR</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* AI Matching Recommendations Section */}
                      {matchingEventId === event.id && (
                        <div className="p-7 bg-white rounded-[28px] border border-[#FF6B1A]/20 shadow-xl space-y-5">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#FF6B1A]/10 pb-4">
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-5 h-5 text-[#FF6B1A]" />
                              <h4 className="text-base font-heading font-bold text-[#7A2E0E]">
                                AI Matched Volunteers ({matches.length} Candidates Ranked)
                              </h4>
                            </div>
                            {matches.length > 0 && (
                              <button
                                onClick={() => handleNotifyMatches(event.id)}
                                className="px-4 py-2 bg-[#FF6B1A] hover:bg-[#E8590C] hover:scale-105 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                              >
                                <Users className="w-3.5 h-3.5 text-white" />
                                <span>Notify Top Candidates</span>
                              </button>
                            )}
                          </div>

                          {notifySuccess && (
                            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>{notifySuccess}</span>
                            </div>
                          )}

                          {matchingLoading ? (
                            <div className="py-10 text-center text-xs text-[#6B5B53] font-semibold">Running multi-factor matching model...</div>
                          ) : matches.length === 0 ? (
                            <div className="py-8 text-center text-xs text-[#6B5B53]">
                              No matching profiles identified yet. Try updating required skills in campaign settings.
                            </div>
                          ) : (
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {matches.map(m => {
                                const fitScore = m.overall_fit_score || m.match_score || 0;
                                const isHighMatch = fitScore >= 85;
                                return (
                                  <div
                                    key={m.volunteer_id}
                                    className="p-5 bg-[#FFF4E8]/60 border border-[#FF6B1A]/15 hover:border-[#FF6B1A]/40 rounded-2xl space-y-3 text-xs transition-all"
                                  >
                                    <div className="flex justify-between items-start gap-2">
                                      <div>
                                        <div className="font-heading font-bold text-[#7A2E0E] text-sm">
                                          {m.volunteer_name || 'Volunteer'}
                                        </div>
                                        {m.volunteer_city && (
                                          <span className="text-[11px] text-[#6B5B53]">
                                            📍 {m.volunteer_city}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex flex-col items-end gap-1">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                          isHighMatch ? 'bg-[#FFE3CC] text-[#7A2E0E] border border-[#FF6B1A]/20' : 'bg-white text-[#6B5B53] border border-[#FF6B1A]/10'
                                        }`}>
                                          {fitScore}% Fit
                                        </span>
                                      </div>
                                    </div>

                                    {/* Matched Certified Skills Tags */}
                                    {m.matched_skills && m.matched_skills.length > 0 && (
                                      <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-[#6B5B53] uppercase tracking-wider block">
                                          Matched Skills
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                          {m.matched_skills.map((skill: string, idx: number) => (
                                            <span
                                              key={idx}
                                              className="px-2 py-0.5 bg-white text-[#7A2E0E] border border-[#FF6B1A]/20 rounded-md text-[10px] font-bold flex items-center space-x-1"
                                            >
                                              <span>✓</span>
                                              <span>{skill}</span>
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Multi-Factor Match Explanation */}
                                    <div className="space-y-1 pt-2 border-t border-[#FF6B1A]/10">
                                      {Array.isArray(m.explanation) ? (
                                        m.explanation.map((exp: string, idx: number) => (
                                          <div key={idx} className="flex items-start space-x-1.5 text-[11px] text-[#6B5B53]">
                                            <span className="text-[#FF6B1A] font-bold leading-none mt-0.5">•</span>
                                            <span className="leading-tight">{exp}</span>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="text-[#6B5B53] text-[11px]">{m.explanation}</div>
                                      )}
                                    </div>

                                    {/* Metrics strip */}
                                    <div className="flex items-center justify-between text-[10px] text-[#6B5B53] pt-2 border-t border-[#FF6B1A]/10">
                                      <span>Reliability: <strong className="text-[#FF6B1A]">{m.reliability_score || 90}/100</strong></span>
                                      <span>Skill Fit: <strong className="text-[#FF6B1A]">{m.skill_score || 85}%</strong></span>
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
                })}
              </div>
            )}
          </div>

          {/* Modal: Registered Volunteers Information */}
          <AnimatePresence>
            {volunteersModalOpen && (
              <div className="fixed inset-0 z-50 bg-[#7A2E0E]/50 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[32px] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl border border-[#FF6B1A]/20"
                >
                  <div className="flex justify-between items-start border-b border-[#FF6B1A]/10 pb-5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B1A]">
                        Registered Volunteers Roster
                      </span>
                      <h3 className="text-2xl font-heading font-extrabold text-[#7A2E0E] mt-1">
                        {selectedEventForVolunteers?.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-[#6B5B53] mt-2 font-medium">
                        <span>Date: {selectedEventForVolunteers?.event_date}</span>
                        <span>•</span>
                        <span className="font-bold text-[#7A2E0E]">
                          Capacity: {volunteersMeta?.confirmed_count || registeredVolunteers.length} / {volunteersMeta?.max_capacity || selectedEventForVolunteers?.max_capacity || 15}
                        </span>
                        <span>•</span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          volunteersMeta?.is_registration_closed
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-[#FFE3CC] text-[#7A2E0E] border border-[#FF6B1A]/20'
                        }`}>
                          {volunteersMeta?.is_registration_closed ? 'Registration Closed (Full)' : 'Registration Open'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setVolunteersModalOpen(false)}
                      className="w-9 h-9 rounded-full bg-[#FFF4E8] text-[#6B5B53] hover:text-[#7A2E0E] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {volunteersLoading ? (
                    <div className="py-20 text-center text-xs text-[#6B5B53] font-semibold">Loading volunteer details...</div>
                  ) : registeredVolunteers.length === 0 ? (
                    <div className="py-16 text-center space-y-2">
                      <Users className="w-12 h-12 text-[#6B5B53]/40 mx-auto" />
                      <p className="text-[#7A2E0E] font-bold text-sm">No Volunteers Registered Yet</p>
                      <p className="text-[#6B5B53] text-xs">
                        When volunteers register for this campaign, their names, contact details, trust scores, and notes will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        {registeredVolunteers.map(v => (
                          <div
                            key={v.id}
                            className="p-5 bg-[#FFF4E8]/60 rounded-2xl border border-[#FF6B1A]/15 space-y-3 text-xs"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-heading font-bold text-sm text-[#7A2E0E]">{v.volunteer_name}</div>
                                <div className="text-[11px] text-[#6B5B53] flex items-center space-x-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-[#FF6B1A]" />
                                  <span>{v.city} {v.district ? `• ${v.district}` : ''}</span>
                                </div>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#FFE3CC] text-[#7A2E0E] border border-[#FF6B1A]/20">
                                Trust: {v.reliability_score || 70}/100
                              </span>
                            </div>

                            {/* Contact Information */}
                            <div className="pt-2 border-t border-[#FF6B1A]/10 space-y-1.5 text-[#6B5B53]">
                              <div className="flex items-center space-x-2">
                                <Mail className="w-3.5 h-3.5 text-[#FF6B1A] flex-shrink-0" />
                                <a href={`mailto:${v.volunteer_email}`} className="text-[#7A2E0E] hover:underline truncate font-medium">
                                  {v.volunteer_email}
                                </a>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-3.5 h-3.5 text-[#FF6B1A] flex-shrink-0" />
                                <a href={`tel:${v.volunteer_phone}`} className="text-[#7A2E0E] font-mono hover:underline">
                                  {v.volunteer_phone}
                                </a>
                              </div>
                            </div>

                            {/* Skills */}
                            {v.skills && v.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {v.skills.map((s: string, idx: number) => (
                                  <span key={idx} className="px-2 py-0.5 bg-white border border-[#FF6B1A]/15 rounded text-[10px] font-bold text-[#7A2E0E]">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Status & Notes */}
                            <div className="pt-2 border-t border-[#FF6B1A]/10 flex items-center justify-between">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                v.attendance_status === 'PRESENT'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-white text-[#6B5B53] border border-[#FF6B1A]/10'
                              }`}>
                                {v.attendance_status === 'PRESENT' ? '✓ Checked In (Present)' : 'Registered'}
                              </span>
                              <span className="text-[10px] text-[#6B5B53]">
                                {new Date(v.registered_at).toLocaleDateString()}
                              </span>
                            </div>

                            {v.notes && (
                              <div className="p-2.5 bg-white rounded-xl border border-[#FF6B1A]/10 text-[11px] text-[#6B5B53] italic">
                                &quot;{v.notes}&quot;
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4 border-t border-[#FF6B1A]/10">
                    <button
                      onClick={() => setVolunteersModalOpen(false)}
                      className="px-6 py-3 rounded-2xl bg-[#FF6B1A] hover:bg-[#E8590C] text-white text-xs font-bold shadow-md shadow-orange-500/20 cursor-pointer transition-all"
                    >
                      Close Roster
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Modal: Display Live Attendance QR Code & Special Code */}
          <AnimatePresence>
            {qrModalOpen && (
              <div className="fixed inset-0 z-50 bg-[#7A2E0E]/50 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[32px] max-w-lg w-full p-8 text-center space-y-6 shadow-2xl border border-[#FF6B1A]/20"
                >
                  <div className="flex justify-between items-start border-b border-[#FF6B1A]/10 pb-4">
                    <div className="text-left space-y-1">
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFE3CC] text-[#7A2E0E] text-[11px] font-bold uppercase tracking-wider border border-[#FF6B1A]/20">
                        <QrCode className="w-3.5 h-3.5 text-[#FF6B1A]" />
                        <span>Live Attendance Station</span>
                      </div>
                      <h3 className="text-xl font-heading font-extrabold text-[#7A2E0E]">
                        {selectedEventForQr?.title || 'Event Check-In Station'}
                      </h3>
                      <p className="text-xs text-[#6B5B53]">
                        Volunteers can check in by entering the special code or scanning the QR code.
                      </p>
                    </div>
                    <button
                      onClick={() => setQrModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-[#FFF4E8] text-[#6B5B53] hover:text-[#7A2E0E] flex items-center justify-center cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {qrLoading ? (
                    <div className="py-16 text-[#6B5B53] text-xs flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-2 border-[#FF6B1A] border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating cryptographic QR token & special check-in code...</span>
                    </div>
                  ) : qrData ? (
                    <div className="space-y-6">
                      {/* Special Check-In Code Callout */}
                      <div className="p-6 bg-gradient-to-r from-[#FFF4E8] via-[#FFE3CC] to-[#FFF4E8] rounded-2xl border-2 border-[#FF6B1A]/30 text-center space-y-3 shadow-sm">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7A2E0E] block">
                          Special Check-In Code
                        </span>
                        <div className="flex items-center justify-center space-x-3">
                          <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-[#7A2E0E] bg-white px-5 py-2 rounded-2xl border-2 border-[#FF6B1A]/30 shadow-sm select-all">
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
                            className="p-3 bg-[#FF6B1A] hover:bg-[#E8590C] hover:scale-105 active:scale-95 text-white rounded-2xl shadow-md transition-all flex items-center space-x-1 text-xs font-bold cursor-pointer"
                            title="Copy Special Code"
                          >
                            {copiedCode ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                            <span className="hidden sm:inline">{copiedCode ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-[#6B5B53] font-medium">
                          Announce this code or display it on site. Volunteers enter it on their dashboard to instantly record attendance and unlock their Gemini AI Certificate!
                        </p>
                      </div>

                      {/* Scannable QR Code */}
                      <div className="p-5 bg-[#FFF4E8] rounded-2xl border border-[#FF6B1A]/15 flex flex-col items-center justify-center space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5B53]">
                          Or Scan QR Code with Smartphone Camera
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrData.qrDataUrl || qrData.data?.qrDataUrl}
                          alt="Attendance QR Code"
                          className="w-48 h-48 rounded-2xl shadow-md border border-[#FF6B1A]/20 bg-white p-3"
                        />
                        <div className="text-[10px] text-[#6B5B53] pt-1">
                          Token valid until: {new Date(qrData.expiresAt || qrData.data?.expiresAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex gap-3">
                    {selectedEventForQr && (
                      <button
                        onClick={() => handleGenerateQR(selectedEventForQr.id)}
                        className="flex-1 py-3 rounded-2xl border border-[#FF6B1A]/20 text-xs font-bold text-[#7A2E0E] hover:bg-[#FFF4E8] transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh Code & QR</span>
                      </button>
                    )}
                    <button
                      onClick={() => setQrModalOpen(false)}
                      className="flex-1 py-3 rounded-2xl bg-[#FF6B1A] hover:bg-[#E8590C] text-white text-xs font-bold shadow-md shadow-orange-500/20 cursor-pointer transition-all"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
}
