"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFollowUser, useUnfollowUser } from "../hooks/useSocial";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import clsx from "clsx";

interface FollowButtonProps {
  userId: string;
  className?: string;
}

/**
 * Follow/Unfollow button with optimistic UI.
 * States: Follow, Following, Follow Back
 */
export function FollowButton({ userId, className }: FollowButtonProps) {
  const currentUser = useCurrentUser();
  const followMutation = useFollowUser(userId);
  const unfollowMutation = useUnfollowUser(userId);

  const [optimisticFollowing, setOptimisticFollowing] = useState<boolean | null>(null);

  // Check if current user follows this user
  const { data: followStatus } = useQuery<{ following: boolean }>({
    queryKey: ["follow-status", userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/follow`);
      if (!res.ok) return { following: false };
      return res.json();
    },
    enabled: !!currentUser?.id && currentUser.id !== userId,
    staleTime: 60_000,
  });

  const isFollowing = optimisticFollowing ?? followStatus?.following ?? false;

  // Also check if this user follows current user (for "Follow Back")
  const { data: reverseFollow } = useQuery<{ following: boolean }>({
    queryKey: ["follow-status", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return { following: false };
      const res = await fetch(`/api/users/${currentUser.id}/follow`, {
        method: "GET",
      });
      if (!res.ok) return { following: false };
      // Check if this userId follows currentUser; we check followers of currentUser
      const followersRes = await fetch(`/api/users/${currentUser.id}/followers?limit=100`);
      if (!followersRes.ok) return { following: false };
      const followers = await followersRes.json();
      return { following: followers.some((f: { follower: { id: string } }) => f.follower?.id === userId) };
    },
    enabled: !!currentUser?.id && currentUser.id !== userId && !isFollowing,
    staleTime: 60_000,
  });

  const theyFollowUs = reverseFollow?.following ?? false;

  const isLoading = followMutation.isPending || unfollowMutation.isPending;

  const handleClick = useCallback(() => {
    if (isLoading) return;
    if (isFollowing) {
      setOptimisticFollowing(false);
      unfollowMutation.mutate(undefined, {
        onError: () => setOptimisticFollowing(null),
      });
    } else {
      setOptimisticFollowing(true);
      followMutation.mutate(undefined, {
        onError: () => setOptimisticFollowing(null),
      });
    }
  }, [isFollowing, isLoading, followMutation, unfollowMutation]);

  if (!currentUser?.id || currentUser.id === userId) return null;

  const label = isFollowing ? "Following" : theyFollowUs ? "Follow Back" : "Follow";

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={clsx(
        "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 font-heading",
        isFollowing
          ? "bg-accent/10 text-accent border border-accent/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
          : "bg-accent text-white hover:bg-accent/90",
        isLoading && "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      {isLoading ? "..." : label}
    </button>
  );
}
