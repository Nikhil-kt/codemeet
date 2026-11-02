'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminHeroAnimation from '@/components/AdminHeroAnimation';
import Badge from '@/components/ui/Badge';
import CountUp from '@/components/motion/CountUp';
import {
  ShieldAlert,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  FileText,
  Search,
  Check,
  X,
  Inbox,
  Sparkles,
  ArrowDown
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'ORGS' | 'EVENTS'>('ORGS');
  const [showAllOrgs, setShowAllOrgs] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    const [statsRes, orgsRes, evRes] = await Promise.all([
      api.getAdminStats(),
      api.getAdminOrgs(),
      api.getAdminEvents()
    ]);
    setLoading(false);

    if (statsRes.success && statsRes.data) setStats(statsRes.data.stats);
    if (orgsRes.success && orgsRes.data) setOrganizations(orgsRes.data.organizations || []);
    if (evRes.success && evRes.data) setEvents(evRes.data.events || []);
  };

  const handleReviewOrg = async (orgId: string, status: string) => {
    setActionMsg(null);
    setOrganizations(prev => prev.map(o => o.id === orgId ? { ...o, verification_status: status } : o));
    const res = await api.reviewOrg(orgId, status, `Reviewed and updated to ${status} by Administrator`);
    if (res.success) {
      setActionMsg(`Organization accepted! Removed from pending approval request list.`);
      loadAdminData();
    }
  };

  const handleReviewEvent = async (eventId: string, status: string) => {
    setActionMsg(null);
    const finalStatus = status === 'APPROVED' ? 'PUBLISHED' : 'REJECTED';
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: finalStatus } : e));
    const res = await api.reviewEvent(eventId, status, `Event ${status.toLowerCase()} by moderation team.`);
    if (res.success) {
      setActionMsg(`Event accepted! Published and removed from pending approval request list.`);
      loadAdminData();
    }
  };

  const pendingOrgs = organizations.filter(o =>
    ['PENDING', 'UNDER_REVIEW', 'MORE_INFO_REQUIRED'].includes(o.verification_status)
  );
  const displayedOrgs = showAllOrgs ? organizations : pendingOrgs;

  const pendingEvents = events.filter(e =>
    ['UNDER_REVIEW', 'DRAFT'].includes(e.status)
  );
  const displayedEvents = showAllEvents ? events : pendingEvents;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center space-y-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-[#FF6B1A] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-bold text-[#6B5B53]">Loading admin governance console...</span>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="w-full min-h-screen bg-[#FFF4E8] text-[#7A2E0E]">
        {/* HERO SECTION: Full Horizontal Stretch with UnicornStudio WebGL Animation */}
        <section className="relative w-full min-h-[500px] sm:min-h-[560px] md:min-h-[620px] flex items-center justify-center overflow-hidden bg-black">
          {/* UnicornStudio WebGL Scene Animation Background */}
          <AdminHeroAnimation
            projectId="qHognYvslANstS7PTGCv"
            className="opacity-90"
          />

          {/* Cinematic Dark & Ambient Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85 backdrop-blur-[0.5px]" />

          {/* Foreground Hero Content Above the Animated Background */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold uppercase tracking-wider shadow-md"
            >
              <ShieldAlert className="w-4 h-4 text-[#FF9A4D]" />
              <span>Platform Governance & Compliance</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-white max-w-4xl mx-auto leading-tight drop-shadow-lg"
            >
              Administrative{' '}
              <span className="bg-gradient-to-r from-[#FF6B1A] via-[#FF9A4D] to-[#FFA96B] bg-clip-text text-transparent drop-shadow-sm">
                Operations
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow"
            >
              Audit organization KYC applications and moderate community campaigns. Accepted requests are automatically published and cleared from approval queues.
            </motion.p>

            {/* Quick Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <button
                onClick={() => {
                  setActiveTab('ORGS');
                  const el = document.getElementById('governance-content');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 shadow-xl cursor-pointer hover:scale-105 active:scale-95 ${
                  activeTab === 'ORGS'
                    ? 'bg-[#FF6B1A] text-white shadow-orange-500/40 hover:bg-[#E8590C]'
                    : 'bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Organization KYC Requests ({pendingOrgs.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('EVENTS');
                  const el = document.getElementById('governance-content');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 shadow-xl cursor-pointer hover:scale-105 active:scale-95 ${
                  activeTab === 'EVENTS'
                    ? 'bg-[#FF6B1A] text-white shadow-orange-500/40 hover:bg-[#E8590C]'
                    : 'bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Campaign Moderation ({pendingEvents.length})</span>
              </button>
            </motion.div>
          </div>
        </section>

        {/* MAIN GOVERNANCE CONTENT CONTAINER */}
        <div id="governance-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-20">
          {actionMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{actionMsg}</span>
            </motion.div>
          )}

          {/* Governance Stats Row */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-7 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-2 hover:-translate-y-1 transition-transform">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">Total Organizations</span>
              <div className="text-4xl font-heading font-black text-[#7A2E0E]">
                <CountUp end={stats?.totalOrgs || organizations.length} />
              </div>
              <div className="text-xs text-[#6B5B53] font-medium">{stats?.verifiedOrgs || 1} verified & active</div>
            </div>

            <div className="bg-white p-7 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-2 hover:-translate-y-1 transition-transform">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">Pending Org Requests</span>
              <div className="text-4xl font-heading font-black text-[#FF6B1A]">
                <CountUp end={pendingOrgs.length} />
              </div>
              <div className="text-xs text-[#6B5B53] font-medium">Awaiting verification review</div>
            </div>

            <div className="bg-white p-7 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-2 hover:-translate-y-1 transition-transform">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">Pending Campaigns</span>
              <div className="text-4xl font-heading font-black text-[#FF6B1A]">
                <CountUp end={pendingEvents.length} />
              </div>
              <div className="text-xs text-[#6B5B53] font-medium">Awaiting event approval</div>
            </div>

            <div className="bg-white p-7 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-2 hover:-translate-y-1 transition-transform">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">Total Volunteers</span>
              <div className="text-4xl font-heading font-black text-[#7A2E0E]">
                <CountUp end={stats?.totalVolunteers || 2} />
              </div>
              <div className="text-xs text-[#FF6B1A] font-bold">Active community members</div>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex border-b border-[#FF6B1A]/15 space-x-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('ORGS')}
              className={`pb-4 border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'ORGS'
                  ? 'border-[#FF6B1A] text-[#7A2E0E] font-bold'
                  : 'border-transparent text-[#6B5B53] hover:text-[#7A2E0E]'
              }`}
            >
              <span>Organization Verification Requests</span>
              <Badge variant={activeTab === 'ORGS' ? 'orange' : 'peach'} size="sm">
                {pendingOrgs.length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab('EVENTS')}
              className={`pb-4 border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'EVENTS'
                  ? 'border-[#FF6B1A] text-[#7A2E0E] font-bold'
                  : 'border-transparent text-[#6B5B53] hover:text-[#7A2E0E]'
              }`}
            >
              <span>Campaign Moderation Requests</span>
              <Badge variant={activeTab === 'EVENTS' ? 'orange' : 'peach'} size="sm">
                {pendingEvents.length}
              </Badge>
            </button>
          </div>

          {/* Tab 1: Organization Applications */}
          {activeTab === 'ORGS' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs font-bold text-[#6B5B53] uppercase tracking-wider">
                  {showAllOrgs ? 'Showing All Organizations' : 'Approval Request List (Pending Only)'}
                </span>
                <button
                  onClick={() => setShowAllOrgs(!showAllOrgs)}
                  className="text-xs font-bold text-[#FF6B1A] hover:underline cursor-pointer"
                >
                  {showAllOrgs ? 'Show Pending Only' : `Show All (${organizations.length})`}
                </button>
              </div>

              {displayedOrgs.length === 0 ? (
                <div className="bg-white p-14 rounded-[32px] border border-[#FF6B1A]/15 text-center space-y-4 shadow-sm">
                  <div className="w-14 h-14 bg-[#FFE3CC] text-[#FF6B1A] rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading font-bold text-[#7A2E0E] text-lg">No Pending Organization Requests</h3>
                  <p className="text-xs text-[#6B5B53] max-w-sm mx-auto leading-relaxed">
                    All organization applications have been reviewed. Once an admin accepts a request, it is removed from this approval queue.
                  </p>
                </div>
              ) : (
                displayedOrgs.map(org => (
                  <div
                    key={org.id}
                    className="bg-white p-7 sm:p-8 rounded-[32px] border border-[#FF6B1A]/15 shadow-sm hover:border-[#FF6B1A]/40 transition-all space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2.5">
                          <span className="font-heading font-extrabold text-lg text-[#7A2E0E]">{org.name}</span>
                          <Badge variant="peach" size="sm">{org.category}</Badge>
                          <Badge variant={['VERIFIED_NEW', 'ESTABLISHED_TRUSTED'].includes(org.verification_status) ? 'success' : 'orange'} size="sm">
                            {org.verification_status}
                          </Badge>
                        </div>
                        <div className="text-xs text-[#6B5B53]">
                          Representative: <strong className="text-[#7A2E0E]">{org.representative_name}</strong> ({org.representative_contact || org.phone}) • {org.operating_location}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5">
                        <button
                          onClick={() => handleReviewOrg(org.id, 'VERIFIED_NEW')}
                          className="px-5 py-2.5 rounded-2xl bg-[#FF6B1A] hover:bg-[#E8590C] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                        >
                          Accept & Approve
                        </button>
                        <button
                          onClick={() => handleReviewOrg(org.id, 'MORE_INFO_REQUIRED')}
                          className="px-4 py-2.5 rounded-2xl border border-[#FF6B1A]/20 text-[#7A2E0E] hover:bg-[#FFF4E8] text-xs font-bold transition-all cursor-pointer"
                        >
                          Request Info
                        </button>
                      </div>
                    </div>

                    {/* Uploaded Documents with AI Risk Analysis */}
                    {org.documents && org.documents.length > 0 && (
                      <div className="pt-4 border-t border-[#FF6B1A]/10 space-y-3">
                        <div className="text-xs font-bold text-[#7A2E0E]">Submitted Documents & AI OCR Findings:</div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {org.documents.map((d: any) => (
                            <div key={d.id} className="p-4 bg-[#FFF4E8] rounded-2xl border border-[#FF6B1A]/15 text-xs space-y-1.5">
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-[#7A2E0E]">{d.document_name}</span>
                                <Badge variant="orange" size="sm">Risk: {d.ai_risk_score}/100</Badge>
                              </div>
                              <div className="text-[11px] text-[#6B5B53] font-medium">{d.ai_notes}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Event Moderation */}
          {activeTab === 'EVENTS' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs font-bold text-[#6B5B53] uppercase tracking-wider">
                  {showAllEvents ? 'Showing All Campaigns' : 'Approval Request List (Pending Only)'}
                </span>
                <button
                  onClick={() => setShowAllEvents(!showAllEvents)}
                  className="text-xs font-bold text-[#FF6B1A] hover:underline cursor-pointer"
                >
                  {showAllEvents ? 'Show Pending Only' : `Show All (${events.length})`}
                </button>
              </div>

              {displayedEvents.length === 0 ? (
                <div className="bg-white p-14 rounded-[32px] border border-[#FF6B1A]/15 text-center space-y-4 shadow-sm">
                  <div className="w-14 h-14 bg-[#FFE3CC] text-[#FF6B1A] rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading font-bold text-[#7A2E0E] text-lg">No Pending Campaign Requests</h3>
                  <p className="text-xs text-[#6B5B53] max-w-sm mx-auto leading-relaxed">
                    All campaign submissions have been moderated. When you accept a campaign request, it is published and removed from this list.
                  </p>
                </div>
              ) : (
                displayedEvents.map(ev => (
                  <div
                    key={ev.id}
                    className="bg-white p-7 sm:p-8 rounded-[32px] border border-[#FF6B1A]/15 shadow-sm hover:border-[#FF6B1A]/40 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-heading font-extrabold text-lg text-[#7A2E0E]">{ev.title}</span>
                        <Badge variant={ev.status === 'PUBLISHED' ? 'success' : 'orange'} size="sm">
                          {ev.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-[#6B5B53]">
                        {ev.event_date} • {ev.city} • Required: {ev.volunteers_required} volunteers • Contact: {ev.contact_person}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={() => handleReviewEvent(ev.id, 'APPROVED')}
                        className="px-5 py-2.5 rounded-2xl bg-[#FF6B1A] hover:bg-[#E8590C] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                      >
                        Accept & Publish
                      </button>
                      <button
                        onClick={() => handleReviewEvent(ev.id, 'REJECTED')}
                        className="px-4 py-2.5 rounded-2xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
