'use client';

import { useRef } from 'react';
import { motion, useScroll, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import SpotlightCard from '../ui/SpotlightCard';
import { cardReveal, staggerContainer } from '@/lib/motion/variants';

function Checkmark() {
  return (
    <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function StackEvolutionTimeline() {
  const { t } = useTranslation();
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.8', 'end 0.5'],
  });

  const milestones = [t.stackTimeline.month1, t.stackTimeline.month6, t.stackTimeline.year1];

  return (
    <section className="relative py-16 lg:py-24 px-4 bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-[var(--color-accent)]/6 via-[var(--color-violet)]/4 to-transparent rounded-full blur-[160px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
            {t.stackTimeline.tag}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-none uppercase mb-6">
            {t.stackTimeline.headline}
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto font-body leading-relaxed">
            {t.stackTimeline.subheadline}
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Connecting line (desktop) — fills with scroll progress */}
          <div className="hidden md:block absolute top-6 left-[16.66%] right-[16.66%] h-px bg-white/10">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-accent via-accent/70 to-accent shadow-[0_0_12px_rgba(255,59,48,0.5)]"
              style={{ scaleX: reduceMotion ? 1 : scrollYProgress }}
            />
          </div>
          {/* Connecting line (mobile) — fills with scroll progress */}
          <div className="md:hidden absolute left-6 top-6 bottom-6 w-px bg-white/10">
            <motion.div
              className="w-full origin-top bg-gradient-to-b from-accent via-accent/70 to-accent shadow-[0_0_12px_rgba(255,59,48,0.5)]"
              style={{ scaleY: reduceMotion ? 1 : scrollYProgress }}
            />
          </div>

          <motion.div
            variants={staggerContainer(0.15)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8"
          >
            {milestones.map((milestone) => (
              <motion.div
                key={milestone.label}
                variants={cardReveal}
                className="relative pl-16 md:pl-0"
              >
                {/* Node dot */}
                <div className="absolute left-[19px] md:left-1/2 top-6 md:-translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_20px_rgba(255,59,48,0.6)]" />

                <SpotlightCard className="p-6 sm:p-8 md:mt-16 h-full">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
                    {milestone.label}
                  </p>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                    {milestone.title}
                  </h3>
                  <p className="text-zinc-300 font-body text-sm leading-relaxed mb-6">
                    {milestone.desc}
                  </p>
                  <ul className="space-y-2.5 mb-6">
                    {milestone.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm">
                        <Checkmark />
                        <span className="text-zinc-300 font-body">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 border-t border-white/10 pt-4">
                    {t.stackTimeline.recurringBill}
                  </p>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 min-h-[48px] rounded-xl bg-[var(--color-accent)] text-white font-heading font-bold text-sm
              hover:shadow-[0_0_40px_rgba(255,59,48,0.3)] transition-all active:scale-[0.97]"
          >
            {t.stackTimeline.cta}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
