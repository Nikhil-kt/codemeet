'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressBarProps {
  label?: string;
  value: number; // 0 to 100
  max?: number;
  delay?: number;
  showPercent?: boolean;
  variant?: 'orange' | 'peach' | 'gradient' | string;
  className?: string;
}

export default function ProgressBar({
  label,
  value,
  max = 100,
  delay = 0.1,
  showPercent = false,
  variant = 'orange',
  className = '',
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const barGradients: Record<string, string> = {
    orange: 'bg-gradient-to-r from-[#FF6B1A] to-[#FF9A4D]',
    peach: 'bg-gradient-to-r from-[#FF9A4D] to-[#FFA96B]',
    gradient: 'bg-gradient-to-r from-[#FF6B1A] via-[#FF9A4D] to-[#FFA96B]',
  };

  const gradientClass = barGradients[variant] || barGradients.orange;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-[#6B5B53]">{label}</span>
          {showPercent && <span className="font-bold text-[#7A2E0E]">{percent}%</span>}
        </div>
      )}
      <div className="w-full h-2.5 rounded-full bg-[#FFE3CC] overflow-hidden border border-[#FED7AA]/40 p-0.5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${gradientClass}`}
        />
      </div>
    </div>
  );
}
