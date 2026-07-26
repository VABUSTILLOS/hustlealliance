'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { dailyHabits, type DailyHabit } from '@/lib/data/founder-survival';
import { useMemo, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface HabitState {
  [habitId: string]: {
    completed: boolean;
    completedAt?: string; // ISO date string
  };
}

// ── Atomic Habits law badge ────────────────────────────────────────────────

const lawLabels: Record<DailyHabit['atomicLaw'], { label: string; color: string }> = {
  'make-it-obvious': { label: 'Make it Obvious', color: 'bg-blue-400/10 text-blue-400 border-blue-400/20' },
  'make-it-attractive': { label: 'Make it Attractive', color: 'bg-purple-400/10 text-purple-400 border-purple-400/20' },
  'make-it-easy': { label: 'Make it Easy', color: 'bg-green-400/10 text-green-400 border-green-400/20' },
  'make-it-satisfying': { label: 'Make it Satisfying', color: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' },
};

// ── Helper: check if two dates are the same calendar day ───────────────────

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

// ── Component ──────────────────────────────────────────────────────────────

export default function HabitTracker() {
  const [habitState, setHabitState] = useLocalStorage<HabitState>(
    'hustle_habits',
    {}
  );

  // Calculate today's completion count
  const todayCount = useMemo(() => {
    return dailyHabits.filter((h) => {
      const s = habitState[h.id];
      return s?.completed && s.completedAt && isToday(s.completedAt);
    }).length;
  }, [habitState]);

  const totalHabits = dailyHabits.length;
  const percent = Math.round((todayCount / totalHabits) * 100);

  /**
   * Toggle a habit. Uses functional update to avoid stale state.
   * On check → "Make it Satisfying" (Law 4): animated celebration.
   * On uncheck → removes today's completion.
   */
  const toggleHabit = useCallback(
    (habitId: string) => {
      setHabitState((prev) => {
        const current = prev[habitId];
        const now = new Date().toISOString();

        if (current?.completed && current.completedAt && isToday(current.completedAt)) {
          // Uncheck: remove today's completion
          const { [habitId]: _, ...rest } = prev;
          return rest;
        }

        // Check: mark complete with timestamp
        return {
          ...prev,
          [habitId]: { completed: true, completedAt: now },
        };
      });
    },
    [setHabitState]
  );

  const isHabitDoneToday = (habitId: string): boolean => {
    const s = habitState[habitId];
    return !!(s?.completed && s.completedAt && isToday(s.completedAt));
  };

  return (
    <div className="space-y-5">
      {/* ── Header with progress ring ─────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">
            Daily Protocol
          </h2>
          <p className="text-sm text-muted">
            {todayCount === totalHabits
              ? 'All protocols executed. You are unstoppable today. 🔥'
              : `${todayCount}/${totalHabits} habits locked in`}
          </p>
        </div>

        {/* Circular progress */}
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke="currentColor"
              className="text-surface-light"
              strokeWidth="5"
            />
            <motion.circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke="currentColor"
              className="text-accent"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 28}
              initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 28 * (1 - percent / 100),
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                filter: percent > 0 ? 'drop-shadow(0 0 6px rgba(255,59,48,0.5))' : 'none',
              }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
            {percent}%
          </span>
        </div>
      </div>

      {/* ── Habit list ────────────────────────────────────────────────── */}
      <div className="space-y-2">
        {dailyHabits.map((habit, index) => {
          const done = isHabitDoneToday(habit.id);
          const law = lawLabels[habit.atomicLaw];

          return (
            <motion.button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 group
                ${done
                  ? 'bg-green-400/5 border-green-400/20 hover:border-green-400/40'
                  : 'bg-surface/40 border-surface-light hover:border-accent/30 hover:bg-accent/5'
                }`}
            >
              {/* Checkbox with satisfying animation */}
              <div className="relative shrink-0 mt-0.5">
                <motion.div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors
                    ${done
                      ? 'bg-accent border-accent'
                      : 'border-surface-light group-hover:border-accent/50'
                    }`}
                  whileTap={{ scale: 0.85 }}
                  animate={done ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence>
                    {done && (
                      <motion.svg
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        className="w-3.5 h-3.5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Celebration particles on check */}
                <AnimatePresence>
                  {done && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-accent"
                          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                          animate={{
                            opacity: 0,
                            x: Math.cos((i / 6) * Math.PI * 2) * 18,
                            y: Math.sin((i / 6) * Math.PI * 2) * 18,
                            scale: 0,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg">{habit.icon}</span>
                  <span
                    className={`text-sm font-heading font-bold transition-colors
                      ${done ? 'text-foreground/60 line-through decoration-accent/50' : 'text-foreground'}`}
                  >
                    {habit.title}
                  </span>
                  {/* Atomic Habits law badge */}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${law.color}`}>
                    {law.label}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 transition-colors ${done ? 'text-muted/50' : 'text-muted'}`}>
                  {habit.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Footer: progress bar ──────────────────────────────────────── */}
      <div className="space-y-1.5">
        <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              boxShadow: percent > 0 ? '0 0 8px rgba(255,59,48,0.4)' : 'none',
            }}
          />
        </div>
        <p className="text-[11px] text-muted text-right">
          {percent === 100
            ? '🏆 Perfect day. Identity cemented.'
            : percent >= 75
              ? '⚡ Nearly there. Finish strong.'
              : percent >= 50
                ? '🔋 Halfway. Momentum building.'
                : percent > 0
                  ? '🌱 Day started. Stack the next habit.'
                  : '💤 No habits yet. Start with the easiest one — cue → craving → response → reward.'}
        </p>
      </div>
    </div>
  );
}
