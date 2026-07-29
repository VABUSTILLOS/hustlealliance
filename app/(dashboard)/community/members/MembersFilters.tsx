'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const SORT_OPTIONS = [
  { value: 'activity', label: 'Most Active' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name A-Z' },
];

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'STUDENT', label: 'Members' },
  { value: 'INSTRUCTOR', label: 'Instructors' },
  { value: 'ADMIN', label: 'Admins' },
];

const TIER_OPTIONS = [
  { value: '', label: 'All Tiers' },
  { value: 'PRO', label: 'PRO' },
  { value: 'BASIC', label: 'Basic' },
  { value: 'FREE', label: 'Free' },
];

interface MembersFiltersProps {
  initialSort?: string;
  initialRole?: string;
  initialTier?: string;
  initialSearch?: string;
}

export function MembersFilters({
  initialSort,
  initialRole,
  initialTier,
  initialSearch,
}: MembersFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`/community/members?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or headline..."
        defaultValue={initialSearch || ''}
        onChange={(e) => {
          const value = e.target.value;
          // Debounce-like: update on blur or after typing stops
          clearTimeout((e.target as any)._timeout);
          (e.target as any)._timeout = setTimeout(() => {
            updateParams({ search: value });
          }, 400);
        }}
        onBlur={(e) => {
          clearTimeout((e.target as any)._timeout);
          updateParams({ search: e.target.value });
        }}
        className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] font-mono focus:outline-none focus:border-[var(--color-accent)] transition-colors"
      />

      {/* Sort */}
      <select
        defaultValue={initialSort || 'activity'}
        onChange={(e) => updateParams({ sort: e.target.value })}
        className="px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-sm text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Role filter */}
      <select
        defaultValue={initialRole || ''}
        onChange={(e) => updateParams({ role: e.target.value })}
        className="px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-sm text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer"
      >
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Tier filter */}
      <select
        defaultValue={initialTier || ''}
        onChange={(e) => updateParams({ tier: e.target.value })}
        className="px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-sm text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer"
      >
        {TIER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
