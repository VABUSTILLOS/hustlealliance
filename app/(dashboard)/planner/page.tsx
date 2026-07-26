'use client';

// ── Planner Page — standalone Workflowy-style outliner ─────────────────

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCurrentUser, getFirstName } from '@/lib/hooks/useCurrentUser';
import { useTranslation } from '@/lib/i18n/useTranslation';
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
  { en: '"Plans are worthless, but planning is everything."', es: '"Los planes no valen nada, pero planear lo es todo."', author: 'Dwight D. Eisenhower' },
  { en: '"What gets measured gets managed."', es: '"Lo que se mide, se gestiona."', author: 'Peter Drucker' },
  { en: '"An hour of planning can save you 10 hours of doing."', es: '"Una hora de planificación te ahorra 10 horas de ejecución."', author: 'Dale Carnegie' },
  { en: '"The secret of getting ahead is getting started."', es: '"El secreto para avanzar es empezar."', author: 'Mark Twain' },
  { en: '"Either you run the day or the day runs you."', es: '"O tú manejas el día o el día te maneja a ti."', author: 'Jim Rohn' },
];

// ── Page ───────────────────────────────────────────────────────────────────

export default function PlannerPage() {
  const user = useCurrentUser();
  const { locale } = useTranslation();
  const firstName = getFirstName(user?.name);

  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6">
      {/* ── Hero Header ──────────────────────────────────────────────── */}
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
        <motion.div variants={item} className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl">📝</span>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-foreground">
              {locale === 'es'
                ? firstName
                  ? `Planificador de ${firstName}`
                  : 'Planificador'
                : firstName
                  ? `${firstName}'s Planner`
                  : 'Planner'}
            </h1>
            <p className="text-xs sm:text-sm text-muted">
              {locale === 'es'
                ? 'Organiza tus ideas con viñetas infinitas. Enter para nuevo, Tab para indentar.'
                : 'Organize your thoughts with infinite bullets. Enter for new, Tab to indent.'}
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

      {/* ── Planner — full width ────────────────────────────────────── */}
      <motion.section
        variants={item}
        initial="hidden"
        animate="show"
        className="min-h-[500px]"
      >
        <PersonalPlanner locale={locale} />
      </motion.section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-4 sm:py-6"
      >
        <p className="text-xs text-muted/60 px-2">
          {locale === 'es'
            ? '💡 Tip: Usa #etiquetas para categorizar y @persona para asignar. Haz clic en el bullet para enfocar.'
            : '💡 Tip: Use #tags to categorize and @person to assign. Click the bullet to zoom in.'}
        </p>
      </motion.div>
    </div>
  );
}
