'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export type ReactionTypeKey = 'LIKE' | 'LOVE' | 'FIRE' | 'CLAP';

export const REACTIONS: { type: ReactionTypeKey; emoji: string; label: string }[] = [
  { type: 'LIKE', emoji: '👍', label: 'Like' },
  { type: 'LOVE', emoji: '❤️', label: 'Love' },
  { type: 'FIRE', emoji: '🔥', label: 'Fire' },
  { type: 'CLAP', emoji: '👏', label: 'Clap' },
];

const EMOJI_BY_TYPE = Object.fromEntries(REACTIONS.map((r) => [r.type, r.emoji])) as Record<ReactionTypeKey, string>;

// Stable default so the prop-sync comparison doesn't retrigger every render
const EMPTY_COUNTS: Record<string, number> = {};

interface ReactionButtonProps {
  /** Full like endpoint, e.g. /api/community/posts/{id}/like */
  endpoint: string;
  initialCount: number;
  initialMyReaction?: string | null;
  initialCounts?: Record<string, number>;
  size?: 'sm' | 'md';
}

/**
 * BuddyBoss-style reaction button: click toggles a reaction, hover/long-press
 * opens an emoji picker (👍 ❤️ 🔥 👏). Self-contained — manages its own
 * optimistic state and talks to the API directly.
 */
export function ReactionButton({
  endpoint,
  initialCount,
  initialMyReaction = null,
  initialCounts = EMPTY_COUNTS,
  size = 'md',
}: ReactionButtonProps) {
  const [myReaction, setMyReaction] = useState<ReactionTypeKey | null>(
    (initialMyReaction as ReactionTypeKey | null) ?? null,
  );
  const [total, setTotal] = useState(initialCount);
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const [pickerOpen, setPickerOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync when parent data changes (e.g. feed refetch) — render-time adjustment
  // pattern instead of an effect (react-hooks/set-state-in-effect)
  const [prevSync, setPrevSync] = useState({ initialCount, initialMyReaction, initialCounts });
  if (
    prevSync.initialCount !== initialCount ||
    prevSync.initialMyReaction !== initialMyReaction ||
    prevSync.initialCounts !== initialCounts
  ) {
    setPrevSync({ initialCount, initialMyReaction, initialCounts });
    setMyReaction((initialMyReaction as ReactionTypeKey | null) ?? null);
    setTotal(initialCount);
    setCounts(initialCounts);
  }

  useEffect(() => {
    if (!pickerOpen) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [pickerOpen]);

  const applyOptimistic = (next: ReactionTypeKey | null) => {
    setCounts((prev) => {
      const c = { ...prev };
      if (myReaction) c[myReaction] = Math.max(0, (c[myReaction] ?? 0) - 1);
      if (next) c[next] = (c[next] ?? 0) + 1;
      return c;
    });
    setTotal((prev) => {
      if (myReaction && !next) return prev - 1;
      if (!myReaction && next) return prev + 1;
      return prev;
    });
    setMyReaction(next);
  };

  const react = async (next: ReactionTypeKey | null) => {
    const prev = myReaction;
    applyOptimistic(next);
    try {
      const res = next
        ? await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: next }),
          })
        : await fetch(endpoint, { method: 'DELETE' });
      if (!res.ok) throw new Error();
    } catch {
      // Rollback: undo the optimistic application of `next`, restore `prev`
      applyOptimisticRollback(next, prev);
    }
  };

  const applyOptimisticRollback = (
    applied: ReactionTypeKey | null,
    restore: ReactionTypeKey | null,
  ) => {
    setCounts((prev) => {
      const c = { ...prev };
      if (applied) c[applied] = Math.max(0, (c[applied] ?? 0) - 1);
      if (restore) c[restore] = (c[restore] ?? 0) + 1;
      return c;
    });
    setTotal((prev) => {
      if (applied && !restore) return prev - 1;
      if (!applied && restore) return prev + 1;
      return prev;
    });
    setMyReaction(restore);
  };

  const handleMainClick = () => {
    if (didLongPress.current) {
      didLongPress.current = false;
      return;
    }
    react(myReaction ? null : 'LIKE');
  };

  const handlePick = (type: ReactionTypeKey) => {
    setPickerOpen(false);
    if (type === myReaction) return;
    react(type);
  };

  const startOpenTimer = () => {
    openTimer.current = setTimeout(() => setPickerOpen(true), 350);
  };
  const cancelOpenTimer = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
  };

  const isSmall = size === 'sm';
  const nonZeroCounts = REACTIONS.filter((r) => (counts[r.type] ?? 0) > 0);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-1.5"
      onMouseEnter={startOpenTimer}
      onMouseLeave={() => {
        cancelOpenTimer();
        setPickerOpen(false);
      }}
    >
      <button
        onClick={handleMainClick}
        onTouchStart={() => {
          longPressTimer.current = setTimeout(() => {
            didLongPress.current = true;
            setPickerOpen(true);
          }, 400);
        }}
        onTouchEnd={() => {
          if (longPressTimer.current) clearTimeout(longPressTimer.current);
        }}
        className={clsx(
          'flex items-center gap-1.5 group focus-visible:ring-2 focus-visible:ring-accent/50 rounded-lg px-1 -mx-1',
        )}
        aria-label={myReaction ? 'Remove reaction' : 'React'}
        aria-haspopup="true"
        aria-expanded={pickerOpen}
      >
        {myReaction ? (
          <span className={clsx(isSmall ? 'text-sm' : 'text-base')} aria-hidden="true">
            {EMOJI_BY_TYPE[myReaction]}
          </span>
        ) : (
          <svg
            className={clsx(
              'transition-colors text-muted group-hover:text-accent',
              isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4',
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        )}
        <span className={clsx('font-mono', isSmall ? 'text-[10px]' : 'text-xs', myReaction ? 'text-accent' : 'text-muted')}>
          {total}
        </span>
      </button>

      {/* Grouped reaction summary chips */}
      {!isSmall && nonZeroCounts.length > 1 && (
        <span className="flex items-center gap-0.5 text-[10px] font-mono text-muted" aria-hidden="true">
          {nonZeroCounts.map((r) => (
            <span key={r.type} title={r.label}>
              {r.emoji}
              {counts[r.type]}
            </span>
          ))}
        </span>
      )}

      {/* Reaction picker popover */}
      {pickerOpen && (
        <div className="absolute bottom-full left-0 mb-1 z-20 flex items-center gap-1 rounded-full border border-surface-light bg-surface px-2 py-1 shadow-lg">
          {REACTIONS.map((r) => (
            <button
              key={r.type}
              onClick={() => handlePick(r.type)}
              className={clsx(
                'rounded-full p-1 text-lg transition-transform hover:scale-125 focus-visible:ring-2 focus-visible:ring-accent/50',
                myReaction === r.type && 'bg-accent/20',
              )}
              aria-label={r.label}
              title={r.label}
            >
              {r.emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
