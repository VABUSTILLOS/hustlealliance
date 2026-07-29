"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface UseNotificationToastOptions {
  userId: string;
  enabled?: boolean;
}

/**
 * Hook that listens for new notifications via Supabase Realtime
 * and shows browser notification toasts (or could trigger a custom toast).
 */
export function useNotificationToast({
  userId,
  enabled = true,
}: UseNotificationToastOptions) {
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled || !userId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          const id = (payload.new as { id: string }).id;
          if (notifiedRef.current.has(id)) return;
          notifiedRef.current.add(id);

          // Show browser notification if permitted
          if ("Notification" in window && Notification.permission === "granted") {
            try {
              const notif = payload.new as {
                title?: string;
                body?: string;
                type?: string;
              };
              new Notification(notif.title || "New notification", {
                body: notif.body || "",
                icon: "/favicon.ico",
              });
            } catch {
              // Browser notifications may fail silently
            }
          }

          // Request permission if not yet requested
          if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission().catch(() => {
              // User may deny
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, enabled]);
}
