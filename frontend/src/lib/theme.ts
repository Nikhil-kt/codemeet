/**
 * ImpactLink Design System Tokens
 * Includes Vintage Parchment Dashboard theme tokens alongside Orange NGO tokens.
 */

export const theme = {
  colors: {
    primary: '#FF6B1A',        // Vibrant Primary Orange
    deepOrange: '#E8590C',     // Deep Burnt Orange
    warmCream: '#FFF4E8',      // Legacy Page Background
    white: '#FFFFFF',          // Card Surfaces
    softPeach: '#FFE3CC',      // Accents & Icon Containers
    peachBorder: '#FED7AA',    // Subtle Borders
    darkBrown: '#7A2E0E',      // Headings & High Emphasis Titles
    warmGray: '#6B5B53',       // Subtitles & Body Copy
    accentGlow: 'rgba(255, 107, 26, 0.25)',
  },
  parchment: {
    bg: '#F3E3C3',
    light: '#FFF8EB',
    cardBg: 'rgba(255, 250, 238, 0.82)',
    cardBorder: 'rgba(139, 94, 52, 0.28)',
    cardOutline: 'rgba(139, 94, 52, 0.15)',
    cardBorderHover: 'rgba(232, 89, 12, 0.5)',
    inkHeading: '#4A2410',
    inkBody: '#5C4033',
    inkMuted: '#7C5A48',
    eyebrow: '#B8430A',
    burntOrange: '#E8590C',
    burntOrangeDark: '#B8430A',
    burntOrangeLight: '#FF6B1A',
    oliveSuccess: '#5B7A2F',
    sepiaDark: '#8B5E34',
  },
  gradients: {
    orangeGradient: 'linear-gradient(135deg, #FF6B1A 0%, #FF9A4D 100%)',
    deepOrangeGradient: 'linear-gradient(135deg, #FF6B1A 0%, #E8590C 100%)',
    burntOrangeGradient: 'linear-gradient(135deg, #E8590C 0%, #B8430A 100%)',
    softCreamGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FFF7EE 100%)',
    shimmer: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
  },
  shadows: {
    cardRest: '0 1px 2px rgba(122, 46, 14, 0.06), 0 8px 24px rgba(255, 107, 26, 0.10)',
    cardHover: '0 24px 48px rgba(255, 107, 26, 0.25), 0 8px 16px rgba(122, 46, 14, 0.08)',
    buttonGlow: '0 10px 25px -4px rgba(255, 107, 26, 0.4)',
    parchmentCardRest: '0 2px 4px rgba(90, 50, 15, 0.12), 0 12px 28px rgba(90, 50, 15, 0.18)',
    parchmentCardHover: '0 22px 44px rgba(90, 50, 15, 0.28)',
  },
  radii: {
    sm: '12px',
    md: '16px',
    parchment: '16px',
    lg: '24px',
    xl: '32px',
    full: '9999px',
  },
  transitions: {
    default: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    parchmentCard: 'all 280ms cubic-bezier(0.22, 1, 0.36, 1)',
    spring: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
} as const;
