'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { learningPaths } from '@/lib/data/learning-paths';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { t } = useTranslation();
  const path = learningPaths.find((lp) => lp.slug === slug);

  if (!path) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="font-display text-3xl text-[var(--color-foreground)] uppercase mb-2">
          Path Not Found
        </h1>
        <p className="text-[var(--color-foreground-muted)] mb-6">
          The learning path you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-[var(--color-accent)] text-white font-heading font-bold text-sm hover:shadow-[0_0_30px_rgba(255,59,48,0.3)] transition-all"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  const firstModule = path.modules[0];
  const firstLesson = firstModule?.lessons[0];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[var(--color-foreground-dim)] font-mono text-xs hover:text-[var(--color-accent)] mb-8 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Hustle Alliance
        </Link>

        {/* Hero info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">
            {path.category} • {path.difficulty} • {path.duration}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--color-foreground)] uppercase leading-none mb-4">
            {path.title}
          </h1>
          <p className="text-lg text-[var(--color-foreground-muted)] max-w-2xl">
            {path.tagline}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Video placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="aspect-video bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden"
            >
              {firstLesson?.videoUrl ? (
                <iframe
                  src={firstLesson.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={firstLesson.title}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-foreground-dim)]">
                  <svg className="w-16 h-16 mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <p className="font-heading font-bold">Video preview</p>
                </div>
              )}
            </motion.div>

            {/* Lesson content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-display text-xl sm:text-2xl text-[var(--color-foreground)] uppercase mb-2">
                {firstLesson?.title || 'Sample Lesson'}
              </h2>
              <p className="font-mono text-xs text-[var(--color-foreground-dim)] mb-6">
                {firstLesson?.duration || '5 min'} • Free Preview
              </p>

              {firstLesson?.insights && firstLesson.insights.length > 0 && (
                <div className="mb-6 relative">
                  <p className="text-[var(--color-foreground-muted)] text-xs uppercase tracking-wider mb-3 font-mono">
                    Key Insights
                  </p>
                  <div className="relative">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                      {firstLesson.insights.map((insight, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="flex-shrink-0 w-56 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[var(--color-accent)]/20 transition-colors"
                        >
                          <span className="text-2xl block mb-2">{insight.icon}</span>
                          <h4 className="font-semibold text-[var(--color-foreground)] text-sm mb-1">
                            {insight.title}
                          </h4>
                          <p className="text-[var(--color-foreground-dim)] text-xs leading-relaxed">
                            {insight.insight}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                    {/* Scroll indicator — gradient fade on right */}
                    {firstLesson.insights.length > 2 && (
                      <div className="absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-[var(--color-bg)] via-[var(--color-bg)]/60 to-transparent pointer-events-none flex items-center justify-end pr-1">
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-[var(--color-foreground-dim)] opacity-60"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Full lesson content */}
              {firstLesson?.content && (
                <div className="prose prose-invert max-w-none text-[var(--color-foreground-muted)] text-sm leading-relaxed whitespace-pre-wrap
                  bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 lg:p-8">
                  {firstLesson.content}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar — CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Enrollment CTA */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 rounded-2xl p-6 text-center
              shadow-[0_0_40px_rgba(255,59,48,0.08)]">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-heading font-bold text-[var(--color-foreground)] text-lg mb-2">
                Ready to go deeper?
              </h3>
              <p className="text-[var(--color-foreground-dim)] text-sm mb-5">
                Join Hustle Alliance to unlock all {path.totalLessons} lessons, earn badges, and connect with {path.studentCount.toLocaleString()}+ founders.
              </p>
              <Link
                href="/login"
                className="block w-full py-3 rounded-xl bg-[var(--color-accent)] text-white font-heading font-bold text-sm
                  hover:shadow-[0_0_30px_rgba(255,59,48,0.3)] transition-all active:scale-[0.98]"
              >
                Start Free — Join the Alliance
              </Link>
              <p className="text-[var(--color-foreground-dim)] text-xs mt-3">
                No credit card required. Free forever tier available.
              </p>
            </div>

            {/* Path overview */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-foreground-dim)] mb-4">
                What you&apos;ll learn
              </h3>
              <ul className="space-y-3">
                {path.modules.map((mod, i) => (
                  <li key={mod.id} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-xs font-mono text-[var(--color-foreground-dim)] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[var(--color-foreground)] text-sm font-medium">{mod.title}</p>
                      <p className="text-[var(--color-foreground-dim)] text-xs">
                        {mod.lessons.length} lessons
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Author */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-foreground-dim)] mb-4">
                Instructor
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src={path.author.avatar}
                  alt={path.author.name}
                  className="w-12 h-12 rounded-full border-2 border-white/10 object-cover"
                />
                <div>
                  <p className="font-heading font-bold text-[var(--color-foreground)] text-sm">
                    {path.author.name}
                  </p>
                  <p className="text-[var(--color-foreground-dim)] text-xs">{path.author.role}</p>
                </div>
              </div>
              <p className="text-[var(--color-foreground-dim)] text-xs mt-3 leading-relaxed">
                {path.author.bio}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
