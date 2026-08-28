'use client';

import { useState } from 'react';
import type { CommunityMemberItem, GetCommunityMembersResult } from '@/lib/db/community';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { MemberCard } from './MemberCard';

interface MembersGridProps {
  members: CommunityMemberItem[];
  initialHasMore?: boolean;
  initialCursor?: string | null;
  /** Current filter params, forwarded when loading more pages */
  filters?: { sort?: string; role?: string; tier?: string; search?: string; online?: string };
}

export function MembersGrid({
  members: initialMembers,
  initialHasMore = false,
  initialCursor = null,
  filters,
}: MembersGridProps) {
  const { t } = useTranslation();
  const [extraMembers, setExtraMembers] = useState<CommunityMemberItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const members = [...initialMembers, ...extraMembers];

  const loadMore = async () => {
    if (!cursor || loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters) {
        if (filters.sort) params.set('sort', filters.sort);
        if (filters.role) params.set('role', filters.role);
        if (filters.tier) params.set('tier', filters.tier);
        if (filters.search) params.set('search', filters.search);
        if (filters.online) params.set('online', filters.online);
      }
      params.set('cursor', cursor);
      params.set('limit', '36');
      const res = await fetch(`/api/community/members?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load members');
      const data = (await res.json()) as GetCommunityMembersResult;
      setExtraMembers((prev) => [...prev, ...data.items]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch {
      // Leave state as-is so the user can retry
    } finally {
      setLoading(false);
    }
  };

  if (members.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-foreground-muted font-mono">
          {t.community.noMembersFound}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-surface border border-surface-light rounded-xl text-muted font-mono text-sm hover:border-accent/30 hover:text-accent transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
          >
            {loading ? t.community.loading : t.community.loadMore}
          </button>
        </div>
      )}
    </>
  );
}
