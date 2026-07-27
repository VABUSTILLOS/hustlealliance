'use client';

import { useQuery } from '@tanstack/react-query';
import type { AccessCheckResult } from '@/lib/auth/accessControl';

interface UseAccessCheckParams {
  courseId?: string;
  lessonId?: string;
  enabled?: boolean;
}

async function fetchAccessCheck(params: {
  courseId?: string;
  lessonId?: string;
}): Promise<AccessCheckResult> {
  const searchParams = new URLSearchParams();
  if (params.courseId) searchParams.set('courseId', params.courseId);
  if (params.lessonId) searchParams.set('lessonId', params.lessonId);

  const res = await fetch(`/api/access/check?${searchParams.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to check access');
  }
  return res.json();
}

/**
 * React hook to check if the current user can access a course or lesson.
 *
 * @example
 * const { data, isLoading } = useAccessCheck({ courseId: 'abc123' });
 * if (data?.allowed) { // render content }
 * else { // show paywall }
 */
export function useAccessCheck({ courseId, lessonId, enabled = true }: UseAccessCheckParams) {
  return useQuery({
    queryKey: ['access-check', courseId, lessonId],
    queryFn: () => fetchAccessCheck({ courseId, lessonId }),
    enabled: enabled && !!(courseId || lessonId),
    staleTime: 60_000, // 1 min — access state rarely changes
    retry: 1,
  });
}
