'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';

const plannerTasks = [
  { text: 'Finalize pitch deck v3', done: true, indent: 0 },
  { text: 'Send investor updates', done: false, indent: 0 },
  { text: 'Review analytics dashboard', done: true, indent: 0 },
  { text: 'Prep for demo day', done: false, indent: 1 },
  { text: 'Draft user interview questions', done: false, indent: 1 },
  { text: 'Update financial model', done: false, indent: 0 },
  { text: 'Q1 projections', done: true, indent: 1 },
  { text: 'Hiring pipeline review', done: false, indent: 0 },
];

export default function PlannerPreview() {
  const { t } = useTranslation();

  return (
    <section className="relative py-16 lg:py-32 px-4 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-[var(--color-violet)]/5 to-[var(--color-magenta)]/5 rounded-full blur-[150px]" />
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
            {t.plannerPreview.tag}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--color-foreground)] uppercase leading-tight max-w-3xl mx-auto">
            {t.plannerPreview.headline}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--color-foreground-muted)] max-w-xl mx-auto">
            {t.plannerPreview.subtitle}
          </p>
        </motion.div>

        {/* Planner preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="max-w-md mx-auto mb-12"
        >
          <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] p-5 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border-subtle)]">
              <div>
                <p className="font-heading font-bold text-sm text-[var(--color-foreground)]">This Week</p>
                <p className="text-[10px] font-mono text-[var(--color-foreground-dim)] mt-0.5">3 of 8 completed</p>
              </div>
              <span className="text-lg">📋</span>
            </div>

            {/* Task list */}
            <div className="space-y-1.5">
              {plannerTasks.map((task, i) => (
                <motion.div
                  key={task.text}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-2.5 py-1.5"
                  style={{ paddingLeft: `${task.indent * 16}px` }}
                >
                  <div
                    className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                      task.done
                        ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
                        : 'border-[var(--color-border-subtle)]'
                    }`}
                  >
                    {task.done && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-xs ${
                      task.done
                        ? 'text-[var(--color-foreground-dim)] line-through'
                        : 'text-[var(--color-foreground)]'
                    }`}
                  >
                    {task.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)]">
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-foreground-dim)] mb-2">
                <span>Weekly progress</span>
                <span>37%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--color-surface-light)] overflow-hidden">
                <div className="h-full w-[37%] rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-violet)]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/planner"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]
              text-[var(--color-foreground)] font-heading font-bold text-sm
              hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)] transition-all duration-300"
          >
            {t.plannerPreview.cta}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
