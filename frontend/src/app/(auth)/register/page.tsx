'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Shield, User, Building2, ArrowRight, AlertCircle, ShieldAlert, Users } from 'lucide-react';

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
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-stone-900/85 backdrop-blur-2xl p-8 rounded-3xl border border-amber-500/20 shadow-2xl shadow-black/80 space-y-6 text-stone-100">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-400 mb-1 shadow-inner">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create ImpactLink Account</h1>
          <p className="text-xs text-stone-400">Join the Verified Civic Network with Role-Based Profiles</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/15 border border-rose-400/30 rounded-2xl text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => setRole('VOLUNTEER')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              role === 'VOLUNTEER'
                ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/30'
                : 'border-stone-800 bg-stone-800/40 hover:border-stone-700'
            }`}
          >
            <User className={`w-5 h-5 mb-1 ${role === 'VOLUNTEER' ? 'text-amber-400' : 'text-stone-400'}`} />
            <div className={`font-bold text-xs ${role === 'VOLUNTEER' ? 'text-amber-300' : 'text-stone-200'}`}>Volunteer</div>
            <div className="text-[10px] text-stone-400">Participate</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('ORGANIZATION')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              role === 'ORGANIZATION'
                ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/30'
                : 'border-stone-800 bg-stone-800/40 hover:border-stone-700'
            }`}
          >
            <Building2 className={`w-5 h-5 mb-1 ${role === 'ORGANIZATION' ? 'text-amber-400' : 'text-stone-400'}`} />
            <div className={`font-bold text-xs ${role === 'ORGANIZATION' ? 'text-amber-300' : 'text-stone-200'}`}>Organizer</div>
            <div className="text-[10px] text-stone-400">Host events</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('TEAM_LEADER')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              role === 'TEAM_LEADER'
                ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/30'
                : 'border-stone-800 bg-stone-800/40 hover:border-stone-700'
            }`}
          >
            <Users className={`w-5 h-5 mb-1 ${role === 'TEAM_LEADER' ? 'text-amber-400' : 'text-stone-400'}`} />
            <div className={`font-bold text-xs ${role === 'TEAM_LEADER' ? 'text-amber-300' : 'text-stone-200'}`}>Team Leader</div>
            <div className="text-[10px] text-stone-400">Lead teams</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              role === 'ADMIN'
                ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/30'
                : 'border-stone-800 bg-stone-800/40 hover:border-stone-700'
            }`}
          >
            <ShieldAlert className={`w-5 h-5 mb-1 ${role === 'ADMIN' ? 'text-amber-400' : 'text-stone-400'}`} />
            <div className={`font-bold text-xs ${role === 'ADMIN' ? 'text-amber-300' : 'text-stone-200'}`}>Admin</div>
            <div className="text-[10px] text-stone-400">Governance</div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              {role === 'ORGANIZATION' ? 'Authorized Representative Name' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700/80 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="e.g. Ananya Sharma"
            />
          </div>

          {role === 'ORGANIZATION' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">Organization Name</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700/80 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="e.g. Green Earth Trust"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">Organization Legal Category</label>
                <select
                  value={orgCategory}
                  onChange={e => setOrgCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="NGO">NGO / Nonprofit Organization</option>
                  <option value="EDUCATIONAL_INSTITUTION">College / University</option>
                  <option value="COMPANY">Company / CSR</option>
                  <option value="TRUST_SOCIETY">Registered Trust / Society</option>
                  <option value="COMMUNITY_GROUP">Community Welfare Group</option>
                  <option value="INDIVIDUAL">Independent Community Organizer</option>
                </select>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700/80 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="contact@example.org"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">Mobile / WhatsApp</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700/80 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">City / Region</label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700/80 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="e.g. Chennai"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700/80 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Creating account in Firebase...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4 text-stone-950" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-400 pt-2 border-t border-stone-800">
          Already registered?{' '}
          <Link href="/login" className="text-amber-400 font-semibold hover:text-amber-300 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
