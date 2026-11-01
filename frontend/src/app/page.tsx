import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, QrCode, ArrowRight, HeartHandshake, Sparkles, Building2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 pb-12">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>AI-Powered Volunteer Matching & Trust Verification</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
          Mobilize Verified Volunteers with{' '}
          <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Uncompromising Trust
          </span>
        </h1>

        <p className="text-base sm:text-lg text-stone-300/90 max-w-2xl mx-auto leading-relaxed font-light">
          ImpactLink eliminates chaotic coordination, ghost registrations, and unverified campaigns with multi-factor AI matching, cryptographic QR check-in, and automated civic proof validation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/events"
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 hover:scale-105 active:scale-95"
          >
            <span>Explore Active Campaigns</span>
            <ArrowRight className="w-4 h-4 text-stone-950" />
          </Link>
          <Link
            href="/organization/register"
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-stone-900/90 text-stone-200 font-semibold border border-stone-800 hover:border-amber-500/40 hover:bg-stone-800/80 transition-all flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Register Organization</span>
          </Link>
        </div>
      </section>

      {/* Trust & Architecture Pillars */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-stone-900/70 backdrop-blur-xl p-7 rounded-3xl border border-stone-800/80 hover:border-amber-500/30 transition-all space-y-3.5 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Multi-Factor AI Matching</h3>
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">
            Deterministic eligibility filters combined with weighted multi-factor ranking (Skills, Vicinity, Availability, Reliability) ensure ideal volunteers are invited with complete factor explainability.
          </p>
        </div>

        <div className="bg-stone-900/70 backdrop-blur-xl p-7 rounded-3xl border border-stone-800/80 hover:border-amber-500/30 transition-all space-y-3.5 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shadow-inner">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Cryptographic QR Attendance</h3>
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">
            Time-limited, signed attendance tokens and human-readable special codes generated dynamically on organizer screens prevent fraud and grant instant attendance certificates.
          </p>
        </div>

        <div className="bg-stone-900/70 backdrop-blur-xl p-7 rounded-3xl border border-stone-800/80 hover:border-amber-500/30 transition-all space-y-3.5 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Explainable Trust Scores</h3>
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">
            Transparent reputation indexes for verified organizations (0-100) and volunteer reliability (0-100) calculated from verified track records, reviews, and community initiatives.
          </p>
        </div>
      </section>

      {/* Demo Portals Walkthrough Banner */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-900 to-[#181512] text-white p-8 sm:p-10 rounded-3xl border border-amber-500/20 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive End-to-End Walkthrough</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Explore the Demonstration Portals</h2>
          </div>
          <span className="px-3.5 py-1.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
            Live Test Credentials Ready
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/volunteer/dashboard"
            className="group p-6 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-900 transition-all space-y-3 block shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                <HeartHandshake className="w-4 h-4" />
                <span>Volunteer Hub</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:translate-x-1 group-hover:text-amber-400 transition-transform" />
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Browse matching events, check in with QR/special codes, inspect verified skills, and download Gemini AI certificates.
            </p>
          </Link>

          <Link
            href="/organization/dashboard"
            className="group p-6 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-900 transition-all space-y-3 block shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                <Building2 className="w-4 h-4" />
                <span>Organizer Console</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:translate-x-1 group-hover:text-amber-400 transition-transform" />
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Launch free public campaigns, view AI-ranked candidates, broadcast QR check-ins, and inspect live attendance rosters.
            </p>
          </Link>

          <Link
            href="/admin/dashboard"
            className="group p-6 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-900 transition-all space-y-3 block shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Governance</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:translate-x-1 group-hover:text-amber-400 transition-transform" />
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Oversee platform health metrics, verify organizational DARPAN & 80G documents, review campaigns, and maintain zero-fraud integrity.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
