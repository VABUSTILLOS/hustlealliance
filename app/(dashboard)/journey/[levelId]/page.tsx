'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getLevelById, journeyLevels } from '@/lib/data/journey';
import { useState, useEffect } from 'react';

export default function LevelDetailPage() {
  const params = useParams();
  const { t } = useTranslation();
  const levelId = Number(params.levelId);
  const level = getLevelById(levelId);

  const isTaskComplete = useStore((s) => s.isTaskComplete);
  const isLevelComplete = useStore((s) => s.isLevelComplete);
  const journeyProgress = useStore((s) => s.journeyProgress);
  const xp = useStore((s) => s.gamification.xp);

  const [showCelebration, setShowCelebration] = useState(false);

  // Check if level just got completed
  const levelComplete = level ? isLevelComplete(level.id) : false;

  useEffect(() => {
    if (levelComplete) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [levelComplete]);

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="text-5xl">🧭</span>
          <h1 className="text-2xl font-heading font-bold text-foreground">Level not found</h1>
          <Link href="/journey" className="text-accent hover:underline">Back to Journey</Link>
        </div>
      </div>
    );
  }

  // Check if previous level must be completed
  const levelIndex = journeyLevels.findIndex((l) => l.id === levelId);
  const isLocked = levelIndex > 0 && !isLevelComplete(journeyLevels[levelIndex - 1].id);

  const completedCount = level.tasks.filter((task) => isTaskComplete(levelId, task.id)).length;
  const totalTasks = level.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back link */}
      <Link
        href="/journey"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Journey
      </Link>

      {/* Level celebration */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-accent/10 border-2 border-accent text-center space-y-3 relative overflow-hidden"
        >
          {/* Glow particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-accent rounded-full animate-ping" />
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
            <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-accent rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
          </div>
          <span className="text-5xl block">{level.badgeIcon}</span>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {t.journey.levelComplete}
          </h2>
          <p className="text-muted">{t.journey.levelCompleteDesc}</p>
          <div className="flex items-center justify-center gap-2 text-accent font-bold text-lg">
            <span>⚡</span>
            <span>+{level.xpReward} XP</span>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-accent font-bold px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
            {t.journey.level} {level.id}
          </span>
          {levelComplete && (
            <span className="text-xs font-mono text-green-400 font-bold px-3 py-1 rounded-full bg-green-400/10 border border-green-400/20">
              ✓ Complete
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
          {level.title}
        </h1>
        <p className="text-muted">{level.description}</p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">
            {completedCount} / {totalTasks} {t.journey.tasksCompleted}
          </span>
          <span className="text-accent font-bold">{progress}%</span>
        </div>
        <div className="h-2 bg-surface-light rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* XP Reward badge */}
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
          <span>⚡</span>
          <span className="text-foreground font-bold">+{level.xpReward} {t.journey.xpReward}</span>
        </div>
        {level.badgeName && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-400/10 border border-purple-400/20">
            <span>{level.badgeIcon}</span>
            <span className="text-foreground font-bold text-sm">{level.badgeName}</span>
          </div>
        )}
      </div>

      {/* Task list */}
      {isLocked ? (
        <div className="p-8 rounded-2xl bg-surface/50 border border-surface-light text-center space-y-3">
          <span className="text-4xl block">🔒</span>
          <h3 className="text-lg font-heading font-bold text-foreground">{t.journey.locked}</h3>
          <Link href="/journey" className="text-accent hover:underline text-sm">
            Back to Journey
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-lg font-heading font-bold text-foreground">Tasks</h2>
          {level.tasks.map((task, index) => {
            const completed = isTaskComplete(levelId, task.id);
            // Check if previous tasks are done (for locking)
            const prevTasksDone = index === 0 || level.tasks.slice(0, index).every((t) => isTaskComplete(levelId, t.id));
            const taskLocked = !prevTasksDone && !completed;

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={taskLocked ? '#' : `/journey/${levelId}/${task.id}`}
                  className={`block p-4 rounded-xl border transition-all
                    ${completed
                      ? 'bg-surface/50 border-green-400/20 hover:border-green-400/40'
                      : taskLocked
                        ? 'bg-surface/20 border-surface-light opacity-50 pointer-events-none'
                        : 'bg-surface/50 border-surface-light hover:border-accent/30 hover:bg-accent/5'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Status icon */}
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm mt-0.5
                        ${completed
                          ? 'bg-green-400/20 text-green-400'
                          : taskLocked
                            ? 'bg-surface-light text-muted'
                            : 'bg-surface-light text-foreground/60'
                        }`}
                    >
                      {completed ? '✓' : taskLocked ? '🔒' : task.type === 'file_upload' ? '📎' : task.type === 'checkbox' ? '☐' : '✎'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-foreground font-heading font-bold text-sm">
                          {task.title}
                        </h3>
                        {task.required && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-muted text-xs line-clamp-1">{task.description}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-xs text-muted">
                      <span className="text-accent font-bold">+{task.points}</span>
                      <span>{t.journey.points}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
