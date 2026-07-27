'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { resources as allResources } from '@/lib/data/resources';
import { learningPaths } from '@/lib/data/learning-paths';
import type { Resource } from '@/lib/data/resources';
import type { LearningPath } from '@/lib/data/learning-paths';

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
  { key: 'Playbooks', label: 'Playbooks', icon: '📖' },
] as const;
type CategoryKey = (typeof categoryDefs)[number]['key'];

// Tag → category mapping
const tagCategoryMap: Record<string, CategoryKey> = {
  fundraising: 'Fundraising', pitching: 'Fundraising', finance: 'Fundraising',
  marketing: 'Marketing', 'social-media': 'Marketing', content: 'Marketing',
  launch: 'Marketing', growth: 'Growth', sales: 'Growth',
  product: 'Product', ux: 'Product', tech: 'Product', validation: 'Product',
  legal: 'Legal', strategy: 'Strategy', ideation: 'Strategy',
  operations: 'Operations', 'customer-research': 'Operations',
  ai: 'Product',
};

function getResourceCategory(resource: Resource): CategoryKey[] {
  const cats = new Set<CategoryKey>();
  for (const tag of resource.tags) {
    const trimmed = tag.trim();
    const mapped = tagCategoryMap[trimmed];
    if (mapped) cats.add(mapped);
  }
  return cats.size > 0 ? [...cats] : ['Strategy'];
}

// ── Convert learning paths to resource-like cards ─────────────────
type UnifiedCard = {
  id: string;
  title: string;
  description: string;
  category: CategoryKey;
  isPlaybook: true;
  accent: string;
  spine: string;
  tier: 'free';
  format: string;
  downloads: number;
  slug: string;
  modules: number;
  difficulty: string;
  duration: string;
} | (Resource & { category: CategoryKey; accent: string; spine: string; isPlaybook: false; tier: 'free' | 'pro' });

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

// Build the unified card list: all resources + playbooks
const playbookCards: UnifiedCard[] = learningPaths.slice(0, 6).map((lp) => {
  const catKey: CategoryKey = lp.category === 'Leadership' ? 'Strategy' : (lp.category as CategoryKey);
  return {
    id: `playbook-${lp.slug}`,
    title: lp.title,
    description: lp.tagline,
    category: catKey,
    isPlaybook: true as const,
    accent: '#FF3B30',
    spine: 'bg-accent',
    tier: 'free' as const,
    format: 'Interactive',
    downloads: lp.studentCount,
    slug: lp.slug,
    modules: lp.modules.length,
    difficulty: lp.difficulty,
    duration: lp.duration,
  };
});

const resourceCards: UnifiedCard[] = allResources.map((r) => {
  const primaryCat = getResourceCategory(r)[0] || 'Strategy';
  const { accent, spine } = getAccent(r.format);
  // Resources with real download URLs are free; '#' fallback = locked/pro
  const hasRealDownload = r.downloadUrl && r.downloadUrl !== '#';
  return { ...r, category: primaryCat, accent, spine, isPlaybook: false as const, tier: hasRealDownload ? ('free' as const) : ('pro' as const) };
});

const allCards: UnifiedCard[] = [...playbookCards, ...resourceCards];

// ── 3D Book Cover (reused for non-playbook resources) ─────────────
function BookCover({ title, accent, spine, format }: { title: string; accent: string; spine: string; format: string }) {
  return (
    <div className="relative mx-auto w-32 h-44 sm:w-36 sm:h-48 perspective-[800px] group/book">
      <div
        className="relative w-full h-full transition-transform duration-500 ease-out group-hover/book:[transform:rotateY(-8deg)_translateX(-4px)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className={`absolute left-0 top-0 bottom-0 w-3 ${spine} rounded-l-sm origin-left`} style={{ transform: 'rotateY(90deg) translateX(-1.5px)' }} />
        <div className="absolute inset-0 rounded-r-md overflow-hidden shadow-2xl" style={{ backgroundColor: '#0A0A0A' }}>
          <div className="absolute inset-[6px] border border-white/10 rounded-sm flex flex-col p-4">
            <div className="h-1 w-12 rounded-full mb-3" style={{ backgroundColor: accent }} />
            <h4 className="font-heading text-sm font-bold text-foreground leading-tight flex-1 line-clamp-3">{title}</h4>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[9px] font-mono uppercase tracking-wider text-foreground-dim">{format}</span>
              <div className="w-5 h-5 rounded-full border border-foreground-dim flex items-center justify-center">
                <span className="text-[7px] font-mono text-foreground-dim">HA</span>
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

// ── Playbook Cover ────────────────────────────────────────────────
function PlaybookCover({ title, modules, difficulty }: { title: string; modules: number; difficulty: string }) {
  return (
    <div className="relative mx-auto w-32 h-44 sm:w-36 sm:h-48 perspective-[800px] group/book">
      <div
        className="relative w-full h-full transition-transform duration-500 ease-out group-hover/book:[transform:rotateY(-8deg)_translateX(-4px)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-accent rounded-l-sm origin-left" style={{ transform: 'rotateY(90deg) translateX(-1.5px)' }} />
        <div className="absolute inset-0 rounded-r-md overflow-hidden shadow-2xl" style={{ backgroundColor: '#1a0505' }}>
          <div className="absolute inset-[6px] border border-accent/20 rounded-sm flex flex-col p-4">
            <span className="text-[9px] font-mono uppercase tracking-wider text-accent mb-2">Playbook</span>
            <h4 className="font-heading text-sm font-bold text-foreground leading-tight flex-1 line-clamp-3">{title}</h4>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[9px] font-mono text-foreground-dim">{modules} modules</span>
              <span className="text-[9px] font-mono text-accent">{difficulty}</span>
            </div>
          </div>
          <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(135deg, #FF3B3020, #FF3B3060)' }} />
        </div>
      </div>
      <div className="absolute right-0 top-0.5 bottom-0.5 w-[2px] bg-accent/30 rounded-r-sm" />
    </div>
  );
}

// ── Download/Preview icon button ──────────────────────────────────
function ActionButton({ resource }: { resource: UnifiedCard }) {
  if (resource.isPlaybook) {
    return (
      <Link
        href={`/preview/${resource.slug}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-heading font-bold hover:bg-accent hover:text-white transition-all duration-200 group/btn"
      >
        Preview
        <svg className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>
    );
  }

  if (resource.tier === 'pro') {
    return (
      <Link
        href="/signup"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-heading font-bold hover:bg-accent hover:text-white transition-all duration-200"
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        Join to unlock
      </Link>
    );
  }

  return (
    <a
      href={`/api/download/${resource.id}?lang=en`}
      download
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-heading font-bold hover:bg-emerald-500 hover:text-white transition-all duration-200 group/btn"
    >
      <svg className="w-3.5 h-3.5 group-hover/btn:translate-y-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
      Download
    </a>
  );
}

// ── Resource Card ─────────────────────────────────────────────────
function ResourceCard({ resource, index }: { resource: UnifiedCard; index: number }) {
  const { t } = useTranslation();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: (index % 12) * 0.04 }}
      className="group"
    >
      <div className="bg-surface border border-surface-light rounded-2xl p-5 transition-all duration-500 hover:-translate-y-2 hover:border-accent/20 hover:shadow-[0_20px_60px_rgba(255,59,48,0.08)] h-full flex flex-col">
        {/* Cover */}
        <div className="mb-4 flex justify-center">
          {resource.isPlaybook ? (
            <PlaybookCover title={resource.title} modules={resource.modules} difficulty={resource.difficulty} />
          ) : (
            <BookCover title={resource.title} accent={resource.accent} spine={resource.spine} format={resource.format} />
          )}
        </div>

        {/* Category & tier badges */}
        <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
          {resource.isPlaybook ? (
            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border bg-accent/10 text-accent border-accent/20">
              Playbook
            </span>
          ) : (
            <span className={clsx(
              'text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border',
              resource.tier === 'free'
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-accent bg-accent/10 border-accent/20'
            )}>
              {resource.tier === 'free' ? t.resourceLibrary.free : t.resourceLibrary.pro}
            </span>
          )}
          <span className="text-[9px] font-mono uppercase tracking-wider text-foreground-dim">
            {resource.category}
          </span>
        </div>

        {/* Title & description */}
        <h3 className="font-heading text-sm font-bold text-foreground leading-tight group-hover:text-accent transition-colors text-center">
          {resource.title}
        </h3>
        <p className="text-muted font-body text-xs mt-1.5 leading-relaxed line-clamp-2 text-center flex-1">
          {resource.description}
        </p>

        {/* Metadata row */}
        <div className="flex items-center justify-center gap-3 mt-3 text-[10px] font-mono text-foreground-dim">
          {!resource.isPlaybook && (
            <>
              <span>{resource.fileSize}</span>
              <span className="text-foreground-dim/40">·</span>
            </>
          )}
          <span>{resource.format}</span>
          <span className="text-foreground-dim/40">·</span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            {resource.downloads >= 1000
              ? `${(resource.downloads / 1000).toFixed(1)}K`
              : resource.downloads}
          </span>
        </div>

        {/* Action button */}
        <div className="mt-4 flex justify-center">
          <ActionButton resource={resource} />
        </div>
      </div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────
export default function ResourceLibrary() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('All');
  const [visibleCount, setVisibleCount] = useState(12);

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

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = useCallback((cat: CategoryKey) => {
    setActiveCategory(cat);
    setVisibleCount(12);
  }, []);

  return (
    <section className="relative py-24 lg:py-32 px-4 bg-black">
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
          className="text-center mb-12"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
            {t.resourceLibrary.tag}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-none uppercase max-w-3xl mx-auto">
            {t.resourceLibrary.headline}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-foreground-muted max-w-xl mx-auto">
            180+ playbooks, templates, and tools built by founders who&apos;ve been in the trenches. Free to download, always.
          </p>
        </motion.div>

        {/* Category filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-14"
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

        {/* Resource grid */}
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((resource, i) => (
              <ResourceCard key={resource.id} resource={resource} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-foreground-muted py-16 font-mono text-sm">
            No resources in this category yet. More added weekly.
          </motion.p>
        )}

        {/* Show more / Show less */}
        {hasMore && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-10">
            <button
              onClick={() => setVisibleCount((c) => c + 12)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-surface-light text-foreground-muted font-heading text-sm hover:border-accent/30 hover:text-foreground transition-all duration-300"
            >
              Show more
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <p className="mt-2 text-[10px] font-mono text-foreground-dim">
              Showing {visibleCount} of {filtered.length} resources
            </p>
          </motion.div>
        )}

        {!hasMore && filtered.length > 12 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-10">
            <button
              onClick={() => setVisibleCount(12)}
              className="text-xs font-mono text-foreground-dim hover:text-accent transition-colors"
            >
              Show less
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
