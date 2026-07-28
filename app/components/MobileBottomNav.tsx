'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { LazyMotionDiv } from '@/lib/framer/lazy-motion';

// ── Types ──────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface MobileBottomNavProps {
  items: NavItem[];
  /** Optional className for the outer container */
  className?: string;
}

// ── Scrollbar-hide utility classes (Tailwind v4 compatible) ──
const SCROLL_HIDE_CLASSES =
  'scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

// ── Component ──────────────────────────────────────────
export default function MobileBottomNav({ items, className }: MobileBottomNavProps) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Determine which item is active
  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(href + '/'),
    [pathname],
  );

  const activeIndex = items.findIndex((item) => isActive(item.href));

  // ── Update fade indicators based on scroll position ──
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });

    // Re-check after fonts/images load
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, items]);

  // ── Auto-scroll active item into view on route change ──
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || activeIndex === -1) return;

    const activeChild = el.children[activeIndex] as HTMLElement | undefined;
    if (!activeChild) return;

    const scrollLeft =
      activeChild.offsetLeft -
      el.clientWidth / 2 +
      activeChild.offsetWidth / 2;

    el.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
  }, [pathname, activeIndex]);

  // ── Touch/drag state for visual feedback ──
  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);
  const handlePointerLeave = () => setIsDragging(false);

  return (
    <nav
      className={clsx(
        'lg:hidden fixed bottom-0 left-0 right-0 z-40',
        'bg-[var(--color-bg)]/90 backdrop-blur-xl',
        'border-t border-[var(--color-border-subtle)]',
        // Safe-area inset for notched phones
        'pb-[env(safe-area-inset-bottom,0px)]',
        className,
      )}
    >
      {/* ── Left fade gradient (visible when scrolled right) ── */}
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute left-0 top-0 bottom-0 w-10 z-10',
          'bg-gradient-to-r from-[var(--color-bg)]/90 to-transparent',
          'transition-opacity duration-300',
          canScrollLeft ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* ── Scrollable track ── */}
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className={clsx(
          'flex items-center gap-0.5 px-2 py-2 overflow-x-auto overscroll-x-contain',
          // iOS momentum scroll
          '[-webkit-overflow-scrolling:touch]',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
          SCROLL_HIDE_CLASSES,
        )}
      >
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={clsx(
                'relative flex flex-col items-center justify-center gap-1 shrink-0',
                'min-w-[64px] px-2 py-1.5 rounded-xl',
                'text-[10px] font-medium leading-tight',
                'transition-colors duration-200',
                'select-none touch-manipulation',
                active
                  ? 'text-accent'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]',
              )}
            >
              {/* Active background pill */}
              {active && (
                <LazyMotionDiv
                  layoutId="mobile-nav-active-bg"
                  className="absolute inset-0 bg-accent/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon with active glow */}
              <span
                className={clsx(
                  'relative z-10 flex items-center justify-center w-6 h-6',
                  active && 'drop-shadow-[0_0_6px_rgba(255,59,48,0.4)]',
                )}
              >
                {item.icon}
              </span>

              {/* Label */}
              <span className="relative z-10 text-center leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ── Right fade gradient (visible when scrollable right) ── */}
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute right-0 top-0 bottom-0 w-14 z-10',
          'bg-gradient-to-l from-[var(--color-bg)]/90 via-[var(--color-bg)]/40 to-transparent',
          'transition-opacity duration-300',
          canScrollRight ? 'opacity-100' : 'opacity-0',
        )}
      />
    </nav>
  );
}
