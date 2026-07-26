'use client';

import { useState, useRef, useCallback } from 'react';
import type { InfographicContent } from '@/lib/data/resources-content/types';

interface InfographicViewerProps {
  title: string;
  description: string;
  content: InfographicContent;
}

export function InfographicViewer({ title, description, content }: InfographicViewerProps) {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div ref={containerRef} className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider">
            Infographic
          </span>
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1 rounded-lg bg-surface-light text-muted text-xs hover:text-foreground hover:bg-surface-light/80 transition-all"
          >
            {isFullscreen ? 'Exit Fullscreen' : '⛶ Fullscreen'}
          </button>
        </div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">{title}</h1>
        <p className="text-muted">{description}</p>
      </div>

      {/* Visual sections grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {content.sections.map((section, i) => (
          <button
            key={i}
            onClick={() => setExpandedSection(expandedSection === i ? null : i)}
            className={`text-left p-5 rounded-xl border transition-all duration-200
              ${expandedSection === i
                ? 'border-accent/30 bg-accent/5 shadow-[0_0_20px_rgba(255,59,48,0.08)]'
                : 'border-surface-light bg-surface hover:border-foreground-dim/20'
              }`}
          >
            <h3 className="font-heading font-bold text-foreground text-sm mb-2">{section.title}</h3>
            {expandedSection === i ? (
              <ul className="space-y-2">
                {section.points.map((point, j) => (
                  <li key={j} className="text-muted text-sm flex gap-2">
                    <span className="text-accent shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-xs line-clamp-2">{section.points[0]}</p>
            )}
          </button>
        ))}
      </div>

      {/* Key takeaway */}
      <div className="p-5 rounded-xl bg-accent/5 border border-accent/20">
        <p className="text-xs font-heading font-bold text-accent uppercase tracking-wider mb-1">Key Takeaway</p>
        <p className="text-foreground font-medium">{content.keyTakeaway}</p>
      </div>
    </div>
  );
}
