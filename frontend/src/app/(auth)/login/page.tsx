'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Shield, KeyRound, Mail, ArrowRight, AlertCircle, CheckCircle2, Sparkles, UserCheck, ArrowLeft, Check } from 'lucide-react';
import { ShaderCanvas } from '@/components/ui/animated-shader-hero';

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
    <div className="fixed inset-0 z-30 overflow-y-auto bg-black flex flex-col justify-between">
      {/* Full-Screen WebGL Interactive Animation Background */}
      <ShaderCanvas className="fixed inset-0 w-full h-full -z-10 object-cover" />

      {/* Top Bar with Back to Platform Link */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-orange-200/90 hover:text-white bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-orange-500/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to ImpactLink</span>
        </Link>
        <span className="text-[11px] font-semibold text-orange-300/80 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-orange-500/20 hidden sm:inline-block">
          Civic Trust & Verification Network
        </span>
      </div>

      {/* Main Content Area - Generous Uncongested Split Layout */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-auto">
        <div className="max-w-6xl w-full grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Brand & Value Narrative */}
          <div className="lg:col-span-7 space-y-6 text-white text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-400/30 text-xs font-semibold text-orange-200">
              <span>✨</span>
              <span>100% Free Public Campaigns • Verified Volunteers</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Welcome back to
              </h1>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent leading-tight">
                ImpactLink
              </h2>
            </div>

            <p className="text-sm sm:text-base text-orange-100/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Connecting passionate volunteers with verified organizations through intelligent skill matching, tamper-proof QR attendance, and automated civic trust scoring.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-orange-500/20 text-xs">
                <div className="font-bold text-orange-300 flex items-center gap-1.5 mb-1">
                  <Check className="w-3.5 h-3.5 text-orange-400" />
                  <span>AI Skill Match</span>
                </div>
                <p className="text-[11px] text-stone-300">Targeted volunteer competency matching.</p>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-orange-500/20 text-xs">
                <div className="font-bold text-orange-300 flex items-center gap-1.5 mb-1">
                  <Check className="w-3.5 h-3.5 text-orange-400" />
                  <span>QR Attendance</span>
                </div>
                <p className="text-[11px] text-stone-300">Cryptographic on-site check-in tokens.</p>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-orange-500/20 text-xs">
                <div className="font-bold text-orange-300 flex items-center gap-1.5 mb-1">
                  <Check className="w-3.5 h-3.5 text-orange-400" />
                  <span>Verified Civic ID</span>
                </div>
                <p className="text-[11px] text-stone-300">Tamper-proof participation records.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Glassmorphic Login Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-stone-950/80 backdrop-blur-2xl p-7 sm:p-8 rounded-3xl border border-orange-500/30 shadow-2xl shadow-black/90 space-y-6 text-stone-100">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-400/40 text-orange-400 mb-1 shadow-inner">
                  <Shield className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Sign In</h2>
                <p className="text-xs text-stone-400">Secure Authentication & Verified Role Access</p>
              </div>

              {verifiedNotice && (
                <div className="p-3 bg-orange-500/15 border border-orange-400/30 rounded-2xl text-orange-200 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Email verified successfully! You can now sign in to your account.</span>
                </div>
              )}

              {error && (
                <div className="p-3.5 bg-rose-950/60 border border-rose-500/50 rounded-2xl text-rose-200 text-xs flex items-start space-x-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <div className="space-y-1">
                    <span>{error}</span>
                    {unconfirmedEmail && (
                      <div>
                        <button
                          type="button"
                          onClick={handleResend}
                          className="text-xs font-bold text-rose-200 underline hover:text-white block mt-1"
                        >
                          Click here to resend verification email
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {resendStatus && (
                <div className="p-3 bg-orange-500/15 border border-orange-400/30 rounded-2xl text-orange-200 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
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
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-900/90 border border-stone-700/80 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="you@domain.org"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-stone-300">Password</label>
                    <Link href="/forgot-password" className="text-[11px] text-orange-400 hover:text-orange-300 hover:underline font-semibold">
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
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-900/90 border border-stone-700/80 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Quick Account Autofill Chips */}
                <div className="p-3 bg-stone-900/80 rounded-2xl border border-stone-800 space-y-2">
                  <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-orange-400">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-orange-400 animate-pulse" />
                    <span>Autofill Test Credentials:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => fillCredentials('admin@impactlink.org', 'admin123')}
                      className="px-2.5 py-1 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border border-orange-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="w-3 h-3" />
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => fillCredentials('contact@greenearthtrust.org', 'demo123')}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="w-3 h-3" />
                      Organizer
                    </button>
                    <button
                      type="button"
                      onClick={() => fillCredentials('rahul.kumar@gmail.com', 'demo123')}
                      className="px-2.5 py-1 rounded-lg bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 border border-yellow-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="w-3 h-3" />
                      Volunteer
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold shadow-md shadow-orange-500/30 text-xs shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? 'Verifying credentials...' : 'Sign In to Account'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </form>

              <div className="text-center text-xs text-stone-400 pt-2 border-t border-stone-800">
                Do not have an account yet?{' '}
                <Link href="/register" className="text-orange-400 font-semibold hover:text-orange-300 hover:underline">
                  Register here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="p-4 text-center text-[11px] text-stone-400/80 bg-black/40 backdrop-blur-md border-t border-orange-500/10">
        ImpactLink • Decentralized Verification & Community Governance
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
