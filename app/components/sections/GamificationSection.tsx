'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';

const tiers = [
  { key: 'homeTier1', icon: '💡', color: '#FFD700' },
  { key: 'homeTier2', icon: '🔍', color: '#4ECDC4' },
  { key: 'homeTier3', icon: '🛠️', color: '#7C3AED' },
  { key: 'homeTier4', icon: '🚀', color: '#FF6B35' },
  { key: 'homeTier5', icon: '📈', color: '#34C759' },
  { key: 'homeTier6', icon: '🏆', color: '#FF3B30' },
];

const stats = [
  { count: '100+', labelKey: 'stat1Label', icon: '✅' },
  { count: '10', labelKey: 'stat2Label', icon: '🏔️' },
  { count: '2,500+', labelKey: 'stat3Label', icon: '⚡' },
];

export default function GamificationSection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 lg:py-32 px-4 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-accent)]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-violet)]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            {t.gamification.homeTag}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--color-foreground)] uppercase leading-tight max-w-3xl mx-auto">
            {t.gamification.homeHeadline}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--color-foreground-muted)] max-w-xl mx-auto">
            {t.gamification.homeSubtitle}
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-14"
        >
          {stats.map((stat) => (
            <div
              key={stat.labelKey}
              className="text-center p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]"
            >
              <span className="text-2xl block mb-1">{stat.icon}</span>
              <p className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
                {stat.count}
              </p>
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[var(--color-foreground-dim)] mt-1">
                {t.gamification[stat.labelKey as keyof typeof t.gamification]}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Tier journey visualization */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12"
        >
          {tiers.map((tier, i) => (
            <div key={tier.key} className="flex items-center gap-0">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center border transition-all duration-300 hover:scale-110"
                style={{
                  borderColor: tier.color + '40',
                  backgroundColor: tier.color + '10',
                }}
              >
                <span className="text-xl sm:text-2xl">{tier.icon}</span>
                <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-[var(--color-foreground-dim)] mt-0.5">
                  {t.gamification[tier.key as keyof typeof t.gamification]}
                </span>
              </div>
              {i < tiers.length - 1 && (
                <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-[var(--color-accent)]/30 to-[var(--color-accent)]/10 mx-1" />
              )}
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="text-center"
        >
          <Link
            href="/journey"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--color-accent)] text-white font-heading font-bold text-sm
              hover:shadow-[0_0_40px_rgba(255,59,48,0.3)] transition-all active:scale-[0.97]"
          >
            {t.gamification.homeCta}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
