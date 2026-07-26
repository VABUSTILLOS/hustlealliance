'use client';

// ── Daily Protocol + Choose Habits ────────────────────────────────────
// Shows selected habits (core + chosen from pool) as a daily checklist.
// "Choose Habits" panel opens a drawer where the user picks from the pool.

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import {
  coreHabits,
  chooseHabits,
  atomicLawLabels,
  getTodayKey,
  type DailyHabit,
  type AtomicLaw,
} from '@/lib/data/founder-survival';

// ── Types ────────────────────────────────────────────────────────────

interface HabitState {
  [habitId: string]: {
    completed: boolean;
    completedAt: string | null; // ISO date
  };
}

interface CompletionParticle {
  id: number;
  x: number;
  y: number;
  color: string;
}

// ── Celebration Particles ────────────────────────────────────────────

const PARTY_COLORS = ['#f97316', '#fbbf24', '#a855f7', '#22c55e', '#3b82f6', '#ec4899'];

function CelebrationParticles({
  onDone,
}: {
  onDone: () => void;
}) {
  const particles: CompletionParticle[] = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 240,
        y: (Math.random() - 0.5) * 240 - 40,
        color: PARTY_COLORS[i % PARTY_COLORS.length],
      })),
    [],
  );

  return (
    <AnimatePresence onExitComplete={onDone}>
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              backgroundColor: p.color,
            }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
            transition={{ duration: 0.7 + Math.random() * 0.5, ease: 'easeOut' as const }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

// ── Habit card ───────────────────────────────────────────────────────

function HabitCard({
  habit,
  completed,
  onToggle,
  locale,
  showParticles,
  onParticlesDone,
}: {
  habit: DailyHabit;
  completed: boolean;
  onToggle: () => void;
  locale: 'en' | 'es';
  showParticles: boolean;
  onParticlesDone: () => void;
}) {
  const law = atomicLawLabels[habit.atomicLaw];
  const title = locale === 'es' ? habit.titleEs : habit.title;
  const desc = locale === 'es' ? habit.descriptionEs : habit.description;

  return (
    <motion.button
      onClick={onToggle}
      className={`relative w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 overflow-hidden
        ${completed
          ? 'bg-green-950/20 border-green-500/30 shadow-[0_0_12px_rgba(34,197,94,0.1)]'
          : 'bg-zinc-900/40 border-zinc-700/40 hover:border-zinc-600 hover:bg-zinc-900/60'
        }`}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Particles */}
      {showParticles && <CelebrationParticles onDone={onParticlesDone} />}

      <div className="flex items-start gap-3 relative z-[1]">
        {/* Checkbox */}
        <motion.div
          className={`mt-0.5 w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-colors
            ${completed
              ? 'bg-green-500 border-green-500'
              : 'border-zinc-600 group-hover:border-zinc-500'
            }`}
          animate={completed ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {completed && (
            <motion.span
              className="text-white text-xs font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
            >
              ✓
            </motion.span>
          )}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-semibold ${completed ? 'text-green-400 line-through opacity-70' : 'text-zinc-200'}`}>
              {habit.icon} {title}
            </span>
            {/* Atomic law badge */}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${law.color}`}>
              {locale === 'es' ? law.es : law.en}
            </span>
            {/* Core badge */}
            {habit.isCore && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-400/10 text-orange-400 border border-orange-400/20">
                {locale === 'es' ? 'Núcleo' : 'Core'}
              </span>
            )}
          </div>
          <p className={`text-xs mt-1 leading-relaxed ${completed ? 'text-zinc-600' : 'text-zinc-500'}`}>
            {desc}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

// ── Choose Habit pool card ───────────────────────────────────────────

function ChooseHabitCard({
  habit,
  isSelected,
  onToggle,
  locale,
}: {
  habit: DailyHabit;
  isSelected: boolean;
  onToggle: () => void;
  locale: 'en' | 'es';
}) {
  const title = locale === 'es' ? habit.titleEs : habit.title;
  const desc = locale === 'es' ? habit.descriptionEs : habit.description;

  return (
    <motion.button
      onClick={onToggle}
      className={`w-full text-left p-3 rounded-xl border transition-all duration-200
        ${isSelected
          ? 'bg-orange-950/20 border-orange-500/40 shadow-[0_0_8px_rgba(249,115,22,0.15)]'
          : 'bg-zinc-900/40 border-zinc-700/40 hover:border-zinc-600'
        }`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-2.5">
        <span className="text-lg flex-shrink-0">{habit.icon}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${isSelected ? 'text-orange-300' : 'text-zinc-300'}`}>
              {title}
            </span>
            {isSelected && (
              <motion.span
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {locale === 'es' ? 'Agregado' : 'Added'}
              </motion.span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{desc}</p>
        </div>
        {/* Plus/minus indicator */}
        <div
          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors
            ${isSelected ? 'bg-orange-500 text-white' : 'bg-zinc-700 text-zinc-400'}`}
        >
          {isSelected ? '−' : '+'}
        </div>
      </div>
    </motion.button>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export default function HabitTracker({ locale }: { locale: 'en' | 'es' }) {
  const [habitState, setHabitState] = useLocalStorage<HabitState>('hustle_habits', {});
  const [selectedHabitIds, setSelectedHabitIds] = useLocalStorage<string[]>('hustle_selected_habits', []);
  const [showPool, setShowPool] = useState(false);
  const [particleHabitId, setParticleHabitId] = useState<string | null>(null);
  const todayKey = getTodayKey();

  // ── Build pool habits as DailyHabit ────────────────────────────────
  const poolHabits: DailyHabit[] = useMemo(
    () =>
      chooseHabits.map((ch) => ({
        id: ch.id,
        icon: ch.icon,
        title: ch.title,
        titleEs: ch.titleEs,
        description: ch.description,
        descriptionEs: ch.descriptionEs,
        atomicLaw: 'make-it-obvious' as AtomicLaw,
        category: (ch.category === 'A' ? 'tech' : ch.category === 'B' ? 'finance' : 'longevity') as DailyHabit['category'],
        isCore: false,
      })),
    [],
  );

  // ── Active habits: core + selected from pool ───────────────────────
  const activeHabits: DailyHabit[] = useMemo(() => {
    const chosen = poolHabits.filter((h) => selectedHabitIds.includes(h.id));
    return [...coreHabits, ...chosen];
  }, [poolHabits, selectedHabitIds]);

  // ── Toggle habit completion ────────────────────────────────────────
  const toggleHabit = useCallback(
    (habitId: string) => {
      const today = new Date().toISOString().slice(0, 10);
      setHabitState((prev) => {
        const current = prev[habitId];
        const isToday = current?.completedAt?.slice(0, 10) === today;
        return {
          ...prev,
          [habitId]: {
            completed: !isToday,
            completedAt: !isToday ? new Date().toISOString() : null,
          },
        };
      });
      if (!habitState[habitId]?.completed || habitState[habitId]?.completedAt?.slice(0, 10) !== today) {
        setParticleHabitId(habitId);
      }
      // Also mark streak for today
      const streaksRaw = localStorage.getItem('hustle_streaks');
      const streaks = streaksRaw ? JSON.parse(streaksRaw) : {};
      streaks[today] = true;
      localStorage.setItem('hustle_streaks', JSON.stringify(streaks));
    },
    [habitState, setHabitState],
  );

  // ── Toggle habit selection from pool ───────────────────────────────
  const toggleHabitSelection = useCallback(
    (habitId: string) => {
      setSelectedHabitIds((prev) =>
        prev.includes(habitId) ? prev.filter((id) => id !== habitId) : [...prev, habitId],
      );
    },
    [setSelectedHabitIds],
  );

  // ── Completed count ────────────────────────────────────────────────
  const completedCount = activeHabits.filter((h) => {
    const s = habitState[h.id];
    return s?.completed && s?.completedAt?.slice(0, 10) === new Date().toISOString().slice(0, 10);
  }).length;

  const progressPercent = activeHabits.length > 0 ? Math.round((completedCount / activeHabits.length) * 100) : 0;

  return (
    <motion.div
      className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">
            {locale === 'es' ? 'Protocolo Diario' : 'Daily Protocol'}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {/* Progress bar */}
            <div className="w-24 sm:w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' as const }}
              />
            </div>
            <span className="text-[10px] text-zinc-500">
              {completedCount}/{activeHabits.length} {locale === 'es' ? 'completados' : 'done'}
            </span>
          </div>
        </div>
        {/* Toggle pool button */}
        <button
          onClick={() => setShowPool((p) => !p)}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all
            ${showPool
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-600'
            }`}
        >
          {locale === 'es' ? 'Elige Hábitos' : 'Choose Habits'} {showPool ? '−' : '+'}
        </button>
      </div>

      {/* ── Choose Habits Pool ─────────────────────────────────────── */}
      <AnimatePresence>
        {showPool && (
          <motion.div
            className="mb-4 border border-zinc-700/50 rounded-xl p-3 sm:p-4 bg-zinc-950/40"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs text-zinc-500 mb-3">
              {locale === 'es'
                ? 'Selecciona hábitos para agregar a tu Protocolo Diario:'
                : 'Select habits to add to your Daily Protocol:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
              {poolHabits.map((habit) => (
                <ChooseHabitCard
                  key={habit.id}
                  habit={habit}
                  isSelected={selectedHabitIds.includes(habit.id)}
                  onToggle={() => toggleHabitSelection(habit.id)}
                  locale={locale}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Active Habits Checklist ────────────────────────────────── */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {activeHabits.length === 0 ? (
          <p className="text-center text-sm text-zinc-600 py-6">
            {locale === 'es'
              ? 'Agrega hábitos desde "Elige Hábitos" para empezar tu protocolo.'
              : 'Add habits from "Choose Habits" to start your protocol.'}
          </p>
        ) : (
          activeHabits.map((habit) => {
            const s = habitState[habit.id];
            const isCompleted =
              s?.completed && s?.completedAt?.slice(0, 10) === new Date().toISOString().slice(0, 10);

            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                completed={isCompleted}
                onToggle={() => toggleHabit(habit.id)}
                locale={locale}
                showParticles={particleHabitId === habit.id}
                onParticlesDone={() => setParticleHabitId(null)}
              />
            );
          })
        )}
      </div>

      {/* ── Empty state for completion ─────────────────────────────── */}
      {activeHabits.length > 0 && completedCount === activeHabits.length && (
        <motion.div
          className="mt-4 p-3 rounded-xl bg-gradient-to-r from-green-950/30 to-emerald-950/20 border border-green-500/20 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-sm font-semibold text-green-400">
            🏆 {locale === 'es' ? '¡Todo completado! Eres imparable.' : 'All done! You\'re unstoppable.'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
