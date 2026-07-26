'use client';

import { useState } from 'react';
import type { SOPContent } from '@/lib/data/resources-content/types';

interface SopViewerProps {
  title: string;
  description: string;
  content: SOPContent;
}

export function SopViewer({ title, description, content }: SopViewerProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (step: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(step)) next.delete(step);
      else next.add(step);
      return next;
    });
  };

  const progress = content.steps.length > 0
    ? Math.round((checkedSteps.size / content.steps.length) * 100)
    : 0;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <span className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider">
          Standard Operating Procedure
        </span>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">{title}</h1>
        <p className="text-muted">{description}</p>
      </div>

      {/* SOP Meta */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface-light/30 border border-surface-light text-center">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Purpose</p>
          <p className="text-foreground font-medium text-sm">{content.purpose}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-light/30 border border-surface-light text-center">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Frequency</p>
          <p className="text-foreground font-medium text-sm">{content.frequency}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-light/30 border border-surface-light text-center">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Owner</p>
          <p className="text-foreground font-medium text-sm">{content.owner}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Progress</span>
          <span className="text-foreground font-medium">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-surface-light overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {content.steps.map((s) => (
          <div
            key={s.step}
            className={`rounded-xl border transition-all cursor-pointer
              ${checkedSteps.has(s.step)
                ? 'border-accent/20 bg-accent/5'
                : 'border-surface-light bg-surface hover:border-foreground-dim/20'
              }`}
            onClick={() => toggleStep(s.step)}
          >
            <div className="p-4 flex items-start gap-4">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-all
                ${checkedSteps.has(s.step)
                  ? 'bg-accent text-white'
                  : 'bg-surface-light text-muted'
                }`}
              >
                {checkedSteps.has(s.step) ? '✓' : s.step}
              </div>
              <div className="min-w-0 space-y-1">
                <h3 className={`font-heading font-bold text-sm transition-all
                  ${checkedSteps.has(s.step) ? 'text-foreground line-through opacity-60' : 'text-foreground'}
                `}>
                  {s.action}
                </h3>
                <p className="text-muted text-xs leading-relaxed">{s.detail}</p>
                {s.tools && (
                  <p className="text-xs text-accent font-medium">🛠 {s.tools}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* KPIs */}
      {content.kpis.length > 0 && (
        <div className="p-4 rounded-xl bg-surface-light/30 border border-surface-light space-y-2">
          <h3 className="text-xs font-heading font-bold text-foreground uppercase tracking-wider">KPIs to Track</h3>
          <div className="flex flex-wrap gap-2">
            {content.kpis.map((kpi, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-surface border border-surface-light text-foreground text-xs font-medium">
                📊 {kpi}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
