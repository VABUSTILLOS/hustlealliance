"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ChallengeStatus } from "@/lib/generated/prisma/client";

// ── Types ──────────────────────────────────────────────────────────────

export type ChallengeCard = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  status: ChallengeStatus;
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  maxParticipants: number | null;
  creator: { id: string; name: string; username: string | null; avatar: string | null };
  _count: { tasks: number; enrollments: number };
  enrollments?: { id: string; completedAt: string | null }[];
};

export type ChallengeTask = {
  id: string;
  challengeId: string;
  dayNumber: number;
  title: string;
  description: string | null;
  sortOrder: number;
};

export type ChallengeTaskCompletion = {
  id: string;
  enrollmentId: string;
  taskId: string;
  proofText: string | null;
  completedAt: string;
};

export type ChallengeEnrollment = {
  id: string;
  challengeId: string;
  userId: string;
  storeOrderId: string | null;
  joinedAt: string;
  completedAt: string | null;
  completions: ChallengeTaskCompletion[];
};

export type ChallengeDetail = ChallengeCard & {
  product: { id: string; slug: string; price: number } | null;
  tasks: ChallengeTask[];
  enrolled: boolean;
  enrollment: ChallengeEnrollment | null;
  paywalled: boolean;
};

export type ChallengeListResponse = { challenges: ChallengeCard[]; total: number };

// ── Query Hooks ────────────────────────────────────────────────────────

export function useChallenges(params?: {
  status?: ChallengeStatus;
  search?: string;
  limit?: number;
  cursor?: string;
}) {
  const queryString = new URLSearchParams();
  if (params?.status) queryString.set("status", params.status);
  if (params?.search) queryString.set("search", params.search);
  if (params?.limit) queryString.set("limit", String(params.limit));
  if (params?.cursor) queryString.set("cursor", params.cursor);

  return useQuery<ChallengeListResponse>({
    queryKey: ["challenges", params],
    queryFn: async () => {
      const res = await fetch(`/api/challenges?${queryString.toString()}`);
      if (!res.ok) throw new Error("Failed to load challenges");
      return res.json();
    },
  });
}

export function useChallenge(slug: string) {
  return useQuery<ChallengeDetail>({
    queryKey: ["challenge", slug],
    queryFn: async () => {
      const res = await fetch(`/api/challenges/${slug}`);
      if (!res.ok) throw new Error("Challenge not found");
      return res.json();
    },
    enabled: !!slug,
  });
}

// ── Mutation Hooks ─────────────────────────────────────────────────────

export function useEnrollInChallenge(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/challenges/${slug}/enroll`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) return { paymentRequired: true, productSlug: data.productSlug as string | null };
        throw new Error(data.error ?? "Failed to enroll");
      }
      return { paymentRequired: false as const, enrollment: data };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["challenge", slug] });
      qc.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}

export function useCompleteChallengeTask(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, proofText }: { taskId: string; proofText?: string }) => {
      const res = await fetch(`/api/challenges/${slug}/tasks/${taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proofText }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to complete task");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["challenge", slug] });
    },
  });
}
