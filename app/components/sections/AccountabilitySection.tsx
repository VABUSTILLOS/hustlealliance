'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { spaces } from '@/lib/data/spaces';
import { useTranslation } from '@/lib/i18n/useTranslation';

/* ─── Tab definitions ─── */
const TABS = [
  {
    id: 'journey',
    title: 'The Journey',
    headline: '100+ tasks to take you from ideation to scale.',
    body: 'Earn XP and unlock tiers as you build — from idea validation to Series A.',
    accent: 'from-violet-500/20 to-purple-600/20',
    glow: 'from-violet-500 to-purple-600',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'habits',
    title: 'Founder Habits',
    headline: 'Build the systems that scale.',
    body: 'Track your daily routines and maintain execution streaks that compound into momentum.',
    accent: 'from-emerald-500/20 to-teal-600/20',
    glow: 'from-emerald-500 to-teal-600',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <rect x="7" y="13" width="3" height="3" rx="0.5" />
        <rect x="14" y="13" width="3" height="3" rx="0.5" />
      </svg>
    ),
  },
  {
    id: 'planner',
    title: 'Strategic Planner',
    headline: 'Map your weekly priorities and execute with clarity.',
    body: "Because winging it doesn't scale — plan your week, crush your goals.",
    accent: 'from-amber-500/20 to-orange-600/20',
    glow: 'from-amber-500 to-orange-600',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: 'spaces',
    title: 'Niche Spaces',
    headline: 'Connect with founders in your exact niche.',
    body: 'Join dedicated spaces for AI, SaaS, Fintech, D2C, and more — find your tribe.',
    accent: 'from-cyan-500/20 to-blue-600/20',
    glow: 'from-cyan-500 to-blue-600',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
] as const;

/* ─── Visual sub-components ─── */

function JourneyVisual() {
  const nodes = [
    { label: 'Ideation', xp: '0 XP', done: true, left: '8%', top: '20%' },
    { label: 'Validation', xp: '100 XP', done: true, left: '28%', top: '8%' },
    { label: 'MVP', xp: '250 XP', done: true, left: '48%', top: '40%' },
    { label: 'Launch', xp: '500 XP', done: false, left: '68%', top: '15%' },
    { label: 'Scale', xp: '1,000 XP', done: false, left: '88%', top: '35%' },
  ];

  return (
    <div className="w-full h-full relative p-4">
      {nodes.map((node) => (
        <div
          key={node.label}
          className="absolute flex flex-col items-center gap-1"
          style={{ left: node.left, top: node.top }}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 ${
              node.done
                ? 'border-violet-400 bg-violet-500/40 shadow-[0_0_14px_rgba(167,139,250,0.6)]'
                : 'border-zinc-600 bg-zinc-800'
            }`}
          />
          <span className="text-[10px] font-mono text-zinc-300 whitespace-nowrap font-bold">{node.label}</span>
          <span className="text-[9px] font-mono text-zinc-500">{node.xp}</span>
        </div>
      ))}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500/80 via-violet-400/40 to-zinc-700 -translate-y-1/2 rounded-full shadow-[0_0_20px_rgba(167,139,250,0.4)]" />
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/90 border border-zinc-700/50 backdrop-blur-sm">
        <span className="text-[10px] font-mono text-zinc-400">Current:</span>
        <span className="text-xs font-heading font-bold text-violet-300">350 XP</span>
        <span className="text-[10px] font-mono text-zinc-500">/ Tier 2</span>
      </div>
    </div>
  );
}

function HabitsVisual() {
  const habitCards = [
    { icon: '🏃', label: 'Morning Routine', streak: 7, color: '#34C759' },
    { icon: '📖', label: 'Daily Reading', streak: 12, color: '#007AFF' },
    { icon: '✍️', label: 'Journaling', streak: 5, color: '#FF9500' },
    { icon: '🧘', label: 'Meditation', streak: 21, color: '#AF52DE' },
  ];

  return (
    <div className="w-full h-full p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 h-full">
        {habitCards.map((habit) => (
          <div
            key={habit.label}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/40 text-center hover:border-zinc-600/60 transition-all duration-300"
          >
            <span className="text-2xl sm:text-3xl mb-2">{habit.icon}</span>
            <p className="text-[10px] font-mono text-zinc-400 mb-1.5">{habit.label}</p>
            <div className="flex items-center gap-1">
              <span className="text-lg font-display font-bold" style={{ color: habit.color }}>
                {habit.streak}
              </span>
              <span className="text-[9px] font-mono text-zinc-500">day</span>
            </div>
            <div className="mt-2 w-full h-1 rounded-full bg-zinc-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(habit.streak / 30) * 100}%`, backgroundColor: habit.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlannerVisual() {
  const tasks = [
    { text: 'Finalize pitch deck v3', done: true, indent: 0 },
    { text: 'Send investor updates', done: false, indent: 0 },
    { text: 'Review analytics dashboard', done: true, indent: 0 },
    { text: 'Prep for demo day', done: false, indent: 1 },
    { text: 'Draft user interview questions', done: false, indent: 1 },
    { text: 'Update financial model', done: false, indent: 0 },
    { text: 'Q1 projections', done: true, indent: 1 },
    { text: 'Hiring pipeline review', done: false, indent: 0 },
  ];

  const doneCount = tasks.filter((t) => t.done).length;
  const pct = Math.round((doneCount / tasks.length) * 100);

  return (
    <div className="w-full h-full p-5 overflow-y-auto">
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-zinc-700/50">
        <div>
          <p className="font-heading font-bold text-sm text-white">This Week</p>
          <p className="text-[10px] font-mono text-zinc-500 mt-0.5">{doneCount}/{tasks.length} tasks done</p>
        </div>
        <span className="text-lg">📋</span>
      </div>
      <div className="space-y-1">
        {tasks.map((task, i) => (
          <div
            key={task.text}
            className="flex items-center gap-2.5 py-1"
            style={{ paddingLeft: `${task.indent * 14}px` }}
          >
            <div
              className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                task.done
                  ? 'bg-amber-500/80 border-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.25)]'
                  : 'border-zinc-600'
              }`}
            >
              {task.done && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className={`text-[11px] ${task.done ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2.5 border-t border-zinc-700/50">
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1.5">
          <span>Weekly progress</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-zinc-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function SpacesVisual() {
  const { t, locale } = useTranslation();
  const previewSpaces = spaces.slice(0, 4);

  return (
    <div className="w-full h-full p-4">
      <div className="grid grid-cols-2 gap-3 h-full">
        {previewSpaces.map((space) => (
          <Link
            key={space.slug}
            href={`/spaces/${space.slug}`}
            className="group flex flex-col rounded-xl bg-zinc-800/60 border border-zinc-700/40 overflow-hidden hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] transition-all duration-300"
          >
            <div className="relative h-20 sm:h-24 overflow-hidden">
              <Image
                src={space.image}
                alt={space.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[9px] font-mono">
                {space.memberCount.toLocaleString()} {t.spaces.members}
              </span>
            </div>
            <div className="p-2.5 flex-1 flex flex-col justify-between">
              <p className="font-heading font-bold text-[11px] text-zinc-200 group-hover:text-cyan-400 transition-colors line-clamp-1">
                {space.name}
              </p>
              <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1">
                {locale === 'es' ? space.descriptionEs : space.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const VISUALS: Record<string, React.ReactNode> = {
  journey: <JourneyVisual />,
  habits: <HabitsVisual />,
  planner: <PlannerVisual />,
  spaces: <SpacesVisual />,
};

/* ─── Main component ─── */

export default function AccountabilitySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const el = tabRefs.current[activeIndex];
    if (el) {
      const rect = el.getBoundingClientRect();
      const parent = el.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        setIndicatorStyle({
          top: `${rect.top - parentRect.top}px`,
          height: `${rect.height}px`,
        });
      }
    }
  }, [activeIndex]);

  const activeTab = TABS[activeIndex];

  return (
    <section className="relative py-16 lg:py-24 px-4 bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/8 to-indigo-600/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            Built-in Accountability
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--color-foreground)] uppercase leading-tight max-w-3xl mx-auto">
            Built-in tools to keep you accountable.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--color-foreground-muted)] max-w-xl mx-auto">
            Don&apos;t just read the playbooks. Execute them. Use our integrated tools and niche communities to track momentum and stay on course.
          </p>
        </motion.div>

        {/* Tabbed content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8"
        >
          {/* Tab list */}
          <div
            role="tablist"
            aria-orientation="vertical"
            className="md:w-[220px] lg:w-[260px] flex-shrink-0"
          >
            {/* Mobile: horizontal scrollable tabs */}
            <div className="md:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              {TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  role="tab"
                  aria-selected={activeIndex === i}
                  onClick={() => setActiveIndex(i)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-heading font-bold transition-all duration-300 ease-in-out border ${
                    activeIndex === i
                      ? 'bg-zinc-800/80 border-zinc-700 text-white shadow-[0_0_20px_rgba(167,139,250,0.15)]'
                      : 'bg-transparent border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <span className={activeIndex === i ? 'text-violet-400' : 'text-zinc-500'}>
                    {tab.icon}
                  </span>
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Desktop: vertical tab list with sliding indicator */}
            <div className="hidden md:block relative">
              <div
                className="absolute left-0 w-full rounded-xl bg-zinc-800/80 border border-zinc-700/50 transition-all duration-300 ease-in-out"
                style={indicatorStyle}
              />
              <div className="relative flex flex-col gap-1">
                {TABS.map((tab, i) => (
                  <button
                    key={tab.id}
                    ref={(el) => { tabRefs.current[i] = el; }}
                    role="tab"
                    aria-selected={activeIndex === i}
                    onClick={() => setActiveIndex(i)}
                    className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-heading font-bold transition-all duration-300 ease-in-out text-left ${
                      activeIndex === i
                        ? 'text-white'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span
                      className={`transition-colors duration-300 ${
                        activeIndex === i ? 'text-violet-400' : 'text-zinc-500'
                      }`}
                    >
                      {tab.icon}
                    </span>
                    {tab.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content panel */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden"
              >
                {/* Content text area */}
                <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-white mb-1.5">
                    {activeTab.headline}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {activeTab.body}
                  </p>
                </div>

                {/* Visual panel */}
                <div className="relative min-h-[240px] sm:min-h-[280px] mx-5 sm:mx-6 mb-5 sm:mb-6 rounded-xl bg-zinc-950/80 border border-zinc-800/50 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${activeTab.accent} opacity-60`} />
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                  {VISUALS[activeTab.id]}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bottom CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10 space-y-4"
        >
          {activeTab.id === 'journey' && (
            <Link
              href="/journey"
              className="inline-flex items-center gap-2 px-8 py-4 min-h-[48px] rounded-xl bg-[var(--color-accent)] text-white font-heading font-bold text-sm
                hover:shadow-[0_0_40px_rgba(255,59,48,0.3)] transition-all active:scale-[0.97]"
            >
              Start Your Journey
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}
          {activeTab.id === 'habits' && (
            <Link
              href="/founder-survival"
              className="inline-flex items-center gap-2 px-8 py-4 min-h-[48px] rounded-xl bg-[var(--color-accent)] text-white font-heading font-bold text-sm
                hover:shadow-[0_0_40px_rgba(255,59,48,0.3)] transition-all active:scale-[0.97]"
            >
              Track Your Habits
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}
          {activeTab.id === 'planner' && (
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 px-8 py-4 min-h-[48px] rounded-xl bg-[var(--color-accent)] text-white font-heading font-bold text-sm
                hover:shadow-[0_0_40px_rgba(255,59,48,0.3)] transition-all active:scale-[0.97]"
            >
              Open Your Planner
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}
          {activeTab.id === 'spaces' && (
            <>
              <Link
                href="/spaces"
                className="inline-flex items-center gap-2 px-8 py-4 min-h-[48px] rounded-xl bg-[var(--color-accent)] text-white font-heading font-bold text-sm
                  hover:shadow-[0_0_40px_rgba(255,59,48,0.3)] transition-all active:scale-[0.97]"
              >
                Explore All Spaces
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
              <div>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]
                    text-[var(--color-foreground)] font-heading font-bold text-sm
                    hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)] transition-all duration-300"
                >
                  {t.hero.cta1}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </a>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
