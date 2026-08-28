'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { PostCard } from '../components/PostCard';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import type { CommunityPostItem } from '@/lib/db/community';

export default function SavedPostsPage() {
  const user = useCurrentUser();

  const { data, isLoading } = useQuery<{ items: CommunityPostItem[] }>({
    queryKey: ['community-bookmarks'],
    queryFn: async () => {
      const res = await fetch('/api/community/bookmarks');
      if (!res.ok) throw new Error('Failed to fetch saved posts');
      return res.json();
    },
  });

  const items = data?.items ?? [];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/community"
          className="inline-flex items-center gap-1.5 text-muted hover:text-foreground text-sm font-mono transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to community
        </Link>
      </div>

      <h1 className="font-display text-2xl text-white uppercase mb-6">🔖 Saved posts</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 bg-surface border border-surface-light rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔖</div>
          <p className="text-foreground-muted text-sm">
            No saved posts yet. Use the post menu to save posts for later.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={user?.id}
              currentUserRole={user?.role}
            />
          ))}
        </div>
      )}
    </div>
  );
}
