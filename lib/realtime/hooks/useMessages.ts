"use client";

import { useEffect, useRef } from "react";
import {
  subscribeToMessages,
  unsubscribe,
  type MessagePayload,
} from "@/lib/realtime/supabase";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface UseMessagesOptions {
  conversationId: string;
  /** Callback when a new message arrives in real-time */
  onNewMessage?: (message: MessagePayload) => void;
  /** Callback when a message is updated (e.g., edited) */
  onUpdateMessage?: (message: MessagePayload) => void;
  enabled?: boolean;
}

/**
 * Hook that subscribes to Supabase real-time messages for a conversation.
 * Calls onNewMessage when a new message is inserted, onUpdateMessage when updated.
 */
export function useMessages({
  conversationId,
  onNewMessage,
  onUpdateMessage,
  enabled = true,
}: UseMessagesOptions) {
  const onNewMessageRef = useRef(onNewMessage);
  const onUpdateMessageRef = useRef(onUpdateMessage);

  // Keep refs current without triggering re-subscriptions
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);
  useEffect(() => {
    onUpdateMessageRef.current = onUpdateMessage;
  }, [onUpdateMessage]);

  useEffect(() => {
    if (!enabled || !conversationId) return;

    const channel = subscribeToMessages(
      conversationId,
      (payload: RealtimePostgresChangesPayload<MessagePayload>) => {
        const data = payload.new as MessagePayload;
        if (data) onNewMessageRef.current?.(data);
      },
      (payload: RealtimePostgresChangesPayload<MessagePayload>) => {
        const data = payload.new as MessagePayload;
        if (data) onUpdateMessageRef.current?.(data);
      },
    );

    return () => {
      unsubscribe(channel);
    };
  }, [conversationId, enabled]);
}
