'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function GlassCard({
  children,
  className,
  hoverEffect = false,
}: GlassCardProps) {
  if (!hoverEffect) {
    return (
      <div className={clsx('glass-card', className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={clsx('glass-card', className)}
      whileHover={{
        scale: 1.02,
        boxShadow: [
          '0 0 20px rgba(180, 76, 240, 0.4)',
          '0 0 40px rgba(180, 76, 240, 0.3)',
          '0 0 60px rgba(180, 76, 240, 0.2)',
          'inset 0 0 20px rgba(180, 76, 240, 0.1)',
        ].join(', '),
        borderColor: 'rgba(180, 76, 240, 0.6)',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
