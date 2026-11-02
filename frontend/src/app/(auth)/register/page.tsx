'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Shield, User, Building2, ArrowRight, AlertCircle, ShieldAlert, Users, Sparkles, Check, ArrowLeft } from 'lucide-react';
import MagneticButton from '@/components/motion/MagneticButton';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState<'VOLUNTEER' | 'ORGANIZATION' | 'TEAM_LEADER' | 'ADMIN'>('VOLUNTEER');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [orgCategory, setOrgCategory] = useState('NGO');
  const [orgName, setOrgName] = useState('');
  const [city, setCity] = useState('Chennai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: any = {
      full_name: fullName,
      email,
      phone,
      password,
      role,
    };

    if (role === 'ORGANIZATION') {
      payload.orgDetails = {
        name: orgName || fullName,
        category: orgCategory,
        operating_location: city,
        address: city,
      };
    } else {
      payload.volunteerDetails = {
        city,
        state: 'Tamil Nadu',
        bio: 'Ready to contribute to social and environmental impact events.',
      };
    }

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      if (res.emailConfirmationRequired) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        if (role === 'VOLUNTEER' || role === 'TEAM_LEADER') router.push('/volunteer/dashboard');
        else if (role === 'ORGANIZATION') router.push('/organization/dashboard');
        else router.push('/admin/dashboard');
      }
    } else {
      setError(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E8] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#FF6B1A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#FFE3CC]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: NGO Narrative Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#FF6B1A] via-[#E8590C] to-[#B8430A] text-white p-8 sm:p-12 shadow-2xl shadow-orange-500/25 space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-xs font-bold text-white/90 hover:text-white bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Homepage</span>
            </Link>

            <div className="space-y-2">
              <span className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-orange-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join ImpactLink</span>
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-black text-white leading-tight">
                Empower Communities with Verified Civic Trust
              </h1>
              <p className="text-sm text-orange-100/90 leading-relaxed font-light">
                Sign up as a verified volunteer or register your nonprofit organization to launch public civic initiatives across India.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-amber-200" />
                <span>Tamper-resistant cryptographic QR attendance</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-amber-200" />
                <span>Automated Gemini AI verified certificates</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-amber-200" />
                <span>Zero-fraud DARPAN & 80G verification</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/20 text-xs text-orange-100/80">
            100% Free Public Platform
          </div>
        </motion.div>

        {/* Right Column: Floating Registration Form Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 w-full max-w-xl mx-auto"
        >
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#FED7AA] shadow-2xl shadow-orange-500/10 space-y-6 text-[#431407]">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FFE3CC] border border-[#FED7AA] text-[#FF6B1A] mb-1 shadow-xs">
                <Shield className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h2 className="font-heading text-2xl font-black text-[#7A2E0E]">Create Account</h2>
              <p className="text-xs text-[#6B5B53]">Select your primary role to customize your workspace</p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Role Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'VOLUNTEER', label: 'Volunteer', desc: 'Participate', icon: User },
                { id: 'TEAM_LEADER', label: 'Leader', desc: 'Lead Squads', icon: Users },
                { id: 'ORGANIZATION', label: 'NGO / Org', desc: 'Host Events', icon: Building2 },
                { id: 'ADMIN', label: 'Admin', desc: 'Governance', icon: ShieldAlert },
              ].map(item => {
                const isSelected = role === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#FF6B1A] bg-[#FFE3CC] shadow-sm ring-2 ring-[#FF6B1A]/30'
                        : 'border-[#FED7AA] bg-white hover:bg-[#FFE3CC]/30'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 mb-1 ${isSelected ? 'text-[#FF6B1A]' : 'text-[#6B5B53]'}`} />
                    <div className={`font-bold text-xs ${isSelected ? 'text-[#7A2E0E]' : 'text-[#431407]'}`}>{item.label}</div>
                    <div className="text-[10px] text-[#6B5B53]">{item.desc}</div>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#6B5B53]/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@domain.org"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#6B5B53]/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#6B5B53]/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">City / Location</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Chennai"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#6B5B53]/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                  />
                </div>
              </div>

              {role === 'ORGANIZATION' && (
                <div className="p-4 rounded-2xl bg-[#FFF4E8] border border-[#FED7AA] space-y-3">
                  <div className="text-xs font-bold text-[#7A2E0E]">Organization Details</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#6B5B53] mb-1">Organization Name</label>
                      <input
                        type="text"
                        required
                        value={orgName}
                        onChange={e => setOrgName(e.target.value)}
                        placeholder="e.g. Green Earth Trust"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#FED7AA] text-xs text-[#431407]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#6B5B53] mb-1">Entity Category</label>
                      <select
                        value={orgCategory}
                        onChange={e => setOrgCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#FED7AA] text-xs text-[#431407]"
                      >
                        <option value="NGO">Registered NGO (Trust/Society)</option>
                        <option value="COMMUNITY_GROUP">Civic Community Group</option>
                        <option value="COLLEGE_NSS">University NSS / Youth Chapter</option>
                        <option value="CSR_INITIATIVE">Corporate CSR Initiative</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#6B5B53]/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                />
              </div>

              <MagneticButton
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B1A] to-[#E8590C] hover:from-[#F06A1D] hover:to-[#C74B0D] text-white font-bold text-xs shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </MagneticButton>
            </form>

            <div className="text-center text-xs text-[#6B5B53] pt-2 border-t border-[#FED7AA]/50">
              Already have an account?{' '}
              <Link href="/login" className="text-[#FF6B1A] font-bold hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
