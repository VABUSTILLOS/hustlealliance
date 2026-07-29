'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface NotificationPayload {
  new: {
    id: string;
    userId: string;
    type: string;
    title: string;
    body: string;
    sourceId: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
  };
}

export function useNotificationToast(
  userId: string | undefined,
  onNotification: (notification: {
    id: string;
    type: string;
    title: string;
    body: string;
    sourceId: string | null;
  }) => void,
) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!userId || initialized.current) return;
    initialized.current = true;

    const supabase = createClient();

    const channel = supabase
      .channel(`notifications-${userId}`, {
        config: { broadcast: { self: false } },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Notification',
          filter: `userId=eq.${userId}`,
        },
        (payload: NotificationPayload) => {
          onNotification({
            id: payload.new.id,
            type: payload.new.type,
            title: payload.new.title,
            body: payload.new.body,
            sourceId: payload.new.sourceId,
          });
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Realtime] Listening for notifications for user ${userId}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onNotification]);
}
