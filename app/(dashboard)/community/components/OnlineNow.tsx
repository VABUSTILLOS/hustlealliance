'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getInitialsAvatarUrl } from '@/lib/utils/avatar';

interface OnlineMember {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
}

export function OnlineNow() {
  const { data } = useQuery<{ items: OnlineMember[]; total: number }>({
    queryKey: ['community-online-now'],
    queryFn: async () => {
      const res = await fetch('/api/community/presence?limit=8');
      if (!res.ok) throw new Error('Failed to load online members');
      return res.json();
    },
    refetchInterval: 60 * 1000,
  });

  const items = data?.items ?? [];
  if (items.length === 0) return null;

  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-5">
      <h3 className="font-heading font-bold text-white text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Online now
      </h3>
      <div className="space-y-1">
        {items.map((member) => (
          <Link
            key={member.id}
            href={`/community/members/${member.username || member.id}`}
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-surface-light transition-colors"
          >
            <span className="relative shrink-0">
              <Image
                src={member.avatar ?? getInitialsAvatarUrl(member.name)}
                alt=""
                width={28}
                height={28}
                className="rounded-full border border-white/10 object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-surface" />
            </span>
            <span className="text-sm text-foreground-muted truncate">{member.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
