'use client';

import { useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import clsx from 'clsx';
import { learningPaths } from '@/lib/data/learning-paths';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function LearningPathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { t } = useTranslation();
  const path = learningPaths.find((lp) => lp.slug === slug);
  const progress = useStore((s) => s.progress);
  const getPathProgress = useStore((s) => s.getPathProgress);
  const isLessonComplete = useStore((s) => s.isLessonComplete);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  if (!path) {
    return (
      <div className="px-8 py-20 text-center">
        <h1 className="font-display text-3xl text-foreground mb-4">{t.learningDetail.notFound}</h1>
        <Link href="/learning" className="text-accent font-mono text-sm hover:underline">← {t.learningDetail.backToLearning}</Link>
      </div>
    );
  }

  const totalLessons = path.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const pct = getPathProgress(slug, totalLessons);
  const enrolled = !!progress[slug];
  const completedCount = progress[slug]?.completedLessons.length ?? 0;

  const toggleModule = (id: string) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/5 to-transparent" />
        <div className="relative px-4 sm:px-6 lg:px-8 py-12 lg:py-16 max-w-7xl mx-auto">
          <Link href="/learning" className="inline-flex items-center gap-1 text-muted font-mono text-xs hover:text-accent mb-6 transition-colors">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            {t.learningDetail.backToLearning}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
                {path.category} • {path.difficulty} • {path.duration}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase leading-none mb-4">
                {path.title}
              </h1>
              <p className="text-lg text-foreground-muted max-w-2xl">{path.tagline}</p>
              <p className="text-muted mt-4 max-w-2xl">{path.description}</p>

              {/* Progress Bar */}
              {enrolled && (
                <div className="mt-6 max-w-md">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-muted uppercase">{t.learningDetail.progress}</span>
                    <span className="font-mono text-accent">{completedCount}/{totalLessons} {t.learningDetail.lessons}</span>
                  </div>
                  <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      className="h-full bg-accent rounded-full"
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )}

              {/* CTA */}
              <Link
                href={
                  enrolled
                    ? `/learning/${slug}/${path.modules[0].lessons[0].slug}`
                    : `/learning/${slug}/${path.modules[0].lessons[0].slug}`
                }
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-heading font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-accent-glow shadow-[0_0_30px_rgba(255,59,48,0.2)] hover:shadow-[0_0_50px_rgba(255,59,48,0.4)] transition-all"
              >
                {enrolled ? t.learningDetail.continuePath : t.learningDetail.startPath}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author */}
              <div className="bg-surface border border-surface-light rounded-2xl p-5">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-4">{t.learningDetail.instructor}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <img src={path.author.avatar} alt={path.author.name}
                    className="w-12 h-12 rounded-full border-2 border-white/10 object-cover" />
                  <div>
                    <p className="font-heading font-bold text-foreground text-sm">{path.author.name}</p>
                    <p className="text-muted text-xs">{path.author.role}</p>
                  </div>
                </div>
                <p className="text-muted text-xs leading-relaxed">{path.author.bio}</p>
              </div>

              {/* Resources */}
              <div className="bg-surface border border-surface-light rounded-2xl p-5">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-4">{t.learningDetail.resources}</h3>
                <ul className="space-y-2">
                  {path.resources.map((r) => (
                    <li key={r.label}>
                      <a href={r.url} className="flex items-center gap-2 text-foreground-muted text-sm hover:text-accent transition-colors">
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        {r.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Community discussion link */}
              {path.communitySpaceSlug && (
                <Link
                  href={`/spaces/${path.communitySpaceSlug}`}
                  className="block bg-surface border border-surface-light rounded-2xl p-5 hover:border-accent/20 transition-colors group"
                >
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
                    {t.gamification.discussTab}
                  </h3>
                  <p className="text-foreground-muted text-sm mb-2">
                    {t.gamification.studyGroupDesc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-accent text-sm font-medium group-hover:text-accent-glow transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    {t.gamification.joinStudyGroup}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Accordion */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <h2 className="font-heading font-bold text-foreground text-xl mb-8">{t.learningDetail.curriculum}</h2>
        <div className="space-y-3 max-w-3xl">
          {path.modules.map((mod, mi) => {
            const isOpen = expandedModule === mod.id;
            const modCompleted = mod.lessons.every((l) => isLessonComplete(slug, l.slug));
            return (
              <div key={mod.id}
                className="bg-surface border border-surface-light rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-light/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={clsx(
                      'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0',
                      modCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-surface-light text-muted border border-white/10'
                    )}>
                      {modCompleted ? '✓' : mi + 1}
                    </span>
                    <div>
                      <p className="font-heading font-bold text-foreground text-sm">{t.learningDetail.module} {mi + 1}</p>
                      <p className="text-muted text-sm">{mod.title}</p>
                    </div>
                  </div>
                  <motion.svg
                    className="w-5 h-5 text-muted"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-surface-light">
                        {mod.lessons.map((lesson) => {
                          const completed = isLessonComplete(slug, lesson.slug);
                          return (
                            <Link
                              key={lesson.slug}
                              href={lesson.locked ? '#' : `/learning/${slug}/${lesson.slug}`}
                              className={clsx(
                                'flex items-center gap-3 px-5 py-3 hover:bg-surface-light/30 transition-colors',
                                lesson.locked && 'opacity-50 pointer-events-none'
                              )}
                            >
                              {completed ? (
                                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                  <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                </span>
                              ) : lesson.locked ? (
                                <svg className="w-5 h-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-foreground text-sm">{lesson.title}</p>
                              </div>
                              <span className="text-muted text-xs font-mono">{lesson.duration}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
