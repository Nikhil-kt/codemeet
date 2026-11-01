'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Shield, KeyRound, Mail, ArrowRight, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifiedNotice = searchParams.get('verified');

  const { login, resendVerification } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUnconfirmedEmail(false);
    setResendStatus(null);

    const res = await login({ email: email.trim(), password });
    setLoading(false);

    if (res.success) {
      const targetRole = res.role;
      if (targetRole === 'VOLUNTEER' || targetRole === 'TEAM_LEADER') {
        router.push('/volunteer/dashboard');
      } else if (targetRole === 'ORGANIZATION') {
        router.push('/organization/dashboard');
      } else if (targetRole === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/events');
      }
    } else {
      if (res.emailNotConfirmed) {
        setUnconfirmedEmail(true);
      }
      setError(res.message || 'Invalid email or password.');
    }
  };

  const handleResend = async () => {
    if (!email) return;
    const res = await resendVerification(email.trim());
    if (res.success) {
      setResendStatus(res.message || 'Verification email resent.');
    } else {
      setError(res.message || 'Failed to resend verification email.');
    }
  };

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mb-1">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sign in to ImpactLink</h1>
          <p className="text-xs text-slate-500">Secure Authentication & Verified Role Access</p>
        </div>

        {verifiedNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Email verified successfully! You can now sign in to your account.</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span>{error}</span>
              {unconfirmedEmail && (
                <div>
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-xs font-bold text-rose-800 underline hover:text-rose-950 block mt-1"
                  >
                    Click here to resend verification email
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {resendStatus && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>{resendStatus}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="you@domain.org"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <Link href="/forgot-password" className="text-[11px] text-emerald-600 hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Quick Account Autofill Chips for testing authentic logins */}
          <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
            <span className="flex items-center text-slate-400"><Sparkles className="w-3 h-3 mr-1" /> Autofill Test Credentials:</span>
            <button
              type="button"
              onClick={() => fillCredentials('admin@impactlink.org', 'admin123')}
              className="text-indigo-600 hover:underline font-medium"
            >
              Admin
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => fillCredentials('contact@greenearthtrust.org', 'demo123')}
              className="text-emerald-600 hover:underline font-medium"
            >
              Organizer
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => fillCredentials('rahul.kumar@gmail.com', 'demo123')}
              className="text-emerald-600 hover:underline font-medium"
            >
              Volunteer
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Verifying credentials...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Do not have an account yet?{' '}
          <Link href="/register" className="text-emerald-600 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-slate-400">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
