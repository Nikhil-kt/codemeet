'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { MailCheck, RefreshCw, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-8 rounded-3xl border border-[#FED7AA] shadow-sm space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FFEDD5] border border-[#FED7AA] text-[#F97316] mb-2">
          <MailCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#7C2D12]">Verify Your Email</h1>
          <p className="text-xs text-[#78716C] leading-relaxed max-w-sm mx-auto">
            We have sent an authentication link to{' '}
            <strong className="text-[#7C2D12] font-semibold">{email || 'your email'}</strong>. Please click the link to verify your account and activate your ImpactLink profile.
          </p>
        </div>

        {status && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center space-x-2 text-left ${
              status.success
                ? 'bg-orange-50 border border-[#FED7AA] text-[#7C2D12]'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {status.success ? (
              <CheckCircle2 className="w-4 h-4 text-[#F97316] flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{status.msg}</span>
          </div>
        )}

        <div className="pt-2 border-t border-[#FED7AA] space-y-3">
          <div className="text-xs text-[#78716C]">Did not receive the verification email?</div>

          {!initialEmail && (
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#78716C] focus:outline-none focus:ring-2 focus:ring-[#F97316] mb-2 text-center"
            />
          )}

          <button
            type="button"
            onClick={handleResend}
            disabled={loading || !email}
            className="w-full py-2.5 rounded-xl border border-[#FED7AA] bg-white text-xs font-semibold text-[#7C2D12] hover:bg-[#FFEDD5] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Resending Link...' : 'Resend Verification Email'}</span>
          </button>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#F97316] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-[#78716C]">Loading verification details...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
