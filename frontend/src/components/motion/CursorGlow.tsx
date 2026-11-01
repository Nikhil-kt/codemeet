'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const [visible, setVisible] = useState(false);
  const mouseX = useSpring(0, { stiffness: 250, damping: 25 });
  const mouseY = useSpring(0, { stiffness: 250, damping: 25 });

  useEffect(() => {
    // Desktop only and no reduced motion
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 160);
      mouseY.set(e.clientY - 160);
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, visible]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-80 h-80 rounded-full pointer-events-none z-30 opacity-25 blur-3xl mix-blend-screen"
      style={{
        x: mouseX,
        y: mouseY,
        background: 'radial-gradient(circle, rgba(255, 107, 26, 0.45) 0%, rgba(255, 154, 77, 0.15) 50%, transparent 70%)',
      }}
      aria-hidden="true"
    />
  );
}

