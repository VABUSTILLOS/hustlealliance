'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import type { GlobalFeedPost } from './useFeeds';

interface FeedLikePatch {
  postId: string;
  liked: boolean;
}

/**
 * Patch like counts in any cached community/global feed pages without
 * triggering a refetch. Feed pages share one of two shapes:
 * - community feed: `InfiniteData<GetCommunityPostsResult>` (pages of `{ items }`)
 * - global feed: `InfiniteData<GlobalFeedPost[]>` (pages of arrays)
 */
function applyLikePatch(
  data: unknown,
  { postId, liked }: FeedLikePatch,
): unknown {
  if (!data || typeof data !== 'object') return data;
  const pages = (data as { pages?: unknown }).pages;
  if (!Array.isArray(pages)) return data;

  const delta = liked ? 1 : -1;

  const nextPages = pages.map((page) => {
    if (page && typeof page === 'object' && 'items' in page) {
      // Community feed page: { items: CommunityPostItem[] }
      const items = (page as { items: { id: string; likeCount: number; isLiked?: boolean }[] }).items;
      return {
        ...page,
        items: items.map((item) =>
          item.id === postId
            ? { ...item, likeCount: item.likeCount + delta, isLiked: liked }
            : item,
        ),
      };
    }
    // Global feed page: GlobalFeedPost[]
    if (Array.isArray(page)) {
      return page.map((item) => {
        const post = item as GlobalFeedPost;
        return post.id === postId
          ? {
              ...post,
              isLiked: liked,
              _count: { ...post._count, likes: post._count.likes + delta },
            }
          : post;
      });
    }
    return page;
  });

  return { ...(data as object), pages: nextPages } as InfiniteData<unknown>;
}

export function useLikeToggle() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ postId, action }: { postId: string; action: 'like' | 'unlike' }) => {
      const res = await fetch(`/api/community/posts/${postId}/like`, {
        method: action === 'like' ? 'POST' : 'DELETE',
      });
      // 409 (already liked) / 404 (not liked) mean the server state differs
      // from the optimistic action — treat as success but flag it so we resync.
      const alreadyInSync = res.status === 409 || res.status === 404;
      if (!res.ok && !alreadyInSync) {
        throw new Error(`Failed to ${action} post`);
      }
      return { postId, liked: action === 'like', applied: !alreadyInSync };
    },
    onSuccess: (data) => {
      if (data.applied) {
        // Optimistically update cached feed like counts — no refetch needed.
        const patch: FeedLikePatch = { postId: data.postId, liked: data.liked };
        queryClient.setQueriesData({ queryKey: ['community-feed'] }, (old) => applyLikePatch(old, patch));
        queryClient.setQueriesData({ queryKey: ['global-feed'] }, (old) => applyLikePatch(old, patch));
      } else {
        // Server was already in the requested state — refetch to resync counts.
        queryClient.invalidateQueries({ queryKey: ['community-feed'] });
        queryClient.invalidateQueries({ queryKey: ['personal-feed'] });
        queryClient.invalidateQueries({ queryKey: ['global-feed'] });
      }
    },
    onError: (_error, vars) => {
      // Roll back the optimistic cache patch on failure.
      const patch: FeedLikePatch = { postId: vars.postId, liked: !(vars.action === 'like') };
      queryClient.setQueriesData({ queryKey: ['community-feed'] }, (old) => applyLikePatch(old, patch));
      queryClient.setQueriesData({ queryKey: ['global-feed'] }, (old) => applyLikePatch(old, patch));
    },
  });

  return mutation;
}
