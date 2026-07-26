'use client';

// ── Personal Planner ────────────────────────────────────────────────────
// Right-column daily notes/to-do with localStorage persistence.
// Key: "hustle_planner" → { "2025-01-13": "notes text here" }

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

interface PlannerData {
  [dateKey: string]: string;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function PersonalPlanner({ locale }: { locale: 'en' | 'es' }) {
  const [planner, setPlanner] = useLocalStorage<PlannerData>('hustle_planner', {});
  const today = todayKey();
  const [notes, setNotes] = useState(planner[today] || '');

  const saveNotes = useCallback(
    (value: string) => {
      setNotes(value);
      setPlanner((prev) => ({ ...prev, [today]: value }));
    },
    [today, setPlanner],
  );

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  // Quick bullets insertion
  const insertBullets = (preset: 'morning' | 'priorities' | 'gratitude') => {
    const presets: Record<string, string> = {
      morning:
        locale === 'es'
          ? '• ☀️ Rutina de mañana:\n• \n• \n\n• 📋 Top 3 de hoy:\n• \n• \n• '
          : '• ☀️ Morning routine:\n• \n• \n\n• 📋 Today\'s top 3:\n• \n• \n• ',
      priorities:
        locale === 'es'
          ? '• 🎯 Prioridad #1:\n• 🎯 Prioridad #2:\n• 🎯 Prioridad #3:'
          : '• 🎯 Priority #1:\n• 🎯 Priority #2:\n• 🎯 Priority #3:',
      gratitude:
        locale === 'es'
          ? '• 🙏 Agradezco:\n• \n• \n\n• 💡 Aprendí hoy:'
          : '• 🙏 Grateful for:\n• \n• \n\n• 💡 Learned today:',
    };
    saveNotes(notes ? notes + '\n\n' + presets[preset] : presets[preset]);
  };

  return (
    <motion.div
      className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📝</span>
          <h3 className="text-sm font-semibold text-zinc-100">
            {locale === 'es' ? 'Planificador Personal' : 'Personal Planner'}
          </h3>
        </div>
        <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
          {locale === 'es'
            ? new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })
            : new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Quick templates */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {(['morning', 'priorities', 'gratitude'] as const).map((preset) => (
          <button
            key={preset}
            onClick={() => insertBullets(preset)}
            className="text-[10px] sm:text-xs px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {preset === 'morning'
              ? locale === 'es' ? '🌅 Mañana' : '🌅 Morning'
              : preset === 'priorities'
                ? locale === 'es' ? '🎯 Prioridades' : '🎯 Priorities'
                : locale === 'es' ? '🙏 Gratitud' : '🙏 Gratitude'}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={notes}
        onChange={(e) => saveNotes(e.target.value)}
        placeholder={
          locale === 'es'
            ? 'Escribe tus notas, prioridades y aprendizajes del día...'
            : 'Write your daily notes, priorities, and learnings...'
        }
        className="flex-1 min-h-[200px] w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3 text-sm text-zinc-200 placeholder:text-zinc-600 resize-none focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/50">
        <span className="text-[10px] text-zinc-600">
          {wordCount} {locale === 'es' ? 'palabras' : 'words'}
        </span>
        <span className="text-[10px] text-zinc-600">
          {locale === 'es' ? 'Se guarda automáticamente' : 'Auto-saves'}
        </span>
      </div>
    </motion.div>
  );
}
