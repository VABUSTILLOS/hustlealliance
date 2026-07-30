'use client';

import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { useTranslation } from '@/lib/i18n/useTranslation';

/* ── color palette for niche accents ─────────────────── */
const NICHE_ACCENTS: Record<string, string> = {
  SaaS: '#059669',
  AI: '#7c3aed',
  Fintech: '#d97706',
  Health: '#db2777',
  Climate: '#0891b2',
  Web3: '#3b82f6',
  Creator: '#ea580c',
  EdTech: '#06b6d4',
  DevTools: '#6366f1',
};

/* ── member data ─────────────────────────────────────── */
interface MemberNode {
  id: string;
  name: string;
  username: string;
  startup: string;
  niche: string;
  image: string;
  accent: string;
}

const members: MemberNode[] = [
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    username: 'marcuschen',
    startup: 'Nexus AI',
    niche: 'SaaS',
    image: '/images/avatars/marcuschen.jpg',
    accent: NICHE_ACCENTS['SaaS'],
  },
  {
    id: 'priya-patel',
    name: 'Priya Patel',
    username: 'priyap',
    startup: 'Lumina Health',
    niche: 'Health',
    image: '/images/avatars/priyap.jpg',
    accent: NICHE_ACCENTS['Health'],
  },
  {
    id: 'james-okafor',
    name: 'James Okafor',
    username: 'jameso',
    startup: 'Volt Finance',
    niche: 'Fintech',
    image: '/images/avatars/jameso.jpg',
    accent: NICHE_ACCENTS['Fintech'],
  },
  {
    id: 'elena-kim',
    name: 'Elena Kim',
    username: 'elenak',
    startup: 'Aether Climate',
    niche: 'Climate',
    image: '/images/avatars/elenak.jpg',
    accent: NICHE_ACCENTS['Climate'],
  },
  {
    id: 'devon-mitchell',
    name: 'Devon Mitchell',
    username: 'devonm',
    startup: 'Flux Studio',
    niche: 'Creator',
    image: '/images/avatars/devonm.jpg',
    accent: NICHE_ACCENTS['Creator'],
  },
  {
    id: 'amara-obi',
    name: 'Amara Obi',
    username: 'amarao',
    startup: 'Cipher Security',
    niche: 'AI',
    image: '/images/avatars/amarao.jpg',
    accent: NICHE_ACCENTS['AI'],
  },
  {
    id: 'kevin-li',
    name: 'Kevin Li',
    username: 'kevinl',
    startup: 'ChainLogic',
    niche: 'Web3',
    image: '/images/avatars/kevinl.jpg',
    accent: NICHE_ACCENTS['Web3'],
  },
  {
    id: 'nina-kapoor',
    name: 'Nina Kapoor',
    username: 'ninak',
    startup: 'LearnFlow',
    niche: 'EdTech',
    image: '/images/avatars/ninak.jpg',
    accent: NICHE_ACCENTS['EdTech'],
  },
  {
    id: 'omar-hassan',
    name: 'Omar Hassan',
    username: 'omarh',
    startup: 'DeployKit',
    niche: 'DevTools',
    image: '/images/avatars/omarh.jpg',
    accent: NICHE_ACCENTS['DevTools'],
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

const NODE_SIZE = 64;
const NODE_GAP = 24; // gap between nodes in the marquee
const SCROLL_DURATION = 30; // seconds for one full cycle of the original set

/* ── FounderCard sub-component ───────────────────────── */
function FounderCard({
  member,
  isHovered,
  isDimmed,
  onHover,
  onLeave,
}: {
  member: MemberNode;
  isHovered: boolean;
  isDimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <Link
      href={`/member/${member.username}`}
      className="flex-shrink-0 flex flex-col items-center group"
      style={{ width: NODE_SIZE + NODE_GAP }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isDimmed ? 0.35 : 1,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          width: NODE_SIZE,
          height: NODE_SIZE,
          borderRadius: '50%',
          border: `2px solid ${member.accent}60`,
          overflow: 'hidden',
        }}
        className="bg-black/40"
      >
        <motion.div
          animate={{
            boxShadow: isHovered
              ? `0 0 28px ${member.accent}70`
              : `0 0 8px ${member.accent}20`,
          }}
          transition={{ duration: 0.3 }}
          className="w-full h-full rounded-full overflow-hidden"
        >
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="120px"
            className="object-cover rounded-full"
            style={{ filter: 'contrast(1.05)' }}
          />
        </motion.div>
      </motion.div>

      {/* Name + startup label — visible on hover */}
      <motion.div
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 4 : -2,
        }}
        transition={{ duration: 0.2 }}
        className="mt-2 text-center pointer-events-none whitespace-nowrap"
      >
        <p className="text-[11px] font-mono font-semibold text-white leading-tight">
          {member.name}
        </p>
        <p className="text-[9px] font-mono uppercase tracking-wider text-[var(--color-accent)] leading-tight">
          {member.startup}
        </p>
      </motion.div>
    </Link>
  );
}

/* ── main component ──────────────────────────────────── */

export default function MemberSpotlight() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const marqueeControls = useAnimationControls();
  const sectionRef = useRef<HTMLElement>(null);

  const filteredMembers = useMemo(() => {
    if (activeCategory === 'All') return members;
    return members.filter((m) => m.niche === activeCategory);
  }, [activeCategory]);

  // Duplicate for seamless infinite loop
  const marqueeItems = useMemo(
    () => [...filteredMembers, ...filteredMembers],
    [filteredMembers],
  );

  // Drive the marquee animation
  useEffect(() => {
    if (marqueeItems.length === 0) return;

    if (isMarqueePaused) {
      marqueeControls.stop();
    } else {
      marqueeControls.start({
        x: ['0%', '-50%'],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: SCROLL_DURATION,
            ease: 'linear',
          },
        },
      });
    }
  }, [isMarqueePaused, marqueeItems.length, marqueeControls, activeCategory]);

  // Reset hover + pause state on category change
  const handleCategoryChange = useCallback((key: CategoryKey) => {
    setActiveCategory(key);
    setHoveredId(null);
    setIsMarqueePaused(false);
  }, []);

  const handleMarqueeEnter = useCallback(() => setIsMarqueePaused(true), []);
  const handleMarqueeLeave = useCallback(() => {
    setIsMarqueePaused(false);
    setHoveredId(null);
  }, []);

  const handleNodeHover = useCallback((id: string) => setHoveredId(id), []);
  const handleNodeLeave = useCallback(() => setHoveredId(null), []);

  return (
    <section ref={sectionRef} className="relative py-16 lg:py-32 px-4 bg-black overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[var(--color-violet)]/4 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[var(--color-accent)]/3 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
            {t.spotlight.tag}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground leading-none uppercase">
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
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
        >
          {categoryPills.map((pill) => (
            <button
              key={pill.key}
              onClick={() => handleCategoryChange(pill.key)}
              className={clsx(
                'relative px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300',
                activeCategory === pill.key
                  ? 'text-foreground bg-accent/20 border border-accent/40 shadow-[0_0_20px_rgba(255,59,48,0.1)]'
                  : 'text-muted border border-white/10 hover:text-foreground hover:border-white/20',
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

        {/* ── Infinite Scrolling Marquee ────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {marqueeItems.length > 0 ? (
              <>
                {/* Overflow mask for clean edges */}
                <div
                  className="relative overflow-hidden py-6"
                  onMouseEnter={handleMarqueeEnter}
                  onMouseLeave={handleMarqueeLeave}
                >
                  {/* Fade edges */}
                  <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-r from-black to-transparent" />
                  <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-r from-transparent to-black" />

                  <motion.div
                    animate={marqueeControls}
                    className="flex"
                    style={{ width: 'fit-content' }}
                  >
                    {marqueeItems.map((member, i) => (
                      <FounderCard
                        key={`${member.id}-${i}`}
                        member={member}
                        isHovered={hoveredId === `${member.id}-${i}`}
                        isDimmed={hoveredId !== null && hoveredId !== `${member.id}-${i}`}
                        onHover={() => handleNodeHover(`${member.id}-${i}`)}
                        onLeave={handleNodeLeave}
                      />
                    ))}
                  </motion.div>
                </div>

                {/* Connected founders badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex justify-center mt-6"
                >
                  <div className="text-center bg-black/70 backdrop-blur-md rounded-2xl px-5 py-2.5 border border-white/8">
                    <div className="text-xl sm:text-2xl font-display font-bold text-white">
                      {filteredMembers.length === members.length
                        ? '2,400+'
                        : filteredMembers.length}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mt-0.5">
                      {t.spotlight.connectedFounders}
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-[var(--color-foreground-muted)] py-16 font-mono text-sm"
              >
                {t.spotlight.emptyCategory}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            href="/community"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]
              text-[var(--color-foreground)] font-heading font-bold text-sm
              hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)] transition-all duration-300"
          >
            {t.spotlight.viewAll}
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
