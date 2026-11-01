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
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#78716C] hover:text-[#9A3412] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Organizer Console</span>
      </button>

      <div className="bg-white backdrop-blur-xl p-8 rounded-3xl border border-[#FED7AA] shadow-2xl shadow-black/80 space-y-6 text-[#431407]">
        <div>
          <h1 className="text-2xl font-bold text-[#7C2D12]">Create New Community Campaign</h1>
          <p className="text-xs text-[#78716C] mt-1 font-medium">
            Define objectives, required skills taxonomy, schedules, and volunteer capacities.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 font-medium text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#431407] mb-1.5">Campaign Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Adyar Estuary Mangrove Sapling Plantation"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#78716C] text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#431407] mb-1.5">Campaign Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
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
                <label className="block text-xs font-semibold text-[#431407] mb-1.5">Operating City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#431407] mb-1.5">Campaign Description</label>
              <textarea
                rows={4}
                required
                placeholder="Detail the goals, volunteer tasks, gathering points, and positive social impact..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#78716C] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#431407] mb-1.5">Event Date</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FED7AA] text-[#431407] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#431407] mb-1.5">Start Time</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FED7AA] text-[#431407] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#431407] mb-1.5">End Time</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FED7AA] text-[#431407] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#431407] mb-1.5">Venue / Landmark Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adyar Eco Park Gate 2"
                  value={locationName}
                  onChange={e => setLocationName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#431407] mb-1.5">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Full physical meeting address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#431407] mb-1.5">Target Volunteers Required</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={volunteersRequired}
                  onChange={e => setVolunteersRequired(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FED7AA] text-[#431407] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#431407] mb-1.5">Max Registration Capacity</label>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={maxCapacity}
                  onChange={e => setMaxCapacity(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FED7AA] text-[#431407] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>
            </div>
          </div>

          {/* Skills Required Selector */}
          <div className="space-y-3 pt-4 border-t border-[#FED7AA]">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-[#7C2D12] flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-[#F97316]" />
                  <span>Required Skills Taxonomy</span>
                </h3>
                <p className="text-[11px] text-[#78716C]">
                  Select required capabilities for AI volunteer candidate ranking
                </p>
              </div>
              <span className="text-xs font-bold text-[#F97316]">
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
                        ? 'border-[#F97316] bg-[#FFEDD5] text-[#7C2D12] font-semibold ring-1 ring-orange-400'
                        : 'border-[#FED7AA] bg-white hover:border-[#F97316] text-[#431407] interactive-card'
                    }`}
                  >
                    <div
                      onClick={() => toggleSkill(skill.id)}
                      className="cursor-pointer flex-1 space-y-0.5"
                    >
                      <div className="font-bold text-[#7C2D12]">{skill.name}</div>
                      <div className="text-[10px] text-[#78716C]">{skill.category}</div>
                    </div>

                    {isSelected && (
                      <button
                        type="button"
                        onClick={() => toggleMandatory(skill.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          reqItem?.is_mandatory
                            ? 'bg-rose-50 text-rose-800 border border-rose-300 font-bold'
                            : 'bg-white text-[#431407] border border-[#FED7AA]'
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
            className="w-full py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Creating Campaign...' : 'Publish Campaign'}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}

