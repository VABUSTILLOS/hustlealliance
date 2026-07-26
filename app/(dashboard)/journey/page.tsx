'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getLocalizedJourneyLevels } from '@/lib/data/journey';

export default function JourneyPage() {
  const { t, locale } = useTranslation();
  const journeyProgress = useStore((s) => s.journeyProgress);
  const getLevelProgress = useStore((s) => s.getLevelProgress);
  const isLevelComplete = useStore((s) => s.isLevelComplete);

  const levels = getLocalizedJourneyLevels(locale as 'en' | 'es');

  // Find current level: first incomplete, or first locked
  let currentLevelIndex = 0;
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const completed = isLevelComplete(level.id);
    if (!completed) {
      // Check if this level is accessible (previous level complete or it's level 1)
      if (i === 0 || isLevelComplete(levels[i - 1].id)) {
        currentLevelIndex = i;
        break;
      }
      // First locked level
      currentLevelIndex = i;
      break;
    }
    // All complete so far, move to next
    currentLevelIndex = i + 1;
  }

  // Clamp
  if (currentLevelIndex >= levels.length) {
    currentLevelIndex = levels.length - 1;
  }

  const currentLevel = levels[currentLevelIndex];
  const isUnlocked = currentLevelIndex === 0 || isLevelComplete(levels[currentLevelIndex - 1].id);

  // Find first incomplete task in current level
  const firstIncompleteTask = currentLevel.tasks.find(
    (task) => !journeyProgress[String(currentLevel.id)]?.tasks?.[task.id]?.completed
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
          {t.journey.title}
        </h1>
        <p className="text-muted">{t.journey.subtitle}</p>
      </div>

      {/* Level Roadmap */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-surface-light hidden md:block" />

        <div className="space-y-3">
          {levels.map((level, index) => {
            const completed = isLevelComplete(level.id);
            const progress = getLevelProgress(level.id, level.tasks.length);
            const isCurrent = index === currentLevelIndex;
            const isLocked = index > 0 && !isLevelComplete(levels[index - 1].id) && !completed;
            const isComingSoon = index >= 10;

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  href={isLocked || isComingSoon ? '#' : `/journey/${level.id}`}
                  className={`block relative pl-12 md:pl-14 ${(isLocked || isComingSoon) ? 'pointer-events-none' : ''}`}
                >
                  {/* Node */}
                  <div
                    className={`absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all z-10
                      ${completed
                        ? 'bg-accent border-accent shadow-[0_0_16px_rgba(255,59,48,0.5)]'
                        : isCurrent && isUnlocked
                          ? 'bg-transparent border-accent shadow-[0_0_12px_rgba(255,59,48,0.4)] animate-pulse'
                          : 'bg-transparent border-surface-light opacity-40'
                      }`}
                  >
                    {completed ? '✓' : level.badgeIcon}
                  </div>

                  {/* Card */}
                  <div
                    className={`rounded-2xl p-4 md:p-5 border transition-all
                      ${isCurrent && isUnlocked
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
                          {isComingSoon && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-light text-muted font-medium">
                              {t.journey.comingSoon}
                            </span>
                          )}
                          {completed && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
                              {t.journey.levelComplete}
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
                        {!isComingSoon && (
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
                        )}
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
        </div>
      </div>

      {/* Current level CTA */}
      {currentLevel && isUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-accent/10 border border-accent/30 text-center space-y-4"
        >
          <div className="space-y-1">
            <p className="text-muted text-sm">{t.journey.level} {currentLevel.id} — {currentLevel.title}</p>
            <h2 className="text-xl font-heading font-bold text-foreground">
              {isLevelComplete(currentLevel.id)
                ? `${t.journey.levelComplete} 🎉`
                : t.journey.keepBuilding
              }
            </h2>
          </div>

          {firstIncompleteTask && (
            <Link
              href={`/journey/${currentLevel.id}/${firstIncompleteTask.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-heading font-bold rounded-xl hover:bg-accent-glow transition-all shadow-[0_0_20px_rgba(255,59,48,0.3)]"
              style={{ animation: 'cta-pulse 2s infinite' }}
            >
              {t.journey.continueJourney}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}

          {!firstIncompleteTask && currentLevelIndex < levels.length - 1 && (
            <Link
              href={`/journey/${levels[currentLevelIndex + 1].id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-heading font-bold rounded-xl hover:bg-accent-glow transition-all shadow-[0_0_20px_rgba(255,59,48,0.3)]"
              style={{ animation: 'cta-pulse 2s infinite' }}
            >
              {t.journey.nextLevel}
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}
