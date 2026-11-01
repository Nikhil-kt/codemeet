'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, LogOut, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-[#FED7AA] sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F97316] to-[#EA580C] flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-all">
                <Shield className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tight text-[#7C2D12]">
                Impact<span className="bg-gradient-to-r from-[#F97316] to-[#EA580C] bg-clip-text text-transparent">Link</span>
              </span>
            </Link>

            <div className="hidden md:flex md:space-x-1.5 pl-6">
              <Link
                href="/events"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  pathname.startsWith('/events')
                    ? 'text-[#7C2D12] bg-[#FFEDD5] border border-[#FED7AA] font-bold shadow-2xs'
                    : 'text-[#78716C] hover:text-[#7C2D12] hover:bg-[#FFEDD5]/60'
                }`}
              >
                Browse Campaigns
              </Link>

              {(role === 'VOLUNTEER' || role === 'TEAM_LEADER') && (
                <>
                  <Link
                    href="/volunteer/dashboard"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      pathname === '/volunteer/dashboard'
                        ? 'text-[#7C2D12] bg-[#FFEDD5] border border-[#FED7AA] font-bold shadow-2xs'
                        : 'text-[#78716C] hover:text-[#7C2D12] hover:bg-[#FFEDD5]/60'
                    }`}
                  >
                    Volunteer Hub
                  </Link>
                  <Link
                    href="/volunteer/profile"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      pathname === '/volunteer/profile'
                        ? 'text-[#7C2D12] bg-[#FFEDD5] border border-[#FED7AA] font-bold shadow-2xs'
                        : 'text-[#78716C] hover:text-[#7C2D12] hover:bg-[#FFEDD5]/60'
                    }`}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/volunteer/tasks"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      pathname === '/volunteer/tasks'
                        ? 'text-[#7C2D12] bg-[#FFEDD5] border border-[#FED7AA] font-bold shadow-2xs'
                        : 'text-[#78716C] hover:text-[#7C2D12] hover:bg-[#FFEDD5]/60'
                    }`}
                  >
                    My Tasks
                  </Link>
                </>
              )}

              {role === 'ORGANIZATION' && (
                <>
                  <Link
                    href="/organization/dashboard"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      pathname === '/organization/dashboard'
                        ? 'text-[#7C2D12] bg-[#FFEDD5] border border-[#FED7AA] font-bold shadow-2xs'
                        : 'text-[#78716C] hover:text-[#7C2D12] hover:bg-[#FFEDD5]/60'
                    }`}
                  >
                    Organizer Console
                  </Link>
                  <Link
                    href="/organization/events/create"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      pathname === '/organization/events/create'
                        ? 'text-[#7C2D12] bg-[#FFEDD5] border border-[#FED7AA] font-bold shadow-2xs'
                        : 'text-[#78716C] hover:text-[#7C2D12] hover:bg-[#FFEDD5]/60'
                    }`}
                  >
                    Create Campaign
                  </Link>
                </>
              )}

              {role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    pathname === '/admin/dashboard'
                      ? 'text-[#7C2D12] bg-[#FFEDD5] border border-[#FED7AA] font-bold shadow-2xs'
                      : 'text-[#78716C] hover:text-[#7C2D12] hover:bg-[#FFEDD5]/60'
                  }`}
                >
                  Admin Governance
                </Link>
              )}
            </div>
          </div>

          {/* User Account Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 pl-2">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-[#7C2D12]">
                    {user.full_name || user.email?.split('@')[0]}
                  </span>
                  <div className="flex items-center justify-end space-x-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#F97316]" />
                    <span className="text-[10px] font-black text-[#F97316] uppercase tracking-wider">
                      {role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-[#78716C] hover:text-[#7C2D12] transition-colors p-2 rounded-xl hover:bg-[#FFEDD5] flex items-center space-x-1 border border-transparent hover:border-[#FED7AA] cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-[#7C2D12] hover:text-[#431407] rounded-xl hover:bg-[#FFEDD5] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer rounded-xl shadow-md shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#78716C] hover:text-[#7C2D12] hover:bg-[#FFEDD5]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#FED7AA] bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#7C2D12] hover:bg-[#FFEDD5]"
          >
            Browse Campaigns
          </Link>

          {(role === 'VOLUNTEER' || role === 'TEAM_LEADER') && (
            <>
              <Link
                href="/volunteer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#7C2D12] hover:bg-[#FFEDD5]"
              >
                Volunteer Hub
              </Link>
              <Link
                href="/volunteer/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#7C2D12] hover:bg-[#FFEDD5]"
              >
                My Profile
              </Link>
              <Link
                href="/volunteer/tasks"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#7C2D12] hover:bg-[#FFEDD5]"
              >
                My Tasks
              </Link>
            </>
          )}

          {role === 'ORGANIZATION' && (
            <>
              <Link
                href="/organization/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#7C2D12] hover:bg-[#FFEDD5]"
              >
                Organizer Console
              </Link>
              <Link
                href="/organization/events/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#7C2D12] hover:bg-[#FFEDD5]"
              >
                Create Campaign
              </Link>
            </>
          )}

          {role === 'ADMIN' && (
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#7C2D12] bg-[#FFEDD5]"
            >
              Admin Governance
            </Link>
          )}

          <div className="pt-3 border-t border-[#FED7AA]">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#7C2D12]">{user.full_name || user.email}</span>
                  <span className="text-[10px] text-[#F97316] font-bold uppercase">{role}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-semibold border border-[#FED7AA] text-[#7C2D12] rounded-xl hover:bg-[#FFEDD5]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold text-white bg-[#F97316] hover:bg-[#EA580C] hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/30 cursor-pointer rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
