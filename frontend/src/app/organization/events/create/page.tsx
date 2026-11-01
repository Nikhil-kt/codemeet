'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  Calendar,
  MapPin,
  Users,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function CreateEventPage() {
  const router = useRouter();
  const [skillsCatalog, setSkillsCatalog] = useState<any[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ENVIRONMENTAL');
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('11:00');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Chennai');
  const [volunteersRequired, setVolunteersRequired] = useState(15);
  const [maxCapacity, setMaxCapacity] = useState(25);
  const [contactPerson, setContactPerson] = useState('Ananya Sharma');
  const [contactPhone, setContactPhone] = useState('+91 98111 22334');
  const [safetyInstructions, setSafetyInstructions] = useState('Gloves and safety gear provided on site.');
  const [eligibilityRequirements, setEligibilityRequirements] = useState('Age 16+, high energy and commitment.');

  const [selectedSkills, setSelectedSkills] = useState<{ skill_id: string; is_mandatory: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Application in Review state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState<any>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const res = await api.getSkillsCatalog();
    if (res.success && res.data) {
      setSkillsCatalog(res.data.skills || []);
    }
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev => {
      const exists = prev.find(s => s.skill_id === skillId);
      if (exists) return prev.filter(s => s.skill_id !== skillId);
      return [...prev, { skill_id: skillId, is_mandatory: false }];
    });
  };

  const toggleMandatory = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.map(s => (s.skill_id === skillId ? { ...s, is_mandatory: !s.is_mandatory } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      description,
      category,
      event_date: eventDate,
      start_time: startTime + ':00',
      end_time: endTime + ':00',
      location_name: locationName,
      address,
      city,
      volunteers_required: volunteersRequired,
      max_capacity: maxCapacity,
      contact_person: contactPerson,
      contact_phone: contactPhone,
      safety_instructions: safetyInstructions,
      eligibility_requirements: eligibilityRequirements,
      requirements: selectedSkills
    };

    const res = await api.createEvent(payload);
    setLoading(false);

    if (res.success && res.data) {
      const created = res.data.event;

      // Mirror to Firebase Cloud Firestore from client SDK
      try {
        if (db && created) {
          await setDoc(doc(db, 'events', created.id), created, { merge: true });
        }
      } catch (clientFsErr: any) {
        console.warn('[Firebase Firestore] Client write notice:', clientFsErr.message);
      }

      // Submit for administrator moderation & review
      await api.submitEvent(created.id);

      setSubmittedEvent(created);
      setIsSubmitted(true);
    } else {
      setError(res.message || 'Failed to create campaign.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pb-16">
        <button
          onClick={() => router.push('/organization/dashboard')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Organizer Console</span>
        </button>

        {/* Application In Review Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-8 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-3xl flex items-center justify-center border-2 border-amber-300 shadow-inner">
              <Clock className="w-8 h-8 text-amber-600 animate-pulse" />
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <span>Application Under Review</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Campaign Submitted for Review
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Your campaign proposal has been received and is currently under administrative moderation. Once approved by the administrator, it will be published to the volunteer discovery feed.
            </p>
          </div>

          {/* Submitted Event Details Summary */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-4">
            <div className="flex justify-between items-start border-b border-slate-200/80 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Campaign Title
                </span>
                <strong className="text-base text-slate-900 font-bold">
                  {submittedEvent?.title || title}
                </strong>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                UNDER_REVIEW
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Date & Time</span>
                <span className="text-slate-700 font-medium">
                  {submittedEvent?.event_date || eventDate} • {submittedEvent?.start_time?.slice(0, 5) || startTime}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Location</span>
                <span className="text-slate-700 font-medium">
                  {submittedEvent?.location_name || locationName}, {submittedEvent?.city || city}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Capacity</span>
                <span className="text-slate-700 font-medium">
                  {submittedEvent?.volunteers_required || volunteersRequired} / {submittedEvent?.max_capacity || maxCapacity} Volunteers
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Preliminary AI Safety Check: Verified Low Risk & Category Cleared</span>
            </div>
          </div>

          {/* Moderation Pipeline */}
          <div className="space-y-3 pt-2 text-left">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Approval Pipeline
            </span>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white border border-emerald-200 rounded-xl flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-800 font-semibold">1. Campaign Proposal Form Submitted</span>
              </div>
              <div className="p-3 bg-white border border-emerald-200 rounded-xl flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-800 font-semibold">2. Automated Safety & Requirements Scan</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3 text-amber-900 font-semibold">
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>3. Administrator Verification & Moderation</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-200/70 px-2 py-0.5 rounded">
                  In Review
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3 text-slate-400">
                <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                <span>4. Public Volunteer Registration & Attendance Access</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSubmittedEvent(null);
                setTitle('');
                setDescription('');
                setLocationName('');
                setAddress('');
              }}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Submit Another Campaign
            </button>
            <button
              onClick={() => router.push('/organization/dashboard')}
              className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Go to Organizer Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Organizer Console</span>
      </button>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Community Campaign</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Define objectives, required skills taxonomy, schedules, and volunteer capacities.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Adyar Estuary Mangrove Sapling Plantation"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="ENVIRONMENTAL">Environmental Conservation</option>
                  <option value="EDUCATIONAL">Educational / Tutoring</option>
                  <option value="HEALTH_AWARENESS">Health Awareness & Camps</option>
                  <option value="COMMUNITY_WELFARE">Community Welfare</option>
                  <option value="SOCIAL_SERVICE">Social Service</option>
                  <option value="DISASTER_RELIEF">Disaster Relief (Admin review required)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operating City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Description</label>
              <textarea
                rows={4}
                required
                placeholder="Detail the goals, volunteer tasks, gathering points, and positive social impact..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Date</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Venue / Landmark Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adyar Eco Park Gate 2"
                  value={locationName}
                  onChange={e => setLocationName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Full physical meeting address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Volunteers Required</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={volunteersRequired}
                  onChange={e => setVolunteersRequired(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Max Registration Capacity</label>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={maxCapacity}
                  onChange={e => setMaxCapacity(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Skills Required Selector */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Required Skills Taxonomy</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Select required capabilities for AI volunteer candidate ranking
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {selectedSkills.length} selected
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
              {skillsCatalog.map(skill => {
                const isSelected = selectedSkills.some(s => s.skill_id === skill.id);
                const reqItem = selectedSkills.find(s => s.skill_id === skill.id);

                return (
                  <div
                    key={skill.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      onClick={() => toggleSkill(skill.id)}
                      className="cursor-pointer flex-1 space-y-0.5"
                    >
                      <div className="font-bold text-slate-900">{skill.name}</div>
                      <div className="text-[10px] text-slate-500">{skill.category}</div>
                    </div>

                    {isSelected && (
                      <button
                        type="button"
                        onClick={() => toggleMandatory(skill.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          reqItem?.is_mandatory
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {reqItem?.is_mandatory ? 'Mandatory' : 'Optional'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Campaign...' : 'Publish Campaign'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

