'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { CheatsheetContent } from '@/lib/data/resources-content/types';

interface CheatsheetViewerProps {
  title: string;
  description: string;
  content: CheatsheetContent;
}

export function CheatsheetViewer({ title, description, content }: CheatsheetViewerProps) {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));

  const toggleItem = (i: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <span className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider">
          {t.resourceViewer.cheatsheetBadge}
        </span>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">{title}</h1>
        <p className="text-muted leading-relaxed">{content.intro}</p>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {content.items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-surface-light bg-surface overflow-hidden transition-all"
          >
            <button
              onClick={() => toggleItem(i)}
              className="w-full text-left p-4 flex items-start gap-4 hover:bg-surface-light/30 transition-colors"
            >
              <span className="text-accent font-mono font-bold text-sm mt-0.5 shrink-0">
                {expandedItems.has(i) ? '▾' : '▸'}
              </span>
              <div className="min-w-0">
                <h3 className="text-foreground font-heading font-bold text-sm">{item.term}</h3>
                {!expandedItems.has(i) && (
                  <p className="text-muted text-xs mt-1 line-clamp-1">{item.definition.split('\n')[0]}</p>
                )}
              </div>
            </button>
            {expandedItems.has(i) && (
              <div className="px-4 pb-4 pl-12 space-y-3">
                <div className="text-muted text-sm leading-relaxed whitespace-pre-line">
                  {item.definition}
                </div>
                {item.example && (
                  <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                    <p className="text-xs font-heading font-bold text-accent uppercase tracking-wider mb-1">{t.resourceViewer.example}</p>
                    <p className="text-foreground text-sm">{item.example}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tip */}
      {content.tip && (
        <div className="p-4 rounded-xl bg-surface-light/30 border border-surface-light">
          <p className="text-xs font-heading font-bold text-foreground uppercase tracking-wider mb-1">{t.resourceViewer.proTip}</p>
          <p className="text-muted text-sm">{content.tip}</p>
        </div>
      )}
    </div>
  );
}
