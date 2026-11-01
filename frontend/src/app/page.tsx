import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Cpu, QrCode, ArrowRight, HeartHandshake, Sparkles, Building2, Globe } from 'lucide-react';

import initiativesRow1 from '../../public/images/initiatives-row1.jpg';
import initiativesRow2 from '../../public/images/initiatives-row2.jpg';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      {/* 1. HERO SECTION: Full horizontal stretch covering whole hero section with background video */}
      <section className="relative w-full min-h-[580px] sm:min-h-[640px] md:min-h-[720px] flex items-center justify-center overflow-hidden bg-black">
        {/* Background Video stretching from one end to another */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Cinematic gradient overlay for contrast and crystal-clear readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/75 backdrop-blur-[0.5px]" />

        {/* Headings from photo positioned above the video in white */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI-Powered Volunteer Matching & Trust Verification</span>
          </div>

          {/* Main Heading in white as in the photo */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight drop-shadow-lg">
            Mobilize Verified Volunteers with{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">
              Uncompromising Trust
            </span>
          </h1>

          {/* Subtitle in white */}
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-light drop-shadow">
            ImpactLink eliminates chaotic coordination, ghost registrations, and unverified campaigns with multi-factor AI matching, cryptographic QR check-in, and automated civic proof validation.
          </p>

          {/* Call to Actions matching the photo */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/events"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center space-x-2 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Explore Active Campaigns</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
            <Link
              href="/organization/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/95 hover:bg-white text-[#7C2D12] font-semibold border border-white shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 backdrop-blur-md cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#F97316]" />
              <span>Register Organization</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PREMIUM INTERACTIVE FEATURE CARDS SECTION */}
      <section className="w-full bg-[#FFF3E8] py-16 sm:py-20 relative overflow-hidden">
        {/* Subtle decorative background ambient gradients */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FED7AA] to-transparent" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FFEDD5]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FED7AA]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Core Platform Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#9A3412]">
              Architected for Absolute Integrity
            </h2>
            <div className="w-16 h-0.5 bg-[#F97316] rounded-full mx-auto" />
            <p className="text-sm sm:text-base text-[#78716C] leading-relaxed">
              Every volunteer connection is powered by explainable intelligence, cryptographic proofs, and tamper-resistant civic reputation.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* CARD 1: Multi-Factor AI Matching */}
            <div className="group relative bg-white rounded-[24px] border border-[#FED7AA] p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2.5 hover:border-[#F97316] shadow-[0_4px_20px_-4px_rgba(249,115,22,0.06),0_2px_6px_-2px_rgba(120,113,108,0.04)] hover:shadow-[0_22px_45px_-12px_rgba(249,115,22,0.18),0_8px_18px_-6px_rgba(249,115,22,0.08)] overflow-hidden cursor-pointer">
              {/* Top Accent Gradient Border on Hover */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#F97316] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Ambient Top-Right Glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#FFEDD5]/60 via-[#FED7AA]/20 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

              {/* Faint Abstract Geometry Watermark */}
              <div className="absolute top-6 right-6 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none">
                <Cpu className="w-24 h-24 text-[#9A3412]" />
              </div>

              {/* Content Container */}
              <div className="space-y-6 relative z-10">
                {/* Header Row: Icon + Micro Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFEDD5] via-[#FFF3E8] to-[#FED7AA]/40 border border-[#FED7AA] text-[#F97316] flex items-center justify-center shadow-xs transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#F97316] group-hover:text-white group-hover:border-[#F97316] group-hover:shadow-lg group-hover:shadow-orange-500/25">
                    <Cpu className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#FFEDD5]/70 text-[#9A3412] border border-[#FED7AA]/80 group-hover:border-[#F97316]/40 transition-colors">
                    01 • DISCOVERY
                  </span>
                </div>

                {/* Title & Copy */}
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#9A3412] group-hover:text-[#EA580C] transition-colors duration-200">
                    Multi-Factor AI Matching
                  </h3>
                  <p className="text-sm text-[#78716C] leading-relaxed font-normal">
                    Deterministic eligibility filters combined with weighted multi-factor ranking (Skills, Vicinity, Availability, Reliability) ensure ideal volunteers are invited with complete factor explainability.
                  </p>
                </div>

                {/* Feature Tags / Micro Badges */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#FED7AA]/40">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#FFF3E8] text-[#9A3412] border border-[#FED7AA]/60 group-hover:border-[#F97316]/30 transition-colors">
                    Skills Affinity
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#FFF3E8] text-[#9A3412] border border-[#FED7AA]/60 group-hover:border-[#F97316]/30 transition-colors">
                    Vicinity Radius
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#FFF3E8] text-[#9A3412] border border-[#FED7AA]/60 group-hover:border-[#F97316]/30 transition-colors">
                    Explainable Weights
                  </span>
                </div>
              </div>

              {/* Interactive Footer Action Reveal */}
              <div className="pt-6 mt-6 border-t border-[#FED7AA]/40 flex items-center justify-between text-xs font-bold text-[#F97316] relative z-10">
                <span className="tracking-wide">Explore Matching Engine</span>
                <div className="w-7 h-7 rounded-full bg-[#FFEDD5] text-[#F97316] flex items-center justify-center group-hover:bg-[#F97316] group-hover:text-white transition-all duration-300 shadow-2xs group-hover:translate-x-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* CARD 2: Cryptographic QR Attendance */}
            <div className="group relative bg-white rounded-[24px] border border-[#FED7AA] p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2.5 hover:border-[#F97316] shadow-[0_4px_20px_-4px_rgba(249,115,22,0.06),0_2px_6px_-2px_rgba(120,113,108,0.04)] hover:shadow-[0_22px_45px_-12px_rgba(249,115,22,0.18),0_8px_18px_-6px_rgba(249,115,22,0.08)] overflow-hidden cursor-pointer">
              {/* Top Accent Gradient Border on Hover */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#F97316] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Ambient Top-Right Glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#FFEDD5]/60 via-[#FED7AA]/20 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

              {/* Faint Abstract Geometry Watermark */}
              <div className="absolute top-6 right-6 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none">
                <QrCode className="w-24 h-24 text-[#9A3412]" />
              </div>

              {/* Content Container */}
              <div className="space-y-6 relative z-10">
                {/* Header Row: Icon + Micro Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFEDD5] via-[#FFF3E8] to-[#FED7AA]/40 border border-[#FED7AA] text-[#F97316] flex items-center justify-center shadow-xs transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-[#F97316] group-hover:text-white group-hover:border-[#F97316] group-hover:shadow-lg group-hover:shadow-orange-500/25">
                    <QrCode className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#FFEDD5]/70 text-[#9A3412] border border-[#FED7AA]/80 group-hover:border-[#F97316]/40 transition-colors">
                    02 • VERIFICATION
                  </span>
                </div>

                {/* Title & Copy */}
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#9A3412] group-hover:text-[#EA580C] transition-colors duration-200">
                    Cryptographic QR Attendance
                  </h3>
                  <p className="text-sm text-[#78716C] leading-relaxed font-normal">
                    Time-limited, signed attendance tokens and human-readable special codes generated dynamically on organizer screens prevent fraud and grant instant attendance certificates.
                  </p>
                </div>

                {/* Feature Tags / Micro Badges */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#FED7AA]/40">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#FFF3E8] text-[#9A3412] border border-[#FED7AA]/60 group-hover:border-[#F97316]/30 transition-colors">
                    Signed Tokens
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#FFF3E8] text-[#9A3412] border border-[#FED7AA]/60 group-hover:border-[#F97316]/30 transition-colors">
                    Dynamic QR Codes
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#FFF3E8] text-[#9A3412] border border-[#FED7AA]/60 group-hover:border-[#F97316]/30 transition-colors">
                    Anti-Spoofing
                  </span>
                </div>
              </div>

              {/* Interactive Footer Action Reveal */}
              <div className="pt-6 mt-6 border-t border-[#FED7AA]/40 flex items-center justify-between text-xs font-bold text-[#F97316] relative z-10">
                <span className="tracking-wide">Explore QR Check-In</span>
                <div className="w-7 h-7 rounded-full bg-[#FFEDD5] text-[#F97316] flex items-center justify-center group-hover:bg-[#F97316] group-hover:text-white transition-all duration-300 shadow-2xs group-hover:translate-x-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* CARD 3: Explainable Trust Scores */}
            <div className="group relative bg-white rounded-[24px] border border-[#FED7AA] p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2.5 hover:border-[#F97316] shadow-[0_4px_20px_-4px_rgba(249,115,22,0.06),0_2px_6px_-2px_rgba(120,113,108,0.04)] hover:shadow-[0_22px_45px_-12px_rgba(249,115,22,0.18),0_8px_18px_-6px_rgba(249,115,22,0.08)] overflow-hidden cursor-pointer">
              {/* Top Accent Gradient Border on Hover */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#F97316] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Ambient Top-Right Glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#FFEDD5]/60 via-[#FED7AA]/20 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

              {/* Faint Abstract Geometry Watermark */}
              <div className="absolute top-6 right-6 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none">
                <ShieldCheck className="w-24 h-24 text-[#9A3412]" />
              </div>

              {/* Content Container */}
              <div className="space-y-6 relative z-10">
                {/* Header Row: Icon + Micro Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFEDD5] via-[#FFF3E8] to-[#FED7AA]/40 border border-[#FED7AA] text-[#F97316] flex items-center justify-center shadow-xs transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#F97316] group-hover:text-white group-hover:border-[#F97316] group-hover:shadow-lg group-hover:shadow-orange-500/25">
                    <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#FFEDD5]/70 text-[#9A3412] border border-[#FED7AA]/80 group-hover:border-[#F97316]/40 transition-colors">
                    03 • REPUTATION
                  </span>
                </div>

                {/* Title & Copy */}
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#9A3412] group-hover:text-[#EA580C] transition-colors duration-200">
                    Explainable Trust Scores
                  </h3>
                  <p className="text-sm text-[#78716C] leading-relaxed font-normal">
                    Transparent reputation indexes for verified organizations (0-100) and volunteer reliability (0-100) calculated from verified track records, reviews, and community initiatives.
                  </p>
                </div>

                {/* Feature Tags / Micro Badges */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#FED7AA]/40">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#FFF3E8] text-[#9A3412] border border-[#FED7AA]/60 group-hover:border-[#F97316]/30 transition-colors">
                    0–100 Scale Index
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#FFF3E8] text-[#9A3412] border border-[#FED7AA]/60 group-hover:border-[#F97316]/30 transition-colors">
                    Verified DARPAN / 80G
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#FFF3E8] text-[#9A3412] border border-[#FED7AA]/60 group-hover:border-[#F97316]/30 transition-colors">
                    Audit Logging
                  </span>
                </div>
              </div>

              {/* Interactive Footer Action Reveal */}
              <div className="pt-6 mt-6 border-t border-[#FED7AA]/40 flex items-center justify-between text-xs font-bold text-[#F97316] relative z-10">
                <span className="tracking-wide">Explore Trust Metrics</span>
                <div className="w-7 h-7 rounded-full bg-[#FFEDD5] text-[#F97316] flex items-center justify-center group-hover:bg-[#F97316] group-hover:text-white transition-all duration-300 shadow-2xs group-hover:translate-x-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECOND & THIRD PHOTO SECTIONS: Covers page horizontally end-to-end like cards */}
      <section className="w-full bg-white py-12 sm:py-16 border-y border-[#FED7AA]/40 overflow-hidden">
        {/* Full-width container stretching horizontally end-to-end */}
        <div className="w-full space-y-4 sm:space-y-6">
          {/* Second Photo: Time to change the world (Education, Health, Integrated Agriculture) */}
          <div className="w-full">
            <Image
              src={initiativesRow1}
              alt="Time to change the world - Education, Health, Integrated Agriculture"
              className="w-full h-auto block object-cover"
              sizes="100vw"
            />
          </div>

          {/* Third Photo: Plantation, Women Empowerment, Beach Cleaning */}
          <div className="w-full">
            <Image
              src={initiativesRow2}
              alt="Community Initiatives - Plantation, Women Empowerment, Beach Cleaning"
              className="w-full h-auto block object-cover"
              sizes="100vw"
            />
          </div>
        </div>

        {/* Action Link for Initiatives */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-center">
          <Link
            href="/events"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#FFEDD5] text-[#9A3412] hover:bg-[#FED7AA] border border-[#FED7AA] font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-105"
          >
            <Globe className="w-4 h-4 text-[#F97316]" />
            <span>Discover Ground Campaigns for These Initiatives</span>
            <ArrowRight className="w-4 h-4 text-[#F97316]" />
          </Link>
        </div>
      </section>

      {/* 4. PLATFORM DEMONSTRATION MODULES */}
      <section className="w-full bg-[#FFF3E8] py-16 sm:py-20">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="bg-[#FFEDD5]/70 p-8 sm:p-10 rounded-3xl border border-[#FED7AA] hover:border-[#F97316]/50 shadow-sm transition-all space-y-8">
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
          </div>
        </div>
      </section>
    </div>
  );
}
