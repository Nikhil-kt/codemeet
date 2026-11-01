'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import UnicornScene with ssr: false for Next.js 14 WebGL safety
const UnicornScene = dynamic(
  () => import('unicornstudio-react').then((mod) => mod.UnicornScene || mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C0D05] via-[#2A1408] to-[#0F0703] animate-pulse" />
    ),
  }
);

interface AdminHeroAnimationProps {
  projectId?: string;
  className?: string;
}

export default function AdminHeroAnimation({
  projectId = 'qHognYvslANstS7PTGCv',
  className = '',
}: AdminHeroAnimationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none ${className}`}>
      {mounted && (
        <div className="w-full h-full flex items-center justify-center [&>div]:w-full! [&>div]:h-full! [&_canvas]:w-full! [&_canvas]:h-full! [&_canvas]:object-cover">
          <UnicornScene
            projectId={projectId}
            width="100%"
            height="100%"
            scale={1}
            dpi={1.5}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}

