'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCurrentUser, getFirstName } from '@/lib/hooks/useCurrentUser';
import { useTranslation } from '@/lib/i18n/useTranslation';
import HabitTracker from '@/app/components/HabitTracker';
import WeeklyStreak from '@/app/components/WeeklyStreak';
import PersonalPlanner from '@/app/components/PersonalPlanner';

// ── Animation variants ─────────────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

// ── Bilingual quotes ────────────────────────────────────────────────────────

const QUOTES = [
  { en: '"The best way to predict the future is to create it."', es: '"La mejor forma de predecir el futuro es crearlo."', author: 'Peter Drucker' },
  { en: '"You do not rise to the level of your goals. You fall to the level of your systems."', es: '"No subes al nivel de tus metas. Caes al nivel de tus sistemas."', author: 'James Clear' },
  { en: '"The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack of will."', es: '"La diferencia entre una persona exitosa y los demás no es falta de fuerza, ni de conocimiento, sino falta de voluntad."', author: 'Vince Lombardi' },
  { en: '"First, sell something. Everything else is a distraction."', es: '"Primero, vende algo. Todo lo demás es distracción."', author: 'The Real World' },
  { en: '"No one cares. Work harder."', es: '"A nadie le importa. Trabaja más duro."', author: 'Unknown' },
];

// ── Page ───────────────────────────────────────────────────────────────────

export default function FounderSurvivalPage() {
  const user = useCurrentUser();
  const { locale } = useTranslation();
  const firstName = getFirstName(user?.name);

  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6">
      {/* ── Hero Header ──────────────────────────────────────────────── */}
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
        <motion.div variants={item} className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl">🛡️</span>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-foreground">
              {locale === 'es'
                ? firstName
                  ? `Dashboard de Supervivencia de ${firstName}`
                  : 'Dashboard de Supervivencia'
                : firstName
                  ? `${firstName}'s Survival Dashboard`
                  : 'Founder Survival Dashboard'}
            </h1>
            <p className="text-xs sm:text-sm text-muted">
              {locale === 'es'
                ? 'Construye el cuerpo, la mente y la cuenta bancaria que resisten todo.'
                : 'Build the body, mind, and bank account that can withstand anything.'}
            </p>
          </div>
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          variants={item}
          className="p-3 sm:p-4 rounded-2xl bg-surface/40 border border-surface-light italic text-muted text-xs sm:text-sm"
        >
          {locale === 'es' ? quote.es : quote.en}
          <span className="block mt-1 text-xs text-accent not-italic font-heading font-bold">
            — {quote.author}
          </span>
        </motion.blockquote>
      </motion.div>

      {/* ── Weekly Streak — full width top ────────────────────────────── */}
      <WeeklyStreak locale={locale} />

      {/* ── Main Content: Daily Protocol (left) + Planner (right) ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Daily Protocol + Choose Habits — takes 2/3 on desktop */}
        <motion.section
          variants={item}
          initial="hidden"
          animate="show"
          className="lg:col-span-2"
        >
          <HabitTracker locale={locale} />
        </motion.section>

        {/* Personal Planner — takes 1/3 on desktop */}
        <motion.section
          variants={item}
          initial="hidden"
          animate="show"
          className="lg:col-span-1 min-h-[400px]"
        >
          <PersonalPlanner locale={locale} />
        </motion.section>
      </div>

      {/* ── Footer philosophy ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-4 sm:py-6"
      >
        <p className="text-xs text-muted/60 px-2">
          {locale === 'es'
            ? '"Una mente calmada, un cuerpo en forma y una casa llena de amor. Estas cosas no se compran — se ganan."'
            : '"A calm mind, a fit body, and a house full of love. These things cannot be bought — they must be earned."'}
          <span className="block mt-1 text-accent/60 font-heading font-bold">— Naval Ravikant</span>
        </p>
      </motion.div>
    </div>
  );
}
