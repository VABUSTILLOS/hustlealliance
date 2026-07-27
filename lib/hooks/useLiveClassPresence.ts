'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useStore } from '@/lib/store/useStore';

interface Attendee {
  userId: string;
  name: string;
  avatar: string;
}

/**
 * Tracks who is currently viewing a live class page via Supabase
 * Realtime Presence (Broadcast channel).
 *
 * @param classId - The LiveClass ID to track presence for
 * @returns { attendees, joinPresence, leavePresence }
 *
 * Usage:
 * ```tsx
 * const { attendees, joinPresence } = useLiveClassPresence(classId);
 * useEffect(() => { joinPresence(); }, []);
 * ```
 */
export function useLiveClassPresence(classId: string | null) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);
  const presenceTracked = useRef(false);
  const currentUser = useStore((s) => s.currentUser);

  const joinPresence = useCallback(() => {
    if (!classId || presenceTracked.current) return;

    const supabase = createClient();
    const channel = supabase.channel(`live-class:${classId}`, {
      config: { broadcast: { self: true } },
    });

    // Listen for presence sync events
    channel.on('broadcast', { event: 'presence' }, (payload) => {
      setAttendees((prev) => {
        const existing = new Map(prev.map((a) => [a.userId, a]));
        const incoming = payload.payload as Attendee[];
        incoming.forEach((a) => existing.set(a.userId, a));
        return Array.from(existing.values());
      });
    });

    channel.on('broadcast', { event: 'leave' }, (payload) => {
      const { userId } = payload.payload as { userId: string };
      setAttendees((prev) => prev.filter((a) => a.userId !== userId));
    });

    channel.subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') return;

      // Broadcast our presence
      const me: Attendee = {
        userId: currentUser?.id ?? 'unknown',
        name: currentUser?.name ?? 'Anonymous',
        avatar:
          currentUser?.avatar ??
          `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(currentUser?.name ?? 'User')}`,
      };

      await channel.send({
        type: 'broadcast',
        event: 'presence',
        payload: [me],
      });

      presenceTracked.current = true;
    });

    channelRef.current = channel;

    return () => {
      // Send leave event on unmount
      if (presenceTracked.current) {
        channel
          .send({
            type: 'broadcast',
            event: 'leave',
            payload: { userId: currentUser?.id ?? 'unknown' },
          })
          .catch(() => {});
      }
      supabase.removeChannel(channel);
      presenceTracked.current = false;
    };
  }, [classId, currentUser]);

  // Cleanup on unmount
  useEffect(() => {
    const cleanup = joinPresence();
    return () => { cleanup?.(); };
  }, [joinPresence]);

  return { attendees, joinPresence };
}
