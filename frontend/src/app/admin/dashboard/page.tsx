'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
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
  Inbox
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
    // Optimistically update list so approved org is removed from approval requests immediately
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
    // Optimistically update list so approved event is removed from approval requests immediately
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
    return <div className="py-24 text-center text-slate-400">Loading admin governance console...</div>;
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="space-y-8 pb-12">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>Platform Governance & Compliance</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Administrative Operations</h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Audit organization KYC applications and moderate community campaigns. Accepted requests are automatically published and cleared from approval queues.
            </p>
          </div>
        </div>

        {actionMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Governance Stats Row */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Organizations</span>
            <div className="text-3xl font-extrabold text-slate-900">{stats?.totalOrgs || organizations.length}</div>
            <div className="text-xs text-slate-500">{stats?.verifiedOrgs || 1} verified & active</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Org Requests</span>
            <div className="text-3xl font-extrabold text-amber-600">{pendingOrgs.length}</div>
            <div className="text-xs text-slate-500">Awaiting verification review</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Campaign Requests</span>
            <div className="text-3xl font-extrabold text-indigo-600">{pendingEvents.length}</div>
            <div className="text-xs text-slate-500">Awaiting event approval</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Volunteers</span>
            <div className="text-3xl font-extrabold text-slate-900">{stats?.totalVolunteers || 2}</div>
            <div className="text-xs text-emerald-600 font-semibold">Active community members</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('ORGS')}
            className={`pb-3 border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'ORGS' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Organization Verification Requests</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'ORGS' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
              {pendingOrgs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('EVENTS')}
            className={`pb-3 border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'EVENTS' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Campaign Moderation Requests</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'EVENTS' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
              {pendingEvents.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Organization Applications */}
        {activeTab === 'ORGS' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {showAllOrgs ? 'Showing All Organizations' : 'Approval Request List (Pending Only)'}
              </span>
              <button
                onClick={() => setShowAllOrgs(!showAllOrgs)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {showAllOrgs ? 'Show Pending Only' : `Show All (${organizations.length})`}
              </button>
            </div>

            {displayedOrgs.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">No Pending Organization Requests</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  All organization applications have been reviewed. Once an admin accepts a request, it is removed from this approval queue.
                </p>
              </div>
            ) : (
              displayedOrgs.map(org => (
                <div key={org.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-base text-slate-900">{org.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {org.category}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          ['VERIFIED_NEW', 'ESTABLISHED_TRUSTED'].includes(org.verification_status)
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {org.verification_status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Representative: <strong>{org.representative_name}</strong> ({org.representative_contact || org.phone}) • {org.operating_location}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleReviewOrg(org.id, 'VERIFIED_NEW')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        Accept & Approve
                      </button>
                      <button
                        onClick={() => handleReviewOrg(org.id, 'MORE_INFO_REQUIRED')}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                      >
                        Request Info
                      </button>
                    </div>
                  </div>

                  {/* Uploaded Documents with AI Risk Analysis */}
                  {org.documents && org.documents.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="text-xs font-bold text-slate-700">Submitted Documents & AI OCR Findings:</div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {org.documents.map((d: any) => (
                          <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-slate-900">{d.document_name}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Risk: {d.ai_risk_score}/100
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">{d.ai_notes}</div>
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
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {showAllEvents ? 'Showing All Campaigns' : 'Approval Request List (Pending Only)'}
              </span>
              <button
                onClick={() => setShowAllEvents(!showAllEvents)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {showAllEvents ? 'Show Pending Only' : `Show All (${events.length})`}
              </button>
            </div>

            {displayedEvents.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">No Pending Campaign Requests</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  All campaign submissions have been moderated. When you accept a campaign request, it is published and removed from this list.
                </p>
              </div>
            ) : (
              displayedEvents.map(ev => (
                <div key={ev.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-base text-slate-900">{ev.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ev.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ev.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {ev.event_date} • {ev.city} • Required: {ev.volunteers_required} volunteers • Contact: {ev.contact_person}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReviewEvent(ev.id, 'APPROVED')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      Accept & Publish
                    </button>
                    <button
                      onClick={() => handleReviewEvent(ev.id, 'REJECTED')}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
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
    </ProtectedRoute>
  );
}
