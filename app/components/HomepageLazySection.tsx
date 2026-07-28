'use client';

import { useLazySection } from './sections/LazySection';

export function HomepageLazySection({
  importFn,
}: {
  importFn: () => Promise<{ default: React.ComponentType<any> }>;
}) {
  const { ref, Component, isVisible } = useLazySection(importFn);

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
