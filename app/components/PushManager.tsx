"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store/useStore";
import { subscribeToPush, unsubscribeFromPush, isPushSupported } from "@/lib/push-client";

/**
 * Browser-side Web Push manager.
 *
 * Once a user is signed in, subscribes this device only when their
 * `push_enabled` notification preference is on (checked via
 * /api/notifications/settings) and VAPID keys are configured. Logging out
 * unsubscribes this device so the next user doesn't inherit it.
 */
export function PushManager() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const userId = useStore((s) => s.currentUser?.id ?? null);
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    // Warm the VAPID config check so subscribe is fast when the user signs in.
    fetch("/api/push/vapid-key", { cache: "no-store" }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isPushSupported()) return;
    let active = true;

    if (isAuthenticated && userId) {
      const run = async () => {
        try {
          const prefsRes = await fetch("/api/notifications/settings", { cache: "no-store" });
          if (!prefsRes.ok) return;
          const data = (await prefsRes.json()) as { preferences?: { push_enabled?: boolean } };
          if (!active || data.preferences?.push_enabled === false) return;
          await subscribeToPush();
        } catch (err) {
          console.warn("[Push] subscribe failed:", err);
        }
      };
      run();
    } else if (!isAuthenticated) {
      // Signed out — drop this device's subscription.
      unsubscribeFromPush();
    }

    return () => {
      active = false;
    };
  }, [isAuthenticated, userId]);

  return null;
}
