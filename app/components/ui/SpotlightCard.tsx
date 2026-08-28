'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { SPRING_INTERACTIVE } from '@/lib/motion/variants';
import { useFinePointer } from '@/lib/motion/use-fine-pointer';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Tint of the cursor spotlight. Defaults to the accent red. */
  spotlightColor?: string;
  /** Accent-tinted border for highlighted cards (e.g. the popular tier). */
  accent?: boolean;
}

/**
 * Apple.com/v0-style card: large radius, hairline border, inner top light,
 * cursor-tracked radial spotlight, and a restrained spring lift on hover.
 * Pointer tracking only activates on fine-pointer devices and is fully
 * disabled under prefers-reduced-motion.
 */
export default function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(255, 59, 48, 0.10)',
  accent = false,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [spotlightOpacity, setSpotlightOpacity] = useState(0);

  const trackCursor = !reduceMotion && finePointer;

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={trackCursor ? handleMove : undefined}
      onMouseEnter={trackCursor ? () => setSpotlightOpacity(1) : undefined}
      onMouseLeave={trackCursor ? () => setSpotlightOpacity(0) : undefined}
      whileHover={trackCursor ? { y: -4, scale: 1.01 } : undefined}
      transition={SPRING_INTERACTIVE}
      className={clsx(
        'relative overflow-hidden rounded-3xl border bg-surface',
        accent ? 'border-accent/40' : 'border-white/10',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
        className
      )}
    >
      {/* Cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: spotlightOpacity,
          background: `radial-gradient(480px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}
