"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMsg } from "@/lib/i18n/getErrorMsg";

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(
        `/api/community/posts/${postId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error ?? getErrorMsg("postComment"));
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community-comments", postId],
      });
      // Also refresh feed to get updated comment counts
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
      queryClient.invalidateQueries({ queryKey: ["personal-feed"] });
    },
  });
}
