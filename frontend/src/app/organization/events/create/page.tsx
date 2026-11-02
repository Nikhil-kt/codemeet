'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
import Badge from '@/components/ui/Badge';

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

      // Redirect directly to organization dashboard
      router.push('/organization/dashboard');
    } else {
      setError(res.message || 'Failed to create campaign.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E8] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#6B5B53] hover:text-[#FF6B1A] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Organizer Console</span>
        </button>

        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-[#FF6B1A]/15 shadow-[0_4px_24px_rgba(255,107,26,0.08)] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#FF6B1A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="relative z-10 space-y-2 border-b border-[#FF6B1A]/10 pb-6">
            <Badge variant="orange" size="sm">Campaign Discovery & Operations</Badge>
            <h1 className="text-3xl font-heading font-black text-[#7A2E0E]">
              Create New Community Campaign
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5B53] font-medium">
              Define initiative goals, schedule, requirements, and capacity. Campaigns are automatically published upon approval.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 font-bold text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#7A2E0E] mb-2">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marina Beach Mega Coastal Cleanup & Segregation Drive"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] placeholder-[#6B5B53]/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-2">Campaign Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all cursor-pointer"
                  >
                    <option value="ENVIRONMENTAL">Environmental Conservation</option>
                    <option value="EDUCATIONAL">Educational / Tutoring</option>
                    <option value="HEALTH_AWARENESS">Health Awareness & Camps</option>
                    <option value="COMMUNITY_WELFARE">Community Welfare</option>
                    <option value="SOCIAL_SERVICE">Social Service</option>
                    <option value="DISASTER_RELIEF">Disaster Relief</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-2">Operating City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A2E0E] mb-2">Campaign Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the goals, volunteer tasks, gathering points, and positive community impact..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] placeholder-[#6B5B53]/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-2">Event Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-2">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-2">End Time</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-2">Venue / Landmark Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marina Beach Light House Gate"
                    value={locationName}
                    onChange={e => setLocationName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] placeholder-[#6B5B53]/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-2">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Full physical meeting address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] placeholder-[#6B5B53]/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-2">Target Volunteers Needed</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={volunteersRequired}
                    onChange={e => setVolunteersRequired(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-2">Max Registration Slot Limit</label>
                  <input
                    type="number"
                    min={1}
                    max={300}
                    value={maxCapacity}
                    onChange={e => setMaxCapacity(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-2">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-2">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF4E8]/60 border border-[#FF6B1A]/20 hover:border-[#FF6B1A] text-[#7A2E0E] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Skills Taxonomy Picker */}
            <div className="space-y-4 pt-6 border-t border-[#FF6B1A]/10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-heading font-bold text-[#7A2E0E] flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#FF6B1A]" />
                    <span>Required Skills Taxonomy</span>
                  </h3>
                  <p className="text-xs text-[#6B5B53] font-medium">
                    Select required capabilities for AI volunteer candidate ranking
                  </p>
                </div>
                <Badge variant="orange" size="sm">
                  {selectedSkills.length} selected
                </Badge>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                {skillsCatalog.map(skill => {
                  const isSelected = selectedSkills.some(s => s.skill_id === skill.id);
                  const reqItem = selectedSkills.find(s => s.skill_id === skill.id);

                  return (
                    <div
                      key={skill.id}
                      className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#FF6B1A] bg-[#FFE3CC] text-[#7A2E0E] shadow-xs'
                          : 'border-[#FF6B1A]/15 bg-white hover:border-[#FF6B1A]/50 text-[#6B5B53]'
                      }`}
                    >
                      <div
                        onClick={() => toggleSkill(skill.id)}
                        className="cursor-pointer flex-1 space-y-0.5"
                      >
                        <div className="font-heading font-bold text-sm text-[#7A2E0E]">{skill.name}</div>
                        <div className="text-[11px] text-[#6B5B53]">{skill.category}</div>
                      </div>

                      {isSelected && (
                        <button
                          type="button"
                          onClick={() => toggleMandatory(skill.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                            reqItem?.is_mandatory
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-white text-[#7A2E0E] border border-[#FF6B1A]/20'
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
              className="w-full py-4 rounded-2xl bg-[#FF6B1A] hover:bg-[#E8590C] hover:scale-[1.01] active:scale-[0.99] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Creating Campaign...' : 'Publish Campaign to Public Community'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
