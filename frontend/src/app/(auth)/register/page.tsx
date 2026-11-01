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
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mb-1">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create ImpactLink Account</h1>
          <p className="text-xs text-slate-500">Firebase Auth & Role-Based Profiles</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setRole('VOLUNTEER')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              role === 'VOLUNTEER'
                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <User className={`w-5 h-5 mb-1 ${role === 'VOLUNTEER' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <div className="font-bold text-xs text-slate-900">Volunteer</div>
            <div className="text-[10px] text-slate-500">Participate</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('ORGANIZATION')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              role === 'ORGANIZATION'
                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Building2 className={`w-5 h-5 mb-1 ${role === 'ORGANIZATION' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <div className="font-bold text-xs text-slate-900">Organizer</div>
            <div className="text-[10px] text-slate-500">Host events</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('TEAM_LEADER')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              role === 'TEAM_LEADER'
                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Users className={`w-5 h-5 mb-1 ${role === 'TEAM_LEADER' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <div className="font-bold text-xs text-slate-900">Team Leader</div>
            <div className="text-[10px] text-slate-500">Lead teams</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              role === 'ADMIN'
                ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <ShieldAlert className={`w-5 h-5 mb-1 ${role === 'ADMIN' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <div className="font-bold text-xs text-slate-900">Admin</div>
            <div className="text-[10px] text-slate-500">Governance</div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {role === 'ORGANIZATION' ? 'Authorized Representative Name' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Ananya Sharma"
            />
          </div>

          {role === 'ORGANIZATION' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Green Earth Trust"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Legal Category</label>
                <select
                  value={orgCategory}
                  onChange={e => setOrgCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="contact@example.org"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile / WhatsApp</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / Region</label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Chennai"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Creating account in Firebase...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
