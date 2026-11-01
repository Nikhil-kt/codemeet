import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, QrCode, ArrowRight, HeartHandshake, Sparkles, Building2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 pb-12">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] text-xs font-bold uppercase tracking-wider shadow-xs hover:scale-105 hover:bg-[#FED7AA] hover:border-[#F97316]/50 transition-all cursor-default">
          <Sparkles className="w-3.5 h-3.5 text-[#F97316] animate-pulse" />
          <span>AI-Powered Volunteer Matching & Trust Verification</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#7C2D12] max-w-5xl mx-auto leading-tight">
          Mobilize Verified Volunteers with{' '}
          <span className="bg-gradient-to-r from-[#7C2D12] via-[#9A3412] to-[#F97316] bg-clip-text text-transparent hover:brightness-110 transition-all">
            Uncompromising Trust
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#78716C] max-w-2xl mx-auto leading-relaxed font-light">
          ImpactLink eliminates chaotic coordination, ghost registrations, and unverified campaigns with multi-factor AI matching, cryptographic QR check-in, and automated civic proof validation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/events"
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 hover:scale-105 active:scale-95 hover:shadow-orange-500/40 cursor-pointer"
          >
            <span>Explore Active Campaigns</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/organization/register"
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white text-[#7C2D12] font-semibold border border-[#FED7AA] hover:bg-[#FFEDD5] hover:border-[#F97316] hover:scale-105 active:scale-95 shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#F97316]" />
            <span>Register Organization</span>
          </Link>
        </div>
      </section>

      {/* Trust & Architecture Pillars */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-3xl border border-[#FED7AA] hover:border-[#F97316] hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 space-y-3.5 shadow-sm group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] border border-[#FED7AA] text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white group-hover:scale-110 flex items-center justify-center shadow-xs transition-all duration-300">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#7C2D12] group-hover:text-[#F97316] transition-colors">Multi-Factor AI Matching</h3>
          <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed font-light">
            Deterministic eligibility filters combined with weighted multi-factor ranking (Skills, Vicinity, Availability, Reliability) ensure ideal volunteers are invited with complete factor explainability.
          </p>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-[#FED7AA] hover:border-[#F97316] hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 space-y-3.5 shadow-sm group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] border border-[#FED7AA] text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white group-hover:scale-110 flex items-center justify-center shadow-xs transition-all duration-300">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#7C2D12] group-hover:text-[#F97316] transition-colors">Cryptographic QR Attendance</h3>
          <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed font-light">
            Time-limited, signed attendance tokens and human-readable special codes generated dynamically on organizer screens prevent fraud and grant instant attendance certificates.
          </p>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-[#FED7AA] hover:border-[#F97316] hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 space-y-3.5 shadow-sm group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] border border-[#FED7AA] text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white group-hover:scale-110 flex items-center justify-center shadow-xs transition-all duration-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#7C2D12] group-hover:text-[#F97316] transition-colors">Explainable Trust Scores</h3>
          <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed font-light">
            Transparent reputation indexes for verified organizations (0-100) and volunteer reliability (0-100) calculated from verified track records, reviews, and community initiatives.
          </p>
        </div>
      </section>

      {/* Demo Portals Walkthrough Banner */}
      <section className="bg-[#FFEDD5]/70 p-8 sm:p-10 rounded-3xl border border-[#FED7AA] hover:border-[#F97316]/50 shadow-sm transition-all space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#FED7AA] pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive End-to-End Walkthrough</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#7C2D12]">Explore the Demonstration Portals</h2>
          </div>
          <span className="px-3.5 py-1.5 bg-white text-[#9A3412] border border-[#FED7AA] rounded-full text-xs font-bold shadow-2xs hover:scale-105 transition-transform cursor-default">
            Live Test Credentials Ready
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/volunteer/dashboard"
            className="group p-6 rounded-2xl bg-white border border-[#FED7AA] hover:border-[#F97316] hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 space-y-3 block shadow-sm cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#7C2D12] group-hover:text-[#F97316] font-bold text-sm transition-colors">
                <HeartHandshake className="w-4 h-4 text-[#F97316] group-hover:scale-110 transition-transform" />
                <span>Volunteer Hub</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#78716C] group-hover:translate-x-1.5 group-hover:text-[#F97316] transition-all" />
            </div>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Browse matching events, check in with QR/special codes, inspect verified skills, and download Gemini AI certificates.
            </p>
          </Link>

          <Link
            href="/organization/dashboard"
            className="group p-6 rounded-2xl bg-white border border-[#FED7AA] hover:border-[#F97316] hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 space-y-3 block shadow-sm cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#7C2D12] group-hover:text-[#F97316] font-bold text-sm transition-colors">
                <Building2 className="w-4 h-4 text-[#F97316] group-hover:scale-110 transition-transform" />
                <span>Organizer Console</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#78716C] group-hover:translate-x-1.5 group-hover:text-[#F97316] transition-all" />
            </div>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Launch free public campaigns, view AI-ranked candidates, broadcast QR check-ins, and inspect live attendance rosters.
            </p>
          </Link>

          <Link
            href="/admin/dashboard"
            className="group p-6 rounded-2xl bg-white border border-[#FED7AA] hover:border-[#F97316] hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 space-y-3 block shadow-sm cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#7C2D12] group-hover:text-[#F97316] font-bold text-sm transition-colors">
                <ShieldCheck className="w-4 h-4 text-[#F97316] group-hover:scale-110 transition-transform" />
                <span>Admin Governance</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#78716C] group-hover:translate-x-1.5 group-hover:text-[#F97316] transition-all" />
            </div>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Oversee platform health metrics, verify organizational DARPAN & 80G documents, review campaigns, and maintain zero-fraud integrity.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
