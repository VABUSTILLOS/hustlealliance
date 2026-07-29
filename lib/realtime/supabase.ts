"use client";

import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

// ── Types ───────────────────────────────────────────────────────────────

export interface MessagePayload {
  id: string;
  conversation_id: string;
  sender_id: string;
  type: string;
  content: string;
  attachment_url: string | null;
  created_at: string;
  edited_at: string | null;
}

export interface TypingPayload {
  conversation_id: string;
  user_id: string;
  timestamp: string;
}

// ── Channel Helpers ─────────────────────────────────────────────────────

/**
 * Subscribe to new messages in a conversation via Supabase Realtime (Postgres CDC).
 * Requires Supabase replication enabled on the "Message" table.
 */
export function subscribeToMessages(
  conversationId: string,
  onInsert: (payload: RealtimePostgresChangesPayload<MessagePayload>) => void,
  onUpdate?: (payload: RealtimePostgresChangesPayload<MessagePayload>) => void,
): RealtimeChannel {
  const supabase = createBrowserClient();

  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "Message",
        filter: `conversationId=eq.${conversationId}`,
      },
      (payload) => {
        onInsert(payload as RealtimePostgresChangesPayload<MessagePayload>);
      },
    );

  if (onUpdate) {
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "Message",
        filter: `conversationId=eq.${conversationId}`,
      },
      (payload) => {
        onUpdate(payload as RealtimePostgresChangesPayload<MessagePayload>);
      },
    );
  }

  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      console.log(`[Realtime] Subscribed to messages in conversation ${conversationId}`);
    }
  });

  return channel;
}

/**
 * Subscribe to typing indicators in a conversation via Supabase Realtime (broadcast).
 * Uses Supabase Broadcast for real-time typing without persisting to DB.
 */
export function subscribeToTyping(
  conversationId: string,
  onTyping: (payload: TypingPayload) => void,
): RealtimeChannel {
  const supabase = createBrowserClient();

  const channel = supabase.channel(`typing:${conversationId}`, {
    config: { broadcast: { self: false } },
  });

  channel.on("broadcast", { event: "typing" }, (payload) => {
    onTyping(payload.payload as TypingPayload);
  });

  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      console.log(`[Realtime] Subscribed to typing in conversation ${conversationId}`);
    }
  });

  return channel;
}

/**
 * Broadcast a typing event to other participants in a conversation.
 */
export function broadcastTyping(conversationId: string, userId: string): void {
  const supabase = createBrowserClient();
  const channel = supabase.channel(`typing:${conversationId}`);

  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      channel.send({
        type: "broadcast",
        event: "typing",
        payload: {
          conversation_id: conversationId,
          user_id: userId,
          timestamp: new Date().toISOString(),
        },
      });
    }
  });
}

// ── Cleanup ─────────────────────────────────────────────────────────────

/**
 * Unsubscribe from a Supabase realtime channel.
 */
export function unsubscribe(channel: RealtimeChannel): void {
  supabaseRemoveChannel(channel);
}

/**
 * Safely remove a channel. Supabase v2 API uses removeChannel on the client.
 */
function supabaseRemoveChannel(channel: RealtimeChannel): void {
  try {
    const supabase = createBrowserClient();
    supabase.removeChannel(channel);
  } catch {
    // Channel may already be removed
  }
}
