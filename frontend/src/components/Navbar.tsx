'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Shield, LogOut, Menu, X, Sparkles, User, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Browse Campaigns', href: '/events', show: true },
    { name: 'Volunteer Hub', href: '/volunteer/dashboard', show: role === 'VOLUNTEER' || role === 'TEAM_LEADER' },
    { name: 'My Profile', href: '/volunteer/profile', show: role === 'VOLUNTEER' || role === 'TEAM_LEADER' },
    { name: 'My Tasks', href: '/volunteer/tasks', show: role === 'VOLUNTEER' || role === 'TEAM_LEADER' },
    { name: 'Organizer Console', href: '/organization/dashboard', show: role === 'ORGANIZATION' },
    { name: 'Create Campaign', href: '/organization/events/create', show: role === 'ORGANIZATION' },
    { name: 'Governance Center', href: '/admin/dashboard', show: role === 'ADMIN' },
  ].filter(link => link.show);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(255,107,26,0.08)] border-b border-[#FF6B1A]/15'
          : 'bg-white/85 backdrop-blur-sm border-b border-[#FED7AA]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B1A] to-[#E8590C] flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                <Shield className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-heading text-xl sm:text-2xl font-black tracking-tight text-[#7A2E0E]">
                Impact<span className="bg-gradient-to-r from-[#FF6B1A] to-[#FF9A4D] bg-clip-text text-transparent">Link</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 pl-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'text-[#7A2E0E]'
                        : 'text-[#6B5B53] hover:text-[#7A2E0E] hover:bg-[#FFE3CC]/50'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute inset-0 bg-[#FFE3CC] rounded-full border border-[#FED7AA] shadow-2xs -z-10"
                      />
                    )}
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Account Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 pl-2">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-[#7A2E0E]">
                    {user.full_name || user.email?.split('@')[0]}
                  </span>
                  <div className="flex items-center justify-end space-x-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#FF6B1A]" />
                    <span className="text-[10px] font-black text-[#FF6B1A] uppercase tracking-wider">
                      {role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-[#FFE3CC]/60 hover:bg-[#FFE3CC] text-[#7A2E0E] border border-[#FED7AA] transition-all hover:scale-105 active:scale-95 flex items-center space-x-1 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 text-[#FF6B1A]" />
                  <span className="text-xs font-semibold">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-bold text-[#7A2E0E] hover:text-[#FF6B1A] rounded-xl hover:bg-[#FFE3CC]/50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8590C] hover:from-[#F06A1D] hover:to-[#C74B0D] rounded-full shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Create Account</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-[#FFE3CC]/70 text-[#7A2E0E] hover:bg-[#FFE3CC] border border-[#FED7AA] transition-all cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Animated Slide-in Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-t border-[#FED7AA] bg-white/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-2 overflow-hidden shadow-xl"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#FFE3CC] text-[#7A2E0E] border border-[#FED7AA]'
                      : 'text-[#6B5B53] hover:text-[#7A2E0E] hover:bg-[#FFE3CC]/40'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-[#FED7AA]/60">
              {user ? (
                <div className="flex items-center justify-between px-2 py-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#7A2E0E]">{user.full_name || user.email}</span>
                    <span className="text-[10px] text-[#FF6B1A] font-bold uppercase tracking-wider">{role}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 text-xs font-bold border border-[#FED7AA] text-[#7A2E0E] rounded-xl hover:bg-[#FFE3CC]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B1A] to-[#E8590C] rounded-xl shadow-md shadow-orange-500/25"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
