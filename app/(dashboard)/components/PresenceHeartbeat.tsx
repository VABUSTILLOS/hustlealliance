'use client';

import { useEffect } from 'react';

const HEARTBEAT_INTERVAL_MS = 2 * 60 * 1000;

// Pings the presence endpoint so the user shows as "online now".
export function PresenceHeartbeat() {
  useEffect(() => {
    const ping = () => {
      fetch('/api/community/presence', { method: 'POST' }).catch(() => {});
    };
    ping();
    const interval = setInterval(ping, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return null;
}
