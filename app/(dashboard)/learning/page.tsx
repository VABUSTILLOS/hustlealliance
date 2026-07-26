'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import clsx from 'clsx';
import { learningPaths, categories as allCats, type Category } from '@/lib/data/learning-paths';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import PreviewModal from '@/app/components/PreviewModal';

const difficultyColors: Record<string, string> = {
  Beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Advanced: 'text-accent bg-accent/10 border-accent/20',
};

export default function LearningCatalogPage() {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [myPathsOnly, setMyPathsOnly] = useState(false);
  const [previewPath, setPreviewPath] = useState<string | null>(null);
  const progress = useStore((s) => s.progress);
  const getPathProgress = useStore((s) => s.getPathProgress);
  const { t } = useTranslation();

  const previewData = previewPath ? learningPaths.find(p => p.slug === previewPath) : undefined;

  const filtered = learningPaths.filter((lp) => {
    if (activeCategory !== 'All' && lp.category !== activeCategory) return false;
    if (myPathsOnly && !progress[lp.slug]) return false;
    return true;
  });

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
          {(['All', ...allCats] as const).map((cat) => (
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

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((lp, i) => {
            const totalLessons = lp.modules.reduce((sum, m) => sum + m.lessons.length, 0);
            const pct = getPathProgress(lp.slug, totalLessons);
            const enrolled = !!progress[lp.slug];

            return (
              <motion.div
                key={lp.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  href={`/learning/${lp.slug}`}
                  className="block group h-full"
                >
                  <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-accent/20 hover:shadow-[0_20px_60px_rgba(255,59,48,0.08)] h-full flex flex-col">
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={lp.thumbnail}
                        alt={lp.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                      {/* Difficulty badge */}
                      <span
                        className={clsx(
                          'absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase border',
                          difficultyColors[lp.difficulty]
                        )}
                      >
                        {t.learning.difficulty[lp.difficulty as keyof typeof t.learning.difficulty]}
                      </span>
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
                    <div className="p-5 flex flex-col flex-1">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-accent mb-2">
                        {lp.category} • {lp.duration}
                      </p>
                      <h3 className="font-heading font-bold text-foreground text-lg mb-1.5 group-hover:text-accent transition-colors">
                        {lp.title}
                      </h3>
                      <p className="text-muted text-sm flex-1">{lp.tagline}</p>
                      {/* Preview button */}
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewPath(lp.slug); }}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-glow transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                        {t.gamification.previewFor}
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
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
          insights={previewData.keyInsights}
        />
      )}
    </div>
  );
}
