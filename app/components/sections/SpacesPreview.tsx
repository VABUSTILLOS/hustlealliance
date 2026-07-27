'use client';

import { useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { spaces } from '@/lib/data/spaces';
import { memberProfiles } from '@/lib/data/users';
import { useTranslation } from '@/lib/i18n/useTranslation';

/* ── types ─────────────────────────────────────────── */
type Node = {
  id: string;
  x: number;
  y: number;
  r: number;
  image: string;
  label: string;
  isHub: boolean;
  slug?: string;
  accent: string;
};

type Edge = { from: string; to: string };

/* ── helpers ────────────────────────────────────────── */
const HUB_ACCENTS = ['#ff3b30', '#7c3aed', '#059669', '#0891b2', '#ea580c', '#db2777'];
const FOUNDER_ACCENT = '#ffffff';

/** Deterministic pseudo-random using a simple hash */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/* ── compute layout once ────────────────────────────── */
function useLayout() {
  return useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // --- hub nodes: spaces arranged in a 3-col × 2-row grid ---
    const previewSpaces = spaces.slice(0, 6);
    const cols = 3;
    const hubRX = 26;
    const hubRY = 26;
    const marginX = 100;
    const marginY = 80;
    const viewW = 800;
    const viewH = 440;
    const colGap = (viewW - marginX * 2) / (cols - 1);
    const rowGap = (viewH - marginY * 2) / 1; // 2 rows, 1 gap

    const hubMap = new Map<string, Node>();

    previewSpaces.forEach((space, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = marginX + col * colGap;
      const y = marginY + row * rowGap;

      const node: Node = {
        id: space.slug,
        x,
        y,
        r: hubRX,
        image: space.image,
        label: space.name,
        isHub: true,
        slug: space.slug,
        accent: HUB_ACCENTS[i % HUB_ACCENTS.length],
      };
      nodes.push(node);
      hubMap.set(space.slug, node);
    });

    // --- founder nodes: members connected to spaces ---
    const founderEntries = Object.values(memberProfiles).slice(0, 6);
    const founderR = 18;
    const usedPositions: { x: number; y: number }[] = [];

    founderEntries.forEach((member) => {
      const seed = hashStr(member.username);
      // find a hub this founder is connected to
      const connectedHubSlug = member.joinedSpaces.find((s) => hubMap.has(s));
      const hub = connectedHubSlug ? hubMap.get(connectedHubSlug) : nodes[seed % nodes.length];

      // place founder near hub with some jitter
      const angle = ((seed % 360) * Math.PI) / 180;
      const dist = 70 + (seed % 40);
      let fx = hub!.x + Math.cos(angle) * dist;
      let fy = hub!.y + Math.sin(angle) * dist;

      // avoid collisions
      const minDist = founderR * 2 + 8;
      for (const pos of usedPositions) {
        const dx = fx - pos.x;
        const dy = fy - pos.y;
        if (Math.sqrt(dx * dx + dy * dy) < minDist) {
          fx += 20 * (seed % 3 === 0 ? 1 : -1);
          fy += 15 * (seed % 3 === 1 ? 1 : -1);
        }
      }
      usedPositions.push({ x: fx, y: fy });

      const node: Node = {
        id: member.username,
        x: fx,
        y: fy,
        r: founderR,
        image: member.avatar,
        label: member.name,
        isHub: false,
        accent: FOUNDER_ACCENT,
      };
      nodes.push(node);

      // edges: founder → connected spaces
      member.joinedSpaces.forEach((slug) => {
        if (hubMap.has(slug)) {
          edges.push({ from: member.username, to: slug });
        }
      });
    });

    // add some inter-hub edges for network feel
    for (let i = 0; i < 6; i++) {
      for (let j = i + 1; j < 6; j++) {
        if ((i + j) % 3 === 0) {
          edges.push({ from: previewSpaces[i].slug, to: previewSpaces[j].slug });
        }
      }
    }

    return { nodes, edges, viewW: 800, viewH: 440 };
  }, []);
}

/* ── component ──────────────────────────────────────── */
export default function SpacesPreview() {
  const { t } = useTranslation();
  const { nodes, edges, viewW, viewH } = useLayout();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  const nodeMap = useMemo(() => {
    const m = new Map<string, Node>();
    nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [nodes]);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 px-4 bg-black overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-[var(--color-violet)]/5 rounded-full blur-[160px]" />
        <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] bg-[var(--color-accent)]/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            {t.spaces.homeTag}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--color-foreground)] uppercase leading-tight max-w-3xl mx-auto">
            {t.spaces.homeHeadline}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--color-foreground-muted)] max-w-xl mx-auto">
            {t.spaces.homeSubtitle}
          </p>
        </motion.div>

        {/* ── Network Graph ────────────────────────────── */}
        <div className="relative w-full" style={{ aspectRatio: `${viewW}/${viewH}` }}>
          <svg
            viewBox={`0 0 ${viewW} ${viewH}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Edge lines */}
            {edges.map((edge, i) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              return (
                <motion.line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={from.isHub && to.isHub ? 1 : 0.6}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.08, ease: 'easeInOut' }}
                />
              );
            })}

            {/* Glowing particles traveling along edges */}
            {edges.map((edge, i) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              return (
                <motion.circle
                  key={`particle-${edge.from}-${edge.to}`}
                  r={2}
                  fill={from.accent}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: [0, 0.8, 0] } : {}}
                  transition={{
                    duration: 2.5,
                    delay: 1.5 + i * 0.15,
                    repeat: Infinity,
                    repeatDelay: 3 + (i % 4),
                    ease: 'easeInOut',
                  }}
                >
                  <animateMotion
                    dur={`${2 + (i % 3)}s`}
                    repeatCount="indefinite"
                    begin={`${1.5 + i * 0.15}s`}
                    path={`M${from.x},${from.y} L${to.x},${to.y}`}
                  />
                </motion.circle>
              );
            })}
          </svg>

          {/* Overlay nodes (positioned absolutely over the SVG) */}
          {/* We use px calculations based on the viewBox ratio */}
          {nodes.map((node, idx) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.06, ease: 'easeOut' }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(node.x / viewW) * 100}%`,
                top: `${(node.y / viewH) * 100}%`,
              }}
            >
              {node.isHub ? (
                /* Hub node: space image circle with glow */
                <Link href={`/spaces/${node.slug}`} className="block group">
                  <motion.div
                    className="relative"
                    animate={{ boxShadow: [`0 0 8px ${node.accent}30`, `0 0 20px ${node.accent}50`, `0 0 8px ${node.accent}30`] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      width: node.r * 2,
                      height: node.r * 2,
                      borderRadius: '50%',
                      border: `2px solid ${node.accent}60`,
                    }}
                  >
                    <img
                      src={node.image}
                      alt={node.label}
                      className="w-full h-full rounded-full object-cover transition-transform duration-400 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-[9px] font-mono text-[var(--color-foreground-dim)] group-hover:text-[var(--color-accent)] transition-colors">
                        {node.label}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ) : (
                /* Founder node: small avatar */
                <Link href={`/member/${node.id}`} className="block group">
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3 + idx * 0.5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.3 }}
                    style={{
                      width: node.r * 2,
                      height: node.r * 2,
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.15)',
                      overflow: 'hidden',
                    }}
                    className="hover:border-[var(--color-accent)]/50 transition-colors duration-300"
                  >
                    <img
                      src={node.image}
                      alt={node.label}
                      className="w-full h-full rounded-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[8px] font-mono text-[var(--color-accent)] bg-black/80 px-1.5 py-0.5 rounded">
                      {node.label}
                    </span>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}

          {/* Center label showing total members */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-[var(--color-foreground)]">
                {spaces.reduce((sum, s) => sum + s.memberCount, 0).toLocaleString()}+
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-foreground-dim)] mt-1">
                connected founders
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mt-10"
        >
          <Link
            href="/spaces"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)]
              text-[var(--color-foreground)] font-heading font-bold text-sm
              hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)] transition-all duration-300"
          >
            {t.spaces.homeCta}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
