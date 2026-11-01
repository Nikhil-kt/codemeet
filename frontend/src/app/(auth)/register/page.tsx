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
      <div className="bg-white p-8 rounded-3xl border border-[#FED7AA] shadow-sm space-y-6 text-[#431407]">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FFEDD5] border border-[#FED7AA] text-[#F97316] mb-1 shadow-xs">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#7C2D12]">Create ImpactLink Account</h1>
          <p className="text-xs text-[#78716C]">Join the Verified Civic Network with Role-Based Profiles</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => setRole('VOLUNTEER')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              role === 'VOLUNTEER'
                ? 'border-[#F97316] bg-[#FFEDD5] ring-2 ring-[#F97316]/30'
                : 'border-[#FED7AA] bg-white hover:bg-[#FFEDD5]/40'
            }`}
          >
            <User className={`w-5 h-5 mb-1 ${role === 'VOLUNTEER' ? 'text-[#F97316]' : 'text-[#78716C]'}`} />
            <div className={`font-bold text-xs ${role === 'VOLUNTEER' ? 'text-[#7C2D12]' : 'text-[#431407]'}`}>Volunteer</div>
            <div className="text-[10px] text-[#78716C]">Participate</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('ORGANIZATION')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              role === 'ORGANIZATION'
                ? 'border-[#F97316] bg-[#FFEDD5] ring-2 ring-[#F97316]/30'
                : 'border-[#FED7AA] bg-white hover:bg-[#FFEDD5]/40'
            }`}
          >
            <Building2 className={`w-5 h-5 mb-1 ${role === 'ORGANIZATION' ? 'text-[#F97316]' : 'text-[#78716C]'}`} />
            <div className={`font-bold text-xs ${role === 'ORGANIZATION' ? 'text-[#7C2D12]' : 'text-[#431407]'}`}>Organizer</div>
            <div className="text-[10px] text-[#78716C]">Host events</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('TEAM_LEADER')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              role === 'TEAM_LEADER'
                ? 'border-[#F97316] bg-[#FFEDD5] ring-2 ring-[#F97316]/30'
                : 'border-[#FED7AA] bg-white hover:bg-[#FFEDD5]/40'
            }`}
          >
            <Users className={`w-5 h-5 mb-1 ${role === 'TEAM_LEADER' ? 'text-[#F97316]' : 'text-[#78716C]'}`} />
            <div className={`font-bold text-xs ${role === 'TEAM_LEADER' ? 'text-[#7C2D12]' : 'text-[#431407]'}`}>Team Leader</div>
            <div className="text-[10px] text-[#78716C]">Lead teams</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              role === 'ADMIN'
                ? 'border-[#F97316] bg-[#FFEDD5] ring-2 ring-[#F97316]/30'
                : 'border-[#FED7AA] bg-white hover:bg-[#FFEDD5]/40'
            }`}
          >
            <ShieldAlert className={`w-5 h-5 mb-1 ${role === 'ADMIN' ? 'text-[#F97316]' : 'text-[#78716C]'}`} />
            <div className={`font-bold text-xs ${role === 'ADMIN' ? 'text-[#7C2D12]' : 'text-[#431407]'}`}>Admin</div>
            <div className="text-[10px] text-[#78716C]">Governance</div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#7C2D12] mb-1.5">
              {role === 'ORGANIZATION' ? 'Authorized Representative Name' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#78716C] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              placeholder="e.g. Ananya Sharma"
            />
          </div>

          {role === 'ORGANIZATION' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] mb-1.5">Organization Name</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#78716C] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                  placeholder="e.g. Green Earth Trust"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] mb-1.5">Organization Legal Category</label>
                <select
                  value={orgCategory}
                  onChange={e => setOrgCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
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
              <label className="block text-xs font-semibold text-[#7C2D12] mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#78716C] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                placeholder="contact@example.org"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#7C2D12] mb-1.5">Mobile / WhatsApp</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#78716C] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#7C2D12] mb-1.5">City / Region</label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#78716C] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                placeholder="e.g. Chennai"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#7C2D12] mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#78716C] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Creating account in Firebase...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        <div className="text-center text-xs text-[#78716C] pt-2 border-t border-[#FED7AA]">
          Already registered?{' '}
          <Link href="/login" className="text-[#F97316] font-semibold hover:text-[#EA580C] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
