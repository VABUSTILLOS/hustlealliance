'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface MembersFiltersProps {
  initialSort?: string;
  initialRole?: string;
  initialTier?: string;
  initialSearch?: string;
  initialOnline?: boolean;
}

export function MembersFilters({
  initialSort,
  initialRole,
  initialTier,
  initialSearch,
  initialOnline,
}: MembersFiltersProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: 'activity', label: t.community.sortActive },
    { value: 'newest', label: t.community.sortNewest },
    { value: 'name', label: t.community.sortName },
  ];

  const roleOptions = [
    { value: '', label: t.community.rolesAll },
    { value: 'STUDENT', label: t.community.rolesMembers },
    { value: 'INSTRUCTOR', label: t.community.rolesInstructors },
    { value: 'ADMIN', label: t.community.rolesAdmins },
  ];

  const tierOptions = [
    { value: '', label: t.community.tiersAll },
    { value: 'PRO', label: t.community.tierPro },
    { value: 'BASIC', label: t.community.tierBasic },
    { value: 'FREE', label: t.community.tierFree },
  ];

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
      <input
        type="text"
        placeholder={t.community.searchPlaceholder}
        defaultValue={initialSearch || ''}
        onChange={(e) => {
          const value = e.target.value;
          clearTimeout((e.target as any)._timeout);
          (e.target as any)._timeout = setTimeout(() => {
            updateParams({ search: value });
          }, 400);
        }}
        onBlur={(e) => {
          clearTimeout((e.target as any)._timeout);
          updateParams({ search: e.target.value });
        }}
        className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-surface border border-white/5 text-sm text-white placeholder:text-muted font-mono focus:outline-none focus:border-accent transition-colors"
      />

      <select
        defaultValue={initialSort || 'activity'}
        onChange={(e) => updateParams({ sort: e.target.value })}
        className="px-4 py-2 rounded-xl bg-surface border border-white/5 text-sm text-white font-mono focus:outline-none focus:border-accent transition-colors cursor-pointer"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        defaultValue={initialRole || ''}
        onChange={(e) => updateParams({ role: e.target.value })}
        className="px-4 py-2 rounded-xl bg-surface border border-white/5 text-sm text-white font-mono focus:outline-none focus:border-accent transition-colors cursor-pointer"
      >
        {roleOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        defaultValue={initialTier || ''}
        onChange={(e) => updateParams({ tier: e.target.value })}
        className="px-4 py-2 rounded-xl bg-surface border border-white/5 text-sm text-white font-mono focus:outline-none focus:border-accent transition-colors cursor-pointer"
      >
        {tierOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => updateParams({ online: initialOnline ? '' : '1' })}
        aria-pressed={!!initialOnline}
        className={`px-4 py-2 rounded-xl border text-sm font-mono transition-colors cursor-pointer ${
          initialOnline
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
            : 'bg-surface border-white/5 text-muted hover:text-white'
        }`}
      >
        ● Online
      </button>
    </div>
  );
}
