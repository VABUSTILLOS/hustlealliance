"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { subscribeToTyping, broadcastTyping, unsubscribe } from "@/lib/realtime/supabase";
import { updateTypingIndicator } from "@/lib/db/messages";

interface UseTypingIndicatorOptions {
  conversationId: string;
  userId: string;
  enabled?: boolean;
  /** How long before a typing indicator expires (ms) */
  timeout?: number;
}

/**
 * Hook for broadcasting and receiving typing indicators.
 * Returns the list of userIds currently typing and a broadcast function.
 */
export function useTypingIndicator({
  conversationId,
  userId,
  enabled = true,
  timeout = 5000,
}: UseTypingIndicatorOptions) {
  const [typingUsers, setTypingUsers] = useState<Map<string, number>>(new Map());
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const lastBroadcastRef = useRef(0);

  // Subscribe to typing events
  useEffect(() => {
    if (!enabled || !conversationId) return;

    const timers = timersRef.current;

    const channel = subscribeToTyping(conversationId, (payload) => {
      if (payload.user_id === userId) return;

      setTypingUsers((prev) => {
        const next = new Map(prev);
        next.set(payload.user_id, Date.now());
        return next;
      });

      const existingTimer = timers.get(payload.user_id);
      if (existingTimer) clearTimeout(existingTimer);

      const timer = setTimeout(() => {
        setTypingUsers((prev) => {
          const next = new Map(prev);
          next.delete(payload.user_id);
          return next;
        });
        timers.delete(payload.user_id);
      }, timeout);

      timers.set(payload.user_id, timer);
    });

    return () => {
      unsubscribe(channel);
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, [conversationId, userId, enabled, timeout]);

  // Broadcast typing event (throttled to every 2s)
  const sendTyping = useCallback(() => {
    const now = Date.now();
    if (now - lastBroadcastRef.current < 2000) return;
    lastBroadcastRef.current = now;

    broadcastTyping(conversationId, userId);
    // Also update DB for persistence
    updateTypingIndicator(conversationId, userId).catch(() => {
      // Silently fail — typying indicator is best-effort
    });
  }, [conversationId, userId]);

  return {
    typingUserIds: Array.from(typingUsers.keys()),
    sendTyping,
    isAnyoneTyping: typingUsers.size > 0,
  };
}
