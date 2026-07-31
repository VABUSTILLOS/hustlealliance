"use client";

import { useQuery } from "@tanstack/react-query";
import { getErrorMsg } from "@/lib/i18n/getErrorMsg";

interface UserProfileData {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
  coverPhoto: string | null;
  bio: string | null;
  headline: string | null;
  role: string;
  membershipTier: string;
  createdAt: string;
  profile: {
    displayName: string | null;
    location: string | null;
    website: string | null;
    socialLinks: Record<string, string> | null;
    skills: string[];
    industries: string[];
    yearsExperience: number | null;
    headline: string | null;
    summary: string | null;
  } | null;
  _counts: {
    followers: number;
    following: number;
    friends: number;
    posts: number;
  };
}

export interface ProfilePost {
  id: string;
  author: {
    id: string;
    name: string;
    username: string | null;
    avatar: string | null;
  };
  content: string;
  space: string | null;
  visibility: string;
  imageUrls: string[];
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

interface PaginatedResult<T> {
  items: T[];
  hasMore: boolean;
  nextCursor: string | null;
}

export function useProfile(username: string) {
  return useQuery<UserProfileData | null>({
    queryKey: ["profile", username],
    queryFn: async () => {
      const res = await fetch(`/api/profile/${encodeURIComponent(username)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(getErrorMsg("fetchProfile"));
      return res.json();
    },
    staleTime: 30_000,
  });
}

export function useProfilePosts(userId: string) {
  return useQuery<PaginatedResult<ProfilePost>>({
    queryKey: ["profile-posts", userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/posts`);
      if (!res.ok) throw new Error(getErrorMsg("fetchPosts"));
      return res.json();
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useUserFollowers(userId: string) {
  return useQuery({
    queryKey: ["user-followers", userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/followers`);
      if (!res.ok) throw new Error(getErrorMsg("fetchFollowers"));
      return res.json();
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useUserFollowing(userId: string) {
  return useQuery({
    queryKey: ["user-following", userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/following`);
      if (!res.ok) throw new Error(getErrorMsg("fetchFollowing"));
      return res.json();
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useUserFriends(userId: string) {
  return useQuery({
    queryKey: ["user-friends", userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/friends`);
      if (!res.ok) throw new Error(getErrorMsg("fetchFriends"));
      return res.json();
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}
