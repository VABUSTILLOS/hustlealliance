'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { survivalQuests, type SurvivalQuest } from '@/lib/data/founder-survival';

const categories = [
  { key: 'all', label: 'All Quests', icon: '🗺️' },
  { key: 'A', label: 'Street-Smart Agency', icon: '🏴‍☠️' },
  { key: 'B', label: 'Financial Resilience', icon: '💰' },
  { key: 'C', label: 'Founder Blueprint', icon: '🧬' },
] as const;

/**
 * Survival Guide — a filterable masonry grid of 26 quests.
 *
 * Gray-hat quests (ethically ambiguous tactics) get distinct "dangerous"
 * styling: red-orange glow borders, hazard icons, and darker backgrounds
 * to warn the founder these are aggressive moves.
 */

export default function SurvivalGuide() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'A' | 'B' | 'C'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredQuests = useMemo(() => {
    if (activeCategory === 'all') return survivalQuests;
    return survivalQuests.filter((q) => q.category === activeCategory);
  }, [activeCategory]);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-5">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-heading font-bold text-foreground">
          Survival Guide
        </h2>
        <p className="text-sm text-muted">
          26 quests across agency warfare, financial resilience &amp; biological optimization.
        </p>
      </div>

      {/* ── Category filter pills ─────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-heading font-bold border transition-all
              ${activeCategory === cat.key
                ? 'bg-accent/10 border-accent text-accent shadow-[0_0_10px_rgba(255,59,48,0.2)]'
                : 'bg-surface/40 border-surface-light text-muted hover:border-accent/30 hover:text-foreground'
              }`}
          >
            <span>{cat.icon}</span>
            <span className="hidden sm:inline">{cat.label}</span>
            {cat.key !== 'all' && (
              <span className="text-[10px] opacity-60">
                ({survivalQuests.filter((q) => q.category === cat.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Masonry grid ──────────────────────────────────────────────── */}
      <motion.div
        layout
        className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              isExpanded={expandedId === quest.id}
              onToggle={() => toggleExpand(quest.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ── Quest Card ─────────────────────────────────────────────────────────────

function QuestCard({
  quest,
  isExpanded,
  onToggle,
}: {
  quest: SurvivalQuest;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // Gray-hat quests get a distinct "dangerous" visual treatment
  const isGray = quest.isGrayHat;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={onToggle}
      className={`break-inside-avoid rounded-2xl border p-4 cursor-pointer transition-all duration-200
        ${isGray
          // Gray-hat: dark, dangerous look — red/orange borders, hazard glow
          ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.08)] hover:shadow-[0_0_25px_rgba(239,68,68,0.15)]'
          : 'bg-surface/40 border-surface-light hover:border-accent/30 hover:bg-accent/5'
        }
        ${quest.status === 'completed'
          ? 'border-green-400/30 bg-green-400/5'
          : ''
        }`}
    >
      {/* ── Card header ──────────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{quest.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            {isGray && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse">
                ⚡ GRAY HAT
              </span>
            )}
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border
              ${quest.category === 'A' ? 'border-orange-400/30 text-orange-400 bg-orange-400/10' : ''}
              ${quest.category === 'B' ? 'border-green-400/30 text-green-400 bg-green-400/10' : ''}
              ${quest.category === 'C' ? 'border-blue-400/30 text-blue-400 bg-blue-400/10' : ''}
            `}>
              {quest.category === 'A' ? 'AGENCY' : quest.category === 'B' ? 'FINANCE' : 'BIOHACK'}
            </span>
            {quest.status === 'completed' && (
              <span className="text-[10px] font-bold text-green-400">✓ DONE</span>
            )}
          </div>
          <h3 className={`text-sm font-heading font-bold ${isGray ? 'text-red-300' : 'text-foreground'}`}>
            Quest {quest.id}: {quest.title}
          </h3>
        </div>
        <motion.span
          className="text-muted text-xs shrink-0"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </div>

      {/* ── Expanded description ──────────────────────────────────────── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className={`mt-3 pt-3 border-t text-xs leading-relaxed
              ${isGray ? 'border-red-500/20 text-red-200/80' : 'border-surface-light text-muted'}`}
            >
              {quest.description}
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex gap-2">
              {quest.status !== 'completed' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Mark complete would go here — wired to store later
                  }}
                  className={`flex-1 text-[11px] font-bold px-3 py-2 rounded-lg border transition-all
                    ${isGray
                      ? 'border-red-500/40 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/60'
                      : 'border-accent/30 text-accent bg-accent/10 hover:bg-accent/20 hover:border-accent/50'
                    }`}
                >
                  ✅ Mark Complete
                </button>
              ) : (
                <span className="flex-1 text-[11px] font-bold text-center px-3 py-2 rounded-lg bg-green-400/10 border border-green-400/20 text-green-400">
                  🏆 Completed
                </span>
              )}

              {isGray && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-bold">
                  ⚠️ HIGH RISK
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
