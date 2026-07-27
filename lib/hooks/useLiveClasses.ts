'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ─── Types ──────────────────────────────────────────────────────

export interface LiveClass {
  id: string;
  title: string;
  description: string | null;
  platform: string;
  meetingUrl: string | null;
  roomName: string | null;
  startsAt: string;
  endsAt: string;
  maxAttendees: number | null;
  courseId: string | null;
  instructor: { id: string; name: string; avatar: string | null };
  course: { id: string; title: string; slug: string } | null;
  _count: { registrations: number };
}

async function fetchJSON<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.classes || data.class || data;
}

// ─── Hooks ──────────────────────────────────────────────────────

export function useLiveClasses(courseId?: string) {
  const params = new URLSearchParams();
  if (courseId) params.set('courseId', courseId);

  return useQuery<LiveClass[]>({
    queryKey: ['liveClasses', courseId],
    queryFn: () => fetchJSON(`/api/live-classes?${params.toString()}`),
    staleTime: 30_000,
  });
}

export function useCreateLiveClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      courseId?: string;
      startsAt: string;
      endsAt: string;
      maxAttendees?: number;
    }) => fetchJSON<{ class: LiveClass }>('/api/live-classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liveClasses'] });
    },
  });
}

export function useRegisterForClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classId: string) =>
      fetchJSON(`/api/live-classes/${classId}/register`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liveClasses'] });
    },
  });
}
