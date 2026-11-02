'use client';

import React from 'react';
import AnimatedCard from './AnimatedCard';
import CountUp from './CountUp';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: string;
  variant?: 'white' | 'orange' | 'gradient';
  className?: string;
}

export default function StatCard({
  label,
  value,
  suffix = '',
  prefix = '',
  subtext,
  icon,
  trend,
  variant = 'white',
  className = '',
}: StatCardProps) {
  const isWhite = variant === 'white';

  return (
    <AnimatedCard variant={variant} className={`p-6 sm:p-7 flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <span
          className={`text-xs font-bold uppercase tracking-wider ${
            isWhite ? 'text-[#FF6B1A]' : 'text-orange-100'
          }`}
        >
          {label}
        </span>
        {icon && (
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-sm ${
              isWhite
                ? 'bg-[#FFE3CC] text-[#FF6B1A] border border-[#FED7AA]'
                : 'bg-white/20 text-white backdrop-blur-md'
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline space-x-1">
          {prefix && (
            <span className={`text-2xl font-bold ${isWhite ? 'text-[#7A2E0E]' : 'text-white'}`}>
              {prefix}
            </span>
          )}
          <CountUp
            value={value}
            className={`text-4xl sm:text-5xl font-black tracking-tight ${
              isWhite ? 'text-[#7A2E0E]' : 'text-white'
            }`}
          />
          {suffix && (
            <span
              className={`text-lg font-bold ${
                isWhite ? 'text-[#6B5B53]' : 'text-orange-100'
              }`}
            >
              {suffix}
            </span>
          )}
        </div>

        {subtext && (
          <p
            className={`text-xs font-light leading-relaxed ${
              isWhite ? 'text-[#6B5B53]' : 'text-white/85'
            }`}
          >
            {subtext}
          </p>
        )}

        {trend && (
          <div className="pt-2">
            <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200">
              {trend}
            </span>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
}

