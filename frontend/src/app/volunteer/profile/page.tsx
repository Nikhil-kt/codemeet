'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/motion/ProgressBar';
import CountUp from '@/components/motion/CountUp';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Award,
  ShieldCheck,
  Clock,
  Calendar,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

export default function VolunteerProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [skillsCatalog, setSkillsCatalog] = useState<any[]>([]);
  const [myCertificates, setMyCertificates] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit Personal Profile Modal
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [fullNameInput, setFullNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [districtInput, setDistrictInput] = useState('');
  const [stateInput, setStateInput] = useState('');
  const [postalCodeInput, setPostalCodeInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Manage Skills Modal
  const [manageSkillsOpen, setManageSkillsOpen] = useState(false);
  const [activeSkills, setActiveSkills] = useState<{ skill_id: string; proficiency_level: string; years_experience: number; name?: string }[]>([]);
  const [selectedCatalogSkill, setSelectedCatalogSkill] = useState('');
  const [selectedProficiency, setSelectedProficiency] = useState('INTERMEDIATE');
  const [savingSkills, setSavingSkills] = useState(false);
  const [skillsSuccessMsg, setSkillsSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('impactlink_user') : null;
    if (raw) {
      try {
        setCurrentUser(JSON.parse(raw));
      } catch (e) {}
    }
    loadData();
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

    if (pRes.success && pRes.data) {
      const vol = pRes.data.volunteer;
      setProfile(vol);
      setFullNameInput(vol.full_name || '');
      setPhoneInput(vol.phone || '');
      setBioInput(vol.bio || '');
      setCityInput(vol.city || '');
      setDistrictInput(vol.district || '');
      setStateInput(vol.state || '');
      setPostalCodeInput(vol.postal_code || '');

      // Initialize active skills
      const initialSkills = (vol.skills || []).map((s: any) => ({
        skill_id: s.skill_id || s.id,
        proficiency_level: s.proficiency_level || 'INTERMEDIATE',
        years_experience: s.years_experience || 1.0,
        name: s.name
      }));
      setActiveSkills(initialSkills);
    }

    if (hRes.success && hRes.data) setHistory(hRes.data);
    if (sRes.success && sRes.data) {
      const catalog = sRes.data.skills || [];
      setSkillsCatalog(catalog);
      if (catalog.length > 0) setSelectedCatalogSkill(catalog[0].id);
    }
    if (cRes.success && cRes.data) setMyCertificates(cRes.data.certificates || []);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccessMsg(null);

    const res = await api.updateVolunteerProfile({
      full_name: fullNameInput.trim(),
      phone: phoneInput.trim(),
      bio: bioInput.trim(),
      city: cityInput.trim(),
      district: districtInput.trim(),
      state: stateInput.trim(),
      postal_code: postalCodeInput.trim()
    });

    setSavingProfile(false);

    if (res.success) {
      setProfileSuccessMsg('Profile information updated successfully!');
      if (currentUser) {
        const updatedUser = { ...currentUser, full_name: fullNameInput.trim(), phone: phoneInput.trim() };
        localStorage.setItem('impactlink_user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }
      await loadData();
      setTimeout(() => {
        setEditProfileOpen(false);
        setProfileSuccessMsg(null);
      }, 1000);
    }
  };

  const handleAddSkill = () => {
    if (!selectedCatalogSkill) return;
    const catalogItem = skillsCatalog.find(s => s.id === selectedCatalogSkill);
    if (!catalogItem) return;

    if (activeSkills.some(s => s.skill_id === selectedCatalogSkill)) {
      return;
    }

    setActiveSkills(prev => [
      ...prev,
      {
        skill_id: catalogItem.id,
        proficiency_level: selectedProficiency,
        years_experience: 1.0,
        name: catalogItem.name
      }
    ]);
  };

  const handleRemoveSkill = (skillId: string) => {
    setActiveSkills(prev => prev.filter(s => s.skill_id !== skillId));
  };

  const handleSaveSkills = async () => {
    setSavingSkills(true);
    setSkillsSuccessMsg(null);

    const res = await api.updateSkills(activeSkills);
    setSavingSkills(false);

    if (res.success) {
      setSkillsSuccessMsg('Skills taxonomy saved successfully!');
      await loadData();
      setTimeout(() => {
        setManageSkillsOpen(false);
        setSkillsSuccessMsg(null);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-[#FF6B1A] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#6B5B53] font-semibold text-sm">Loading volunteer profile...</p>
      </div>
    );
  }

  const volunteerName = currentUser?.full_name || profile?.full_name || 'Community Volunteer';
  const volunteerEmail = currentUser?.email || profile?.email || '';
  const volunteerPhone = currentUser?.phone || profile?.phone || 'Not specified';
  const reliabilityScore = profile?.reliability_score || 75.0;
  const factors = profile?.reliability_factors || {
    attendanceConsistency: 90,
    taskCompletion: 85,
    organizerFeedback: 85,
    timelyCancellation: 90
  };

  const allEvents = history?.events || [];
  const attendedEvents = allEvents.filter((item: any) => item.attendance_status === 'PRESENT');
  const totalVerifiedHours = history?.total_hours || (attendedEvents.length * 4.0);

  return (
    <ProtectedRoute allowedRoles={['VOLUNTEER', 'TEAM_LEADER', 'ADMIN']}>
      <div className="min-h-screen bg-[#FFF4E8] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8 pb-16">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => router.push('/volunteer/dashboard')}
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#6B5B53] hover:text-[#FF6B1A] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Volunteer Console</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setEditProfileOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-white hover:bg-[#FFF4E8] text-[#7A2E0E] text-xs font-bold flex items-center space-x-2 border border-[#FF6B1A]/20 shadow-xs transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-[#FF6B1A]" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => setManageSkillsOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-[#FF6B1A] hover:bg-[#E8590C] hover:scale-105 active:scale-95 text-white text-xs font-bold flex items-center space-x-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Manage Skills ({activeSkills.length})</span>
              </button>
            </div>
          </div>

          {/* Identity & Bio Card */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#FF6B1A]/15 shadow-[0_4px_24px_rgba(255,107,26,0.08)] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#FF6B1A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-[#FF6B1A]/10">
              <div className="flex items-center space-x-5">
                <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-[#FF6B1A] to-[#FF9A4D] text-white flex items-center justify-center font-heading font-black text-3xl shadow-lg shadow-orange-500/25 flex-shrink-0">
                  {volunteerName.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2.5">
                    <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#7A2E0E]">{volunteerName}</h1>
                    <Badge variant="orange" size="sm">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                      <span>Verified Volunteer</span>
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#6B5B53]">
                    <span className="flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#FF6B1A]" />
                      <span>{volunteerEmail}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#FF6B1A]" />
                      <span>{volunteerPhone}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B1A]" />
                      <span>{profile?.city || 'Chennai'}, {profile?.state || 'Tamil Nadu'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-[#FFF4E8] px-6 py-3.5 rounded-2xl border border-[#FF6B1A]/15">
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5B53] block">Trust Rating</span>
                  <span className="text-2xl font-heading font-black text-[#FF6B1A]">
                    <CountUp end={Math.round(reliabilityScore)} />/100
                  </span>
                </div>
                <div className="w-px h-10 bg-[#FF6B1A]/20"></div>
                <div className="text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5B53] block">Verified Hours</span>
                  <span className="text-2xl font-heading font-black text-[#7A2E0E]">
                    <CountUp end={totalVerifiedHours} /> hrs
                  </span>
                </div>
              </div>
            </div>

            {/* Bio / Civic Mission */}
            <div className="relative z-10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">
                Personal Bio & Civic Mission
              </span>
              <p className="text-xs sm:text-sm text-[#7A2E0E] leading-relaxed font-medium bg-[#FFF4E8]/60 p-5 rounded-2xl border border-[#FF6B1A]/15">
                {profile?.bio || 'Dedicated community volunteer passionate about environmental conservation, social impact initiatives, and emergency relief operations.'}
              </p>
            </div>
          </div>

          {/* 3-Column Highlights */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Certified Skills */}
            <div className="bg-white p-7 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">
                  Certified Skills ({activeSkills.length})
                </span>
                <button
                  onClick={() => setManageSkillsOpen(true)}
                  className="text-xs font-bold text-[#FF6B1A] hover:underline cursor-pointer"
                >
                  + Add Skill
                </button>
              </div>

              {activeSkills.length === 0 ? (
                <p className="text-xs text-[#6B5B53] py-4 text-center">No skills added yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {activeSkills.map((sk, idx) => (
                    <div key={idx} className="p-3.5 bg-[#FFF4E8] rounded-2xl border border-[#FF6B1A]/15 flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-[#7A2E0E] block font-heading font-bold">{sk.name || 'Community Service'}</strong>
                        <span className="text-[11px] text-[#6B5B53]">{sk.years_experience || 1.0} yr(s) experience</span>
                      </div>
                      <Badge variant="orange" size="sm">{sk.proficiency_level}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reliability Breakdown */}
            <div className="bg-white p-7 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">
                Reliability Score Factors
              </span>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[#7A2E0E] font-semibold mb-1">
                    <span>Attendance Consistency</span>
                    <strong className="text-[#FF6B1A]">{factors.attendanceConsistency}%</strong>
                  </div>
                  <ProgressBar value={factors.attendanceConsistency} variant="orange" />
                </div>
                <div>
                  <div className="flex justify-between text-[#7A2E0E] font-semibold mb-1">
                    <span>Task Execution Quality</span>
                    <strong className="text-[#FF6B1A]">{factors.taskCompletion}%</strong>
                  </div>
                  <ProgressBar value={factors.taskCompletion} variant="orange" />
                </div>
                <div>
                  <div className="flex justify-between text-[#7A2E0E] font-semibold mb-1">
                    <span>Organizer Feedback</span>
                    <strong className="text-[#FF6B1A]">{factors.organizerFeedback}%</strong>
                  </div>
                  <ProgressBar value={factors.organizerFeedback} variant="orange" />
                </div>
                <div>
                  <div className="flex justify-between text-[#7A2E0E] font-semibold mb-1">
                    <span>Timely Cancellation</span>
                    <strong className="text-[#FF6B1A]">{factors.timelyCancellation}%</strong>
                  </div>
                  <ProgressBar value={factors.timelyCancellation} variant="peach" />
                </div>
              </div>
              <p className="text-[11px] text-[#6B5B53] pt-2 border-t border-[#FF6B1A]/10">
                Calculated dynamically via tamper-proof QR check-ins and organizer reviews.
              </p>
            </div>

            {/* Certificates Earned */}
            <div className="bg-white p-7 rounded-[28px] border border-[#FF6B1A]/15 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B5B53]">
                  Certificates Earned ({myCertificates.length})
                </span>
                {myCertificates.length === 0 ? (
                  <p className="text-xs text-[#6B5B53] py-4 text-center">
                    Check in to an event to receive your first Gemini AI-endorsed certificate!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {myCertificates.map((cert) => (
                      <div key={cert.id} className="p-3 bg-[#FFF4E8] rounded-2xl border border-[#FF6B1A]/15 space-y-1 text-xs">
                        <div className="flex justify-between items-start">
                          <strong className="text-[#7A2E0E] font-bold">{cert.event_title}</strong>
                          <span className="text-[10px] font-bold text-[#FF6B1A] bg-[#FFE3CC] px-2 py-0.5 rounded-full">
                            4.0 hrs
                          </span>
                        </div>
                        <div className="text-[10px] text-[#6B5B53] font-mono">
                          ID: {cert.certificate_number || cert.id}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/volunteer/dashboard"
                className="block w-full py-3 rounded-2xl text-center text-xs font-bold bg-[#FF6B1A] text-white hover:bg-[#E8590C] shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                Open Certificate Viewer
              </Link>
            </div>
          </div>

          {/* Participations & Attendance Log Table */}
          <div className="bg-white rounded-[32px] border border-[#FF6B1A]/15 shadow-sm overflow-hidden">
            <div className="p-7 sm:p-8 border-b border-[#FF6B1A]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-[#7A2E0E]">Campaign Participation Record</h2>
                <p className="text-xs text-[#6B5B53] mt-1 font-medium">Comprehensive audit log of registered campaigns and verified check-in status</p>
              </div>
              <Badge variant="peach" size="md">
                {allEvents.length} Campaigns Registered
              </Badge>
            </div>

            {allEvents.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#6B5B53]">
                No participation records found. Explore open campaigns to start volunteering!
              </div>
            ) : (
              <div className="divide-y divide-[#FF6B1A]/10">
                {allEvents.map((ev: any) => (
                  <div key={ev.registration_id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[#FFF4E8]/50 transition-colors">
                    <div className="space-y-1">
                      <strong className="text-base font-heading font-bold text-[#7A2E0E]">{ev.event_title}</strong>
                      <div className="flex items-center space-x-3 text-xs text-[#6B5B53]">
                        <span>{ev.event_date}</span>
                        <span>•</span>
                        <span>{ev.city}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge variant={ev.registration_status === 'CONFIRMED' ? 'success' : 'peach'} size="sm">
                        {ev.registration_status}
                      </Badge>
                      <Badge variant={ev.attendance_status === 'PRESENT' ? 'orange' : 'peach'} size="sm">
                        {ev.attendance_status === 'PRESENT' ? '✓ Verified Present' : 'Registered'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal: Edit Personal Profile */}
          <AnimatePresence>
            {editProfileOpen && (
              <div className="fixed inset-0 z-50 bg-[#7A2E0E]/50 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[32px] max-w-lg w-full p-8 space-y-6 shadow-2xl border border-[#FF6B1A]/20"
                >
                  <div className="flex justify-between items-start border-b border-[#FF6B1A]/10 pb-4">
                    <div>
                      <h3 className="text-xl font-heading font-extrabold text-[#7A2E0E]">Edit Volunteer Profile</h3>
                      <p className="text-xs text-[#6B5B53]">Update your contact details, city, and mission statement.</p>
                    </div>
                    <button
                      onClick={() => setEditProfileOpen(false)}
                      className="w-8 h-8 rounded-full bg-[#FFF4E8] text-[#6B5B53] hover:text-[#7A2E0E] flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {profileSuccessMsg && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{profileSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullNameInput}
                        onChange={e => setFullNameInput(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 text-[#7A2E0E] focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">Phone Number</label>
                        <input
                          type="text"
                          value={phoneInput}
                          onChange={e => setPhoneInput(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 text-[#7A2E0E] focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">City</label>
                        <input
                          type="text"
                          value={cityInput}
                          onChange={e => setCityInput(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 text-[#7A2E0E] focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">District / State</label>
                        <input
                          type="text"
                          value={districtInput || stateInput}
                          onChange={e => {
                            setDistrictInput(e.target.value);
                            setStateInput(e.target.value);
                          }}
                          className="w-full px-4 py-2.5 text-xs rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 text-[#7A2E0E] focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">Postal Code</label>
                        <input
                          type="text"
                          value={postalCodeInput}
                          onChange={e => setPostalCodeInput(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 text-[#7A2E0E] focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">Bio / Civic Mission</label>
                      <textarea
                        rows={3}
                        value={bioInput}
                        onChange={e => setBioInput(e.target.value)}
                        className="w-full p-3.5 text-xs rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 text-[#7A2E0E] focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]"
                        placeholder="Tell organizations about your volunteer passions and skills..."
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditProfileOpen(false)}
                        className="flex-1 py-3 rounded-2xl border border-[#FF6B1A]/20 text-xs font-bold text-[#7A2E0E] hover:bg-[#FFF4E8] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="flex-1 py-3 rounded-2xl bg-[#FF6B1A] hover:bg-[#E8590C] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                      >
                        {savingProfile ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Modal: Manage Skills */}
          <AnimatePresence>
            {manageSkillsOpen && (
              <div className="fixed inset-0 z-50 bg-[#7A2E0E]/50 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[32px] max-w-lg w-full p-8 space-y-6 shadow-2xl border border-[#FF6B1A]/20 max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-start border-b border-[#FF6B1A]/10 pb-4">
                    <div>
                      <h3 className="text-xl font-heading font-extrabold text-[#7A2E0E]">Manage Volunteer Skills</h3>
                      <p className="text-xs text-[#6B5B53]">
                        Add or update your certified competencies to match with community campaigns.
                      </p>
                    </div>
                    <button
                      onClick={() => setManageSkillsOpen(false)}
                      className="w-8 h-8 rounded-full bg-[#FFF4E8] text-[#6B5B53] hover:text-[#7A2E0E] flex items-center justify-center cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {skillsSuccessMsg && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{skillsSuccessMsg}</span>
                    </div>
                  )}

                  {/* Add New Skill Picker */}
                  <div className="p-5 bg-[#FFF4E8] rounded-2xl border border-[#FF6B1A]/15 space-y-3">
                    <span className="text-xs font-bold text-[#7A2E0E] uppercase tracking-wider block">
                      Select Skill from Catalog
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={selectedCatalogSkill}
                        onChange={e => setSelectedCatalogSkill(e.target.value)}
                        className="px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-[#FF6B1A]/20 bg-white text-[#7A2E0E] focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]"
                      >
                        {skillsCatalog.map(sk => (
                          <option key={sk.id} value={sk.id}>
                            {sk.name} ({sk.category})
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedProficiency}
                        onChange={e => setSelectedProficiency(e.target.value)}
                        className="px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-[#FF6B1A]/20 bg-white text-[#7A2E0E] focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]"
                      >
                        <option value="BEGINNER">BEGINNER</option>
                        <option value="INTERMEDIATE">INTERMEDIATE</option>
                        <option value="ADVANCED">ADVANCED</option>
                        <option value="EXPERT">EXPERT</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="w-full py-2.5 bg-[#FF6B1A] hover:bg-[#E8590C] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-orange-500/20 cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Skill to Profile</span>
                    </button>
                  </div>

                  {/* Active Skills List */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#7A2E0E] uppercase tracking-wider block">
                      Your Current Skills ({activeSkills.length})
                    </span>
                    {activeSkills.length === 0 ? (
                      <p className="text-xs text-[#6B5B53] py-3 text-center">No skills selected yet.</p>
                    ) : (
                      <div className="divide-y divide-[#FF6B1A]/10 max-h-48 overflow-y-auto">
                        {activeSkills.map((sk) => (
                          <div key={sk.skill_id} className="py-2.5 flex justify-between items-center text-xs">
                            <div>
                              <strong className="text-[#7A2E0E] block font-heading font-bold">{sk.name || 'Volunteering'}</strong>
                              <span className="text-[11px] text-[#6B5B53] font-semibold">{sk.proficiency_level}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(sk.skill_id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Remove skill"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2 border-t border-[#FF6B1A]/10">
                    <button
                      type="button"
                      onClick={() => setManageSkillsOpen(false)}
                      className="flex-1 py-3 rounded-2xl border border-[#FF6B1A]/20 text-xs font-bold text-[#7A2E0E] hover:bg-[#FFF4E8] cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      disabled={savingSkills}
                      onClick={handleSaveSkills}
                      className="flex-1 py-3 rounded-2xl bg-[#FF6B1A] hover:bg-[#E8590C] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                    >
                      {savingSkills ? 'Saving...' : `Save Skills (${activeSkills.length})`}
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
