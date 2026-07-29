'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CommentPayload {
  new: {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    createdAt: string;
  };
}

interface RealtimeComment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string; username?: string; avatar?: string | null; likes?: unknown[] };
  likes: unknown[];
}

export function useRealtimeComments(
  postId: string | undefined,
  onNewComment: (comment: RealtimeComment) => void,
) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!postId || initialized.current) return;
    initialized.current = true;

    const supabase = createClient();

    const channel = supabase
      .channel(`comments-${postId}`, {
        config: { broadcast: { self: false } },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'CommunityComment',
          filter: `postId=eq.${postId}`,
        },
        async (payload: CommentPayload) => {
          const row = payload.new;

          const { data: author } = await supabase
            .from('User')
            .select('id, name, username, avatar')
            .eq('id', row.authorId)
            .single();

          onNewComment({
            id: row.id,
            postId: row.postId,
            content: row.content,
            createdAt: row.createdAt,
            author: author ?? { id: row.authorId, name: 'User' },
            likes: [],
          });
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Realtime] Listening for comments on post ${postId}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, onNewComment]);
}
