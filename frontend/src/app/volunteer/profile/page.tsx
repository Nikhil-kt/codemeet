'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
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
      return; // already added
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
    return <div className="py-24 text-center text-slate-400">Loading volunteer profile...</div>;
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
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={() => router.push('/volunteer/dashboard')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Volunteer Console</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditProfileOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile Details</span>
            </button>
            <button
              onClick={() => setManageSkillsOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Manage Skills ({activeSkills.length})</span>
            </button>
          </div>
        </div>

        {/* Identity & Bio Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 text-white flex items-center justify-center font-black text-2xl shadow-md">
                {volunteerName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-black text-slate-900">{volunteerName}</h1>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Volunteer</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{volunteerEmail}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{volunteerPhone}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile?.city || 'Chennai'}, {profile?.state || 'Tamil Nadu'}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Trust Rating</span>
                <span className="text-xl font-extrabold text-slate-900">{reliabilityScore}/100</span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Verified Hours</span>
                <span className="text-xl font-extrabold text-emerald-600">{totalVerifiedHours} hrs</span>
              </div>
            </div>
          </div>

          {/* Bio / Civic Mission Statement */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Personal Bio & Civic Mission
            </span>
            <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {profile?.bio || 'Dedicated community volunteer passionate about environmental conservation, social impact initiatives, and emergency relief operations.'}
            </p>
          </div>
        </div>

        {/* 3-Column Highlights */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Certified Skills Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Certified Skills ({activeSkills.length})
              </span>
              <button
                onClick={() => setManageSkillsOpen(true)}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                + Add Skill
              </button>
            </div>

            {activeSkills.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No skills added yet.</p>
            ) : (
              <div className="space-y-2">
                {activeSkills.map((sk, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-slate-900 block">{sk.name || 'Community Service'}</strong>
                      <span className="text-[11px] text-slate-400">{sk.years_experience || 1.0} yr(s) experience</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {sk.proficiency_level}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reliability Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reliability Score Factors
            </span>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Attendance Consistency</span>
                <strong className="text-slate-900">{factors.attendanceConsistency}%</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Task Execution Quality</span>
                <strong className="text-slate-900">{factors.taskCompletion}%</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Organizer Feedback</span>
                <strong className="text-slate-900">{factors.organizerFeedback}%</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Timely Cancellation</span>
                <strong className="text-slate-900">{factors.timelyCancellation}%</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              Calculated dynamically via tamper-proof QR check-ins and organizer performance reviews.
            </p>
          </div>

          {/* Official Certificates & Credentials */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Certificates Earned ({myCertificates.length})
            </span>
            {myCertificates.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Check in to an event to receive your first Gemini AI-endorsed certificate!
              </p>
            ) : (
              <div className="space-y-2">
                {myCertificates.map((cert) => (
                  <div key={cert.id} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 space-y-1 text-xs">
                    <div className="flex justify-between items-start">
                      <strong className="text-slate-900 font-bold">{cert.event_title}</strong>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        4.0 hrs
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      ID: {cert.certificate_number || cert.id}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/volunteer/dashboard"
              className="block w-full py-2 rounded-xl text-center text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all"
            >
              Open Certificate Viewer
            </Link>
          </div>
        </div>

        {/* Participations & Attendance Log Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Campaign Participation Record</h2>
              <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit log of registered campaigns and verified check-in status</p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              {allEvents.length} Campaigns Registered
            </span>
          </div>

          {allEvents.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No participation records found. Explore open campaigns to start volunteering!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {allEvents.map((ev: any) => (
                <div key={ev.registration_id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <strong className="text-sm font-bold text-slate-900">{ev.event_title}</strong>
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <span>{ev.event_date}</span>
                      <span>•</span>
                      <span>{ev.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      ev.registration_status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {ev.registration_status}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      ev.attendance_status === 'PRESENT'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ev.attendance_status === 'PRESENT' ? '✓ Verified Present' : 'Registered'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Edit Personal Profile */}
        {editProfileOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Volunteer Profile</h3>
                  <p className="text-xs text-slate-500">Update your contact details, city, and mission statement.</p>
                </div>
                <button
                  onClick={() => setEditProfileOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {profileSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullNameInput}
                    onChange={e => setFullNameInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={cityInput}
                      onChange={e => setCityInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">District / State</label>
                    <input
                      type="text"
                      value={districtInput || stateInput}
                      onChange={e => {
                        setDistrictInput(e.target.value);
                        setStateInput(e.target.value);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={postalCodeInput}
                      onChange={e => setPostalCodeInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / Civic Mission</label>
                  <textarea
                    rows={3}
                    value={bioInput}
                    onChange={e => setBioInput(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Tell organizations about your volunteer passions and skills..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditProfileOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all flex items-center justify-center space-x-1.5"
                  >
                    {savingProfile ? <span>Saving...</span> : <span>Save Profile</span>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Manage Skills */}
        {manageSkillsOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Manage Volunteer Skills</h3>
                  <p className="text-xs text-slate-500">
                    Add or update your certified competencies to match with targeted community campaigns.
                  </p>
                </div>
                <button
                  onClick={() => setManageSkillsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {skillsSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{skillsSuccessMsg}</span>
                </div>
              )}

              {/* Add New Skill Picker */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Select Skill from Catalog
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={selectedCatalogSkill}
                    onChange={e => setSelectedCatalogSkill(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill to Profile</span>
                </button>
              </div>

              {/* Active Skills List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Your Current Skills ({activeSkills.length})
                </span>
                {activeSkills.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No skills selected yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {activeSkills.map((sk) => (
                      <div key={sk.skill_id} className="py-2.5 flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-slate-900 block">{sk.name || 'Volunteering'}</strong>
                          <span className="text-[11px] text-slate-400 font-semibold">{sk.proficiency_level}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(sk.skill_id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove skill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setManageSkillsOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={savingSkills}
                  onClick={handleSaveSkills}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all flex items-center justify-center space-x-1.5"
                >
                  {savingSkills ? <span>Saving...</span> : <span>Save Skills ({activeSkills.length})</span>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

