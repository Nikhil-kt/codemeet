'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home, Sparkles } from 'lucide-react';
import SmoothScroll from '@/components/motion/SmoothScroll';
import MagneticButton from '@/components/motion/MagneticButton';

export default function NotFound() {
  return (
    <SmoothScroll>
      <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden bg-[#FFF4E8]">
        {/* Ambient Gradient Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B1A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FFE3CC]/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full text-center space-y-6 relative z-10">
          {/* Bold Orange Illustration Block */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#FF6B1A] to-[#E8590C] text-white flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/30 border-2 border-white/40"
          >
            <ShieldAlert className="w-14 h-14" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="space-y-2"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFE3CC] text-[#9A3412] border border-[#FED7AA] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B1A]" />
              <span>404 Page Not Found</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-[#7A2E0E] tracking-tight">
              Lost in the Civic Network?
            </h1>
            <p className="text-sm sm:text-base text-[#6B5B53] max-w-md mx-auto leading-relaxed font-light">
              The page, campaign, or resource you are looking for has been relocated or does not exist. Let&apos;s get you back on track.
            </p>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/">
              <MagneticButton
                pulseRing={true}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#E8590C] hover:from-[#F06A1D] hover:to-[#C74B0D] text-white font-bold text-sm shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Homepage</span>
              </MagneticButton>
            </Link>
            <Link
              href="/events"
              className="px-7 py-4 rounded-full bg-white hover:bg-[#FFE3CC]/40 text-[#7A2E0E] font-bold text-sm border border-[#FED7AA] shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Explore Campaigns</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </motion.div>
        </div>
      </div>
    </SmoothScroll>
  );
}

