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

  // Mouse position values for 3D tilt (reduced to 5-6 deg for classic archival feel)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 20 });

  // Rotate between -6deg and 6deg
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

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

  // Step 3: Parchment Card Variant Styling
  const variantStyles = {
    white:
      'bg-[#FFFAEE]/85 backdrop-blur-[6px] text-[#4A2410] border border-[rgba(139,94,52,0.28)] [outline:1px_solid_rgba(139,94,52,0.15)] [outline-offset:-6px] shadow-[0_2px_4px_rgba(90,50,15,0.12),0_12px_28px_rgba(90,50,15,0.18)] hover:border-[rgba(232,89,12,0.5)] hover:shadow-[0_22px_44px_rgba(90,50,15,0.28)]',
    orange:
      'bg-gradient-to-br from-[#E8590C] to-[#B8430A] text-[#FFF8EB] border border-[#FF9A4D]/35 [outline:1px_solid_rgba(255,248,235,0.22)] [outline-offset:-6px] shadow-[0_4px_16px_rgba(90,50,15,0.22),0_14px_32px_rgba(184,67,10,0.3)] hover:shadow-[0_22px_44px_rgba(184,67,10,0.45)]',
    gradient:
      'bg-gradient-to-br from-[#E8590C] via-[#D14F0B] to-[#B8430A] text-[#FFF8EB] border border-[#FF9A4D]/40 [outline:1px_solid_rgba(255,248,235,0.25)] [outline-offset:-6px] shadow-[0_6px_20px_rgba(90,50,15,0.25),0_16px_36px_rgba(184,67,10,0.35)] hover:shadow-[0_24px_48px_rgba(184,67,10,0.48)]',
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
        y: -6,
        scale: 1.015,
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      }}
      className={`group relative rounded-[16px] overflow-hidden transition-all duration-[280ms] ${variantStyles[variant]} ${className}`}
    >
      {/* Shine Sweep Overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-full h-[300%] w-[200%] -rotate-45 bg-gradient-to-r from-transparent via-white/20 to-transparent z-20"
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
