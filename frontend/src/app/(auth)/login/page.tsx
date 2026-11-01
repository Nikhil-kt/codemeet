'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Shield, KeyRound, Mail, ArrowRight, AlertCircle, CheckCircle2, Sparkles, UserCheck } from 'lucide-react';
import Hero from '@/components/ui/animated-shader-hero';

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
    <Hero
      trustBadge={{
        text: "Verified Civic Network • 100% Free Public Campaigns",
        icons: ["🌱", "✨", "🤝"]
      }}
      headline={{
        line1: "Welcome back to",
        line2: "ImpactLink"
      }}
      subtitle="Connecting passionate volunteers with verified organizations through intelligent skill matching and tamper-proof civic trust."
      className="-mx-4 sm:-mx-6 lg:-mx-8 -my-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] min-h-[calc(100vh-4rem)] py-12"
    >
      <div className="w-full max-w-md mx-auto text-left">
        {/* Modern Glassmorphic Login Card */}
        <div className="bg-stone-900/85 backdrop-blur-2xl p-7 sm:p-8 rounded-3xl border border-amber-500/20 shadow-2xl shadow-black/90 space-y-6 text-stone-100">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-400 mb-1 shadow-inner">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Sign In</h2>
            <p className="text-xs text-stone-400">Secure Authentication & Verified Role Access</p>
          </div>

          {verifiedNotice && (
            <div className="p-3 bg-amber-500/15 border border-amber-400/30 rounded-2xl text-amber-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Email verified successfully! You can now sign in to your account.</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-500/15 border border-rose-400/30 rounded-2xl text-rose-300 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="space-y-1">
                <span>{error}</span>
                {unconfirmedEmail && (
                  <div>
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-xs font-bold text-rose-300 underline hover:text-rose-200 block mt-1"
                    >
                      Click here to resend verification email
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {resendStatus && (
            <div className="p-3 bg-amber-500/15 border border-amber-400/30 rounded-2xl text-amber-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{resendStatus}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700/80 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  placeholder="you@domain.org"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-stone-300">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline font-semibold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-800/90 border border-stone-700/80 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Quick Account Autofill Chips for testing authentic logins */}
            <div className="p-3.5 bg-stone-800/70 rounded-2xl border border-stone-700/70 space-y-2">
              <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400 animate-pulse" />
                <span>Autofill Test Credentials:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => fillCredentials('admin@impactlink.org', 'admin123')}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1"
                >
                  <UserCheck className="w-3 h-3" />
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('contact@greenearthtrust.org', 'demo123')}
                  className="px-2.5 py-1 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border border-orange-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1"
                >
                  <UserCheck className="w-3 h-3" />
                  Organizer
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('rahul.kumar@gmail.com', 'demo123')}
                  className="px-2.5 py-1 rounded-lg bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 border border-yellow-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1"
                >
                  <UserCheck className="w-3 h-3" />
                  Volunteer
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Verifying credentials...' : 'Sign In to Account'}</span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </button>
          </form>

          <div className="text-center text-xs text-stone-400 pt-2 border-t border-stone-800">
            Do not have an account yet?{' '}
            <Link href="/register" className="text-amber-400 font-semibold hover:text-amber-300 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </Hero>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-slate-400">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
