'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  getLocalizedJourneyLevels,
  getLevelsForPage,
  getTotalPages,
  LEVELS_PER_PAGE,
  DEV_MODE,
} from '@/lib/data/journey';

export default function JourneyPage() {
  const { t, locale } = useTranslation();
  const journeyProgress = useStore((s) => s.journeyProgress);
  const getLevelProgress = useStore((s) => s.getLevelProgress);
  const isLevelComplete = useStore((s) => s.isLevelComplete);

  const levels = getLocalizedJourneyLevels(locale as 'en' | 'es');
  const totalPages = getTotalPages();

  // Find the page containing the first incomplete/unlocked level
  let defaultPage = 1;
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const completed = isLevelComplete(level.id);
    const isUnlocked = DEV_MODE || i === 0 || isLevelComplete(levels[i - 1].id);
    if (!completed && isUnlocked) {
      defaultPage = Math.floor(i / LEVELS_PER_PAGE) + 1;
      break;
    }
    // If all levels complete, stay on last page
    if (i === levels.length - 1) defaultPage = totalPages;
  }

  const [currentPage, setCurrentPage] = useState(defaultPage);
  const pageLevels = getLevelsForPage(currentPage);

  // Determine current phase name from the first level on this page
  const phaseName = pageLevels[0]?.phaseName || '';

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
          {t.journey.title}
        </h1>
        <p className="text-muted">{t.journey.subtitle}</p>
      </div>

      {/* Pagination controls — top */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        phaseName={phaseName}
        onPageChange={goToPage}
        t={t}
      />

      {/* Level Roadmap */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-surface-light hidden md:block" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {pageLevels.map((level, index) => {
              const globalIndex = (currentPage - 1) * LEVELS_PER_PAGE + index;
              const completed = isLevelComplete(level.id);
              const progress = getLevelProgress(level.id, level.tasks.length);
              const isLocked = !DEV_MODE && globalIndex > 0 && !isLevelComplete(levels[globalIndex - 1].id) && !completed;
              const isUnlocked = DEV_MODE || globalIndex === 0 || isLevelComplete(levels[globalIndex - 1].id);

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Link
                    href={isLocked ? '#' : `/journey/${level.id}`}
                    className={`block relative pl-12 md:pl-14 ${isLocked ? 'pointer-events-none' : ''}`}
                  >
                    {/* Node */}
                    <div
                      className={`absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all z-10
                        ${completed
                          ? 'bg-accent border-accent shadow-[0_0_16px_rgba(255,59,48,0.5)]'
                          : isUnlocked && !completed
                            ? 'bg-transparent border-accent shadow-[0_0_12px_rgba(255,59,48,0.4)]'
                            : 'bg-transparent border-surface-light opacity-40'
                        }`}
                    >
                      {completed ? '✓' : level.badgeIcon}
                    </div>

                    {/* Card */}
                    <div
                      className={`rounded-2xl p-4 md:p-5 border transition-all
                        ${isUnlocked && !completed
                          ? 'bg-accent/5 border-accent/30 shadow-[0_0_20px_rgba(255,59,48,0.1)]'
                          : completed
                            ? 'bg-surface/50 border-surface-light'
                            : 'bg-surface/30 border-surface-light opacity-50'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-accent font-bold">
                              {t.journey.level} {level.id}
                            </span>
                            {completed && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
                                {t.journey.levelComplete}
                              </span>
                            )}
                            {isLocked && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-light text-muted font-medium">
                                🔒
                              </span>
                            )}
                          </div>
                          <h3 className="text-foreground font-heading font-bold text-lg">
                            {level.title}
                          </h3>
                          <p className="text-muted text-sm mt-1 line-clamp-2">
                            {level.description}
                          </p>

                          {/* Progress bar */}
                          <div className="mt-3 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted">
                                {journeyProgress[String(level.id)]?.tasks
                                  ? Object.values(journeyProgress[String(level.id)].tasks).filter((t) => t.completed).length
                                  : 0} / {level.tasks.length} {t.journey.tasksCompleted}
                              </span>
                              <span className="text-accent font-bold">{progress}%</span>
                            </div>
                            <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-accent rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* XP badge */}
                        <div className="shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-surface-light/50 border border-white/5">
                          <span className="text-xl">{completed ? '🎉' : level.badgeIcon}</span>
                          <span className="text-[10px] text-muted font-mono">+{level.xpReward} XP</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination controls — bottom */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        phaseName={phaseName}
        onPageChange={goToPage}
        t={t}
      />
    </div>
  );
}

// ── Pagination Bar Component ──────────────────────────────────────

function PaginationBar({
  currentPage,
  totalPages,
  phaseName,
  onPageChange,
  t,
}: {
  currentPage: number;
  totalPages: number;
  phaseName: string;
  onPageChange: (page: number) => void;
  t: Record<string, any>;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-surface/50 border border-surface-light">
      {/* Phase info */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-accent font-bold px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
          {t.journey.phase || 'Phase'} {currentPage}
        </span>
        {phaseName && (
          <span className="text-sm text-foreground font-medium hidden sm:inline">{phaseName}</span>
        )}
      </div>

      {/* Page nav */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1.5 text-sm rounded-lg bg-surface-light text-muted hover:text-foreground hover:bg-surface transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← {t.journey.previous || 'Previous'}
        </button>

        <span className="text-sm text-foreground font-mono font-bold min-w-[80px] text-center">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1.5 text-sm rounded-lg bg-surface-light text-muted hover:text-foreground hover:bg-surface transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {t.journey.next || 'Next'} →
        </button>
      </div>
    </div>
  );
}
