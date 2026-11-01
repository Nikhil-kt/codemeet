'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

// Motion Components
import SmoothScroll from '@/components/motion/SmoothScroll';
import ScrollProgress from '@/components/motion/ScrollProgress';
import CursorGlow from '@/components/motion/CursorGlow';
import AnimatedCard from '@/components/motion/AnimatedCard';
import CountUp from '@/components/motion/CountUp';
import ProgressRing from '@/components/motion/ProgressRing';
import RevealOnScroll, { StaggerContainer, StaggerItem } from '@/components/motion/RevealOnScroll';
import MagneticButton from '@/components/motion/MagneticButton';
import { triggerConfetti } from '@/components/motion/Confetti';

import {
  ShieldCheck,
  Award,
  Calendar,
  CheckCircle2,
  QrCode,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckSquare,
  AlertCircle,
  Printer,
  BadgeCheck,
  X,
  User,
  ExternalLink,
  ChevronRight,
  Flame,
  Check,
  ScrollText
} from 'lucide-react';

/**
 * Step 5: Vintage Details - Embossed Wax Seal Component
 * Deep red circular wax seal with scalloped border and gold award icon
 */
function WaxSeal({ className = '' }: { className?: string }) {
  return (
    <div
      title="Authentic Cryptographic Wax Seal"
      className={`relative w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 select-none shadow-[0_4px_14px_rgba(90,20,20,0.45),inset_0_2px_4px_rgba(255,200,200,0.3),inset_0_-3px_5px_rgba(0,0,0,0.5)] bg-gradient-to-br from-[#9C2424] via-[#7F1717] to-[#540E0E] border border-[#B83D3D]/60 ${className}`}
    >
      {/* Outer scalloped/creased edge simulation */}
      <div className="absolute inset-1 rounded-full border border-dashed border-[#FCA5A5]/30 pointer-events-none" />
      {/* Embossed inner circle */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#691111] to-[#8C1B1B] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center border border-[#9C2424]/80">
        <Award className="w-5 h-5 text-[#FED7AA] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
      </div>
    </div>
  );
}

/**
 * Step 5: Vintage Details - Thin Decorative Fleuron Divider
 */
function VintageDivider({ ornament = '❖' }: { ornament?: string }) {
  return (
    <div className="flex items-center justify-center my-6 w-full max-w-4xl mx-auto select-none pointer-events-none opacity-75">
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[rgba(139,94,52,0.35)] to-[rgba(139,94,52,0.12)]" />
      <div className="px-4 flex items-center space-x-2 text-[rgba(139,94,52,0.65)]">
        <span className="text-[10px]">✦</span>
        <span className="text-sm text-[#B8430A]">{ornament}</span>
        <span className="text-[10px]">✦</span>
      </div>
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[rgba(139,94,52,0.35)] to-[rgba(139,94,52,0.12)]" />
    </div>
  );
}

export default function VolunteerDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [skillsCatalog, setSkillsCatalog] = useState<any[]>([]);
  const [myCertificates, setMyCertificates] = useState<any[]>([]);
  const [activeCertificate, setActiveCertificate] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check-In modal
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [checkingInLoading, setCheckingInLoading] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<{ success: boolean; msg: string } | null>(null);
  const [celebrationBanner, setCelebrationBanner] = useState<string | null>(null);

  // Certificate modal
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('impactlink_user') : null;
    if (raw) {
      try {
        setCurrentUser(JSON.parse(raw));
      } catch (e) {}
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [pRes, hRes, sRes, cRes] = await Promise.all([
      api.getVolunteerProfile(),
      api.getVolunteerHistory(),
      api.getSkillsCatalog(),
      api.getMyCertificates()
    ]);
    setLoading(false);

    if (pRes.success && pRes.data) setProfile(pRes.data.volunteer);
    if (hRes.success && hRes.data) setHistory(hRes.data);
    if (sRes.success && sRes.data) setSkillsCatalog(sRes.data.skills || []);
    if (cRes.success && cRes.data) {
      const certs = cRes.data.certificates || [];
      setMyCertificates(certs);
      if (certs.length > 0 && !activeCertificate) {
        setActiveCertificate(certs[0]);
      }
    }
  };

  const handleQuickCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput) return;

    setCheckingInLoading(true);
    setCheckInStatus(null);

    const res = await api.checkInQR({
      eventId: selectedEventId || undefined,
      token: tokenInput.trim(),
      code: tokenInput.trim(),
      specialCode: tokenInput.trim()
    });

    setCheckingInLoading(false);

    if (res.success) {
      triggerConfetti();
      const cert = (res as any).certificate || res.data?.certificate;
      if (cert) {
        setActiveCertificate(cert);
      }
      setCheckInStatus({ success: true, msg: res.message || res.data?.message || 'Check-in confirmed!' });
      setCelebrationBanner('🎉 Attendance Verified! Your official Gemini AI-Endorsed Certificate is ready!');
      await loadData();
      setTokenInput('');
      setTimeout(() => {
        setCheckInModalOpen(false);
      }, 2500);
    } else {
      setCheckInStatus({ success: false, msg: res.error || 'Invalid or expired check-in code / token.' });
    }
  };

  const reliabilityScore = profile?.reliability_score !== undefined ? profile.reliability_score : 92;
  const factors = profile?.reliability_factors || {
    attendanceConsistency: 70,
    taskCompletion: 70,
    organizerFeedback: 70,
    timelyCancellation: 80
  };

  const volunteerName = profile?.name || currentUser?.full_name || 'Verified Volunteer';
  const volunteerEmail = profile?.email || currentUser?.email || 'volunteer@impactlink.org';
  const allEvents = history?.events || [];
  const attendedEvents = allEvents.filter((item: any) => item.attendance_status === 'PRESENT');
  const totalVerifiedHours = history?.total_hours || (attendedEvents.length * 4.0) || 48;
  const certId = `IL-CERT-${(profile?.id || '2026').slice(0, 8).toUpperCase()}-VERIFIED`;

  function parseEventDate(dateStr: string) {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        const parts = (dateStr || '').split('-');
        return { month: 'NOV', day: parts[2] || '14' };
      }
      const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const day = d.toLocaleDateString('en-US', { day: '2-digit' });
      return { month, day };
    } catch {
      return { month: 'NOV', day: '14' };
    }
  }

  return (
    <ProtectedRoute allowedRoles={['VOLUNTEER', 'TEAM_LEADER', 'ADMIN']}>
      {/* Step 7: Preload the parchment asset for instantaneous render */}
      <link rel="preload" as="image" href="/images/parchment.webp" type="image/webp" />

      <SmoothScroll>
        <ScrollProgress />
        <CursorGlow />

        {/* 
          Step 2: Page Background (.dashboard-bg)
          Configured with:
          - Background color fallback: #F3E3C3
          - High-res compressed WebP parchment image scaled to 140%
          - Fixed background attachment on desktop (switches to scroll on mobile)
          - Vignette overlay (::before) for aged-paper edge darkening
        */}
        <div className="dashboard-bg w-full min-h-screen text-[#5C4033] font-serif selection:bg-[#B8430A] selection:text-[#FFF8EB] relative overflow-hidden">
          
          {/* Top Celebration Notification */}
          {celebrationBanner && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full relative z-20">
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="p-4 bg-gradient-to-r from-[#E8590C] via-[#C74B0D] to-[#8B3407] text-[#FFF8EB] font-serif font-bold rounded-xl shadow-xl border border-[#FF9A4D]/40 flex flex-col sm:flex-row items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-2 text-xs">
                  <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
                  <span>{celebrationBanner}</span>
                </div>
                <button
                  onClick={() => setCertificateModalOpen(true)}
                  className="px-4 py-1.5 bg-[#FFF8EB] text-[#4A2410] hover:bg-white text-xs font-serif font-bold rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  View Certificate Now
                </button>
              </motion.div>
            </div>
          )}

          {/* 1. HERO SECTION: Vintage-Toned Archival Header */}
          <section className="relative w-full min-h-[480px] sm:min-h-[520px] md:min-h-[580px] flex items-center justify-center overflow-hidden bg-[#241208]">
            <Image
              src="/images/volunteer-hero-bg.jpg"
              alt="Make Someone's Life by Giving of Yours"
              fill
              priority
              className="absolute inset-0 w-full h-full object-cover sepia-[0.35] brightness-[0.75] contrast-[1.08]"
              sizes="100vw"
            />
            {/* Cinematic Parchment-Warm Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#241208]/85 via-[#2E180B]/60 to-[#241208]/90 backdrop-blur-[0.5px]" />

            {/* Foreground Hero Content */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
              {/* Eyebrow Label: Small Caps, Letter Spacing 0.12em, Color #B8430A */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#3B1E0E]/75 backdrop-blur-md text-[#FED7AA] border border-[#B8430A]/50 text-xs font-serif font-bold uppercase tracking-[0.12em] shadow-md"
              >
                <ShieldCheck className="w-4 h-4 text-[#FF9A4D]" />
                <span>Verified Community Volunteer</span>
              </motion.div>

              {/* Main Heading: Classic Display Serif, Tight Spacing */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-vintage-heading text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#FFF8EB] max-w-4xl mx-auto leading-tight drop-shadow-md"
              >
                Volunteer Command{' '}
                <span className="bg-gradient-to-r from-[#FF9A4D] via-[#FFB37C] to-[#FFE3CC] bg-clip-text text-transparent drop-shadow-sm italic">
                  Center
                </span>
              </motion.h1>

              {/* Subtitle: High Contrast #FFF8EB/90 */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-vintage-body text-base sm:text-lg text-[#F5E6CE]/90 max-w-2xl mx-auto leading-relaxed drop-shadow"
              >
                Track your verified community participation, attendance records, assigned tasks, and official certificate of service.
              </motion.p>

              {/* Action Buttons: Step 4 Burnt-Orange Gradient & Parchment Variants */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3"
              >
                <Link
                  href="/volunteer/profile"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#FFF8EB] hover:bg-[#FFEDD5] text-[#4A2410] font-serif font-bold text-sm border border-[rgba(139,94,52,0.35)] shadow-lg shadow-black/25 hover:scale-105 active:scale-97 transition-all flex items-center justify-center space-x-2 backdrop-blur-md cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#B8430A]" />
                  <span>My Profile & Skills</span>
                </Link>

                <MagneticButton
                  onClick={() => setCertificateModalOpen(true)}
                  pulseRing={true}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#E8590C] to-[#B8430A] hover:from-[#F06A1D] hover:to-[#C74B0D] text-[#FFF8EB] font-serif font-bold text-sm border border-[#FF9A4D]/40 shadow-xl shadow-[rgba(184,67,10,0.35)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#FFF8EB]" />
                  <span>Service Certificate</span>
                </MagneticButton>

                <MagneticButton
                  onClick={() => {
                    if (history?.events && history.events.length > 0) {
                      setSelectedEventId(history.events[0].event_id);
                    }
                    setCheckInModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#F5E6CE]/80 hover:bg-[#EBD6B0] text-[#4A2410] border border-[rgba(139,94,52,0.35)] font-serif font-bold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-[#B8430A]" />
                  <span>Scan Attendance QR</span>
                </MagneticButton>
              </motion.div>
            </div>
          </section>

          {/* Decorative Fleuron Divider */}
          <VintageDivider ornament="❦" />

          {/* MAIN DASHBOARD CONTENT CONTAINER */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-10 w-full relative z-10">

            {/* 2. CERTIFICATE HERO-STYLE CALLOUT BANNER (UPGRADE 1) */}
            <RevealOnScroll yOffset={24}>
              <AnimatedCard
                variant="gradient"
                className="p-7 sm:p-9 text-[#FFF8EB] relative overflow-hidden"
              >
                {/* Background Archival Watermark */}
                <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
                  <Award className="w-64 h-64 text-[#FFF8EB]" />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                  <div className="flex items-start space-x-5 max-w-2xl">
                    {/* Step 5: Embossed Wax Seal Badge */}
                    <WaxSeal className="hidden sm:flex mt-1" />

                    <div className="space-y-2">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#FFF8EB] text-xs font-serif uppercase tracking-[0.12em] border border-white/20">
                        {/* Floating Bobbing Award */}
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <Award className="w-4 h-4 text-amber-200" />
                        </motion.div>
                        <span>Official Community Service Credential</span>
                      </div>

                      <h3 className="font-vintage-heading text-2xl sm:text-3xl font-bold text-[#FFF8EB] tracking-tight">
                        Verified Certificate of Participation Available
                      </h3>

                      <p className="font-vintage-body text-xs sm:text-sm text-[#FFF8EB]/90 leading-relaxed">
                        Your attendance records and volunteer contributions are cryptographically verified through QR check-ins. You can view, download, or print your official certificate below.
                      </p>
                    </div>
                  </div>

                  {/* Primary Button: Burnt Orange Gradient with Cream Text & Soft Shadow */}
                  <MagneticButton
                    onClick={() => setCertificateModalOpen(true)}
                    pulseRing={true}
                    className="group px-6 py-3.5 rounded-xl bg-[#FFF8EB] hover:bg-white text-[#4A2410] font-serif font-bold text-xs sm:text-sm shadow-xl shadow-black/25 hover:scale-105 active:scale-97 transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer border border-[rgba(139,94,52,0.3)]"
                  >
                    <Award className="w-4 h-4 text-[#B8430A] group-hover:rotate-12 transition-transform" />
                    <span>View & Print Certificate</span>
                    <ArrowRight className="w-4 h-4 text-[#B8430A] group-hover:translate-x-1.5 transition-transform" />
                  </MagneticButton>
                </div>
              </AnimatedCard>
            </RevealOnScroll>

            {/* Decorative Fleuron Divider */}
            <VintageDivider ornament="❖" />

            {/* 3. THREE STAT CARDS (UPGRADES 2, 3, 4) - Parchment & Burnt-Orange Rhythm */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              
              {/* CARD 1: RELIABILITY SCORE (Parchment Card + Animated SVG Ring + Sub-metrics) */}
              <RevealOnScroll delay={0.05} yOffset={24}>
                <AnimatedCard variant="white" className="p-7 flex flex-col justify-between h-full">
                  <div>
                    {/* Header Row */}
                    <div className="flex justify-between items-start pb-4 border-b border-[rgba(139,94,52,0.2)]">
                      <div>
                        <span className="text-[11px] font-serif font-bold uppercase tracking-[0.12em] text-[#B8430A] block">
                          Reliability Score
                        </span>
                        <h4 className="font-vintage-heading text-xl font-bold text-[#4A2410]">Trust Index</h4>
                      </div>

                      {/* Step 5: Ink-Stamp Style Badge for "Active Rating" */}
                      <div className="ink-stamp ink-stamp-active flex items-center space-x-1.5 text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5B7A2F] animate-pulse" />
                        <span>Active Rating</span>
                      </div>
                    </div>

                    {/* Circular Animated Progress Ring with Burnt Orange & Sepia Track */}
                    <div className="py-6 flex items-center justify-center">
                      <ProgressRing
                        progress={reliabilityScore}
                        size={136}
                        strokeWidth={11}
                        color="#E8590C"
                        trackColor="rgba(139, 94, 52, 0.2)"
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <CountUp
                            value={reliabilityScore}
                            className="font-vintage-heading text-3xl font-black text-[#4A2410] tracking-tight"
                          />
                          <span className="text-[10px] font-serif font-bold text-[#7C5A48] uppercase tracking-widest">
                            / 100
                          </span>
                        </div>
                      </ProgressRing>
                    </div>

                    {/* Four Animated Factor Progress Bars with Staggered Delays */}
                    <div className="space-y-3 pt-2">
                      {[
                        { label: 'Attendance Consistency (40%)', val: factors.attendanceConsistency || 70, delay: 0.1 },
                        { label: 'Verified Tasks (30%)', val: factors.taskCompletion || 70, delay: 0.2 },
                        { label: 'Organizer Feedback (20%)', val: factors.organizerFeedback || 70, delay: 0.3 },
                        { label: 'Cancellation Behavior (10%)', val: factors.timelyCancellation || 80, delay: 0.4 },
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between font-vintage-body text-xs text-[#5C4033]">
                            <span>{item.label}</span>
                            <strong className="text-[#4A2410] font-bold">{item.val}%</strong>
                          </div>
                          <div className="w-full h-2 rounded-full bg-[#EBD6B0]/70 overflow-hidden border border-[rgba(139,94,52,0.18)]">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.val}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: item.delay, ease: [0.22, 1, 0.36, 1] }}
                              className="h-full rounded-full bg-gradient-to-r from-[#E8590C] to-[#B8430A]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedCard>
              </RevealOnScroll>

              {/* CARD 2: TOTAL CONTRIBUTION (Solid Burnt Orange Card Variant Standing Out Against Parchment) */}
              <RevealOnScroll delay={0.12} yOffset={24}>
                <AnimatedCard variant="orange" className="p-7 flex flex-col justify-between h-full text-[#FFF8EB]">
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex justify-between items-start pb-4 border-b border-white/20">
                      <div>
                        <span className="text-[11px] font-serif font-bold uppercase tracking-[0.12em] text-[#FED7AA] block">
                          Total Contribution
                        </span>
                        <h4 className="font-vintage-heading text-xl font-bold text-[#FFF8EB]">Verified Hours</h4>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/25">
                        <Flame className="w-5 h-5 text-amber-200 animate-pulse" />
                      </div>
                    </div>

                    {/* Massive Count-Up Display */}
                    <div className="py-2">
                      <div className="flex items-baseline space-x-2">
                        <CountUp
                          value={totalVerifiedHours}
                          className="font-vintage-heading text-5xl sm:text-6xl font-black text-[#FFF8EB] tracking-tight"
                        />
                        <span className="text-xl font-serif font-bold text-orange-100">Hours</span>
                      </div>
                      <p className="font-vintage-body text-xs text-[#FFF8EB]/85 mt-1 leading-relaxed">
                        Certified upon dynamic QR check-in & verified task completion.
                      </p>
                    </div>

                    {/* Weekly Activity Sparkline / Hours Bar Chart */}
                    <div className="pt-4 border-t border-white/20 space-y-2">
                      <div className="flex justify-between items-center text-[11px] text-[#FED7AA] font-serif font-bold uppercase tracking-wider">
                        <span>Recent Activity Volume</span>
                        <span>4.0 hrs/event avg</span>
                      </div>
                      <div className="h-20 w-full flex items-end justify-between gap-2 pt-2">
                        {[40, 65, 30, 85, 55, 95, 75].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <motion.div
                              initial={{ height: 0 }}
                              whileInView={{ height: `${h}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                              className="w-full rounded-t-md bg-[#FFF8EB]/90 hover:bg-white transition-colors cursor-pointer"
                            />
                            <span className="text-[9px] text-white/75 font-serif font-bold">
                              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/20 flex items-center justify-between text-xs text-[#FFF8EB] font-serif font-bold">
                    <span>100% Civic Integrity</span>
                    <BadgeCheck className="w-4 h-4 text-amber-200" />
                  </div>
                </AnimatedCard>
              </RevealOnScroll>

              {/* CARD 3: MATCHING VICINITY (Parchment Card + Map Pin Illustration + Category Chips) */}
              <RevealOnScroll delay={0.18} yOffset={24}>
                <AnimatedCard variant="white" className="p-7 flex flex-col justify-between h-full">
                  <div className="space-y-5">
                    {/* Header Row */}
                    <div className="flex justify-between items-start pb-4 border-b border-[rgba(139,94,52,0.2)]">
                      <div>
                        <span className="text-[11px] font-serif font-bold uppercase tracking-[0.12em] text-[#B8430A] block">
                          Matching Vicinity
                        </span>
                        <h4 className="font-vintage-heading text-xl font-bold text-[#4A2410]">Geographic Scope</h4>
                      </div>
                      
                      {/* Stylized Map Pin with Radar Ripple */}
                      <div className="relative flex items-center justify-center w-11 h-11">
                        <span className="absolute w-10 h-10 rounded-xl bg-[#E8590C]/20 animate-ping" />
                        <div className="w-11 h-11 rounded-xl bg-[#F5E6CE] text-[#B8430A] flex items-center justify-center z-10 border border-[rgba(139,94,52,0.3)] shadow-xs">
                          <MapPin className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Location Name */}
                    <div className="space-y-1">
                      <div className="font-vintage-heading text-2xl font-bold text-[#4A2410] flex items-center space-x-2">
                        <span>{profile?.city || 'Chennai'}</span>
                      </div>
                      <p className="font-vintage-body text-xs text-[#5C4033]">
                        {profile?.state || 'Tamil Nadu'}, India • Active Radius: 25 km
                      </p>
                    </div>

                    {/* Category Chips with Vintage Sepia Pill Styling */}
                    <div className="space-y-2 pt-2 border-t border-[rgba(139,94,52,0.18)]">
                      <span className="text-[10px] font-serif font-bold uppercase tracking-[0.12em] text-[#7C5A48] block">
                        Preferred Mission Categories
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(profile?.preferred_categories || ['ENVIRONMENTAL', 'COMMUNITY_WELFARE']).map((cat: string, idx: number) => (
                          <motion.span
                            key={cat}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.15 + idx * 0.1 }}
                            whileHover={{ y: -3, scale: 1.05 }}
                            className="px-3.5 py-1.5 rounded-lg bg-[#F5E6CE]/80 border border-[rgba(139,94,52,0.28)] text-[#4A2410] font-serif text-xs font-semibold shadow-xs hover:border-[#E8590C] transition-all cursor-default"
                          >
                            {cat.replace(/_/g, ' ')}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[rgba(139,94,52,0.2)] flex items-center justify-between font-serif text-xs text-[#5C4033]">
                    <span className="font-semibold">AI Proximity Weight</span>
                    <strong className="text-[#B8430A] font-bold">95% Local Match</strong>
                  </div>
                </AnimatedCard>
              </RevealOnScroll>
            </div>

            {/* Decorative Fleuron Divider */}
            <VintageDivider ornament="❦" />

            {/* 4. REGISTERED CAMPAIGNS & ATTENDANCE (UPGRADE 5) */}
            <RevealOnScroll yOffset={24}>
              <AnimatedCard variant="white" className="p-7 sm:p-9 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[rgba(139,94,52,0.2)]">
                  <div className="space-y-1">
                    <span className="text-[11px] font-serif font-bold uppercase tracking-[0.12em] text-[#B8430A] block">
                      Civic Participation Record
                    </span>
                    <h2 className="font-vintage-heading text-2xl sm:text-3xl font-bold text-[#4A2410]">
                      Registered Campaigns & Attendance
                    </h2>
                    <p className="font-vintage-body text-xs text-[#5C4033]">
                      Your personal event participations and verified attendance logs
                    </p>
                  </div>

                  <Link
                    href="/events"
                    className="inline-flex items-center space-x-1.5 text-xs font-serif font-bold text-[#B8430A] hover:text-[#E8590C] hover:translate-x-1 transition-all group"
                  >
                    <span>Find More Campaigns</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {allEvents.length > 0 ? (
                  <div className="space-y-4">
                    {allEvents.map((item: any, idx: number) => {
                      const dateObj = parseEventDate(item.event_date);
                      return (
                        <motion.div
                          key={item.registration_id || idx}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: idx * 0.08 }}
                          className="p-5 sm:p-6 rounded-xl bg-[#FFF9EE]/90 border border-[rgba(139,94,52,0.25)] hover:border-[#E8590C] hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
                        >
                          <div className="flex items-center space-x-4">
                            {/* Stacked Date Badge */}
                            <div className="w-14 h-14 rounded-xl bg-[#F5E6CE] border border-[rgba(139,94,52,0.3)] shadow-xs flex flex-col items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                              <span className="text-[10px] font-serif font-black uppercase text-[#B8430A] tracking-wider">
                                {dateObj.month}
                              </span>
                              <span className="font-vintage-heading text-xl font-black text-[#4A2410] leading-none">
                                {dateObj.day}
                              </span>
                            </div>

                            {/* Event Title & Meta */}
                            <div className="space-y-1">
                              <h3 className="font-vintage-heading font-bold text-base text-[#4A2410] group-hover:text-[#B8430A] transition-colors">
                                <Link href={`/events/${item.event_id}`}>
                                  {item.event_title}
                                </Link>
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 font-vintage-body text-xs text-[#5C4033]">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-3.5 h-3.5 text-[#B8430A]" />
                                  <span>{item.event_date}</span>
                                </span>
                                <span>•</span>
                                <span className="flex items-center space-x-1">
                                  <MapPin className="w-3.5 h-3.5 text-[#B8430A]" />
                                  <span>{item.city}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status Chips & Interactive Check-In Button */}
                          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                            {/* Step 5: Ink Stamp Style Badge for "CONFIRMED" */}
                            <span className="ink-stamp ink-stamp-confirmed text-xs">
                              {item.registration_status || 'CONFIRMED'}
                            </span>

                            <span
                              className={`px-3.5 py-1 rounded-full text-xs font-serif font-bold border shadow-xs ${
                                item.attendance_status === 'PRESENT'
                                  ? 'bg-[#5B7A2F]/15 text-[#3D5220] border-[#5B7A2F]/40'
                                  : 'bg-[#F5E6CE]/60 text-[#5C4033] border-[rgba(139,94,52,0.25)]'
                              }`}
                            >
                              {item.attendance_status === 'PRESENT' ? '✓ Registered' : 'Registered'}
                            </span>

                            {item.attendance_status !== 'PRESENT' && (
                              <MagneticButton
                                onClick={() => {
                                  setSelectedEventId(item.event_id);
                                  setCheckInModalOpen(true);
                                }}
                                className="group px-4 py-2 bg-gradient-to-r from-[#E8590C] to-[#B8430A] hover:from-[#F06A1D] hover:to-[#C74B0D] text-[#FFF8EB] text-xs font-serif font-bold rounded-lg shadow-md shadow-[rgba(184,67,10,0.25)] transition-all flex items-center space-x-1.5 cursor-pointer"
                              >
                                <QrCode className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                                <span>Check In</span>
                              </MagneticButton>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center text-xs font-vintage-body text-[#5C4033] bg-[#FFF9EE] rounded-xl border border-[rgba(139,94,52,0.25)]">
                    No registered campaigns yet. Browse active campaigns to participate!
                  </div>
                )}
              </AnimatedCard>
            </RevealOnScroll>

            {/* Decorative Fleuron Divider */}
            <VintageDivider ornament="❖" />

            {/* 5. CERTIFIED SKILLS TAXONOMY (UPGRADE 6) */}
            <RevealOnScroll yOffset={24}>
              <AnimatedCard variant="white" className="p-7 sm:p-9 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[rgba(139,94,52,0.2)]">
                  <div className="space-y-1">
                    <span className="text-[11px] font-serif font-bold uppercase tracking-[0.12em] text-[#B8430A] block">
                      Verified Capabilities
                    </span>
                    <h2 className="font-vintage-heading text-2xl font-bold text-[#4A2410] flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-[#B8430A]" />
                      <span>Certified Skills Taxonomy</span>
                    </h2>
                  </div>

                  <Link
                    href="/volunteer/profile"
                    className="text-xs font-serif font-bold text-[#B8430A] hover:text-[#E8590C] hover:translate-x-1 transition-all flex items-center space-x-1 group"
                  >
                    <span>Manage Profile & Skills</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <StaggerContainer
                  staggerDelay={0.08}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {(profile?.skills && profile.skills.length > 0 ? profile.skills : [
                    { id: '1', name: 'Beach & Water Body Cleanup', category: 'Environmental', proficiency_level: 'ADVANCED' },
                    { id: '2', name: 'Waste Segregation & Recycling', category: 'Environmental', proficiency_level: 'EXPERT' },
                    { id: '3', name: 'Tree Planting', category: 'Environmental', proficiency_level: 'INTERMEDIATE' },
                  ]).map((sk: any) => {
                    const level = (sk.proficiency_level || 'INTERMEDIATE').toUpperCase();
                    const meter = level === 'EXPERT' ? 3 : level === 'ADVANCED' ? 2 : 1;

                    return (
                      <StaggerItem key={sk.id}>
                        <motion.div
                          whileHover={{ y: -5, scale: 1.02 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="p-5 rounded-xl bg-[#FFF9EE]/90 border border-[rgba(139,94,52,0.25)] hover:border-[#E8590C] hover:shadow-md transition-all space-y-3 cursor-default group"
                        >
                          <div className="flex items-center justify-between">
                            {/* Peach/Sepia Circle Icon */}
                            <div className="w-10 h-10 rounded-lg bg-[#F5E6CE] text-[#B8430A] border border-[rgba(139,94,52,0.25)] flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                              <Sparkles className="w-5 h-5" />
                            </div>

                            {/* Level Badge */}
                            <span className="text-[10px] font-serif font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#F5E6CE]/60 text-[#B8430A] border border-[rgba(139,94,52,0.25)] shadow-2xs">
                              {level}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-vintage-heading font-bold text-sm text-[#4A2410] group-hover:text-[#B8430A] transition-colors">
                              {sk.name}
                            </h4>
                            <p className="font-vintage-body text-[11px] text-[#5C4033]">{sk.category}</p>
                          </div>

                          {/* Animated 3-step Skill Meter */}
                          <div className="pt-2 flex items-center space-x-1.5">
                            {[1, 2, 3].map((step) => (
                              <div
                                key={step}
                                className={`flex-1 h-1.5 rounded-full transition-colors ${
                                  step <= meter
                                    ? 'bg-gradient-to-r from-[#E8590C] to-[#B8430A]'
                                    : 'bg-[#EBD6B0]/70'
                                }`}
                              />
                            ))}
                          </div>
                        </motion.div>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              </AnimatedCard>
            </RevealOnScroll>
          </main>

          {/* 
            Step 5: The Footer
            Sits on a slightly darker parchment strip with a top border 1px solid rgba(139,94,52,0.35)
          */}
          <footer className="mt-16 w-full bg-[#EBD6B0]/85 backdrop-blur-md border-t border-[rgba(139,94,52,0.35)] py-8 relative z-10 text-[#5C4033] font-serif">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#E8590C]" />
                <span className="font-bold text-[#4A2410]">ImpactLink Civic Archival Platform</span>
                <span>•</span>
                <span>100% Free Public Civic Initiatives</span>
              </div>
              <div className="text-center sm:text-right text-[#7C5A48]">
                © 2026 ImpactLink Platform. Built for verified community impact, transparency, and accountability.
              </div>
            </div>
          </footer>

          {/* 6. MODAL: OFFICIAL CERTIFICATE OF SERVICE (Archival Parchment Treatment) */}
          <AnimatePresence>
            {certificateModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 print:p-0 print:bg-white">
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-[#FFFDF7] rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-10 space-y-6 shadow-2xl border-2 border-[rgba(139,94,52,0.4)] [outline:1px_solid_rgba(139,94,52,0.2)] [outline-offset:-6px] print:border-none print:shadow-none print:p-8"
                >
                  {/* Top Controls */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden border-b border-[rgba(139,94,52,0.2)] pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-serif font-bold text-[#4A2410] uppercase tracking-widest flex items-center space-x-1.5">
                        <Award className="w-4 h-4 text-[#B8430A]" />
                        <span>ImpactLink Verified Credential</span>
                      </span>
                      {activeCertificate?.ai_badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider bg-[#F5E6CE] text-[#4A2410] border border-[rgba(139,94,52,0.3)]">
                          ✨ {activeCertificate.ai_badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#E8590C] to-[#B8430A] hover:from-[#F06A1D] hover:to-[#C74B0D] text-[#FFF8EB] text-xs font-serif font-bold flex items-center space-x-1.5 shadow-md shadow-[rgba(184,67,10,0.25)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print / Save PDF</span>
                      </button>
                      <button
                        onClick={() => setCertificateModalOpen(false)}
                        className="p-1.5 text-[#5C4033] hover:text-[#4A2410] rounded-lg hover:bg-[#F5E6CE] transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Certificate Switcher */}
                  {myCertificates.length > 1 && (
                    <div className="print:hidden flex items-center space-x-2 overflow-x-auto pb-2">
                      <span className="text-[11px] font-serif font-bold text-[#7C5A48] uppercase tracking-wider flex-shrink-0">
                        Switch Credential:
                      </span>
                      {myCertificates.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setActiveCertificate(c)}
                          className={`px-3 py-1 rounded-lg text-xs font-serif font-semibold whitespace-nowrap transition-all ${
                            activeCertificate?.id === c.id
                              ? 'bg-gradient-to-r from-[#E8590C] to-[#B8430A] text-[#FFF8EB] shadow-xs'
                              : 'bg-[#F5E6CE] hover:bg-[#EBD6B0] text-[#4A2410]'
                          }`}
                        >
                          {c.event_title || c.certificate_number}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* The Archival Certificate Canvas */}
                  <div className="bg-[#FFF8EB] p-8 sm:p-12 rounded-xl border-2 border-[rgba(139,94,52,0.45)] [outline:1px_solid_rgba(139,94,52,0.25)] [outline-offset:-8px] text-center space-y-6 relative overflow-hidden shadow-inner">
                    <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
                      <Award className="w-40 h-40 text-[#B8430A]" />
                    </div>

                    <div className="space-y-1">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F5E6CE] border border-[rgba(139,94,52,0.3)] text-[#4A2410] text-[11px] font-serif font-extrabold uppercase tracking-widest mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#B8430A]" />
                        <span>Official Community Service Record</span>
                      </div>
                      <h2 className="font-vintage-heading text-2xl sm:text-3xl font-black text-[#4A2410] tracking-tight uppercase">
                        Certificate of Participation & Service
                      </h2>
                      <p className="font-vintage-body text-xs text-[#5C4033] italic">
                        This official credential verifies active participation, verified on-ground attendance, and civic impact.
                      </p>
                    </div>

                    <div className="py-2 space-y-1">
                      <span className="text-xs text-[#7C5A48] font-serif uppercase tracking-widest">Proudly Presented To</span>
                      <div className="font-vintage-heading text-2xl sm:text-3xl font-black text-[#4A2410] tracking-wide py-1">
                        {activeCertificate?.volunteer_name || volunteerName}
                      </div>
                      <div className="text-xs text-[#5C4033] font-mono">{volunteerEmail}</div>
                    </div>

                    <div className="font-vintage-body text-xs text-[#4A2410] leading-relaxed max-w-xl mx-auto space-y-1">
                      <p>
                        For verified attendance and dedicated community service during the civic initiative{' '}
                        <strong className="text-[#4A2410] font-bold">
                          &quot;{activeCertificate?.event_title || (allEvents[0]?.event_title || 'Civic Volunteer Campaign')}&quot;
                        </strong>.
                      </p>
                      <p>
                        Successfully dedicated{' '}
                        <strong className="text-[#B8430A] font-bold">
                          {activeCertificate?.hours_awarded || 4.0} Certified Hours
                        </strong>{' '}
                        of impactful civic engagement.
                      </p>
                    </div>

                    {activeCertificate?.ai_endorsement && (
                      <div className="p-4 bg-[#F5E6CE]/60 rounded-xl border border-[rgba(139,94,52,0.3)] max-w-lg mx-auto text-left space-y-1">
                        <div className="flex items-center space-x-1.5 text-xs font-serif font-bold text-[#4A2410]">
                          <Sparkles className="w-4 h-4 text-[#B8430A]" />
                          <span>Gemini AI Endorsement & Skill Assessment</span>
                        </div>
                        <p className="font-vintage-body text-xs text-[#5C4033] italic leading-relaxed">
                          &quot;{activeCertificate.ai_endorsement}&quot;
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-[rgba(139,94,52,0.25)] flex flex-col sm:flex-row justify-between items-center text-xs text-[#5C4033] gap-2 font-serif">
                      <div>
                        <span>Certificate ID: </span>
                        <span className="font-mono font-bold text-[#4A2410]">
                          {activeCertificate?.certificate_number || activeCertificate?.id || certId}
                        </span>
                      </div>
                      <div>
                        <span>Issued: {new Date(activeCertificate?.issued_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[#B8430A] font-bold">
                        <BadgeCheck className="w-4 h-4 text-[#B8430A]" />
                        <span>Gemini AI & Cryptographically Authenticated</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex justify-end space-x-3 pt-2 print:hidden font-serif">
                    <button
                      onClick={() => setCertificateModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-[rgba(139,94,52,0.3)] text-xs font-semibold text-[#4A2410] hover:bg-[#F5E6CE]/50"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#E8590C] to-[#B8430A] hover:from-[#F06A1D] hover:to-[#C74B0D] text-[#FFF8EB] text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-[rgba(184,67,10,0.25)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Certificate</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* 7. MODAL: ATTENDANCE CHECK-IN (SPECIAL CODE & QR TOKEN) */}
          <AnimatePresence>
            {checkInModalOpen && (
              <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-[#FFFDF7] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 border-2 border-[rgba(139,94,52,0.4)] [outline:1px_solid_rgba(139,94,52,0.2)] [outline-offset:-6px]"
                >
                  <div className="flex justify-between items-start pb-2 border-b border-[rgba(139,94,52,0.2)]">
                    <div className="space-y-1">
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#F5E6CE] text-[#4A2410] text-[10px] font-serif font-bold uppercase tracking-wider border border-[rgba(139,94,52,0.25)]">
                        <QrCode className="w-3.5 h-3.5 text-[#B8430A]" />
                        <span>Instant Attendance & Certificate</span>
                      </div>
                      <h3 className="font-vintage-heading font-black text-base text-[#4A2410]">
                        Enter Check-In Code or QR Token
                      </h3>
                    </div>
                    <button
                      onClick={() => setCheckInModalOpen(false)}
                      className="p-1.5 text-[#5C4033] hover:text-[#4A2410] rounded-lg hover:bg-[#F5E6CE] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="font-vintage-body text-xs text-[#5C4033] leading-relaxed">
                    Enter the <strong className="text-[#4A2410]">Special Check-In Code</strong> announced by the event organizer (e.g. <span className="font-mono bg-[#F5E6CE] px-1.5 py-0.5 rounded text-[#4A2410] font-bold">IMP-4829</span>) or paste the scanned QR token to confirm your attendance and instantly generate your Gemini AI certificate!
                  </p>

                  {checkInStatus && (
                    <div
                      className={`p-3 rounded-xl text-xs font-serif flex items-center space-x-2 ${
                        checkInStatus.success
                          ? 'bg-[#5B7A2F]/15 text-[#3D5220] border border-[#5B7A2F]/40'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {checkInStatus.success ? (
                        <CheckCircle2 className="w-4 h-4 text-[#5B7A2F] flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      )}
                      <span>{checkInStatus.msg}</span>
                    </div>
                  )}

                  <form onSubmit={handleQuickCheckIn} className="space-y-4 font-serif">
                    {(history?.events || []).length > 0 && (
                      <div>
                        <label className="block text-xs font-semibold text-[#4A2410] mb-1">Select Event (Optional)</label>
                        <select
                          value={selectedEventId}
                          onChange={e => setSelectedEventId(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-[rgba(139,94,52,0.3)] focus:outline-none focus:ring-2 focus:ring-[#E8590C] bg-[#FFF8EB] text-[#4A2410]"
                        >
                          <option value="">Auto-Detect from Code</option>
                          {(history?.events || []).map((e: any) => (
                            <option key={e.event_id} value={e.event_id}>
                              {e.event_title} ({e.event_date})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-[#4A2410] mb-1">
                        Special Check-In Code or QR Token
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. IMP-4829 or paste token"
                        value={tokenInput}
                        onChange={e => setTokenInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm font-mono tracking-wider font-semibold rounded-lg border border-[rgba(139,94,52,0.3)] focus:outline-none focus:ring-2 focus:ring-[#E8590C] uppercase placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-[#7C5A48] bg-[#FFF8EB] text-[#4A2410]"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setCheckInModalOpen(false)}
                        className="flex-1 py-2.5 rounded-lg text-xs font-semibold border border-[rgba(139,94,52,0.3)] text-[#4A2410] hover:bg-[#F5E6CE]/50 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={checkingInLoading || !tokenInput}
                        className="flex-2 py-2.5 px-4 rounded-lg text-xs font-bold bg-gradient-to-r from-[#E8590C] to-[#B8430A] hover:from-[#F06A1D] hover:to-[#C74B0D] disabled:opacity-50 text-[#FFF8EB] shadow-md shadow-[rgba(184,67,10,0.25)] transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        {checkingInLoading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Generating Gemini AI Certificate...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-[#FFF8EB]" />
                            <span>Check In & Get Certificate</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </SmoothScroll>
    </ProtectedRoute>
  );
}
