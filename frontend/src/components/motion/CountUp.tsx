'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
  value: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function CountUp({
  value,
  duration = 1.4,
  suffix = '',
  decimals = 0,
  className = '',
}: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const counter = () => {
      frame++;
      // Ease out quartic for ultra-smooth deceleration
      const progress = 1 - Math.pow(1 - frame / totalFrames, 4);
      const current = start + (end - start) * progress;

      setDisplayValue(current);

      if (frame < totalFrames) {
        requestAnimationFrame(counter);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(counter);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue)}
      {suffix}
    </span>
  );
}

