'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

const sectionMap: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  QuickPreviewCTA: () => import('./sections/QuickPreviewCTA'),
  Pillars: () => import('./Pillars'),
  StackEvolutionTimeline: () => import('./sections/StackEvolutionTimeline'),
  GamificationSection: () => import('./sections/GamificationSection'),
  ResourceLibrary: () => import('./sections/ResourceLibrary'),
  ValueProposition: () => import('./sections/ValueProposition'),
  AccountabilitySection: () => import('./sections/AccountabilitySection'),
  WallOfLove: () => import('./sections/WallOfLove'),
  FAQ: () => import('./sections/FAQ'),
  Pricing: () => import('./sections/Pricing'),
};

export function HomepageLazySection({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          const importFn = sectionMap[name];
          if (importFn) {
            importFn().then((mod) => setComponent(() => mod.default));
          }
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [name, isVisible]);

  return (
    <div ref={ref} className="min-h-[100px]">
      {isVisible && Component ? (
        <Component />
      ) : (
        <div className="animate-pulse bg-surface/20 rounded-xl h-[300px]" />
      )}
    </div>
  );
}
