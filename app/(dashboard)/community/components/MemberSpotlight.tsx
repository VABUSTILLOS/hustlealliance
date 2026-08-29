'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_AVATAR } from '@/lib/utils/avatar';

interface SpotlightData {
  spotlight: {
    id: string;
    name: string | null;
    username: string | null;
    avatar: string | null;
    activityCount: number;
  } | null;
}

// Weekly member spotlight — most active community contributor this week.
export function MemberSpotlight() {
  const { data } = useQuery<SpotlightData>({
    queryKey: ['member-spotlight'],
    queryFn: async () => {
      const res = await fetch('/api/community/spotlight');
      if (!res.ok) throw new Error('Failed to load spotlight');
      return res.json();
    },
    staleTime: 5 * 60_000,
  });

  const member = data?.spotlight;
  if (!member) return null;

  const href = member.username ? `/member/${member.username}` : undefined;

  const inner = (
    <div className="flex items-center gap-3">
      <Image
        src={member.avatar ?? DEFAULT_AVATAR}
        alt=""
        width={40}
        height={40}
        className="rounded-full border-2 border-amber-500/40 object-cover shrink-0"
      />
      <div className="min-w-0">
        <p className="font-heading font-bold text-foreground text-sm truncate">
          {member.name ?? 'Member'}
        </p>
        <p className="text-muted text-xs">
          {member.activityCount} {member.activityCount === 1 ? 'contribution' : 'contributions'} this week
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-surface border border-amber-500/20 rounded-2xl p-5">
      <h3 className="font-heading font-bold text-white text-sm mb-4 uppercase tracking-wider">
        🌟 Member spotlight
      </h3>
      {href ? (
        <Link href={href} className="block hover:opacity-80 transition-opacity">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}
