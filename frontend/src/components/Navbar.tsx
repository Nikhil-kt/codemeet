'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, LogOut, Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Impact<span className="text-emerald-600">Link</span>
              </span>
            </Link>

            <div className="hidden md:flex md:space-x-1 pl-6">
              <Link
                href="/events"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/events')
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Browse Campaigns
              </Link>

              {(role === 'VOLUNTEER' || role === 'TEAM_LEADER') && (
                <>
                  <Link
                    href="/volunteer/dashboard"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  >
                    Volunteer Hub
                  </Link>
                  <Link
                    href="/volunteer/tasks"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  >
                    My Tasks
                  </Link>
                </>
              )}

              {role === 'ORGANIZATION' && (
                <>
                  <Link
                    href="/organization/dashboard"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  >
                    Organizer Console
                  </Link>
                  <Link
                    href="/organization/events/create"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  >
                    Create Campaign
                  </Link>
                </>
              )}

              {role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-indigo-700 bg-indigo-50"
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
                  <span className="text-xs font-semibold text-slate-900">
                    {user.full_name || user.email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 tracking-wider">
                    {role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-2 rounded-xl hover:bg-slate-100 flex items-center space-x-1"
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
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-sm transition-all"
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
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Browse Campaigns
          </Link>

          {(role === 'VOLUNTEER' || role === 'TEAM_LEADER') && (
            <>
              <Link
                href="/volunteer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Volunteer Hub
              </Link>
              <Link
                href="/volunteer/tasks"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
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
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Organizer Console
              </Link>
              <Link
                href="/organization/events/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Create Campaign
              </Link>
            </>
          )}

          {role === 'ADMIN' && (
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-indigo-700 bg-indigo-50"
            >
              Admin Governance
            </Link>
          )}

          <div className="pt-2 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900">{user.full_name || user.email}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">{role}</span>
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
                  className="text-center py-2 text-xs font-semibold border border-slate-200 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl"
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
