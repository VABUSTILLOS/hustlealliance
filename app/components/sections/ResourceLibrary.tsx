'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useTranslation } from '@/lib/i18n/useTranslation';

const categories = [
  'All',
  'Fundraising',
  'Marketing',
  'Product',
  'Growth',
] as const;
type Category = (typeof categories)[number];

const resources = [
  {
    title: '12-Slide Pre-Seed Deck',
    category: 'Fundraising',
    tier: 'free',
    accent: '#FF3B30',
    spine: 'bg-accent',
    description:
      'The exact deck structure that raised $40M+ across our community.',
  },
  {
    title: 'Zero-Budget Launch',
    category: 'Marketing',
    tier: 'free',
    accent: '#FF6B35',
    spine: 'bg-accent-glow',
    description:
      'How 200+ founders got their first 1,000 users without spending a dime.',
  },
  {
    title: 'Term Sheet Breakdown',
    category: 'Fundraising',
    tier: 'pro',
    accent: '#FF3B30',
    spine: 'bg-accent',
    description:
      'Every clause explained by the lawyers who negotiate them daily.',
  },
  {
    title: 'PMF Framework',
    category: 'Product',
    tier: 'free',
    accent: '#FF6B35',
    spine: 'bg-accent-glow',
    description:
      'The 4-week process to validate your idea with real customer signals.',
  },
  {
    title: 'Growth Playbook',
    category: 'Growth',
    tier: 'pro',
    accent: '#FF3B30',
    spine: 'bg-accent',
    description:
      'Scalable acquisition tactics from founders who scaled to $1M+ ARR.',
  },
  {
    title: 'SaaS Pricing Models',
    category: 'Product',
    tier: 'pro',
    accent: '#FF6B35',
    spine: 'bg-accent-glow',
    description:
      'Choose the right pricing strategy with real revenue data.',
  },
  {
    title: 'Social Media Engine',
    category: 'Marketing',
    tier: 'free',
    accent: '#FF3B30',
    spine: 'bg-accent',
    description:
      'Build a content system that converts followers into paying customers.',
  },
  {
    title: 'Founder Agreement',
    category: 'Fundraising',
    tier: 'free',
    accent: '#FF6B35',
    spine: 'bg-accent-glow',
    description:
      'Protect yourself and your co-founders from day one.',
  },
];

function BookCover({
  title,
  accent,
  spine,
  tier,
}: {
  title: string;
  accent: string;
  spine: string;
  tier: string;
}) {
  return (
    <div className="relative mx-auto w-32 h-44 sm:w-36 sm:h-48 perspective-[800px] group/book">
      {/* 3D book */}
      <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover/book:[transform:rotateY(-8deg)_translateX(-4px)]"
           style={{ transformStyle: 'preserve-3d' }}>
        {/* Book spine */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-3 ${spine} rounded-l-sm origin-left`}
          style={{ transform: 'rotateY(90deg) translateX(-1.5px)' }}
        />
        {/* Book cover */}
        <div
          className="absolute inset-0 rounded-r-md overflow-hidden shadow-2xl"
          style={{ backgroundColor: '#0A0A0A' }}
        >
          {/* Cover design */}
          <div className="absolute inset-[6px] border border-white/10 rounded-sm flex flex-col p-4">
            {/* Top accent bar */}
            <div
              className="h-1 w-12 rounded-full mb-3"
              style={{ backgroundColor: accent }}
            />
            {/* Title */}
            <h4 className="font-heading text-sm font-bold text-foreground leading-tight flex-1">
              {title}
            </h4>
            {/* Author line */}
            <div className="h-1 w-16 bg-mockup-bg rounded-full mb-2" />
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase tracking-wider text-foreground-dim">
                Hustle Alliance
              </span>
              <div className="w-5 h-5 rounded-full border border-foreground-dim flex items-center justify-center">
                <span className="text-[7px] font-mono text-foreground-dim">HA</span>
              </div>
            </div>
          </div>
          {/* Subtle gradient overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `linear-gradient(135deg, ${accent}00, ${accent}40)`,
            }}
          />
        </div>
      </div>

      {/* Page edges (side) */}
      <div className="absolute right-0 top-0.5 bottom-0.5 w-[2px] bg-surface-light rounded-r-sm" />

      {/* Pro lock overlay */}
      {tier === 'pro' && (
        <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] rounded-md flex items-center justify-center">
          <div className="text-center">
            <svg
              className="w-8 h-8 text-accent mx-auto mb-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span className="font-mono text-[8px] uppercase tracking-wider text-accent">
              Pro
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResourceLibrary() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const categoryLabels: Record<Category, string> = {
    All: t.resourceLibrary.categories.All,
    Fundraising: t.resourceLibrary.categories.Fundraising,
    Marketing: t.resourceLibrary.categories.Marketing,
    Product: t.resourceLibrary.categories.Product,
    Growth: t.resourceLibrary.categories.Growth,
  };

  const filtered =
    activeCategory === 'All'
      ? resources
      : resources.filter((r) => r.category === activeCategory);

  return (
    <section className="relative py-24 lg:py-32 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
            {t.resourceLibrary.tag}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-none uppercase max-w-3xl mx-auto">
            {t.resourceLibrary.headline}
          </h2>
        </motion.div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                'relative px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300',
                activeCategory === cat
                  ? 'text-foreground bg-accent/20 border border-accent/40'
                  : 'text-muted border border-white/10 hover:text-foreground hover:border-white/20'
              )}
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 rounded-full bg-accent/10 border border-accent/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{categoryLabels[cat]}</span>
            </button>
          ))}
        </div>

        {/* Book cover grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((resource, i) => (
              <motion.div
                key={resource.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group cursor-pointer"
              >
                <div className="bg-surface border border-surface-light rounded-2xl p-5 transition-all duration-500 hover:-translate-y-2 hover:border-accent/20 hover:shadow-[0_20px_60px_rgba(255,59,48,0.08)]">
                  {/* Book cover */}
                  <div className="mb-4 flex justify-center">
                    <BookCover
                      title={resource.title}
                      accent={resource.accent}
                      spine={resource.spine}
                      tier={resource.tier}
                    />
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span
                        className={clsx(
                          'text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border',
                          resource.tier === 'free'
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : 'text-accent bg-accent/10 border-accent/20'
                        )}
                      >
                        {resource.tier === 'free' ? t.resourceLibrary.free : t.resourceLibrary.pro}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-foreground-dim">
                        {resource.category}
                      </span>
                    </div>
                    <h3 className="font-heading text-sm font-bold text-foreground leading-tight group-hover:text-accent transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-muted font-body text-xs mt-1.5 leading-relaxed line-clamp-2">
                      {resource.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
