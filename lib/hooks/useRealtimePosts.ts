'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getInitialsAvatarUrl, DEFAULT_AVATAR } from '@/lib/utils/avatar';
import { useStore } from '@/lib/store/useStore';
import type { FeedPost } from '@/lib/data/community';

/**
 * Subscribes to Supabase Realtime inserts on CommunityPost and
 * auto-appends new posts to the feed without a page refresh.
 *
 * Usage: drop it once in the community page layout — the component
 * has no visible UI; it just wires up the channel.
 */
export function useRealtimePosts() {
  const initialized = useRef(false);
  const addPost = useStore((s) => s.addPost);

  useEffect(() => {
    // Only set up the channel once (Strict Mode safety)
    if (initialized.current) return;
    initialized.current = true;

    const supabase = createClient();

    const channel = supabase
      .channel('community-posts', {
        config: { broadcast: { self: false } },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'CommunityPost',
        },
        async (payload) => {
          const row = payload.new as {
            id: string;
            authorId: string;
            content: string;
            space: string | null;
            createdAt: string;
            image?: string | null;
          };

          // ================================================================
          // OPTIMIZATION: Replace per-post author fetch with a Postgres VIEW.
          //
          // Run this SQL in Supabase SQL Editor (one-time migration):
          //
          //   CREATE VIEW "CommunityPostWithAuthor" AS
          //   SELECT
          //     p.*,
          //     u.name   AS "authorName",
          //     u.username AS "authorUsername",
          //     u.avatar  AS "authorAvatar",
          //     COALESCE(lc."likeCount", 0) AS "likeCount"
          //   FROM "CommunityPost" p
          //   JOIN "User" u ON u.id = p."authorId"
          //   LEFT JOIN LATERAL (
          //     SELECT COUNT(*)::int AS "likeCount"
          //     FROM "PostLike"
          //     WHERE "postId" = p.id
          //   ) lc ON true;
          //
          // Then subscribe to "CommunityPostWithAuthor" instead of
          // "CommunityPost", and remove this supabase.from('User') fetch.
          // This eliminates 1 round-trip per real-time INSERT (→ ~40ms saved).
          // ================================================================

          // Fetch author info so we can display name + avatar
          const { data: author } = await supabase
            .from('User')
            .select('name, username, avatar')
            .eq('id', row.authorId)
            .single();

          if (!author) return;

          const newPost: FeedPost = {
            id: row.id,
            author: {
              username: author.username ?? 'member',
              name: author.name ?? 'Member',
              avatar:
                author.avatar ??
                getInitialsAvatarUrl(author.name ?? 'User'),
            },
            text: row.content,
            image: row.image ?? undefined,
            timestamp: row.createdAt,
            likes: 0,
            liked: false,
            comments: [],
            space: row.space ?? undefined,
          };

          addPost(newPost);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] Listening for new community posts');
        } else if (status === 'CHANNEL_ERROR') {
          console.warn('[Realtime] Community posts channel error');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addPost]);
}
