'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';

const companies = [
  'Google', 'Stripe', 'Y Combinator', 'Techstars', 'a16z', 'Sequoia',
  'Accel', 'Notion', 'Figma', 'Vercel', 'Supabase', 'Linear',
];

export default function TrustBar() {
  const { t } = useTranslation();

  return (
    <section className="relative py-10 px-4 bg-black border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2"
        >
          {t.trustBar.tag}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-center text-xs text-zinc-600 mb-6"
        >
          {t.trustBar.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          {companies.map((company) => (
            <span
              key={company}
              className="text-sm sm:text-base font-heading font-bold text-zinc-500 hover:text-zinc-300 transition-colors cursor-default"
            >
              {company}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
