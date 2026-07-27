'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: number;
  name: string;
  handle: string;
  message: string;
  time: string;
  avatar: string;
  reaction?: string;
}

const messages: ChatMessage[] = [
  {
    id: 1,
    name: 'Marcus Chen',
    handle: '@marchen',
    message: 'Just used the Pre-Seed deck template. Got a second meeting with a16z. This thing is gold.',
    time: '2m ago',
    avatar: 'MC',
    reaction: '🔥 24',
  },
  {
    id: 2,
    name: 'Priya Patel',
    handle: '@priyap',
    message: 'Anyone tested the new cold email sequence? 42% open rate on my first batch.',
    time: '5m ago',
    avatar: 'PP',
    reaction: '🚀 18',
  },
  {
    id: 3,
    name: 'James Okafor',
    handle: '@jokafor',
    message: 'Pro tip: Send your deck via DocSend, not PDF. Track every second they spend on each slide.',
    time: '8m ago',
    avatar: 'JO',
    reaction: '💡 31',
  },
  {
    id: 4,
    name: 'Elena Torres',
    handle: '@elenat',
    message: 'Just closed our seed round. The term sheet breakdown in the library saved us $50K in legal fees.',
    time: '12m ago',
    avatar: 'ET',
    reaction: '🎉 47',
  },
  {
    id: 5,
    name: 'Devon Wright',
    handle: '@devonw',
    message: 'Launched on Product Hunt today. The launch checklist in Growth Playbook was a lifesaver.',
    time: '15m ago',
    avatar: 'DW',
    reaction: '👏 22',
  },
  {
    id: 6,
    name: 'Amara Obi',
    handle: '@amarao',
    message: 'Zero-budget launch strategy from the playbook got us 2K signups in 72 hours. No ads.',
    time: '18m ago',
    avatar: 'AO',
    reaction: '⚡ 56',
  },
  {
    id: 7,
    name: 'Sarah Kim',
    handle: '@sarahk',
    message: 'The SaaS pricing model template literally doubled our conversion. $29 → $49 tier.',
    time: '22m ago',
    avatar: 'SK',
    reaction: '💰 39',
  },
  {
    id: 8,
    name: 'Diego Ramirez',
    handle: '@diegor',
    message: 'Just onboarded. The welcome mastermind call was insane. 3 founders gave me feedback on my pitch.',
    time: '25m ago',
    avatar: 'DR',
    reaction: '🙌 15',
  },
  {
    id: 9,
    name: 'Lisa Wang',
    handle: '@lisaw',
    message: 'Who here has raised via SAFE vs priced round? About to close our first and want to compare notes.',
    time: '30m ago',
    avatar: 'LW',
  },
  {
    id: 10,
    name: 'Tomás Ferrer',
    handle: '@tomasf',
    message: 'The PMF framework from Module 3 completely changed how we think about validation. No more guesswork.',
    time: '35m ago',
    avatar: 'TF',
    reaction: '🧠 28',
  },
  {
    id: 11,
    name: 'Rachel Adeyemi',
    handle: '@rachela',
    message: 'Just landed our first enterprise client using the B2B outreach script from the Marketing playbook. $120K ACV.',
    time: '40m ago',
    avatar: 'RA',
    reaction: '💼 63',
  },
  {
    id: 12,
    name: 'Alex Novak',
    handle: '@alexn',
    message: 'Running the founder agreement template by my lawyer today. Saved me $3K vs drafting from scratch.',
    time: '44m ago',
    avatar: 'AN',
    reaction: '📝 12',
  },
];

const avatarColors = [
  'bg-red-500/30 text-red-300',
  'bg-orange-500/30 text-orange-300',
  'bg-amber-500/30 text-amber-300',
  'bg-emerald-500/30 text-emerald-300',
  'bg-teal-500/30 text-teal-300',
  'bg-cyan-500/30 text-cyan-300',
  'bg-blue-500/30 text-blue-300',
  'bg-purple-500/30 text-purple-300',
  'bg-pink-500/30 text-pink-300',
];

export default function LiveChatFeed() {
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    // Initial batch: show 5 messages immediately
    if (visibleMessages.length === 0) {
      setVisibleMessages(messages.slice(0, 5));
      setMessageIndex(5);
      return;
    }

    const interval = setInterval(() => {
      setVisibleMessages((prev) => {
        const nextIndex = messageIndex % messages.length;
        const next = [...prev, messages[nextIndex]];
        setMessageIndex((i) => i + 1);
        // Keep max 8 visible, remove oldest
        if (next.length > 8) {
          return next.slice(next.length - 8);
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [messageIndex, isPaused, visibleMessages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  return (
    <div
      className="relative w-full max-w-md mx-auto rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-light)]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-foreground-muted)] ml-2">
          #general-chat
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] text-[var(--color-foreground-dim)]">
            {messages.length + 228} online
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="h-80 overflow-y-auto overflow-x-hidden px-4 py-3 space-y-3 scrollbar-thin"
        style={{ scrollBehavior: 'smooth' }}
      >
        <AnimatePresence initial={false}>
          {visibleMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex gap-3 group"
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono ${
                  avatarColors[msg.id % avatarColors.length]
                }`}
              >
                {msg.avatar}
              </div>
              {/* Message body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-sm font-bold text-[var(--color-foreground)]">
                    {msg.name}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-foreground-dim)]">
                    {msg.time}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed mt-0.5">
                  {msg.message}
                </p>
                {msg.reaction && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[11px] bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10 text-[var(--color-foreground-muted)] cursor-default hover:border-[var(--color-accent)]/30 transition-colors"
                  >
                    {msg.reaction}
                  </motion.span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-[var(--color-mockup-bg)] flex items-center justify-center shrink-0" />
          <div className="flex items-center gap-1 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-foreground-dim)] animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-foreground-dim)] animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-foreground-dim)] animate-bounce [animation-delay:300ms]" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
