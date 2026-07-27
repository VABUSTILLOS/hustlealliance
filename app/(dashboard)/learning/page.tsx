'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import clsx from 'clsx';
import { useCourses } from '@/lib/hooks/useCourses';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import PreviewModal from '@/app/components/PreviewModal';
import { Shield } from 'lucide-react';

const difficultyColors: Record<string, string> = {
  BEGINNER: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  INTERMEDIATE: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  ADVANCED: 'text-accent bg-accent/10 border-accent/20',
};

const difficultyLabels: Record<string, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};

export default function LearningCatalogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [myPathsOnly, setMyPathsOnly] = useState(false);
  const [previewPath, setPreviewPath] = useState<string | null>(null);

  const { data: courses, isLoading } = useCourses({
    category: activeCategory !== 'All' ? activeCategory.toLowerCase() : undefined,
  });

  const progress = useStore((s) => s.progress);
  const getPathProgress = useStore((s) => s.getPathProgress);
  const { t } = useTranslation();

  // Derive unique categories from courses
  const categories = courses
    ? [...new Set(courses.map((c) => c.category?.name).filter((n): n is string => !!n))]
    : [];

  const filtered = (courses || []).filter((c) => {
    if (myPathsOnly && !progress[c.slug]) return false;
    return true;
  });

  const previewData = previewPath ? courses?.find(p => p.slug === previewPath) : undefined;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
          {t.learning.tag}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase leading-none">
          {t.learning.headline}
        </h1>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-2">
          {['All', ...(Array.isArray(categories) ? categories : [])].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                'relative px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300',
                activeCategory === cat
                  ? 'text-foreground bg-accent/20 border border-accent/40'
                  : 'text-muted border border-foreground-dim hover:text-foreground hover:border-foreground-dim'
              )}
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="catPill"
                  className="absolute inset-0 rounded-full bg-accent/10 border border-accent/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat === 'All' ? t.learning.all : cat}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setMyPathsOnly(!myPathsOnly)}
          className={clsx(
            'px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-all',
            myPathsOnly
              ? 'text-foreground bg-accent/20 border-accent/40'
              : 'text-muted border-foreground-dim hover:text-foreground hover:border-foreground-dim'
          )}
        >
          {myPathsOnly ? t.learning.myPathsActive : t.learning.myPaths}
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-surface-light rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-surface-light" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-surface-light rounded w-1/3" />
                <div className="h-5 bg-surface-light rounded w-2/3" />
                <div className="h-4 bg-surface-light rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {!isLoading && (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((course, i) => {
              const totalLessons = course._count.modules;
              const pct = getPathProgress(course.slug, totalLessons);
              const enrolled = !!progress[course.slug];

              return (
                <motion.div
                  key={course.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    href={`/learning/${course.slug}`}
                    className="block group h-full"
                  >
                    <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-accent/20 hover:shadow-[0_20px_60px_rgba(255,59,48,0.08)] h-full flex flex-col">
                      {/* Thumbnail */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={course.thumbnail || 'https://images.unsplash.com/photo-1553484771-371e845efba1?w=800&h=500&fit=crop'}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                        {/* Difficulty badge */}
                        <span
                          className={clsx(
                            'absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase border',
                            difficultyColors[course.difficulty] || difficultyColors.BEGINNER
                          )}
                        >
                          {difficultyLabels[course.difficulty] || course.difficulty}
                        </span>
                        {/* Access level badge */}
                        {course.accessLevel !== 'FREE' && (
                          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-mono uppercase border border-amber-500/20 bg-amber-500/10 text-amber-400 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {course.accessLevel}
                          </span>
                        )}
                        {/* Progress indicator */}
                        {enrolled && (
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  className="h-full bg-accent rounded-full"
                                  transition={{ duration: 0.6, delay: 0.2 }}
                                />
                              </div>
                              <span className="text-white text-[10px] font-mono">{pct}%</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-accent mb-2">
                          {course.category?.name} • {course.durationWeeks} weeks
                        </p>
                        <h3 className="font-heading font-bold text-foreground text-lg mb-1.5 group-hover:text-accent transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-muted text-sm flex-1">{course.tagline}</p>
                        {/* Preview button */}
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewPath(course.slug); }}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-glow transition-colors group-hover:gap-2 group-hover:translate-x-0.5 transition-all"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                          <span>{t.gamification.previewFor}</span>
                          <motion.svg
                            className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </motion.svg>
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted py-16"
        >
          {t.learning.noResults}
        </motion.p>
      )}

      {/* Preview Modal */}
      {previewData && (
        <PreviewModal
          isOpen={!!previewPath}
          onClose={() => setPreviewPath(null)}
          title={previewData.title}
          slug={previewPath || ''}
          insights={[]}
        />
      )}
    </div>
  );
}
