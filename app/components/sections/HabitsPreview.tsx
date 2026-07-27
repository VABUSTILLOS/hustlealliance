'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';

const habitPreviewCards = [
  { icon: '🏃', label: 'Morning Routine', streak: 7, color: '#34C759' },
  { icon: '📖', label: 'Daily Reading', streak: 12, color: '#007AFF' },
  { icon: '✍️', label: 'Journaling', streak: 5, color: '#FF9500' },
  { icon: '🧘', label: 'Meditation', streak: 21, color: '#AF52DE' },
];

export default function HabitsPreview() {
  const { t } = useTranslation();

  return (
    <section className="relative py-16 lg:py-32 px-4 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[var(--color-accent)]/3 rounded-full blur-[130px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            {t.habitsPreview.tag}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--color-foreground)] uppercase leading-tight max-w-3xl mx-auto">
            {t.habitsPreview.headline}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--color-foreground-muted)] max-w-xl mx-auto">
            {t.habitsPreview.subtitle}
          </p>
        </motion.div>

        {/* Habit preview cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10"
        >
          {habitPreviewCards.map((habit) => (
            <div
              key={habit.label}
              className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-center
                hover:border-[var(--color-accent)]/20 transition-all duration-300"
            >
              <span className="text-3xl block mb-2">{habit.icon}</span>
              <p className="text-xs font-mono text-[var(--color-foreground-dim)] mb-1.5">{habit.label}</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg font-display font-bold" style={{ color: habit.color }}>
                  {habit.streak}
                </span>
                <span className="text-[10px] font-mono text-[var(--color-foreground-dim)]">{t.habitsPreview.dayStreak}</span>
              </div>
              {/* Mini progress bar */}
              <div className="mt-2 h-1 rounded-full bg-[var(--color-surface-light)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(habit.streak / 30) * 100}%`,
                    backgroundColor: habit.color,
                  }}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="text-center max-w-lg mx-auto mb-10"
        >
          <p className="text-sm sm:text-base italic text-[var(--color-foreground-dim)]">
            {t.habitsPreview.quote}
          </p>
          <footer className="mt-2 text-xs font-mono text-[var(--color-foreground-muted)]">
            — {t.habitsPreview.quoteAuthor}
          </footer>
        </motion.blockquote>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/founder-survival"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]
              text-[var(--color-foreground)] font-heading font-bold text-sm
              hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)] transition-all duration-300"
          >
            {t.habitsPreview.cta}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
