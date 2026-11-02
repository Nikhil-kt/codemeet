/**
 * ImpactLink Universal NGO Foundation Design System
 * Unified tokens for all pages, layouts, cards, typography, and motion.
 */

export const theme = {
  colors: {
    // NGO Foundation Palette
    primaryOrange: '#FF6B1A',     // Vibrant Primary Accent
    deepOrange: '#E8590C',        // Deeper Orange / Hover Accent
    warmCream: '#FFF4E8',         // Page Background
    pureWhite: '#FFFFFF',         // Card Background
    softPeach: '#FFE3CC',         // Accent & Icon Containers
    cardBorder: 'rgba(255, 107, 26, 0.12)', // Subtle Soft Orange Border
    cardBorderHover: 'rgba(255, 107, 26, 0.45)',
    darkBrown: '#7A2E0E',         // Primary Headings
    warmGray: '#6B5B53',          // Secondary Body Text
    mutedBrown: '#9A3412',        // Subtitles & Eyebrow Accent
    oliveSuccess: '#5B7A2F',      // Verified / Success State
    roseError: '#E11D48',         // Error / Rejection State
  },
  gradients: {
    primary: 'linear-gradient(135deg, #FF6B1A 0%, #FF9A4D 100%)',
    deepOrange: 'linear-gradient(135deg, #FF6B1A 0%, #E8590C 100%)',
    burntOrange: 'linear-gradient(135deg, #E8590C 0%, #B8430A 100%)',
    softCream: 'linear-gradient(180deg, #FFFFFF 0%, #FFF7EE 100%)',
    cardShine: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
    heroDarkOverlay: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0.85) 100%)',
  },
  shadows: {
    cardRest: '0 1px 2px rgba(122, 46, 14, 0.06), 0 8px 24px rgba(255, 107, 26, 0.10)',
    cardHover: '0 24px 48px rgba(255, 107, 26, 0.25)',
    buttonGlow: '0 10px 25px -4px rgba(255, 107, 26, 0.35)',
    orangeAura: '0 0 32px rgba(255, 107, 26, 0.30)',
  },
  radii: {
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    full: '9999px',
  },
  animation: {
    transitionStandard: 'all 280ms cubic-bezier(0.22, 1, 0.36, 1)',
    cubicBezier: [0.22, 1, 0.36, 1],
    springBouncy: { type: 'spring', stiffness: 350, damping: 22 },
    springSmooth: { type: 'spring', stiffness: 240, damping: 25 },
  },
} as const;
