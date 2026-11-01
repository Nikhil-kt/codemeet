'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { KeyRound, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-8 rounded-3xl border border-[#FED7AA] shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FFEDD5] border border-[#FED7AA] text-[#F97316] mb-1">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#7C2D12]">Set New Password</h1>
          <p className="text-xs text-[#78716C]">
            Choose a strong new password for your ImpactLink account.
          </p>
        </div>

        {status && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center space-x-2 ${
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#7C2D12] mb-1">New Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#78716C] absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#78716C] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#7C2D12] mb-1">Confirm New Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#78716C] absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#FED7AA] text-[#431407] placeholder-[#78716C] text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#78716C]">
          <Link href="/login" className="text-[#F97316] font-semibold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
