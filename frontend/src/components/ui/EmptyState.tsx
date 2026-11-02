'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionLabel,
  actionHref,
  onAction,
  className = '',
}: EmptyStateProps) {
  const buttonLabel = actionText || actionLabel;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-10 sm:p-14 rounded-3xl bg-white border border-[#FF6B1A]/15 text-center space-y-4 shadow-sm max-w-lg mx-auto ${className}`}
    >
      {icon && (
        <div className="w-16 h-16 rounded-3xl bg-[#FFE3CC] text-[#FF6B1A] border border-[#FF6B1A]/20 flex items-center justify-center mx-auto shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="font-heading font-extrabold text-[#7A2E0E] text-lg sm:text-xl">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#6B5B53] max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {buttonLabel && (
        <div className="pt-2">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#FF6B1A] hover:bg-[#E8590C] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>{buttonLabel}</span>
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#FF6B1A] hover:bg-[#E8590C] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>{buttonLabel}</span>
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
