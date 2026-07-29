"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface PresenceUser {
  user_id: string;
  online_at: string;
}

interface UsePresenceOptions {
  userId: string;
  name?: string;
  enabled?: boolean;
}

/**
 * Hook for online presence tracking using Supabase Realtime Presence.
 * Tracks who is currently online across conversations.
 */
export function usePresence({ userId, name, enabled = true }: UsePresenceOptions) {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled || !userId) return;

    const supabase = createClient();
    const channel = supabase.channel("presence:global", {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PresenceUser>();
        const userIds = new Set<string>();
        for (const [, presences] of Object.entries(state)) {
          const presence = (presences as PresenceUser[])[0];
          if (presence) userIds.add(presence.user_id);
        }
        setOnlineUsers(userIds);
      })
      .on("presence", { event: "join" }, ({ key }: { key: string }) => {
        setOnlineUsers((prev) => new Set(prev).add(key));
      })
      .on("presence", { event: "leave" }, ({ key }: { key: string }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
            name: name || "",
          });
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [userId, name, enabled]);

  const isUserOnline = useCallback(
    (id: string) => onlineUsers.has(id),
    [onlineUsers],
  );

  return {
    onlineUsers,
    isUserOnline,
    isConnected,
    onlineCount: onlineUsers.size,
  };
}
