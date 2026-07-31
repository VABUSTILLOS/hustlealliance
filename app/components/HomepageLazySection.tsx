'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

const sectionMap: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  QuickPreviewCTA: () => import('./sections/QuickPreviewCTA'),
  Pillars: () => import('./Pillars'),
  TakeawayCards: () => import('./TakeawayCards'),
  MemberSpotlight: () => import('./sections/MemberSpotlight'),
  ResourceLibrary: () => import('./sections/ResourceLibrary'),
  GamificationSection: () => import('./sections/GamificationSection'),
  SpacesPreview: () => import('./sections/SpacesPreview'),
  HabitsPreview: () => import('./sections/HabitsPreview'),
  PlannerPreview: () => import('./sections/PlannerPreview'),
  ValueProposition: () => import('./sections/ValueProposition'),
  Pricing: () => import('./sections/Pricing'),
  WallOfLove: () => import('./sections/WallOfLove'),
  FooterCTA: () => import('./sections/FooterCTA'),
  ActivityTicker: () => import('./ActivityTicker'),
  AccountabilitySection: () => import('./sections/AccountabilitySection'),
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
