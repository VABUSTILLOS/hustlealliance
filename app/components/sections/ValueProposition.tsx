'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function ValueProposition() {
  const { t } = useTranslation();

  return (
    <section className="relative py-14 lg:py-24 px-4 bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[var(--color-accent)]/8 via-[var(--color-violet)]/5 to-transparent rounded-full blur-[160px]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-violet)]/20 border border-[var(--color-accent)]/20">
            <span className="text-3xl">⚡</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--color-foreground)] uppercase leading-tight mb-8"
        >
          {t.valueProp.headline}
        </motion.h2>

        {/* Three key points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-10"
        >
          <p className="text-base sm:text-lg text-[var(--color-foreground-muted)]">
            <span className="text-[var(--color-accent)] font-bold">❌</span>{' '}
            {t.valueProp.line1}
          </p>
          <p className="text-base sm:text-lg text-[var(--color-foreground-muted)]">
            <span className="text-[var(--color-emerald)] font-bold">✅</span>{' '}
            {t.valueProp.line2}
          </p>
          <p className="text-base sm:text-lg text-[var(--color-foreground)] font-heading font-bold">
            {t.valueProp.line3}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-5 min-h-[48px] rounded-xl bg-[var(--color-accent)] text-white font-heading font-bold text-base
              hover:shadow-[0_0_50px_rgba(255,59,48,0.4)] transition-all active:scale-[0.97] animate-pulse-glow"
          >
            {t.valueProp.cta}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
