'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string | React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const isCenter = align === 'center';

  return (
    <div className={`space-y-3 ${isCenter ? 'text-center max-w-2xl mx-auto' : 'text-left'} ${className}`}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFE3CC] text-[#9A3412] border border-[#FED7AA] text-xs font-bold uppercase tracking-wider shadow-2xs ${
            isCenter ? 'mx-auto' : ''
          }`}
        >
          <span>✦</span>
          <span>{eyebrow}</span>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#7A2E0E] leading-tight"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-[#6B5B53] leading-relaxed font-light"
        >
          {subtitle}
        </motion.p>
      )}

      {isCenter && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-16 h-1 bg-[#FF6B1A] rounded-full mx-auto"
        />
      )}
    </div>
  );
}

