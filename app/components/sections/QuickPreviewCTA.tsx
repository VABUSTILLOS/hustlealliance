'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { learningPaths, getLearningPathLocale } from '@/lib/data/learning-paths';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function QuickPreviewCTA() {
  const { t, locale } = useTranslation();
  const featuredPaths = learningPaths.slice(0, 3).map(p => getLearningPathLocale(p, locale));
  const [email, setEmail] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    // Simulate API call — replace with real endpoint when ready
    setTimeout(() => {
      setUnlocked(true);
      setLoading(false);
    }, 800);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-14 sm:py-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent)]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            {t.quickPreview.tag}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--color-foreground)] uppercase leading-tight">
            {t.quickPreview.headline1}{' '}
            <span className="bg-gradient-to-r from-[var(--color-violet)] to-[var(--color-magenta)] bg-clip-text text-transparent">{t.quickPreview.headlineHighlight}</span>
            <br />
            {t.quickPreview.headline2}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--color-foreground-muted)] max-w-lg mx-auto">
            {t.quickPreview.description}
          </p>
        </motion.div>

        {!unlocked ? (
          /* Email gate — capture before showing lessons */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.quickPreview.emailPlaceholder || 'Where should we send it?'}
                required
                className="flex-1 px-4 py-3 min-h-[48px] rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder:text-zinc-500 
                  focus:outline-none focus:border-accent/50 focus:bg-white/8 transition-all duration-200"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 min-h-[48px] rounded-xl bg-[var(--color-accent)] text-white font-heading font-bold text-sm
                  hover:shadow-[0_0_40px_rgba(255,59,48,0.3)] transition-all active:scale-[0.97] disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    {t.quickPreview.cta}
                  </>
                )}
              </button>
            </form>
            <p className="mt-3 text-xs text-center text-[var(--color-foreground-dim)]">
              {t.quickPreview.disclaimer}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Featured path cards — shown after email unlock */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {featuredPaths.map((path) => (
                <motion.div key={path.slug} variants={item}>
                  <Link
                    href={`/preview/${path.slug}`}
                    className="group block p-5 sm:p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]
                      hover:border-[var(--color-accent)]/30 hover:shadow-[0_0_30px_rgba(255,59,48,0.08)]
                      transition-all duration-300 h-full"
                  >
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider
                      bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 mb-3">
                      {path.category}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl text-[var(--color-foreground)] uppercase mb-2
                      group-hover:text-[var(--color-accent)] transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-[var(--color-foreground-dim)] text-sm mb-4 line-clamp-2">
                      {path.tagline}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-foreground-dim)]">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18M9 21V9" />
                        </svg>
                        {path.modules.length} {t.quickPreview.modules}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {path.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 20h20M5 20V8l7-5 7 5v12" />
                        </svg>
                        {path.difficulty}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center gap-2 text-[var(--color-accent)] text-sm font-heading font-bold
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {t.quickPreview.previewLesson}
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom CTA — already unlocked, direct link */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link
                href="/preview/fundraising-101"
                className="inline-flex items-center gap-2 px-8 py-4 min-h-[48px] rounded-xl bg-[var(--color-accent)] text-white font-heading font-bold text-sm
                  hover:shadow-[0_0_40px_rgba(255,59,48,0.3)] transition-all active:scale-[0.97]
                  animate-pulse-glow"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                {t.quickPreview.cta}
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
