'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getInitialsAvatarUrl } from '@/lib/utils/avatar';
import { useToast } from '@/app/components/ToastProvider';

interface Suggestion {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
  headline: string | null;
  reasons: string[];
}

export function PeopleYouMayKnow({ compact = false }: { compact?: boolean }) {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());

  const { data } = useQuery<{ items: Suggestion[] }>({
    queryKey: ['member-suggestions'],
    queryFn: async () => {
      const res = await fetch('/api/community/members/suggestions?limit=6');
      if (!res.ok) throw new Error('Failed to load suggestions');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const items = (data?.items ?? []).filter((s) => !requestedIds.has(s.id));
  if (items.length === 0) return null;

  const sendRequest = async (suggestion: Suggestion) => {
    try {
      const res = await fetch('/api/social/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: suggestion.id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send request');
      }
      setRequestedIds((prev) => new Set(prev).add(suggestion.id));
      addToast({ message: `Friend request sent to ${suggestion.name}`, type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['member-suggestions'] });
    } catch (err) {
      addToast({ message: (err as Error).message, type: 'error' });
    }
  };

  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-5">
      <h3 className="font-heading font-bold text-white text-sm mb-4 uppercase tracking-wider">
        People you may know
      </h3>
      <div className="space-y-3">
        {items.map((s) => (
          <div key={s.id} className="flex items-center gap-3">
            <Link href={`/community/members/${s.username || s.id}`} className="shrink-0">
              <Image
                src={s.avatar ?? getInitialsAvatarUrl(s.name)}
                alt=""
                width={compact ? 32 : 40}
                height={compact ? 32 : 40}
                className="rounded-full border border-white/10 object-cover"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/community/members/${s.username || s.id}`}
                className="block font-heading font-bold text-white text-sm truncate hover:text-accent transition-colors"
              >
                {s.name}
              </Link>
              <p className="text-[11px] text-muted truncate">
                {s.reasons[0] ?? s.headline ?? ''}
              </p>
            </div>
            <button
              type="button"
              onClick={() => sendRequest(s)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/30 text-accent text-[11px] font-mono hover:bg-accent/20 transition-colors"
            >
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
