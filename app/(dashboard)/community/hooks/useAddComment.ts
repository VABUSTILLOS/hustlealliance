"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMsg } from "@/lib/i18n/getErrorMsg";

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: string | { content: string; parentId?: string }) => {
      const { content, parentId } =
        typeof vars === "string" ? { content: vars } : vars;
      const res = await fetch(
        `/api/community/posts/${postId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parentId ? { content, parentId } : { content }),
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
