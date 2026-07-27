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
const FOUNDER_BORDER = 'rgba(255,255,255,0.2)';

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

    const previewSpaces = spaces.slice(0, 6);
    const cols = 3;
    const hubR = 32;
    const founderR = 20;
    const marginX = 90;
    const marginY = 90;
    const viewW = 800;
    const viewH = 480;
    const colGap = (viewW - marginX * 2) / (cols - 1);
    const rowGap = (viewH - marginY * 2);

    const hubMap = new Map<string, Node>();

    // --- hub nodes ---
    previewSpaces.forEach((space, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const node: Node = {
        id: space.slug,
        x: marginX + col * colGap,
        y: marginY + row * rowGap,
        r: hubR,
        image: space.image,
        label: space.name,
        isHub: true,
        slug: space.slug,
        accent: HUB_ACCENTS[i % HUB_ACCENTS.length],
      };
      nodes.push(node);
      hubMap.set(space.slug, node);
    });

    // --- founder nodes ---
    const founderEntries = Object.values(memberProfiles).slice(0, 6);
    const usedPositions: { x: number; y: number }[] = [];

    founderEntries.forEach((member, idx) => {
      const seed = hashStr(member.username);
      const connectedHubSlug = member.joinedSpaces.find((s) => hubMap.has(s));
      const hub = connectedHubSlug ? hubMap.get(connectedHubSlug) : nodes[idx % nodes.length];

      const angleOffset = (idx * 60 + (seed % 40)) * (Math.PI / 180);
      const angle = ((seed % 360) * Math.PI) / 180 + angleOffset * 0.3;
      const dist = 80 + (seed % 50);
      let fx = hub!.x + Math.cos(angle) * dist;
      let fy = hub!.y + Math.sin(angle) * dist;

      // avoid collisions
      const minDist = founderR * 2 + 12;
      for (const pos of usedPositions) {
        const dx = fx - pos.x;
        const dy = fy - pos.y;
        if (Math.sqrt(dx * dx + dy * dy) < minDist) {
          fx += 25 * (seed % 3 === 0 ? 1 : -1);
          fy += 20 * (seed % 3 === 1 ? 1 : -1);
        }
      }
      // clamp to viewport
      fx = Math.max(founderR + 10, Math.min(viewW - founderR - 10, fx));
      fy = Math.max(founderR + 10, Math.min(viewH - founderR - 10, fy));
      usedPositions.push({ x: fx, y: fy });

      const node: Node = {
        id: member.username,
        x: fx,
        y: fy,
        r: founderR,
        image: member.avatar,
        label: member.name,
        isHub: false,
        accent: HUB_ACCENTS[idx % HUB_ACCENTS.length],
      };
      nodes.push(node);

      member.joinedSpaces.forEach((slug) => {
        if (hubMap.has(slug)) {
          edges.push({ from: member.username, to: slug });
        }
      });
    });

    // inter-hub edges for network feel
    for (let i = 0; i < 6; i++) {
      for (let j = i + 1; j < 6; j++) {
        if ((i + j) % 3 === 0) {
          edges.push({ from: previewSpaces[i].slug, to: previewSpaces[j].slug });
        }
      }
    }

    return { nodes, edges, viewW, viewH };
  }, []);
}

/* ── component ──────────────────────────────────────── */
export default function SpacesPreview() {
  const { t } = useTranslation();
  const { nodes, edges, viewW, viewH } = useLayout();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  const nodeMap = useMemo(() => {
    const m = new Map<string, Node>();
    nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [nodes]);

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28 px-4 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-[var(--color-violet)]/5 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-[var(--color-accent)]/4 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
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
          {/* SVG layer: edges + particles */}
          <svg
            viewBox={`0 0 ${viewW} ${viewH}`}
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Edge lines */}
            {edges.map((edge, i) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              const isHubEdge = from.isHub && to.isHub;
              return (
                <motion.line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={isHubEdge ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}
                  strokeWidth={isHubEdge ? 1.2 : 0.8}
                  strokeDasharray={isHubEdge ? '4 6' : undefined}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 1.4, delay: 0.3 + i * 0.1, ease: 'easeInOut' }}
                />
              );
            })}

            {/* Traveling glow particles */}
            {edges.slice(0, 12).map((edge, i) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              return (
                <motion.circle
                  key={`p-${edge.from}-${edge.to}`}
                  r={2.5}
                  fill={from.isHub ? from.accent : '#fff'}
                  filter="blur(0.5px)"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: [0, 0.7, 0] } : {}}
                  transition={{
                    duration: 3,
                    delay: 2 + i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 4 + (i % 5),
                    ease: 'easeInOut',
                  }}
                >
                  <animateMotion
                    dur={`${2.5 + (i % 3)}s`}
                    repeatCount="indefinite"
                    begin={`${2 + i * 0.2}s`}
                    path={`M${from.x},${from.y} L${to.x},${to.y}`}
                  />
                </motion.circle>
              );
            })}
          </svg>

          {/* Overlay nodes */}
          {nodes.map((node, idx) => {
            const size = node.r * 2;
            const xPct = `${(node.x / viewW) * 100}%`;
            const yPct = `${(node.y / viewH) * 100}%`;

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.55, delay: 0.15 + idx * 0.07, ease: 'easeOut' }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: xPct, top: yPct }}
              >
                {node.isHub ? (
                  <HubNode node={node} size={size} idx={idx} />
                ) : (
                  <FounderNode node={node} size={size} idx={idx} />
                )}
              </motion.div>
            );
          })}

          {/* Center badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="absolute top-[88%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          >
            <div className="text-center bg-black/60 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/8">
              <div className="text-2xl sm:text-3xl font-display font-bold text-white">
                {spaces.reduce((sum, s) => sum + s.memberCount, 0).toLocaleString()}+
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-white/50 mt-0.5">
                {t.spaces.members}
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

/* ── sub-components ─────────────────────────────────── */

function HubNode({ node, size, idx }: { node: Node; size: number; idx: number }) {
  return (
    <Link href={`/spaces/${node.slug}`} className="block group">
      <motion.div
        className="relative"
        animate={{
          boxShadow: [
            `0 0 10px ${node.accent}25`,
            `0 0 24px ${node.accent}45`,
            `0 0 10px ${node.accent}25`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.4 }}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `2.5px solid ${node.accent}50`,
          overflow: 'hidden',
        }}
      >
        <img
          src={node.image}
          alt={node.label}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </motion.div>
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-[10px] font-mono font-medium text-white/60 group-hover:text-[var(--color-accent)] transition-colors">
          {node.label}
        </span>
      </div>
    </Link>
  );
}

function FounderNode({ node, size, idx }: { node: Node; size: number; idx: number }) {
  return (
    <Link href={`/member/${node.id}`} className="block group">
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 3.5 + idx * 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: idx * 0.4,
        }}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `2px solid ${FOUNDER_BORDER}`,
          overflow: 'hidden',
        }}
        className="hover:border-[var(--color-accent)]/60 transition-colors duration-300 bg-black/40"
      >
        <img
          src={node.image}
          alt={node.label}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="text-[9px] font-mono text-[var(--color-accent)] bg-black/85 px-1.5 py-0.5 rounded">
          {node.label}
        </span>
      </div>
    </Link>
  );
}
