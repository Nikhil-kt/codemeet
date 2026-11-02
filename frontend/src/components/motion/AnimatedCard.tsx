'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  variant?: 'white' | 'orange' | 'gradient';
  enableTilt?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function AnimatedCard({
  children,
  variant = 'white',
  enableTilt = true,
  className = '',
  onClick,
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 20 });

  // Rotate between -7deg and 7deg
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // NGO Foundation Card Variant Styling
  const variantStyles = {
    white:
      'bg-white text-[#7A2E0E] border border-[rgba(255,107,26,0.14)] shadow-[0_1px_2px_rgba(122,46,14,.06),0_8px_24px_rgba(255,107,26,.10)] hover:border-[#FF6B1A] hover:shadow-[0_24px_48px_rgba(255,107,26,.25)]',
    orange:
      'bg-gradient-to-br from-[#FF6B1A] to-[#E8590C] text-white border border-white/20 shadow-[0_4px_24px_rgba(232,89,12,.35)] hover:shadow-[0_28px_56px_rgba(232,89,12,.5)]',
    gradient:
      'bg-gradient-to-br from-[#FF6B1A] via-[#FF8C38] to-[#FF9A4D] text-white border border-white/30 shadow-[0_6px_28px_rgba(255,107,26,.32)] hover:shadow-[0_28px_56px_rgba(255,107,26,.45)]',
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      }}
      className={`group relative rounded-[28px] overflow-hidden transition-all duration-[280ms] ${variantStyles[variant]} ${className}`}
    >
      {/* Shine Sweep Overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-full h-[300%] w-[200%] -rotate-45 bg-gradient-to-r from-transparent via-white/25 to-transparent z-20"
        animate={{
          x: isHovered ? '150%' : '-150%',
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
        }}
      />

      {/* Card Content Container */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </motion.div>
  );
}
