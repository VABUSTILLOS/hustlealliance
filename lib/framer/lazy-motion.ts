import dynamic from 'next/dynamic';
import React from 'react';

/**
 * LazyMotion — a dynamically-imported motion component that accepts an `as` prop
 * to render as any HTML element (h1, p, span, div, etc.).
 *
 * Usage:
 *   <LazyMotion as="h1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
 *     Hello
 *   </LazyMotion>
 *
 * SSR disabled since Framer Motion animations only run client-side.
 */
export const LazyMotion = dynamic(
  () =>
    import('framer-motion').then((mod) => {
      const MotionComponent = ({
        as: Tag = 'div',
        ...props
      }: { as?: string } & Record<string, unknown>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return React.createElement((mod.motion as any)[Tag], props);
      };
      return { default: MotionComponent };
    }),
  { ssr: false },
);

/**
 * LazyMotionDiv — convenience alias for <LazyMotion as="div" />.
 * Use in non-critical-path components where animation can wait until after hydration.
 */
export const LazyMotionDiv = dynamic(
  () =>
    import('framer-motion').then((mod) => {
      const MotionDiv = mod.motion.div;
      return { default: MotionDiv };
    }),
  { ssr: false },
);

/**
 * LazyAnimatePresence — a dynamically-imported `AnimatePresence`.
 * Use for enter/exit animations that aren't part of the initial paint.
 */
export const LazyAnimatePresence = dynamic(
  () => import('framer-motion').then((mod) => ({ default: mod.AnimatePresence })),
  { ssr: false },
);
