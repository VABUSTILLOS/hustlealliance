'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/lib/store/useStore';
import { useCurrentUser, getFirstName } from '@/lib/hooks/useCurrentUser';
import { dailyHabits } from '@/lib/data/founder-survival';
import HabitTracker from '@/app/components/HabitTracker';
import SurvivalGuide from '@/app/components/SurvivalGuide';

// ── Animation variants ─────────────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

// ── Page ───────────────────────────────────────────────────────────────────

export default function FounderSurvivalPage() {
  const user = useCurrentUser();
  const gamification = useStore((s) => s.gamification);
  const firstName = getFirstName(user?.name);

  // Quote rotation — gritty founder wisdom
  const quotes = [
    { text: '"The best way to predict the future is to create it."', author: 'Peter Drucker' },
    { text: '"You do not rise to the level of your goals. You fall to the level of your systems."', author: 'James Clear' },
    { text: '"The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack of will."', author: 'Vince Lombardi' },
    { text: '"First, sell something. Everything else is a distraction."', author: 'The Real World' },
    { text: '"No one cares. Work harder."', author: 'Unknown' },
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Hero Header ──────────────────────────────────────────────── */}
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
        <motion.div variants={item} className="flex items-center gap-3">
          <span className="text-3xl">🛡️</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              {firstName ? `${firstName}'s Survival Dashboard` : 'Founder Survival Dashboard'}
            </h1>
            <p className="text-sm text-muted">
              Build the body, mind, and bank account that can withstand anything.
            </p>
          </div>
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          variants={item}
          className="p-4 rounded-2xl bg-surface/40 border border-surface-light italic text-muted text-sm"
        >
          {quote.text}
          <span className="block mt-1 text-xs text-accent not-italic font-heading font-bold">
            — {quote.author}
          </span>
        </motion.blockquote>

        {/* Stats strip */}
        <motion.div variants={item} className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-surface/40 border border-surface-light text-center">
            <p className="text-lg font-heading font-bold text-accent">{gamification.xp}</p>
            <p className="text-[10px] text-muted uppercase tracking-wider">Total XP</p>
          </div>
          <div className="p-3 rounded-xl bg-surface/40 border border-surface-light text-center">
            <p className="text-lg font-heading font-bold text-foreground">
              {gamification.streak} 🔥
            </p>
            <p className="text-[10px] text-muted uppercase tracking-wider">Day Streak</p>
          </div>
          <div className="p-3 rounded-xl bg-surface/40 border border-surface-light text-center">
            <p className="text-lg font-heading font-bold text-foreground">
              {dailyHabits.length}
            </p>
            <p className="text-[10px] text-muted uppercase tracking-wider">Daily Protocols</p>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Two-column layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Habit Tracker — left column (2/5 width) */}
        <motion.section
          variants={item}
          initial="hidden"
          animate="show"
          className="lg:col-span-2 bg-surface/30 border border-surface-light rounded-2xl p-5 md:p-6"
        >
          <HabitTracker />
        </motion.section>

        {/* Survival Guide — right column (3/5 width) */}
        <motion.section
          variants={item}
          initial="hidden"
          animate="show"
          className="lg:col-span-3 bg-surface/30 border border-surface-light rounded-2xl p-5 md:p-6"
        >
          <SurvivalGuide />
        </motion.section>
      </div>

      {/* ── Footer philosophy ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-6"
      >
        <p className="text-xs text-muted/60">
          "A calm mind, a fit body, and a house full of love. These things cannot be bought — they must be earned."
          <span className="block mt-1 text-accent/60 font-heading font-bold">— Naval Ravikant</span>
        </p>
      </motion.div>
    </div>
  );
}
