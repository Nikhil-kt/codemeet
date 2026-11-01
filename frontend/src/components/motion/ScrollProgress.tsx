'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B1A] via-[#FF9A4D] to-[#E8590C] origin-left z-50 pointer-events-none shadow-sm"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

