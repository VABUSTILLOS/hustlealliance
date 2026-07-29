'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  sourceId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  actor: { name: string; avatar: string | null } | null;
}

interface NotificationsResponse {
  notifications: NotificationItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

// ── Fetch functions ──────────────────────────────────────────────────

async function fetchNotifications({
  cursor,
  limit = 20,
}: {
  cursor?: string;
  limit?: number;
}): Promise<NotificationsResponse> {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  if (cursor) params.set('cursor', cursor);
  const res = await fetch(`/api/notifications?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

async function fetchUnreadCount(): Promise<{ count: number }> {
  const res = await fetch('/api/notifications/unread-count');
  if (!res.ok) throw new Error('Failed to fetch unread count');
  return res.json();
}

async function markAsRead(id: string): Promise<void> {
  const res = await fetch(`/api/notifications/${encodeURIComponent(id)}/read`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to mark as read');
}

async function markAllRead(): Promise<void> {
  const res = await fetch('/api/notifications/read-all', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to mark all as read');
}

async function deleteNotification(id: string): Promise<void> {
  const res = await fetch(`/api/notifications/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete notification');
}

async function fetchSettings(): Promise<Record<string, boolean>> {
  const res = await fetch('/api/notifications/settings');
  if (!res.ok) throw new Error('Failed to fetch settings');
  const data = await res.json();
  return data.preferences;
}

async function updateSettings(prefs: Record<string, boolean>): Promise<Record<string, boolean>> {
  const res = await fetch('/api/notifications/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prefs),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  const data = await res.json();
  return data.preferences;
}

// ── Hooks ─────────────────────────────────────────────────────────────

export function useNotifications(limit = 20) {
  return useInfiniteQuery<NotificationsResponse>({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) =>
      fetchNotifications({ cursor: pageParam as string | undefined, limit }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: fetchUnreadCount,
    refetchInterval: 30_000, // poll every 30s
    staleTime: 15_000,
    select: (data) => data.count,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: ['notifications', 'settings'],
    queryFn: fetchSettings,
    staleTime: 60_000,
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['notifications', 'settings'], data);
    },
  });
}
