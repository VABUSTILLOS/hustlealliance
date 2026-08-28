"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CommunityPostItem } from "@/lib/db/community";
import { getErrorMsg } from "@/lib/i18n/getErrorMsg";

interface CreatePostInput {
  content: string;
  space?: string;
  imageUrls?: string[];
  visibility?: "PUBLIC" | "CONNECTIONS_ONLY" | "GROUP_ONLY";
  poll?: {
    question: string;
    options: string[];
    expiresAt?: string;
  };
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePostInput) => {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error ?? getErrorMsg("createPost"));
      }
      return res.json() as Promise<CommunityPostItem>;
    },
    onSuccess: () => {
      // Invalidate all feed queries to refetch
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
      queryClient.invalidateQueries({ queryKey: ["personal-feed"] });
      queryClient.invalidateQueries({ queryKey: ["global-feed"] });
    },
  });
}
