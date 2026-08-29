'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

interface MediaItem {
  postId: string;
  url: string;
  createdAt: string;
  author: { name: string | null };
}

// Group media gallery — every image shared in the group's posts.
export function GroupMediaTab({ groupId }: { groupId: string }) {
  const { data, isLoading } = useQuery<{ items: MediaItem[] }>({
    queryKey: ['group-media', groupId],
    queryFn: async () => {
      const res = await fetch(`/api/groups/${groupId}/media`);
      if (!res.ok) throw new Error('Failed to load media');
      return res.json();
    },
    enabled: !!groupId,
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square bg-surface-light rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const items = data?.items ?? [];
  if (items.length === 0) {
    return (
      <div className="bg-surface border border-white/5 rounded-2xl p-8 text-center">
        <p className="text-muted text-sm">No media shared in this group yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {items.map((item, i) => (
        <a
          key={`${item.postId}-${i}`}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative aspect-square rounded-xl overflow-hidden border border-white/5 group hover:border-accent/40 transition-colors"
        >
          <Image
            src={item.url}
            alt={`Shared by ${item.author.name ?? 'member'}`}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </a>
      ))}
    </div>
  );
}
