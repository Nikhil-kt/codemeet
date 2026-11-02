'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { MailCheck, RefreshCw, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import MagneticButton from '@/components/motion/MagneticButton';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const { resendVerification } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; msg: string } | null>(null);

  const handleResend = async () => {
    if (!email) return;

    setLoading(true);
    setStatus(null);

    const res = await resendVerification(email);
    setLoading(false);

    if (res.success) {
      setStatus({
        success: true,
        msg: res.message || `A new verification email has been sent to ${email}.`
      });
    } else {
      setStatus({
        success: false,
        msg: res.message || 'Failed to resend verification email.'
      });
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#FFF4E8] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-[#FF6B1A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[#FFE3CC]/50 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#FED7AA] shadow-2xl shadow-orange-500/10 space-y-6 text-center relative z-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#FFE3CC] border border-[#FED7AA] text-[#FF6B1A] mb-2 shadow-xs">
          <MailCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFE3CC] text-[#9A3412] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B1A]" />
            <span>Verification Link Dispatched</span>
          </span>
          <h1 className="font-heading text-2xl font-black text-[#7A2E0E]">Verify Your Email</h1>
          <p className="text-xs text-[#6B5B53] leading-relaxed max-w-sm mx-auto font-light">
            We have sent an authentication link to{' '}
            <strong className="text-[#7A2E0E] font-bold">{email || 'your email'}</strong>. Please click the link to verify your account and activate your ImpactLink profile.
          </p>
        </div>

        {status && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center space-x-2 text-left ${
              status.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {status.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{status.msg}</span>
          </div>
        )}

        <div className="pt-2 border-t border-[#FED7AA]/50 space-y-3">
          <div className="text-xs text-[#6B5B53]">Did not receive the verification email?</div>

          {!initialEmail && (
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#6B5B53]/60 focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] mb-2 text-center"
            />
          )}

          <MagneticButton
            onClick={handleResend}
            disabled={loading || !email}
            className="w-full py-3 rounded-2xl bg-[#FFE3CC] hover:bg-[#FED7AA] text-[#7A2E0E] border border-[#FED7AA] font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#FF6B1A] ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Resending Link...' : 'Resend Verification Email'}</span>
          </MagneticButton>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#FF6B1A] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-[#6B5B53]">Loading verification details...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
