"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLikePost(postId: string) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/community/posts/${postId}/like`, {
        method: "POST",
      });
      if (!res.ok && res.status !== 409) throw new Error("Failed to like");
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
      queryClient.invalidateQueries({ queryKey: ["personal-feed"] });
      queryClient.invalidateQueries({ queryKey: ["global-feed"] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/community/posts/${postId}/like`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 404) throw new Error("Failed to unlike");
      return false;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
      queryClient.invalidateQueries({ queryKey: ["personal-feed"] });
      queryClient.invalidateQueries({ queryKey: ["global-feed"] });
    },
  });

  return { likeMutation, unlikeMutation };
}
