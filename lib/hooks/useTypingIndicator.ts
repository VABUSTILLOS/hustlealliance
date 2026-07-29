'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface TypingPayload {
  event: string;
  payload: { userId: string; conversationId: string; typing: boolean };
}

export function useTypingIndicator(
  conversationId: string | undefined,
  userId: string | undefined,
  onTyping: (typingUserId: string, isTyping: boolean) => void,
) {
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);

  useEffect(() => {
    if (!conversationId || !userId) return;

    const supabase = createClient();

    const channel = supabase.channel(`typing-${conversationId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on('broadcast', { event: 'typing' }, (payload: TypingPayload) => {
        if (payload.payload.userId !== userId) {
          onTyping(payload.payload.userId, payload.payload.typing);
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onTyping is a stable callback
  }, [conversationId, userId]);

  const sendTyping = (typing: boolean) => {
    if (channelRef.current && conversationId && userId) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId, conversationId, typing },
      });
    }
  };

  return { sendTyping };
}
