'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface MessagePayload {
  new: {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    type: string;
    createdAt: string;
  };
}

interface RealtimeMessage {
  id: string;
  conversationId: string;
  content: string;
  type: string;
  createdAt: string;
  sender: { id: string; name: string; username?: string; avatar?: string | null };
  reads: unknown[];
}

export function useRealtimeMessages(
  conversationId: string | undefined,
  onNewMessage: (msg: RealtimeMessage) => void,
) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!conversationId || initialized.current) return;
    initialized.current = true;

    const supabase = createClient();

    const channel = supabase
      .channel(`messages-${conversationId}`, {
        config: { broadcast: { self: false } },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `conversationId=eq.${conversationId}`,
        },
        async (payload: MessagePayload) => {
          const row = payload.new;

          // Fetch sender info
          const { data: sender } = await supabase
            .from('User')
            .select('id, name, username, avatar')
            .eq('id', row.senderId)
            .single();

          onNewMessage({
            id: row.id,
            conversationId: row.conversationId,
            content: row.content,
            type: row.type,
            createdAt: row.createdAt,
            sender: sender ?? { id: row.senderId, name: 'User' },
            reads: [],
          });
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Realtime] Listening for messages in ${conversationId}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, onNewMessage]);
}
