import confetti from 'canvas-confetti';

export function triggerConfetti() {
  if (typeof window === 'undefined') return;

  // Primary festive burst
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.65 },
    colors: ['#FF6B1A', '#FF9A4D', '#FFE3CC', '#FFFFFF', '#E8590C'],
    disableForReducedMotion: true,
  });

  // Secondary delayed stars/cannons from left and right
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors: ['#FF6B1A', '#FF9A4D', '#FFE3CC', '#FFFFFF'],
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors: ['#FF6B1A', '#FF9A4D', '#FFE3CC', '#FFFFFF'],
      disableForReducedMotion: true,
    });
  }, 200);
}

