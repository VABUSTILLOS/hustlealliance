'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Tab copy constant ─── */
const TABS = [
  {
    id: 'journey',
    title: 'The Journey',
    headline: '100+ tasks to take you from ideation to scale.',
    body: 'Earn XP and unlock tiers as you build.',
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
    body: 'Track your daily routines and maintain your execution streaks.',
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
    body: "Because winging it doesn't scale.",
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
] as const;

/* ─── Visual placeholder sub-components ─── */

function JourneyVisual() {
  return (
    <div className="w-full h-full flex flex-col gap-3 p-4">
      {/* Roadmap nodes */}
      {[
        { label: 'Ideation', xp: '0 XP', done: true, left: '8%', top: '20%' },
        { label: 'Validation', xp: '100 XP', done: true, left: '28%', top: '8%' },
        { label: 'MVP', xp: '250 XP', done: true, left: '48%', top: '40%' },
        { label: 'Launch', xp: '500 XP', done: false, left: '68%', top: '15%' },
        { label: 'Scale', xp: '1,000 XP', done: false, left: '88%', top: '35%' },
      ].map((node) => (
        <div
          key={node.label}
          className="absolute flex flex-col items-center gap-1"
          style={{ left: node.left, top: node.top }}
        >
          <div
            className={`w-4 h-4 rounded-full border-2 ${
              node.done
                ? 'border-violet-400 bg-violet-500/40 shadow-[0_0_12px_rgba(167,139,250,0.5)]'
                : 'border-zinc-600 bg-zinc-800'
            }`}
          />
          <span className="text-[10px] font-mono text-zinc-300 whitespace-nowrap">{node.label}</span>
          <span className="text-[9px] font-mono text-zinc-500">{node.xp}</span>
        </div>
      ))}

      {/* Glowing gradient path */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500/80 via-violet-400/40 to-zinc-700 translate-y-[-50%] rounded-full shadow-[0_0_20px_rgba(167,139,250,0.3)]" />

      {/* XP badge */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/50">
        <span className="text-[10px] font-mono text-zinc-400">Current:</span>
        <span className="text-xs font-heading font-bold text-violet-300">350 XP</span>
        <span className="text-[10px] font-mono text-zinc-500">/ Tier 2</span>
      </div>
    </div>
  );
}

function HabitsVisual() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weeks = [
    [true, true, true, true, false, true, false],
    [true, true, true, true, true, false, true],
    [true, true, true, true, true, true, true],
    [true, true, false, true, true, true, false],
  ];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      {/* Calendar grid */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d) => (
            <div key={d} className="text-[10px] font-mono text-zinc-500 text-center">
              {d}
            </div>
          ))}
        </div>
        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1.5">
            {week.map((active, di) => (
              <div
                key={di}
                className={`aspect-square rounded-md transition-all duration-300 ${
                  active
                    ? 'bg-emerald-500/40 border border-emerald-400/30 shadow-[0_0_8px_rgba(52,211,153,0.2)]'
                    : 'bg-zinc-800/60 border border-zinc-700/30'
                }`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Streak counter */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/30">
        <span className="text-[10px] font-mono text-zinc-400">Current streak</span>
        <span className="text-sm font-heading font-bold text-emerald-300">14 days 🔥</span>
      </div>
    </div>
  );
}

function PlannerVisual() {
  const tasks = [
    { text: 'Finalize pitch deck v3', done: true },
    { text: 'Send investor updates', done: false },
    { text: 'Review analytics dashboard', done: true },
    { text: 'Prep for demo day', done: false },
    { text: 'Draft user interview questions', done: false },
    { text: 'Update financial model', done: false },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-3 p-4">
      {/* Checklist items */}
      <div className="flex-1 space-y-1.5">
        {tasks.map((task, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 py-1.5"
          >
            <div
              className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                task.done
                  ? 'bg-amber-500/60 border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                  : 'border-zinc-600'
              }`}
            >
              {task.done && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span
              className={`text-xs ${
                task.done ? 'text-zinc-500 line-through' : 'text-zinc-200'
              }`}
            >
              {task.text}
            </span>
          </div>
        ))}
      </div>

      {/* Progress footer */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/30">
        <span className="text-[10px] font-mono text-zinc-400">This week</span>
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 rounded-full bg-zinc-700 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 w-[50%]" />
          </div>
          <span className="text-[10px] font-mono text-zinc-400">3/6</span>
        </div>
      </div>
    </div>
  );
}

const VISUALS: Record<string, React.ReactNode> = {
  journey: <JourneyVisual />,
  habits: <HabitsVisual />,
  planner: <PlannerVisual />,
};

/* ─── Main component ─── */

export default function AccountabilitySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
    <section className="relative py-16 lg:py-32 px-4 bg-black overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/5 to-indigo-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* ── Section header ── */}
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
            Don&apos;t just read the playbooks. Execute them. Use our integrated dashboard to track your momentum and let the community keep you on track.
          </p>
        </motion.div>

        {/* ── Tabbed content ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8"
        >
          {/* ── Tab list ── */}
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
              {/* Sliding background indicator */}
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

          {/* ── Content panel (bento box) ── */}
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

                {/* Visual placeholder area */}
                <div className="relative h-[220px] sm:h-[260px] mx-5 sm:mx-6 mb-5 sm:mb-6 rounded-xl bg-zinc-950/80 border border-zinc-800/50 overflow-hidden">
                  {/* Animated gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${activeTab.accent} opacity-60`}
                  />
                  {/* Subtle grid pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                  {VISUALS[activeTab.id]}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
