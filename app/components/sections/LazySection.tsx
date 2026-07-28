'use client';

import { useRef, useEffect, useState, type ComponentType } from 'react';

export function useLazySection<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options?: { rootMargin?: string }
) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [Component, setComponent] = useState<ComponentType<T> | null>(null);

  useEffect(() => {
    if (!ref.current || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          importFn().then((mod) => setComponent(() => mod.default));
          observer.disconnect();
        }
      },
      { rootMargin: options?.rootMargin ?? '200px 0px' }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, Component, isVisible };
}
