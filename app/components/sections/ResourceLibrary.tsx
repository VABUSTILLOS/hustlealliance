'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { resources as allResources } from '@/lib/data/resources';
import type { Resource } from '@/lib/data/resources';

// ── Category system ──────────────────────────────────────────────
const categoryDefs = [
  { key: 'All', label: 'All', icon: '📚' },
  { key: 'Fundraising', label: 'Fundraising', icon: '💰' },
  { key: 'Marketing', label: 'Marketing', icon: '📣' },
  { key: 'Product', label: 'Product', icon: '🛠️' },
  { key: 'Growth', label: 'Growth', icon: '📈' },
  { key: 'Legal', label: 'Legal', icon: '⚖️' },
  { key: 'Strategy', label: 'Strategy', icon: '🎯' },
  { key: 'Operations', label: 'Ops', icon: '⚙️' },
] as const;
type CategoryKey = (typeof categoryDefs)[number]['key'];

// Tag → category mapping
const tagCategoryMap: Record<string, CategoryKey> = {
  fundraising: 'Fundraising', pitching: 'Fundraising', finance: 'Fundraising', 'venture-capital': 'Fundraising',
  marketing: 'Marketing', 'social-media': 'Marketing', content: 'Marketing', branding: 'Marketing',
  launch: 'Marketing', seo: 'Marketing', email: 'Marketing', outbound: 'Marketing',
  growth: 'Growth', sales: 'Growth', pricing: 'Growth', revenue: 'Growth', scaling: 'Growth',
  product: 'Product', ux: 'Product', tech: 'Product', validation: 'Product', mvp: 'Product',
  legal: 'Legal', strategy: 'Strategy', ideation: 'Strategy', leadership: 'Strategy',
  operations: 'Operations', 'customer-research': 'Operations', hiring: 'Operations', automation: 'Operations',
  ai: 'Product', 'machine-learning': 'Product', analytics: 'Growth', networking: 'Strategy',
};

function getResourceCategory(resource: Resource): CategoryKey[] {
  const cats = new Set<CategoryKey>();
  for (const tag of resource.tags) {
    const trimmed = tag.trim().toLowerCase();
    const mapped = tagCategoryMap[trimmed];
    if (mapped) cats.add(mapped);
  }
  return cats.size > 0 ? [...cats] : ['Strategy'];
}

// ── Simplified card type ─────────────────────────────────────────
type LibraryCard = Resource & { category: CategoryKey; accent: string; spine: string };

const formatAccentMap: Record<string, { accent: string; spine: string }> = {
  PDF: { accent: '#FF3B30', spine: 'bg-accent' },
  XLSX: { accent: '#34C759', spine: 'bg-emerald-500' },
  DOCX: { accent: '#007AFF', spine: 'bg-blue-500' },
  PPTX: { accent: '#FF9500', spine: 'bg-orange-500' },
  ZIP: { accent: '#AF52DE', spine: 'bg-purple-500' },
};

function getAccent(format: string): { accent: string; spine: string } {
  return formatAccentMap[format] || { accent: '#FF6B35', spine: 'bg-accent-glow' };
}

const allCards: LibraryCard[] = allResources.map((r) => {
  const primaryCat = getResourceCategory(r)[0] || 'Strategy';
  const { accent, spine } = getAccent(r.format);
  return { ...r, category: primaryCat, accent, spine };
});

// ── 3D Book Cover ─────────────────────────────────────────────────
function BookCover({ title, accent, spine, format }: { title: string; accent: string; spine: string; format: string }) {
  return (
    <div className="relative mx-auto w-28 h-40 sm:w-32 sm:h-44 perspective-[800px] group/book">
      <div
        className="relative w-full h-full transition-transform duration-500 ease-out group-hover/book:[transform:rotateY(-8deg)_translateX(-4px)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className={`absolute left-0 top-0 bottom-0 w-2.5 ${spine} rounded-l-sm origin-left`} style={{ transform: 'rotateY(90deg) translateX(-1.25px)' }} />
        <div className="absolute inset-0 rounded-r-md overflow-hidden shadow-2xl" style={{ backgroundColor: '#0A0A0A' }}>
          <div className="absolute inset-[5px] border border-white/10 rounded-sm flex flex-col p-3">
            <div className="h-1 w-10 rounded-full mb-2" style={{ backgroundColor: accent }} />
            <h4 className="font-heading text-xs font-bold text-foreground leading-tight flex-1 line-clamp-3">{title}</h4>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[8px] font-mono uppercase tracking-wider text-foreground-dim">{format}</span>
              <div className="w-4 h-4 rounded-full border border-foreground-dim flex items-center justify-center">
                <span className="text-[6px] font-mono text-foreground-dim">HA</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, ${accent}00, ${accent}40)` }} />
        </div>
      </div>
      <div className="absolute right-0 top-0.5 bottom-0.5 w-[2px] bg-surface-light rounded-r-sm" />
    </div>
  );
}

// ── Resource Card (homepage preview — no download button) ──────────
function ResourceCard({ resource, index }: { resource: LibraryCard; index: number }) {
  const { t } = useTranslation();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: (index % 8) * 0.04 }}
      className="group"
    >
      <Link href="/resources" className="block bg-surface border border-surface-light rounded-2xl p-4 transition-all duration-500 hover:-translate-y-2 hover:border-accent/20 hover:shadow-[0_20px_60px_rgba(255,59,48,0.08)] h-full flex flex-col">
        {/* Cover */}
        <div className="mb-3 flex justify-center">
          <BookCover title={resource.title} accent={resource.accent} spine={resource.spine} format={resource.format} />
        </div>

        {/* Category badge */}
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            {t.resourceLibrary.free}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-wider text-foreground-dim">
            {resource.category}
          </span>
        </div>

        {/* Title & description */}
        <h3 className="font-heading text-xs font-bold text-foreground leading-tight group-hover:text-accent transition-colors text-center">
          {resource.title}
        </h3>
        <p className="text-muted font-body text-[11px] mt-1 leading-relaxed line-clamp-2 text-center flex-1">
          {resource.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-center gap-2 mt-2 text-[9px] font-mono text-foreground-dim">
          <span>{resource.fileSize}</span>
          <span className="text-foreground-dim/40">·</span>
          <span>{resource.format}</span>
        </div>

        {/* CTA — View in Library */}
        <div className="mt-3 pt-3 border-t border-surface-light flex justify-center">
          <span className="inline-flex items-center gap-1 text-[10px] font-heading font-bold text-accent hover:text-accent-glow transition-colors">
            {t.resourceLibrary.viewInLibrary}
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────
export default function ResourceLibrary() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('All');
  const MAX_VISIBLE = 8;
  const MOBILE_VISIBLE = 4;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allCards.length };
    for (const def of categoryDefs) {
      if (def.key === 'All') continue;
      counts[def.key] = allCards.filter((c) => c.category === def.key).length;
    }
    return counts;
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return allCards;
    return allCards.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  const visible = useMemo(() => filtered.slice(0, MAX_VISIBLE), [filtered]);

  const handleCategoryChange = useCallback((cat: CategoryKey) => {
    setActiveCategory(cat);
  }, []);

  return (
    <section className="relative py-16 lg:py-32 px-4 bg-black">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/3 rounded-full blur-[180px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
            {t.resourceLibrary.tag}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-none uppercase max-w-3xl mx-auto">
            {t.resourceLibrary.headline}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-foreground-muted max-w-xl mx-auto">
            {t.resourceLibrary.homeSubtitle}
          </p>
        </motion.div>

        {/* Category filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {categoryDefs.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={clsx(
                'relative px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300',
                activeCategory === cat.key
                  ? 'text-foreground bg-accent/20 border border-accent/40 shadow-[0_0_20px_rgba(255,59,48,0.1)]'
                  : 'text-muted border border-white/10 hover:text-foreground hover:border-white/20'
              )}
            >
              {activeCategory === cat.key && (
                <motion.div layoutId="activeResourcePill" className="absolute inset-0 rounded-full bg-accent/10 border border-accent/30" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="text-[11px]">{cat.icon}</span>
                {cat.label}
                {cat.key !== 'All' && categoryCounts[cat.key] > 0 && (
                  <span className="text-[10px] text-foreground-dim ml-0.5">{categoryCounts[cat.key]}</span>
                )}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Resource grid — 2 rows desktop (4 cols), 1 row mobile */}
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((resource, i) => (
              <div key={resource.id} className={i >= MOBILE_VISIBLE ? 'hidden sm:block' : undefined}>
                <ResourceCard resource={resource} index={i} />
              </div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-foreground-muted py-16 font-mono text-sm">
            {t.resourceLibrary.empty}
          </motion.p>
        )}

        {/* CTA — View full library */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mt-10"
        >
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-glow text-white font-heading font-bold text-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,59,48,0.3)] hover:-translate-y-0.5"
          >
            {t.resourceLibrary.viewAll}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
          <p className="mt-2 text-[10px] font-mono text-foreground-dim">
            {t.resourceLibrary.showingCount.replace('{visible}', String(visible.length)).replace('{total}', String(filtered.length))}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
