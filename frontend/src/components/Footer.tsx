'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Heart, Sparkles, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t-2 border-[#FF6B1A] relative z-20 text-[#6B5B53] mt-auto">
      {/* Top Multi-column Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B1A] to-[#E8590C] flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-all">
                <Shield className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-heading text-2xl font-black tracking-tight text-[#7A2E0E]">
                Impact<span className="bg-gradient-to-r from-[#FF6B1A] to-[#FF9A4D] bg-clip-text text-transparent">Link</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#6B5B53] leading-relaxed max-w-sm font-light">
              Mobilizing verified volunteers with uncompromising trust. Powered by multi-factor AI matching, cryptographic QR check-in, and tamper-resistant civic proof verification.
            </p>

            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#FFE3CC] text-[#7A2E0E] text-xs font-bold border border-[#FED7AA]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Free Public Civic Infrastructure</span>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#7A2E0E]">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/events" className="hover-underline-grow hover:text-[#FF6B1A] transition-colors">
                  Explore Campaigns
                </Link>
              </li>
              <li>
                <Link href="/volunteer/dashboard" className="hover-underline-grow hover:text-[#FF6B1A] transition-colors">
                  Volunteer Hub
                </Link>
              </li>
              <li>
                <Link href="/organization/dashboard" className="hover-underline-grow hover:text-[#FF6B1A] transition-colors">
                  Organizer Console
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover-underline-grow hover:text-[#FF6B1A] transition-colors">
                  Governance Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Civic Verification */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#7A2E0E]">
              Trust & Tech
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B1A]" />
                <span>Multi-Factor AI Match</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-[#FF6B1A]" />
                <span>Cryptographic QR</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Heart className="w-3.5 h-3.5 text-[#FF6B1A]" />
                <span>Explainable Reputation</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B1A]" />
                <span>Geo-Proximity Scoring</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Connect */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#7A2E0E]">
              Connect
            </h4>
            <div className="space-y-2 text-xs">
              <p className="text-[11px] text-[#6B5B53]">Have questions or an NGO initiative to register?</p>
              <Link
                href="/organization/register"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#FF6B1A] hover:text-[#E8590C] transition-colors group"
              >
                <span>Register Organization</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#FFF4E8]/60 border-t border-[#FED7AA]/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6B1A]" />
            <span className="font-bold text-[#7A2E0E]">ImpactLink Civic Platform</span>
            <span>•</span>
            <span>Built for Transparent Social Good</span>
          </div>
          <div className="text-center sm:text-right text-[#6B5B53]">
            © {new Date().getFullYear()} ImpactLink Platform. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

