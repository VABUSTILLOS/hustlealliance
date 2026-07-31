'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function StickyCTA() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroHeight = window.innerHeight;
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          setVisible(window.scrollY > heroHeight * 0.6);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 min-h-[48px] rounded-xl bg-[var(--color-accent)] text-white font-heading font-bold text-sm
              shadow-[0_8px_40px_rgba(255,59,48,0.4)] hover:shadow-[0_12px_50px_rgba(255,59,48,0.5)]
              transition-all duration-300 hover:scale-105 active:scale-[0.97]"
          >
            {t.hero.cta1}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
