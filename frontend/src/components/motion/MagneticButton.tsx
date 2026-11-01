'use client';

import React, { useRef, useState } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
  pulseRing?: boolean;
}

export default function MagneticButton({
  children,
  className = '',
  magneticStrength = 0.25,
  pulseRing = false,
  onClick,
  disabled,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const { clientX, clientY } = e;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setPosition({
      x: (clientX - centerX) * magneticStrength,
      y: (clientY - centerY) * magneticStrength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 280, damping: 20, mass: 0.2 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center transition-all ${
        pulseRing ? 'before:absolute before:inset-0 before:rounded-2xl before:border-2 before:border-[#E8590C]/40 before:animate-ping before:pointer-events-none' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
