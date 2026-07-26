'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Badge } from '@/lib/data/gamification';

interface Props {
  badge: Badge | null;
  onClose: () => void;
}

export default function BadgeUnlock({ badge, onClose }: Props) {
  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with particles */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl pointer-events-none"
              initial={{
                x: '50%',
                y: '50%',
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: `${40 + Math.random() * 20}%`,
                y: `${20 + Math.random() * 60}%`,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 1.5 + Math.random(),
                delay: 0.1 + Math.random() * 0.5,
                ease: 'easeOut',
              }}
            >
              {['✨', '🌟', '💫', '🔥', '🎉', '💎'][i % 6]}
            </motion.div>
          ))}

          {/* Badge Card */}
          <motion.div
            className="relative z-10 max-w-sm mx-4"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-accent/30 blur-2xl animate-pulse" />

            <div className="relative p-8 rounded-3xl bg-surface border-2 border-accent/40
              shadow-2xl shadow-accent/20 text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {badge.icon}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-sm text-accent font-semibold uppercase tracking-widest mb-2">
                  Badge Unlocked!
                </h2>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {badge.name}
                </h1>
                <p className="text-foreground-dim text-sm mb-6">
                  {badge.description}
                </p>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm
                    hover:shadow-lg hover:shadow-accent/30 transition-all active:scale-95"
                >
                  Awesome!
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
