import dynamic from 'next/dynamic';

/**
 * LazyMotionDiv — a dynamically-imported `motion.div` component.
 * Use in non-critical-path components where animation can wait until after hydration.
 * Includes ssr: false since Framer Motion animations only run client-side.
 */
export const LazyMotionDiv = dynamic(
  () => import('framer-motion').then((mod) => {
    const MotionDiv = mod.motion.div;
    return { default: MotionDiv };
  }),
  { ssr: false }
);

/**
 * LazyAnimatePresence — a dynamically-imported `AnimatePresence`.
 * Use for enter/exit animations that aren't part of the initial paint.
 */
export const LazyAnimatePresence = dynamic(
  () => import('framer-motion').then((mod) => ({ default: mod.AnimatePresence })),
  { ssr: false }
);
