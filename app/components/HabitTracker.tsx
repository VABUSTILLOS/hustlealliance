'use client';

// ── Daily Protocol + Choose Habits ────────────────────────────────────
// Shows selected habits (core + chosen from pool + custom) as a daily checklist.
// Each habit card expands to show streak, tips, and full detail.
// "Choose Habits" panel opens a drawer for picking from pool.
// Custom habit form lets users define their own habits.

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
  type HabitCategory,
} from '@/lib/data/founder-survival';

// ── Types ────────────────────────────────────────────────────────────

interface HabitState {
  [habitId: string]: {
    completed: boolean;
    completedAt: string | null; // ISO date
  };
}

/** Per-habit streak: how many consecutive days completed */
interface HabitStreaks {
  [habitId: string]: {
    currentStreak: number;
    bestStreak: number;
    lastCompletedDate: string | null; // "YYYY-MM-DD"
  };
}

/** A user-created custom habit */
interface CustomHabit {
  id: string;
  icon: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  category: HabitCategory;
  createdAt: string;
}

interface CompletionParticle {
  id: number;
  x: number;
  y: number;
  color: string;
}

let _customHabitCounter = 0;
function genCustomId(): string {
  _customHabitCounter++;
  return `custom-${Date.now().toString(36)}-${_customHabitCounter}`;
}

// ── Streak helpers ────────────────────────────────────────────────────

function computeStreak(habitId: string, habitState: HabitState, streaks: HabitStreaks): HabitStreaks[string] {
  const today = new Date().toISOString().slice(0, 10);
  const state = habitState[habitId];
  const isCompletedToday = state?.completed && state?.completedAt?.slice(0, 10) === today;
  const existing = streaks[habitId] ?? { currentStreak: 0, bestStreak: 0, lastCompletedDate: null };

  const lastDate = existing.lastCompletedDate;
  if (!isCompletedToday) {
    // Check if streak is broken (last completed wasn't yesterday)
    if (lastDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);
      if (lastDate !== yesterdayStr && lastDate !== today) {
        return { currentStreak: 0, bestStreak: existing.bestStreak, lastCompletedDate: lastDate };
      }
    }
    return existing;
  }

  // Completed today
  if (lastDate === today) return existing; // already counted

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  let newStreak: number;
  if (lastDate === yesterdayStr) {
    newStreak = existing.currentStreak + 1;
  } else {
    newStreak = 1;
  }

  return {
    currentStreak: newStreak,
    bestStreak: Math.max(newStreak, existing.bestStreak),
    lastCompletedDate: today,
  };
}

// ── Celebration Particles ────────────────────────────────────────────

const PARTY_COLORS = ['#f97316', '#fbbf24', '#a855f7', '#22c55e', '#3b82f6', '#ec4899'];

function CelebrationParticles({ onDone }: { onDone: () => void }) {
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
            style={{ left: '50%', top: '50%', backgroundColor: p.color }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
            transition={{ duration: 0.7 + Math.random() * 0.5, ease: 'easeOut' as const }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

// ── Expandable Habit Card ────────────────────────────────────────────

function HabitCard({
  habit,
  completed,
  expanded,
  onToggleExpand,
  onToggle,
  locale,
  showParticles,
  onParticlesDone,
  streak,
}: {
  habit: DailyHabit;
  completed: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggle: () => void;
  locale: 'en' | 'es';
  showParticles: boolean;
  onParticlesDone: () => void;
  streak: { currentStreak: number; bestStreak: number };
}) {
  const law = atomicLawLabels[habit.atomicLaw];
  const title = locale === 'es' ? habit.titleEs : habit.title;
  const desc = locale === 'es' ? habit.descriptionEs : habit.description;

  // Tips based on atomic law
  const tipEn: Record<AtomicLaw, string> = {
    'make-it-obvious': 'Stack this after an existing habit you already do. Use a visible cue (post-it, alarm, calendar block).',
    'make-it-attractive': 'Pair it with something you enjoy. Make the environment inviting — good lighting, music, tools ready.',
    'make-it-easy': 'Reduce friction to zero. Prep everything the night before. Start with just 2 minutes if needed.',
    'make-it-satisfying': 'Track visually. Celebrate small wins. Tell someone about your progress for accountability.',
  };
  const tipEs: Record<AtomicLaw, string> = {
    'make-it-obvious': 'Apila esto después de un hábito que ya haces. Usa una señal visible (post-it, alarma, bloque en calendario).',
    'make-it-attractive': 'Combínalo con algo que disfrutes. Haz el ambiente atractivo — buena luz, música, herramientas listas.',
    'make-it-easy': 'Reduce la fricción a cero. Prepara todo la noche anterior. Empieza con solo 2 minutos si es necesario.',
    'make-it-satisfying': 'Lleva registro visual. Celebra pequeñas victorias. Cuéntale a alguien sobre tu progreso.',
  };
  const tip = locale === 'es' ? tipEs[habit.atomicLaw] : tipEn[habit.atomicLaw];

  return (
    <motion.div
      className={`relative w-full rounded-xl border transition-all duration-200 overflow-hidden
        ${completed
          ? 'bg-green-950/20 border-green-500/30 shadow-[0_0_12px_rgba(34,197,94,0.1)]'
          : 'bg-zinc-900/40 border-zinc-700/40 hover:border-zinc-600'
        }`}
      layout
    >
      {showParticles && <CelebrationParticles onDone={onParticlesDone} />}

      {/* ── Header row (always visible) ── */}
      <button
        onClick={onToggleExpand}
        className="w-full text-left p-3 sm:p-4 relative z-[1]"
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className={`mt-0.5 w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-colors cursor-pointer
              ${completed
                ? 'bg-green-500 border-green-500'
                : 'border-zinc-600 hover:border-zinc-500'
              }`}
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
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-semibold ${completed ? 'text-green-400 line-through opacity-70' : 'text-zinc-200'}`}>
                {habit.icon} {title}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${law.color}`}>
                {locale === 'es' ? law.es : law.en}
              </span>
              {habit.isCore && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-400/10 text-orange-400 border border-orange-400/20">
                  {locale === 'es' ? 'Núcleo' : 'Core'}
                </span>
              )}
              {habit.id.startsWith('custom-') && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-400/10 text-purple-400 border border-purple-400/20">
                  {locale === 'es' ? 'Personal' : 'Custom'}
                </span>
              )}
            </div>
            <p className={`text-xs mt-1 leading-relaxed ${completed ? 'text-zinc-600' : 'text-zinc-500'}`}>
              {desc}
            </p>
          </div>

          {/* Streak badge + expand chevron */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {streak.currentStreak > 0 && (
              <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded-full border border-orange-400/20">
                🔥 {streak.currentStreak}
              </span>
            )}
            <motion.span
              className="text-zinc-500 text-xs"
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.span>
          </div>
        </div>
      </button>

      {/* ── Expanded detail ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="px-4 pb-4 pt-0 relative z-[1]"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t border-zinc-700/40 pt-3 space-y-3">
              {/* Streak stats */}
              <div className="flex gap-3">
                <div className="flex-1 bg-zinc-800/50 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-zinc-500">{locale === 'es' ? 'Racha actual' : 'Current streak'}</p>
                  <p className="text-lg font-bold text-orange-400">{streak.currentStreak}</p>
                </div>
                <div className="flex-1 bg-zinc-800/50 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-zinc-500">{locale === 'es' ? 'Mejor racha' : 'Best streak'}</p>
                  <p className="text-lg font-bold text-green-400">{streak.bestStreak}</p>
                </div>
              </div>

              {/* Tip */}
              <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
                <p className="text-[10px] text-zinc-500 mb-1">
                  💡 {locale === 'es' ? `Consejo — ${locale === 'es' ? atomicLawLabels[habit.atomicLaw].es : atomicLawLabels[habit.atomicLaw].en}` : `Tip — ${atomicLawLabels[habit.atomicLaw].en}`}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed">{tip}</p>
              </div>

              {/* Full description */}
              <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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

// ── Custom Habit Form ─────────────────────────────────────────────────

const EMOJI_OPTIONS = ['🏃', '🏋️', '🧘', '📚', '💻', '🎯', '💡', '🧠', '❤️', '💰', '📝', '🎨', '🔧', '🌱', '⚡', '🔋', '🛡️', '🎵'];

function CustomHabitForm({
  onSubmit,
  onCancel,
  locale,
}: {
  onSubmit: (habit: CustomHabit) => void;
  onCancel: () => void;
  locale: 'en' | 'es';
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📝');
  const [category, setCategory] = useState<HabitCategory>('movement');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      id: genCustomId(),
      icon,
      title: title.trim(),
      titleEs: title.trim(), // same for now, user can edit later
      description: description.trim(),
      descriptionEs: description.trim(),
      category,
      createdAt: new Date().toISOString(),
    });
    setTitle('');
    setDescription('');
    setIcon('📝');
    setCategory('movement');
  };

  const categories: { value: HabitCategory; labelEs: string; labelEn: string }[] = [
    { value: 'movement', labelEs: 'Movimiento', labelEn: 'Movement' },
    { value: 'nutrition', labelEs: 'Nutrición', labelEn: 'Nutrition' },
    { value: 'tech', labelEs: 'Tecnología', labelEn: 'Tech' },
    { value: 'relationships', labelEs: 'Relaciones', labelEn: 'Relationships' },
    { value: 'finance', labelEs: 'Finanzas', labelEn: 'Finance' },
    { value: 'recovery', labelEs: 'Recuperación', labelEn: 'Recovery' },
    { value: 'longevity', labelEs: 'Longevidad', labelEn: 'Longevity' },
  ];

  return (
    <motion.div
      className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 space-y-3"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <p className="text-xs font-semibold text-zinc-300">
        {locale === 'es' ? 'Crear hábito personalizado' : 'Create custom habit'}
      </p>

      {/* Icon picker */}
      <div>
        <p className="text-[10px] text-zinc-500 mb-1.5">{locale === 'es' ? 'Ícono' : 'Icon'}</p>
        <div className="flex flex-wrap gap-1">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setIcon(emoji)}
              className={`w-7 h-7 rounded-md text-sm flex items-center justify-center transition-all ${
                icon === emoji ? 'bg-orange-500/20 border border-orange-500/40 scale-110' : 'bg-zinc-700/50 border border-zinc-600/30 hover:border-zinc-500'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={locale === 'es' ? 'Nombre del hábito' : 'Habit name'}
        className="w-full bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-orange-500/50 transition-colors"
      />

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={locale === 'es' ? 'Descripción (opcional)' : 'Description (optional)'}
        rows={2}
        className="w-full bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-orange-500/50 transition-colors resize-none"
      />

      {/* Category */}
      <div>
        <p className="text-[10px] text-zinc-500 mb-1.5">{locale === 'es' ? 'Categoría' : 'Category'}</p>
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`text-[10px] px-2 py-1 rounded-full transition-all ${
                category === cat.value
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  : 'bg-zinc-700/40 text-zinc-500 border border-zinc-600/30 hover:border-zinc-500'
              }`}
            >
              {locale === 'es' ? cat.labelEs : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="text-xs px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
        >
          {locale === 'es' ? 'Agregar hábito' : 'Add habit'}
        </button>
        <button
          onClick={onCancel}
          className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-500 hover:text-zinc-300 border border-zinc-700 transition-colors"
        >
          {locale === 'es' ? 'Cancelar' : 'Cancel'}
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export default function HabitTracker({ locale }: { locale: 'en' | 'es' }) {
  const [habitState, setHabitState] = useLocalStorage<HabitState>('hustle_habits', {});
  const [selectedHabitIds, setSelectedHabitIds] = useLocalStorage<string[]>('hustle_selected_habits', []);
  const [streaks, setStreaks] = useLocalStorage<HabitStreaks>('hustle_habit_streaks', {});
  const [customHabits, setCustomHabits] = useLocalStorage<CustomHabit[]>('hustle_custom_habits', []);
  const [showPool, setShowPool] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [particleHabitId, setParticleHabitId] = useState<string | null>(null);
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);
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

  // ── Convert custom habits to DailyHabit shape ──────────────────────
  const customDailyHabits: DailyHabit[] = useMemo(
    () =>
      customHabits.map((ch) => ({
        id: ch.id,
        icon: ch.icon,
        title: ch.title,
        titleEs: ch.titleEs,
        description: ch.description,
        descriptionEs: ch.descriptionEs,
        atomicLaw: 'make-it-satisfying' as AtomicLaw,
        category: ch.category,
        isCore: false,
      })),
    [customHabits],
  );

  // ── Active habits: core + selected from pool + custom ──────────────
  const activeHabits: DailyHabit[] = useMemo(() => {
    const chosen = poolHabits.filter((h) => selectedHabitIds.includes(h.id));
    return [...coreHabits, ...chosen, ...customDailyHabits];
  }, [poolHabits, selectedHabitIds, customDailyHabits]);

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

      // Update streak
      setStreaks((prev) => {
        const current = prev[habitId] ?? { currentStreak: 0, bestStreak: 0, lastCompletedDate: null };
        const state = habitState[habitId];
        const isToday = state?.completedAt?.slice(0, 10) === today;
        const wasAlreadyDone = state?.completed && isToday;
        const isCompleting = !wasAlreadyDone;

        if (isCompleting) {
          const lastDate = current.lastCompletedDate;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().slice(0, 10);

          let newStreak: number;
          if (lastDate === yesterdayStr) {
            newStreak = current.currentStreak + 1;
          } else {
            newStreak = 1;
          }

          return {
            ...prev,
            [habitId]: {
              currentStreak: newStreak,
              bestStreak: Math.max(newStreak, current.bestStreak),
              lastCompletedDate: today,
            },
          };
        } else {
          // Unchecking — decrease streak (if last completion was today)
          if (current.lastCompletedDate === today) {
            const prevStreak = Math.max(0, current.currentStreak - 1);
            return {
              ...prev,
              [habitId]: {
                ...current,
                currentStreak: prevStreak,
                lastCompletedDate: prevStreak > 0 ? current.lastCompletedDate : null,
              },
            };
          }
          return prev;
        }
      });

      if (!habitState[habitId]?.completed || habitState[habitId]?.completedAt?.slice(0, 10) !== today) {
        setParticleHabitId(habitId);
      }
      // Also mark streak for today (weekly streak)
      const streaksRaw = localStorage.getItem('hustle_streaks');
      const dailyStreaks = streaksRaw ? JSON.parse(streaksRaw) : {};
      dailyStreaks[today] = true;
      localStorage.setItem('hustle_streaks', JSON.stringify(dailyStreaks));
    },
    [habitState, setHabitState, setStreaks],
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

  // ── Add custom habit ───────────────────────────────────────────────
  const addCustomHabit = useCallback(
    (habit: CustomHabit) => {
      setCustomHabits((prev) => [...prev, habit]);
      setShowCustomForm(false);
    },
    [setCustomHabits],
  );

  // ── Delete custom habit ────────────────────────────────────────────
  const deleteCustomHabit = useCallback(
    (habitId: string) => {
      setCustomHabits((prev) => prev.filter((h) => h.id !== habitId));
    },
    [setCustomHabits],
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
        <div className="flex gap-1.5">
          {/* Custom habit button */}
          <button
            onClick={() => setShowCustomForm((p) => !p)}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all
              ${showCustomForm
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-zinc-800 text-zinc-500 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-600'
              }`}
            title={locale === 'es' ? 'Crear hábito' : 'Create habit'}
          >
            +
          </button>
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
      </div>

      {/* ── Custom Habit Form ──────────────────────────────────────── */}
      <AnimatePresence>
        {showCustomForm && (
          <div className="mb-4">
            <CustomHabitForm
              onSubmit={addCustomHabit}
              onCancel={() => setShowCustomForm(false)}
              locale={locale}
            />
          </div>
        )}
      </AnimatePresence>

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
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
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
            const streakData = streaks[habit.id] ?? { currentStreak: 0, bestStreak: 0 };
            const isExpanded = expandedHabitId === habit.id;
            const isCustom = habit.id.startsWith('custom-');

            return (
              <div key={habit.id} className="relative group">
                <HabitCard
                  habit={habit}
                  completed={isCompleted}
                  expanded={isExpanded}
                  onToggleExpand={() => setExpandedHabitId(isExpanded ? null : habit.id)}
                  onToggle={() => toggleHabit(habit.id)}
                  locale={locale}
                  showParticles={particleHabitId === habit.id}
                  onParticlesDone={() => setParticleHabitId(null)}
                  streak={streakData}
                />
                {/* Delete custom habit button */}
                {isCustom && (
                  <button
                    onClick={() => deleteCustomHabit(habit.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
                    title={locale === 'es' ? 'Eliminar hábito' : 'Delete habit'}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── All done celebration ────────────────────────────────────── */}
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
