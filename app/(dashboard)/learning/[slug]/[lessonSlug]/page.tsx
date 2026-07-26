'use client';

import { useState, use, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import clsx from 'clsx';
import { learningPaths, type Lesson } from '@/lib/data/learning-paths';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function LessonPlayerPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = use(params);
  const { t } = useTranslation();
  const path = learningPaths.find((lp) => lp.slug === slug);
  const completeLesson = useStore((s) => s.completeLesson);
  const isLessonComplete = useStore((s) => s.isLessonComplete);

  // Flatten all lessons
  const allLessons: { lesson: Lesson; moduleIdx: number; lessonIdx: number }[] = [];
  path?.modules.forEach((mod, mi) => {
    mod.lessons.forEach((l, li) => {
      allLessons.push({ lesson: l, moduleIdx: mi, lessonIdx: li });
    });
  });

  const currentIdx = allLessons.findIndex((l) => l.lesson.slug === lessonSlug);
  const current = allLessons[currentIdx];
  const prev = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const next = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const [showCelebration, setShowCelebration] = useState(false);
  const completed = current ? isLessonComplete(slug, current.lesson.slug) : false;

  const handleComplete = () => {
    if (current && !completed) {
      completeLesson(slug, current.lesson.slug);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2500);
    }
  };

  if (!path || !current) {
    return (
      <div className="px-8 py-20 text-center">
        <h1 className="font-display text-3xl text-white mb-4">{t.lesson.notFound}</h1>
        <Link href={`/learning/${slug}`} className="text-accent font-mono text-sm">← {t.lesson.backToPath}</Link>
      </div>
    );
  }

  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => isLessonComplete(slug, l.lesson.slug)).length;
  const pct = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      {/* Back link */}
      <Link
        href={`/learning/${slug}`}
        className="inline-flex items-center gap-1 text-muted font-mono text-xs hover:text-accent mb-6 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        {t.lesson.backTo} {path.title}
      </Link>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-muted text-xs font-mono">{completedCount}/{totalLessons}</span>
      </div>

      {/* Lesson content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Video */}
          <div className="aspect-video bg-surface border border-surface-light rounded-2xl overflow-hidden">
            {current.lesson.locked ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                <svg className="w-12 h-12 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <p className="font-heading font-bold text-lg">{t.lesson.locked}</p>
                <p className="text-sm">{t.lesson.lockedHint}</p>
              </div>
            ) : (
              <iframe src={current.lesson.videoUrl} className="w-full h-full" allowFullScreen title={current.lesson.title} />
            )}
          </div>

          {/* Title & Mark Complete */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl text-white uppercase leading-none mb-1">
                {current.lesson.title}
              </h1>
              <p className="font-mono text-xs text-muted">{current.lesson.duration}</p>
            </div>
            {!current.lesson.locked && (
              <button
                onClick={handleComplete}
                className={clsx(
                  'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all',
                  completed
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 cursor-default'
                    : 'bg-accent text-white hover:bg-accent-glow shadow-[0_0_20px_rgba(255,59,48,0.2)]'
                )}
                disabled={completed}
              >
                {completed ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t.lesson.completed}
                  </>
                ) : (
                  t.lesson.markComplete
                )}
              </button>
            )}
          </div>

          {/* Content */}
          <div className="bg-surface border border-surface-light rounded-2xl p-6 lg:p-8">
            <div className="prose prose-invert max-w-none text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
              {current.lesson.content}
            </div>
          </div>

          {/* Nav */}
          <div className="flex items-center justify-between pt-4">
            {prev ? (
              <Link
                href={`/learning/${slug}/${prev.lesson.slug}`}
                className="flex items-center gap-2 text-muted hover:text-white transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                {prev.lesson.title}
              </Link>
            ) : <div />}
            {next ? (
              <Link
                href={`/learning/${slug}/${next.lesson.slug}`}
                className="flex items-center gap-2 text-accent hover:text-accent-glow transition-colors text-sm font-medium"
              >
                {next.lesson.title}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* Lesson list sidebar */}
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3 px-1">{t.lesson.lessons}</p>
          {allLessons.map((item, i) => {
            const isActive = item.lesson.slug === lessonSlug;
            const isDone = isLessonComplete(slug, item.lesson.slug);
            const isLocked = item.lesson.locked;
            return (
              <Link
                key={item.lesson.slug}
                href={isLocked ? '#' : `/learning/${slug}/${item.lesson.slug}`}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive && 'bg-accent/10 border border-accent/20',
                  !isActive && 'hover:bg-surface-light/50',
                  isLocked && 'opacity-40 pointer-events-none'
                )}
              >
                <span className={clsx(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0',
                  isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  isActive ? 'bg-accent/20 text-accent border border-accent/30' :
                  'bg-surface-light text-muted border border-white/5'
                )}>
                  {isDone ? '✓' : i + 1}
                </span>
                <span className={clsx('truncate', isActive ? 'text-white' : 'text-muted')}>
                  {item.lesson.title}
                </span>
                {isLocked && (
                  <svg className="w-3.5 h-3.5 text-muted shrink-0 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Celebration overlay */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: 3, duration: 0.4 }}
            className="bg-surface border border-accent/30 rounded-3xl p-10 text-center shadow-[0_0_80px_rgba(255,59,48,0.3)]"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.6 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <p className="font-display text-2xl text-white uppercase">Lesson Complete!</p>
            <p className="text-muted text-sm mt-2">Great work. Keep the momentum going.</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
