'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { KeyRound, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import MagneticButton from '@/components/motion/MagneticButton';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setStatus({ success: false, msg: 'Password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ success: false, msg: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    const res = await resetPassword(newPassword);
    setLoading(false);

    if (res.success) {
      setStatus({
        success: true,
        msg: res.message || 'Password successfully updated! Redirecting to login...'
      });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setStatus({
        success: false,
        msg: res.message || 'Failed to update password. Your reset session may have expired.'
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
        className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#FED7AA] shadow-2xl shadow-orange-500/10 space-y-6 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FFE3CC] border border-[#FED7AA] text-[#FF6B1A] mb-1 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl font-black text-[#7A2E0E]">Set New Password</h1>
          <p className="text-xs text-[#6B5B53]">
            Choose a strong new password for your ImpactLink account.
          </p>
        </div>

        {status && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center space-x-2 ${
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">New Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#6B5B53] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#6B5B53]/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#7A2E0E] mb-1.5">Confirm New Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#6B5B53] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#6B5B53]/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] transition-all"
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <MagneticButton
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B1A] to-[#E8590C] hover:from-[#F06A1D] hover:to-[#C74B0D] text-white font-bold text-xs shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </MagneticButton>
        </form>

        <div className="text-center text-xs text-[#6B5B53] pt-2 border-t border-[#FED7AA]/50">
          <Link href="/login" className="text-[#FF6B1A] font-bold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
