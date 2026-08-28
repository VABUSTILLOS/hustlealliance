import type { Variants } from 'framer-motion';

/**
 * Shared motion language for the homepage — Apple.com-inspired.
 * Entrances use ease-out-expo (fast attack, long soft settle);
 * interactive elements use springs, not keyframes.
 *
 * Global reduced-motion handling is provided by
 * <MotionConfig reducedMotion="user"> in app/providers.tsx, which
 * automatically strips transform/layout animations for users who
 * prefer reduced motion (opacity fades still run).
 */

/** Apple-style ease-out-expo curve. */
export const EASE_APPLE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Hover lifts, toggle pills, spotlight cards. */
export const SPRING_INTERACTIVE = { type: 'spring', stiffness: 260, damping: 30 } as const;

/** Button presses / taps — snappier, less travel. */
export const SPRING_PRESS = { type: 'spring', stiffness: 500, damping: 28 } as const;

/** Standard section/element entrance: rise + fade. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_APPLE } },
};

/** Parent for staggered children reveals. */
export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Card entrance — rise + fade + subtle scale, Apple product-grid feel. */
export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE_APPLE } },
};

/**
 * Masked line reveal — the child slides up from behind an
 * overflow-hidden parent. Pass the line index via `custom`.
 */
export const maskedLine: Variants = {
  hidden: { y: '110%' },
  show: (i: number = 0) => ({
    y: '0%',
    transition: { duration: 0.9, ease: EASE_APPLE, delay: i * 0.12 },
  }),
};

/** Small spring pop for stats, badges, counters. */
export const springPop: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: SPRING_INTERACTIVE },
};
