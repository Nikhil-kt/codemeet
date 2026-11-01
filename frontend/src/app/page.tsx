import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, QrCode, CheckCircle2, TrendingUp, Users, ArrowRight, HeartHandshake, FileCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6 pb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>AI-Powered Volunteer Matching & Trust Verification</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
          Mobilize Verified Volunteers with{' '}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Uncompromising Trust
          </span>
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          ImpactLink eliminates chaotic coordination, ghost registrations, and unverified campaigns with AI matching, cryptographic QR check-in, and automated evidence validation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/events"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
          >
            <span>Explore Active Campaigns</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/organization/events/create"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-slate-800 font-semibold border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Register Organization</span>
          </Link>
        </div>
      </section>

      {/* Trust & Architecture Pillars */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Multi-Factor AI Matching</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Deterministic eligibility filters combined with weighted ranking (Skills 30%, Location 25%, Availability 20%, Experience 15%, Reliability 10%) ensure ideal volunteers are invited with full score explainability.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Cryptographic QR Attendance</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Time-limited, signed attendance tokens dynamically generated on organizer screens prevent fraudulent check-ins and duplicate claims with real-time dashboard updates.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Explainable Trust Scores</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Transparent reputation models for organizations (0-100) and volunteer reliability (0-100) driven by verified attendance records, completed campaigns, and community feedback.
          </p>
        </div>
      </section>

      {/* Hackathon Demo Flow Banner */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700/60 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Interactive End-to-End Walkthrough
            </span>
            <h2 className="text-2xl font-bold mt-1">Explore the Demonstration Portals</h2>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-medium">
            Demo Accounts Ready
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-2">
          <Link
            href="/volunteer/dashboard"
            className="group p-5 rounded-2xl bg-slate-800/60 border border-slate-700 hover:border-emerald-500 transition-all space-y-2 block"
          >
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold text-sm">Volunteer Hub</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-400 transition-transform" />
            </div>
            <p className="text-xs text-slate-300">
              Test candidate matching, view reliability rating (92/100), register for beach cleanup, and scan QR check-in.
            </p>
          </Link>

          <Link
            href="/organization/dashboard"
            className="group p-5 rounded-2xl bg-slate-800/60 border border-slate-700 hover:border-emerald-500 transition-all space-y-2 block"
          >
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold text-sm">Organizer Console</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-400 transition-transform" />
            </div>
            <p className="text-xs text-slate-300">
              Trigger AI volunteer matching recommendations, generate live attendance QR, inspect tasks, and manage security deposits.
            </p>
          </Link>

          <Link
            href="/admin/dashboard"
            className="group p-5 rounded-2xl bg-slate-800/60 border border-slate-700 hover:border-indigo-400 transition-all space-y-2 block"
          >
            <div className="flex items-center justify-between">
              <span className="text-indigo-400 font-bold text-sm">Admin Governance</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-400 transition-transform" />
            </div>
            <p className="text-xs text-slate-300">
              Review OCR document analysis, inspect anomaly risk scores, moderate events, and audit financial deposits.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

