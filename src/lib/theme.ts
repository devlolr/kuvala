/**
 * Heritage Color Tokens & Animation Presets
 *
 * Single source of truth for all design tokens used across JS/TS contexts.
 * CSS counterparts live in globals.css. Keep these in sync.
 */

export const HERITAGE_COLORS = {
  earth:       'var(--color-earth)',
  earthLight:  'var(--color-earth-light)',
  terracotta:  'var(--color-terracotta)',
  gold:        'var(--color-gold)',
  goldLight:   'var(--color-gold-light)',
  moss:        'var(--color-moss)',
  slate:       'var(--color-slate)',
  slateMid:    'var(--color-slate-mid)',
  stone:       'var(--color-stone)',
  parchment:   'var(--color-parchment)',
  ivory:       'var(--color-ivory)',
} as const;

export type HeritageColor = keyof typeof HERITAGE_COLORS;

/** Framer Motion variants reused across the site */
export const ANIMATION_PRESETS = {
  /** Standard fade + slide up — use on section entries */
  fadeInUp: {
    hidden:  { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  },

  /** Stagger container — wrap a list of fadeInUp children */
  staggerContainer: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  },

  /** Stagger item — child of staggerContainer */
  staggerItem: {
    hidden:  { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  },

  /** Scale pop — use on cards and badges */
  scalePop: {
    hidden:  { opacity: 0, scale: 0.88 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
  },

  /** Slide from right — use for detail panels */
  slideRight: {
    hidden:  { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit:    { opacity: 0, x: 60, transition: { duration: 0.3 } },
  },

  /** Slide from left — use for drawer/nav */
  slideLeft: {
    hidden:  { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit:    { opacity: 0, x: -60, transition: { duration: 0.3 } },
  },

  /** Page transition — wrap page content */
  pageTransition: {
    initial:  { opacity: 0, y: 16 },
    animate:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit:     { opacity: 0, y: -16, transition: { duration: 0.3 } },
  },
} as const;

/** Mind-map node type color mapping */
export const NODE_COLORS: Record<string, string> = {
  ancestor:   HERITAGE_COLORS.earth,
  event:      HERITAGE_COLORS.gold,
  monument:   HERITAGE_COLORS.slate,
  era:        HERITAGE_COLORS.terracotta,
  temple:     HERITAGE_COLORS.moss,
  devasthan:  HERITAGE_COLORS.earthLight,
  chabutro:   HERITAGE_COLORS.goldLight,
  panjrapole: HERITAGE_COLORS.moss,
};

/** Heritage location categories */
export const LOCATION_CATEGORIES = [
  { key: 'all',        label: 'All',           labelGu: 'બધા'           },
  { key: 'temple',     label: 'Temples',        labelGu: 'મંદિર'         },
  { key: 'devasthan',  label: 'Devasthan',      labelGu: 'દેવસ્થાન'      },
  { key: 'chabutro',   label: 'Chabutro',       labelGu: 'ચાબૂત્રો'      },
  { key: 'panjrapole', label: 'Panjrapole',     labelGu: 'પાંજરાપોળ'    },
  { key: 'other',      label: 'Other',          labelGu: 'અન્ય'          },
] as const;

export type LocationCategory = (typeof LOCATION_CATEGORIES)[number]['key'];
