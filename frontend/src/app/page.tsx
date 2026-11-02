'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Cpu,
  QrCode,
  ArrowRight,
  HeartHandshake,
  Sparkles,
  Building2,
  Globe,
  Award,
  Users,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Calendar,
  Flame,
  FileCheck
} from 'lucide-react';

import SmoothScroll from '@/components/motion/SmoothScroll';
import ScrollProgress from '@/components/motion/ScrollProgress';
import CursorGlow from '@/components/motion/CursorGlow';
import AnimatedCard from '@/components/motion/AnimatedCard';
import CountUp from '@/components/motion/CountUp';
import MagneticButton from '@/components/motion/MagneticButton';
import RevealOnScroll, { StaggerContainer, StaggerItem } from '@/components/motion/RevealOnScroll';
import SectionHeading from '@/components/ui/SectionHeading';
import StatCard from '@/components/motion/StatCard';

import initiativesRow1 from '../../public/images/initiatives-row1.jpg';
import initiativesRow2 from '../../public/images/initiatives-row2.jpg';

export default function HomePage() {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <CursorGlow />

      <div className="w-full flex flex-col bg-[#FFF4E8] text-[#431407] selection:bg-[#FF6B1A] selection:text-white">
        
        {/* 1. HERO SECTION: Full-Width Cinematic Video with Clean White Headings */}
        <section className="relative w-full min-h-[580px] sm:min-h-[640px] md:min-h-[720px] flex items-center justify-center overflow-hidden bg-black">
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

          {/* Cinematic Scrim */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/85 backdrop-blur-[0.5px]" />

          {/* Floating Hero Content */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold uppercase tracking-wider shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>AI-Powered Volunteer Matching & Trust Verification</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight drop-shadow-lg"
            >
              Mobilize Verified Volunteers with{' '}
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">
                Uncompromising Trust
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-light drop-shadow"
            >
              ImpactLink eliminates chaotic coordination, ghost registrations, and unverified campaigns with multi-factor AI matching, cryptographic QR check-in, and automated civic proof validation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/events">
                <MagneticButton
                  pulseRing={true}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B1A] to-[#E8590C] hover:from-[#F06A1D] hover:to-[#C74B0D] text-white font-bold text-sm shadow-xl shadow-orange-500/35 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Explore Active Campaigns</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </MagneticButton>
              </Link>

              <Link href="/organization/register">
                <MagneticButton className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/95 hover:bg-white text-[#7A2E0E] font-bold text-sm border border-white shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 backdrop-blur-md cursor-pointer">
                  <ShieldCheck className="w-4 h-4 text-[#FF6B1A]" />
                  <span>Register Organization</span>
                </MagneticButton>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 2. STATS COUNTER STRIP (NGO Foundation Style) */}
        <section className="w-full py-12 bg-white border-y border-[#FED7AA]/60 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <RevealOnScroll delay={0.05}>
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-center space-x-1 text-3xl sm:text-4xl font-heading font-black text-[#7A2E0E]">
                    <CountUp value={2400} suffix="+" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B1A]">Verified Volunteers</span>
                  <p className="text-[11px] text-[#6B5B53]">Cryptographically validated on-ground</p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.1}>
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-center space-x-1 text-3xl sm:text-4xl font-heading font-black text-[#FF6B1A]">
                    <CountUp value={450} suffix="+" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7A2E0E]">Civic Campaigns</span>
                  <p className="text-[11px] text-[#6B5B53]">Zero-fraud moderated initiatives</p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.15}>
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-center space-x-1 text-3xl sm:text-4xl font-heading font-black text-[#7A2E0E]">
                    <CountUp value={98} suffix="%" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B1A]">Attendance Accuracy</span>
                  <p className="text-[11px] text-[#6B5B53]">Via signed QR & dynamic tokens</p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-center space-x-1 text-3xl sm:text-4xl font-heading font-black text-[#FF6B1A]">
                    <CountUp value={18000} suffix="+" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7A2E0E]">Hours Dedicated</span>
                  <p className="text-[11px] text-[#6B5B53]">Certified civic contributions</p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* 3. PREMIUM INTERACTIVE FEATURE CARDS (NGO Foundation Rhythm) */}
        <section className="w-full py-20 relative overflow-hidden">
          {/* Ambient Background Gradient Blobs */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#FF6B1A]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#FFE3CC]/50 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
            <SectionHeading
              eyebrow="Core Platform Architecture"
              title="Architected for Absolute Civic Integrity"
              subtitle="Every volunteer match is verified through explainable intelligence, cryptographic proofs, and transparent reputation metrics."
            />

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {/* CARD 1: Multi-Factor AI Matching */}
              <RevealOnScroll delay={0.05}>
                <AnimatedCard variant="white" className="p-8 sm:p-9 flex flex-col justify-between h-full">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-[#FFE3CC] text-[#FF6B1A] border border-[#FED7AA] flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:rotate-6 transition-transform">
                        <Cpu className="w-7 h-7 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#FFE3CC]/70 text-[#9A3412] border border-[#FED7AA]">
                        01 • MATCHING
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#7A2E0E] group-hover:text-[#FF6B1A] transition-colors">
                        Multi-Factor AI Matching
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6B5B53] leading-relaxed font-light">
                        Deterministic eligibility filters combined with weighted multi-factor ranking (Skills, Vicinity, Availability, Reliability) ensure ideal volunteers are invited with complete factor explainability.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[#FED7AA]/40 text-[11px] font-semibold text-[#7A2E0E]">
                      <span className="px-2.5 py-1 rounded-lg bg-[#FFF4E8] border border-[#FED7AA]">Skills Affinity</span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#FFF4E8] border border-[#FED7AA]">Vicinity Radius</span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#FFF4E8] border border-[#FED7AA]">Explainable Weights</span>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#FED7AA]/40 flex items-center justify-between text-xs font-bold text-[#FF6B1A]">
                    <span>Explore Matching Engine</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </AnimatedCard>
              </RevealOnScroll>

              {/* CARD 2: Solid Orange Variant (NGO Foundation Template Highlight) */}
              <RevealOnScroll delay={0.12}>
                <AnimatedCard variant="orange" className="p-8 sm:p-9 flex flex-col justify-between h-full text-white">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 text-white border border-white/30 backdrop-blur-md flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                        <QrCode className="w-7 h-7 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/30">
                        02 • VERIFICATION
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                        Cryptographic QR Attendance
                      </h3>
                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light">
                        Time-limited, signed attendance tokens and human-readable special codes generated dynamically on organizer screens prevent fraud and grant instant attendance certificates.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/20 text-[11px] font-semibold text-white">
                      <span className="px-2.5 py-1 rounded-lg bg-white/15 border border-white/25">Signed Tokens</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/15 border border-white/25">Dynamic QR Codes</span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/15 border border-white/25">Anti-Spoofing</span>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
                    <span>Explore QR Check-In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </AnimatedCard>
              </RevealOnScroll>

              {/* CARD 3: Explainable Trust Scores */}
              <RevealOnScroll delay={0.18}>
                <AnimatedCard variant="white" className="p-8 sm:p-9 flex flex-col justify-between h-full">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-[#FFE3CC] text-[#FF6B1A] border border-[#FED7AA] flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:rotate-6 transition-transform">
                        <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#FFE3CC]/70 text-[#9A3412] border border-[#FED7AA]">
                        03 • REPUTATION
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#7A2E0E] group-hover:text-[#FF6B1A] transition-colors">
                        Explainable Trust Scores
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6B5B53] leading-relaxed font-light">
                        Transparent reputation indexes for verified organizations (0-100) and volunteer reliability (0-100) calculated from verified track records, reviews, and community initiatives.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[#FED7AA]/40 text-[11px] font-semibold text-[#7A2E0E]">
                      <span className="px-2.5 py-1 rounded-lg bg-[#FFF4E8] border border-[#FED7AA]">0–100 Scale Index</span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#FFF4E8] border border-[#FED7AA]">Verified DARPAN</span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#FFF4E8] border border-[#FED7AA]">Audit Logging</span>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#FED7AA]/40 flex items-center justify-between text-xs font-bold text-[#FF6B1A]">
                    <span>Explore Trust Metrics</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </AnimatedCard>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* 4. INITIATIVES PHOTO STRIP: End-to-End Visual Showcase */}
        <section className="w-full bg-white py-14 sm:py-18 border-y border-[#FED7AA]/60 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
            <SectionHeading
              eyebrow="On-Ground Mobilization"
              title="Real Impact Across Critical Civic Domains"
              subtitle="From environmental shoreline protection to education and food security, explore the initiatives active on ImpactLink."
            />
          </div>

          <div className="w-full space-y-4 sm:space-y-6">
            <div className="w-full overflow-hidden shadow-inner">
              <Image
                src={initiativesRow1}
                alt="Time to change the world - Education, Health, Integrated Agriculture"
                className="w-full h-auto block object-cover"
                sizes="100vw"
              />
            </div>
            <div className="w-full overflow-hidden shadow-inner">
              <Image
                src={initiativesRow2}
                alt="Community Initiatives - Plantation, Women Empowerment, Beach Cleaning"
                className="w-full h-auto block object-cover"
                sizes="100vw"
              />
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-center">
            <Link
              href="/events"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-[#FFE3CC] text-[#7A2E0E] hover:bg-[#FED7AA] border border-[#FED7AA] font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Globe className="w-4 h-4 text-[#FF6B1A]" />
              <span>Discover Ground Campaigns for These Initiatives</span>
              <ArrowRight className="w-4 h-4 text-[#FF6B1A]" />
            </Link>
          </div>
        </section>

        {/* 5. DEMONSTRATION PORTALS: Asymmetric Rhythm Cards */}
        <section className="w-full py-20 bg-[#FFF4E8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <SectionHeading
              eyebrow="Live Demonstration"
              title="Experience End-to-End Civic Coordination"
              subtitle="Switch between roles to inspect intelligent volunteer matching, organizer campaign creation, and administrative verification."
            />

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <RevealOnScroll delay={0.05}>
                <Link href="/volunteer/dashboard">
                  <AnimatedCard variant="white" className="p-8 space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFE3CC] text-[#FF6B1A] flex items-center justify-center border border-[#FED7AA]">
                        <HeartHandshake className="w-6 h-6" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-[#7A2E0E]">Volunteer Hub</h3>
                      <p className="text-xs text-[#6B5B53] leading-relaxed">
                        Browse matching events, check in with QR/special codes, inspect verified skills, and download Gemini AI certificates.
                      </p>
                    </div>
                    <div className="flex items-center text-xs font-bold text-[#FF6B1A] pt-4 border-t border-[#FED7AA]/40">
                      <span>Launch Volunteer Console</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </div>
                  </AnimatedCard>
                </Link>
              </RevealOnScroll>

              <RevealOnScroll delay={0.1}>
                <Link href="/organization/dashboard">
                  <AnimatedCard variant="white" className="p-8 space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFE3CC] text-[#FF6B1A] flex items-center justify-center border border-[#FED7AA]">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-[#7A2E0E]">Organizer Console</h3>
                      <p className="text-xs text-[#6B5B53] leading-relaxed">
                        Launch free public campaigns, view AI-ranked candidates, broadcast QR check-ins, and inspect live attendance rosters.
                      </p>
                    </div>
                    <div className="flex items-center text-xs font-bold text-[#FF6B1A] pt-4 border-t border-[#FED7AA]/40">
                      <span>Launch Organizer Console</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </div>
                  </AnimatedCard>
                </Link>
              </RevealOnScroll>

              <RevealOnScroll delay={0.15}>
                <Link href="/admin/dashboard">
                  <AnimatedCard variant="white" className="p-8 space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFE3CC] text-[#FF6B1A] flex items-center justify-center border border-[#FED7AA]">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-[#7A2E0E]">Admin Governance</h3>
                      <p className="text-xs text-[#6B5B53] leading-relaxed">
                        Oversee platform health metrics, verify organizational DARPAN & 80G documents, review campaigns, and maintain zero-fraud integrity.
                      </p>
                    </div>
                    <div className="flex items-center text-xs font-bold text-[#FF6B1A] pt-4 border-t border-[#FED7AA]/40">
                      <span>Launch Governance Center</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </div>
                  </AnimatedCard>
                </Link>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* 6. BOLD CTA BAND: NGO Foundation Template Highlight */}
        <section className="w-full py-16 sm:py-20 bg-gradient-to-br from-[#FF6B1A] via-[#E8590C] to-[#B8430A] text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Join India&apos;s Verified Civic Network</span>
            </span>

            <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Ready to Drive Genuine Social Good with Verifiable Trust?
            </h2>

            <p className="text-sm sm:text-base text-orange-100 max-w-2xl mx-auto leading-relaxed font-light">
              Whether you are an NGO organizing community drives or a citizen ready to dedicate your time, ImpactLink provides transparent coordination with zero hassle.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <MagneticButton
                  pulseRing={true}
                  className="px-8 py-4 rounded-2xl bg-white hover:bg-orange-50 text-[#7A2E0E] font-black text-sm shadow-2xl shadow-black/25 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>Sign Up as a Volunteer</span>
                  <ArrowRight className="w-4 h-4 text-[#FF6B1A]" />
                </MagneticButton>
              </Link>
              <Link href="/organization/register">
                <MagneticButton className="px-8 py-4 rounded-2xl bg-black/30 hover:bg-black/40 text-white font-bold text-sm border border-white/30 backdrop-blur-md shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer">
                  <span>Register an Organization</span>
                </MagneticButton>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SmoothScroll>
  );
}
