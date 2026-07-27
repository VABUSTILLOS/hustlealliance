'use client';

import { useRef, useState, useMemo, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
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
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    accent: NICHE_ACCENTS['SaaS'],
  },
  {
    id: 'priya-patel',
    name: 'Priya Patel',
    username: 'priyap',
    startup: 'Lumina Health',
    niche: 'Health',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
    accent: NICHE_ACCENTS['Health'],
  },
  {
    id: 'james-okafor',
    name: 'James Okafor',
    username: 'jameso',
    startup: 'Volt Finance',
    niche: 'Fintech',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
    accent: NICHE_ACCENTS['Fintech'],
  },
  {
    id: 'elena-torres',
    name: 'Elena Torres',
    username: 'elenat',
    startup: 'Aether Climate',
    niche: 'Climate',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces',
    accent: NICHE_ACCENTS['Climate'],
  },
  {
    id: 'devon-wright',
    name: 'Devon Wright',
    username: 'devonw',
    startup: 'Flux Studio',
    niche: 'Creator',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces',
    accent: NICHE_ACCENTS['Creator'],
  },
  {
    id: 'amara-obi',
    name: 'Amara Obi',
    username: 'amarao',
    startup: 'Cipher Security',
    niche: 'AI',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    accent: NICHE_ACCENTS['AI'],
  },
  {
    id: 'kevin-li',
    name: 'Kevin Li',
    username: 'kevinl',
    startup: 'ChainLogic',
    niche: 'Web3',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
    accent: NICHE_ACCENTS['Web3'],
  },
  {
    id: 'nina-kapoor',
    name: 'Nina Kapoor',
    username: 'ninak',
    startup: 'LearnFlow',
    niche: 'EdTech',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=faces',
    accent: NICHE_ACCENTS['EdTech'],
  },
  {
    id: 'omar-hassan',
    name: 'Omar Hassan',
    username: 'omark',
    startup: 'DeployKit',
    niche: 'DevTools',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces',
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

/* ── layout types ────────────────────────────────────── */
interface LayoutNode {
  member: MemberNode;
  x: number;
  y: number;
  r: number;
}

interface LayoutEdge {
  from: string;
  to: string;
}

/* ── helpers ─────────────────────────────────────────── */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const NODE_R = 26;
const VIEW_W = 800;
const VIEW_H = 500;

/* ── compute layout once ─────────────────────────────── */
function computeLayout(filtered: MemberNode[]): { nodes: LayoutNode[]; edges: LayoutEdge[] } {
  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];

  if (filtered.length === 0) return { nodes, edges };

  // Group by niche
  const groups = new Map<string, MemberNode[]>();
  for (const m of filtered) {
    const list = groups.get(m.niche) || [];
    list.push(m);
    groups.set(m.niche, list);
  }

  const nicheKeys = Array.from(groups.keys());
  const centerX = VIEW_W / 2;
  const centerY = VIEW_H / 2;

  if (nicheKeys.length === 1) {
    // Single niche: arrange in a circle
    const group = groups.get(nicheKeys[0])!;
    const radius = Math.min(180, group.length * 50);
    group.forEach((m, i) => {
      const angle = (2 * Math.PI * i) / group.length - Math.PI / 2;
      nodes.push({
        member: m,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        r: NODE_R,
      });
    });
  } else {
    // Arrange niches around the center
    const nicheRadius = Math.min(180, nicheKeys.length * 40 + 40);
    const positions: { cx: number; cy: number; members: MemberNode[] }[] = [];

    nicheKeys.forEach((key, i) => {
      const angle = (2 * Math.PI * i) / nicheKeys.length - Math.PI / 2;
      positions.push({
        cx: centerX + Math.cos(angle) * nicheRadius,
        cy: centerY + Math.sin(angle) * nicheRadius,
        members: groups.get(key)!,
      });
    });

    // Place members around their niche center
    positions.forEach((pos) => {
      const { cx, cy, members: groupMembers } = pos;
      const scatterR = Math.min(50, groupMembers.length * 18 + 15);
      groupMembers.forEach((m, i) => {
        const seed = hashStr(m.id);
        const angle = (2 * Math.PI * i) / groupMembers.length + (seed % 30) * (Math.PI / 180);
        const dist = groupMembers.length === 1 ? 0 : scatterR;
        nodes.push({
          member: m,
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          r: NODE_R,
        });
      });
    });
  }

  // Build edges: members in same niche are connected
  const nicheGroups = new Map<string, LayoutNode[]>();
  for (const n of nodes) {
    const list = nicheGroups.get(n.member.niche) || [];
    list.push(n);
    nicheGroups.set(n.member.niche, list);
  }

  for (const [, groupNodes] of nicheGroups) {
    for (let i = 0; i < groupNodes.length; i++) {
      for (let j = i + 1; j < groupNodes.length; j++) {
        edges.push({ from: groupNodes[i].member.id, to: groupNodes[j].member.id });
      }
    }
  }

  return { nodes, edges };
}

/* ── sub-components ──────────────────────────────────── */

function FounderNode({ node, idx, inView }: { node: LayoutNode; idx: number; inView: boolean }) {
  const size = node.r * 2;
  return (
    <Link href={`/member/${node.member.username}`} className="block group">
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 + idx * 0.08, ease: 'easeOut' }}
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{
            duration: 3.5 + idx * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: idx * 0.5,
          }}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            border: `2px solid ${node.member.accent}60`,
            overflow: 'hidden',
          }}
          className="hover:border-[var(--color-accent)]/80 transition-colors duration-300 bg-black/40"
        >
          <motion.div
            animate={{
              boxShadow: [
                `0 0 6px ${node.member.accent}20`,
                `0 0 16px ${node.member.accent}40`,
                `0 0 6px ${node.member.accent}20`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.7 }}
            className="w-full h-full rounded-full"
          >
            <img
              src={node.member.image}
              alt={node.member.name}
              className="w-full h-full object-cover rounded-full"
              style={{ filter: 'grayscale(100%) contrast(1.1)' }}
              loading="lazy"
            />
          </motion.div>
        </motion.div>
        {/* Hover tooltip */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <span className="text-[9px] font-mono text-[var(--color-accent)] bg-black/90 px-2 py-1 rounded">
            {node.member.name} · {node.member.startup}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

/* ── main component ──────────────────────────────────── */

export default function MemberSpotlight() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('All');
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  const filteredMembers = useMemo(() => {
    if (activeCategory === 'All') return members;
    return members.filter((m) => m.niche === activeCategory);
  }, [activeCategory]);

  const layout = useMemo(() => computeLayout(filteredMembers), [filteredMembers]);

  const nodeMap = useMemo(() => {
    const m = new Map<string, LayoutNode>();
    layout.nodes.forEach((n) => m.set(n.member.id, n));
    return m;
  }, [layout.nodes]);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 px-4 bg-black overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[var(--color-violet)]/4 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[var(--color-accent)]/3 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
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
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
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

        {/* ── Network Graph ────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative w-full"
            style={{ aspectRatio: `${VIEW_W}/${VIEW_H}` }}
          >
            {/* SVG layer: edges + particles */}
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Edge lines */}
              {layout.edges.map((edge, i) => {
                const from = nodeMap.get(edge.from);
                const to = nodeMap.get(edge.to);
                if (!from || !to) return null;
                return (
                  <motion.line
                    key={`${edge.from}-${edge.to}`}
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={`${from.member.accent}20`}
                    strokeWidth={1}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2 + i * 0.08, ease: 'easeInOut' }}
                  />
                );
              })}

              {/* Traveling glow particles */}
              {layout.edges.slice(0, 15).map((edge, i) => {
                const from = nodeMap.get(edge.from);
                const to = nodeMap.get(edge.to);
                if (!from || !to) return null;
                return (
                  <motion.circle
                    key={`p-${edge.from}-${edge.to}`}
                    r={2}
                    fill={from.member.accent}
                    filter="blur(0.5px)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{
                      duration: 2.5,
                      delay: 2 + i * 0.15,
                      repeat: Infinity,
                      repeatDelay: 3 + (i % 4),
                      ease: 'easeInOut',
                    }}
                  >
                    <animateMotion
                      dur={`${2 + (i % 2.5)}s`}
                      repeatCount="indefinite"
                      begin={`${2 + i * 0.15}s`}
                      path={`M${from.x},${from.y} L${to.x},${to.y}`}
                    />
                  </motion.circle>
                );
              })}
            </svg>

            {/* Node overlay */}
            {layout.nodes.map((node, idx) => {
              const xPct = `${(node.x / VIEW_W) * 100}%`;
              const yPct = `${(node.y / VIEW_H) * 100}%`;
              return (
                <div
                  key={node.member.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: xPct, top: yPct }}
                >
                  <FounderNode node={node} idx={idx} inView={inView} />
                </div>
              );
            })}

            {/* Center badge */}
            {filteredMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="absolute top-[92%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
              >
                <div className="text-center bg-black/70 backdrop-blur-md rounded-2xl px-5 py-2.5 border border-white/8">
                  <div className="text-xl sm:text-2xl font-display font-bold text-white">
                    {filteredMembers.length === members.length ? '2,400+' : filteredMembers.length}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/50 mt-0.5">
                    {filteredMembers.length === members.length
                      ? t.spotlight.viewAll.replace('View all ', '').replace(' members', '')
                      : 'founders'}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
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
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
