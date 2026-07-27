'use client';

import { useQuery } from '@tanstack/react-query';

export type DripStatus = {
  allowed: boolean;
  reason: 'released' | 'drip_locked' | 'prerequisite_locked';
  releasesAt: string | null;
  missingPrerequisites: { id: string; title: string }[];
};

async function fetchDripStatus(lessonId: string): Promise<DripStatus> {
  const res = await fetch(`/api/drip/check?lessonId=${lessonId}`);
  if (!res.ok) throw new Error(`Failed to fetch drip status: ${res.status}`);
  return res.json();
}

export function useDripStatus(lessonId: string | undefined) {
  return useQuery<DripStatus>({
    queryKey: ['drip-status', lessonId],
    queryFn: () => fetchDripStatus(lessonId!),
    enabled: !!lessonId,
    staleTime: 30_000,
  });
}
