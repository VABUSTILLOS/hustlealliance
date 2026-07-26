'use client';

// ── Weekly Streak Bar ─────────────────────────────────────────────────
// Shows Mon–Sun with illuminated dots for completed days.
// Uses localStorage key "hustle_streaks" — { "2025-01-13": true, ... }

import { motion } from 'framer-motion';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { DAY_KEYS, DAY_LABELS, type DayKey, getTodayKey } from '@/lib/data/founder-survival';

interface StreakData {
  [dateKey: string]: boolean; // "YYYY-MM-DD" → completed at least one habit
}

/**
 * Computes the current week's Monday–Sunday date strings.
 */
function getCurrentWeekDays(): { key: DayKey; date: string }[] {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7)); // Monday of current week

  return DAY_KEYS.map((key, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
    return { key, date: dateStr };
  });
}

export default function WeeklyStreak({ locale }: { locale: 'en' | 'es' }) {
  const [streaks] = useLocalStorage<StreakData>('hustle_streaks', {});
  const todayKey = getTodayKey();
  const weekDays = getCurrentWeekDays();

  const completedCount = weekDays.filter((d) => streaks[d.date]).length;

  return (
    <motion.div
      className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">
            {locale === 'es' ? 'Racha Semanal' : 'Weekly Streak'}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            {locale === 'es'
              ? `${completedCount} de 7 días esta semana`
              : `${completedCount} of 7 days this week`}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🔥</span>
          <span className="text-2xl font-bold text-orange-400">{completedCount}</span>
        </div>
      </div>

      {/* Day dots */}
      <div className="flex justify-between gap-1 sm:gap-2">
        {weekDays.map(({ key, date }) => {
          const completed = !!streaks[date];
          const isToday = key === todayKey;
          const label = DAY_LABELS[key][locale];

          return (
            <motion.div
              key={key}
              className="flex flex-col items-center gap-1.5 flex-1"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all
                  ${completed
                    ? 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30 text-white'
                    : isToday
                      ? 'bg-zinc-800 border-2 border-orange-500/50 text-zinc-300'
                      : 'bg-zinc-800/50 text-zinc-600'
                  }`}
                animate={
                  completed
                    ? {
                        boxShadow: [
                          '0 0 12px rgba(251, 146, 60, 0.3)',
                          '0 0 20px rgba(251, 146, 60, 0.5)',
                          '0 0 12px rgba(251, 146, 60, 0.3)',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {completed ? '✓' : label.charAt(0)}
              </motion.div>
              <span
                className={`text-[10px] sm:text-xs font-medium ${
                  isToday ? 'text-orange-400' : completed ? 'text-zinc-400' : 'text-zinc-600'
                }`}
              >
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
