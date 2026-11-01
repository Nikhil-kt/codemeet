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
    <nav className="bg-[#0c0a09]/90 backdrop-blur-xl border-b border-stone-800/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/25 group-hover:scale-105 transition-all">
                <Shield className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Impact<span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Link</span>
              </span>
            </Link>

            <div className="hidden md:flex md:space-x-1.5 pl-6">
              <Link
                href="/events"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  pathname.startsWith('/events')
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/25 shadow-2xs'
                    : 'text-stone-300 hover:text-amber-300 hover:bg-stone-900/60'
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
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/25 shadow-2xs'
                        : 'text-stone-300 hover:text-amber-300 hover:bg-stone-900/60'
                    }`}
                  >
                    Volunteer Hub
                  </Link>
                  <Link
                    href="/volunteer/profile"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      pathname === '/volunteer/profile'
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/25 shadow-2xs'
                        : 'text-stone-300 hover:text-amber-300 hover:bg-stone-900/60'
                    }`}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/volunteer/tasks"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      pathname === '/volunteer/tasks'
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/25 shadow-2xs'
                        : 'text-stone-300 hover:text-amber-300 hover:bg-stone-900/60'
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
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/25 shadow-2xs'
                        : 'text-stone-300 hover:text-amber-300 hover:bg-stone-900/60'
                    }`}
                  >
                    Organizer Console
                  </Link>
                  <Link
                    href="/organization/events/create"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      pathname === '/organization/events/create'
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/25 shadow-2xs'
                        : 'text-stone-300 hover:text-amber-300 hover:bg-stone-900/60'
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
                      ? 'text-amber-400 bg-amber-500/10 border border-amber-500/25 shadow-2xs'
                      : 'text-stone-300 hover:text-amber-300 hover:bg-stone-900/60'
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
                  <span className="text-xs font-bold text-white">
                    {user.full_name || user.email?.split('@')[0]}
                  </span>
                  <div className="flex items-center justify-end space-x-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                      {role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-stone-400 hover:text-amber-400 transition-colors p-2 rounded-xl hover:bg-stone-800/80 flex items-center space-x-1 border border-transparent hover:border-stone-700 cursor-pointer"
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
                  className="px-3.5 py-2 text-xs font-semibold text-stone-300 hover:text-white rounded-xl hover:bg-stone-800/60 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl shadow-md shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-800 bg-[#0c0a09] px-4 pt-3 pb-5 space-y-2">
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-stone-200 hover:bg-stone-900"
          >
            Browse Campaigns
          </Link>

          {(role === 'VOLUNTEER' || role === 'TEAM_LEADER') && (
            <>
              <Link
                href="/volunteer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-stone-200 hover:bg-stone-900"
              >
                Volunteer Hub
              </Link>
              <Link
                href="/volunteer/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-stone-200 hover:bg-stone-900"
              >
                My Profile
              </Link>
              <Link
                href="/volunteer/tasks"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-stone-200 hover:bg-stone-900"
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
                className="block px-3 py-2 rounded-xl text-sm font-medium text-stone-200 hover:bg-stone-900"
              >
                Organizer Console
              </Link>
              <Link
                href="/organization/events/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-stone-200 hover:bg-stone-900"
              >
                Create Campaign
              </Link>
            </>
          )}

          {role === 'ADMIN' && (
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-amber-400 bg-amber-500/10"
            >
              Admin Governance
            </Link>
          )}

          <div className="pt-3 border-t border-stone-800">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">{user.full_name || user.email}</span>
                  <span className="text-[10px] text-amber-400 font-bold uppercase">{role}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-400 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-semibold border border-stone-700 text-stone-200 rounded-xl hover:bg-stone-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl"
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
