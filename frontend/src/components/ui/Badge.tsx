'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'orange' | 'peach' | 'success' | 'white' | 'danger' | 'rose';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export default function Badge({
  children,
  variant = 'peach',
  size = 'md',
  className = '',
  icon,
}: BadgeProps) {
  const variantStyles = {
    orange: 'bg-[#FF6B1A] text-white border-transparent shadow-sm',
    peach: 'bg-[#FFE3CC] text-[#7A2E0E] border-[#FED7AA]',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    danger: 'bg-rose-100 text-rose-800 border-rose-300',
    rose: 'bg-rose-100 text-rose-800 border-rose-300',
    white: 'bg-white text-[#7A2E0E] border-[#FED7AA] shadow-2xs',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full font-bold border transition-transform duration-200 hover:scale-105 cursor-default ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

