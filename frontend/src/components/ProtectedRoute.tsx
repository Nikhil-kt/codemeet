'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Loader2, ArrowRight, LogOut, Home } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('VOLUNTEER' | 'ORGANIZATION' | 'ADMIN' | 'TEAM_LEADER')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, role, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3 text-[#78716C] text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-[#F97316]" />
        <span>Verifying security credentials & authorization...</span>
      </div>
    );
  }

  // Not signed in: redirecting
  if (!user) {
    return null;
  }

  const currentRole = ((role || user?.role || '') as string).toUpperCase();
  const isAuthorized = allowedRoles.map(r => r.toUpperCase()).includes(currentRole);

  if (!isAuthorized) {
    const roleDashboardUrl =
      currentRole === 'ORGANIZATION'
        ? '/organization/dashboard'
        : currentRole === 'ADMIN'
        ? '/admin/dashboard'
        : '/volunteer/dashboard';

    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white backdrop-blur-xl rounded-3xl border border-[#FED7AA] shadow-2xl text-center space-y-6">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 shadow-sm">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#7C2D12]">Access Denied</h2>
          <p className="text-xs text-[#431407] leading-relaxed">
            You are signed in as <span className="font-bold text-[#9A3412] px-1.5 py-0.5 rounded bg-white border border-[#FED7AA]">{currentRole}</span>.
          </p>
          <p className="text-xs text-[#78716C] leading-relaxed">
            This portal is restricted to authorized <span className="font-semibold text-rose-700">{allowedRoles.join(' / ')}</span> accounts only. Role switching is prohibited.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={() => router.push(roleDashboardUrl)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs interactive-btn flex items-center justify-center space-x-2 shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <span>Go to Your {currentRole === 'ORGANIZATION' ? 'Organizer' : currentRole === 'ADMIN' ? 'Admin' : 'Volunteer'} Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FFEDD5] border border-[#FED7AA] text-[#7C2D12] font-semibold text-xs interactive-btn flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-[#78716C]" />
            <span>Sign In with Different Account</span>
          </button>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-xs text-[#78716C] hover:text-[#9A3412] font-medium inline-flex items-center space-x-1 pt-1"
          >
            <Home className="w-3 h-3" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
