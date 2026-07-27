'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useTranslation } from '@/lib/i18n/useTranslation';

const nicheTagStyles: Record<string, string> = {
  SaaS: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Health: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Fintech: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Climate: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  Creator: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  AI: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Web3': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  EdTech: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'DevTools': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
};

const members = [
  {
    name: 'Marcus Chen',
    role: 'Founder & CEO',
    startup: 'Nexus AI',
    niche: 'SaaS',
    tagColor: nicheTagStyles['SaaS'],
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=faces',
  },
  {
    name: 'Priya Patel',
    role: 'CTO & Co-Founder',
    startup: 'Lumina Health',
    niche: 'Health',
    tagColor: nicheTagStyles['Health'],
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop&crop=faces',
  },
  {
    name: 'James Okafor',
    role: 'Founder',
    startup: 'Volt Finance',
    niche: 'Fintech',
    tagColor: nicheTagStyles['Fintech'],
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&crop=faces',
  },
  {
    name: 'Elena Torres',
    role: 'Co-Founder',
    startup: 'Aether Climate',
    niche: 'Climate',
    tagColor: nicheTagStyles['Climate'],
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop&crop=faces',
  },
  {
    name: 'Devon Wright',
    role: 'Founder & Designer',
    startup: 'Flux Studio',
    niche: 'Creator',
    tagColor: nicheTagStyles['Creator'],
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop&crop=faces',
  },
  {
    name: 'Amara Obi',
    role: 'CEO',
    startup: 'Cipher Security',
    niche: 'AI',
    tagColor: nicheTagStyles['AI'],
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=faces',
  },
  {
    name: 'Kevin Li',
    role: 'Founder',
    startup: 'ChainLogic',
    niche: 'Web3',
    tagColor: nicheTagStyles['Web3'],
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=faces',
  },
  {
    name: 'Nina Kapoor',
    role: 'Co-Founder',
    startup: 'LearnFlow',
    niche: 'EdTech',
    tagColor: nicheTagStyles['EdTech'],
    image:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop&crop=faces',
  },
  {
    name: 'Omar Hassan',
    role: 'CTO',
    startup: 'DeployKit',
    niche: 'DevTools',
    tagColor: nicheTagStyles['DevTools'],
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop&crop=faces',
  },
];

const categoryPills = [
  { key: 'All', label: 'All' },
  { key: 'SaaS', label: 'SaaS' },
  { key: 'AI', label: 'AI' },
  { key: 'Fintech', label: 'Fintech' },
  { key: 'Health', label: 'Health' },
  { key: 'Climate', label: 'Climate' },
  { key: 'Web3', label: 'Web3' },
  { key: 'Creator', label: 'Creator' },
] as const;

type CategoryKey = (typeof categoryPills)[number]['key'];

const MemberCard = ({
  name,
  role,
  startup,
  niche,
  tagColor,
  image,
}: (typeof members)[number]) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="group cursor-pointer"
  >
    <div className="relative bg-surface border border-surface-light rounded-2xl overflow-hidden transition-all duration-500 hover:border-accent/30 hover:shadow-[0_20px_60px_rgba(255,59,48,0.1)]">
      {/* Portrait photo */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-all duration-700"
          style={{
            filter: 'grayscale(100%) contrast(1.1)',
          }}
          loading="lazy"
        />
        {/* Red overlay on hover */}
        <div className="absolute inset-0 bg-accent/0 mix-blend-multiply transition-all duration-500 group-hover:bg-accent/25" />

        {/* Gradient fade to bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

        {/* Niche tag */}
        <div
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${tagColor}`}
        >
          {niche}
        </div>

        {/* Info overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-heading text-lg font-bold text-foreground leading-tight">
            {name}
          </h3>
          <p className="font-body text-xs text-foreground-muted mt-0.5">{role}</p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-foreground-dim">
            <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center">
              <span className="text-[10px] font-mono font-bold text-accent">
                {startup.charAt(0)}
              </span>
            </div>
            <span className="font-mono text-[11px] text-foreground-muted tracking-wide">
              {startup}
            </span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function MemberSpotlight() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('All');

  const filteredMembers = useMemo(() => {
    if (activeCategory === 'All') return members;
    return members.filter((m) => m.niche === activeCategory);
  }, [activeCategory]);

  return (
    <section className="relative py-24 lg:py-32 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
            {t.spotlight.tag}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-none uppercase">
            {t.spotlight.line1}
            <br />
            {t.spotlight.line2}
          </h2>
        </motion.div>

        {/* Category filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-14"
        >
          {categoryPills.map((pill) => (
            <button
              key={pill.key}
              onClick={() => setActiveCategory(pill.key)}
              className={clsx(
                'relative px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300',
                activeCategory === pill.key
                  ? 'text-foreground bg-accent/20 border border-accent/40 shadow-[0_0_20px_rgba(255,59,48,0.1)]'
                  : 'text-muted border border-white/10 hover:text-foreground hover:border-white/20'
              )}
            >
              {activeCategory === pill.key && (
                <motion.div
                  layoutId="activeMemberPill"
                  className="absolute inset-0 rounded-full bg-accent/10 border border-accent/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {pill.label}
                {pill.key !== 'All' && (
                  <span className="ml-1.5 text-[10px] text-[var(--color-foreground-dim)]">
                    {members.filter((m) => m.niche === pill.key).length}
                  </span>
                )}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Trading card grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member) => (
              <MemberCard key={member.name} {...member} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state when no members match */}
        {filteredMembers.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[var(--color-foreground-muted)] py-16 font-mono text-sm"
          >
            No members in this category yet. More joining daily.
          </motion.p>
        )}

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="#members"
            className="font-mono text-xs uppercase tracking-[0.15em] text-accent hover:text-accent-glow transition-colors inline-flex items-center gap-2"
          >
            {t.spotlight.viewAll}
            <span className="text-lg leading-none">&rarr;</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
