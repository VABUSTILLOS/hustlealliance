'use client';

import { useQuery } from '@tanstack/react-query';

export type DashboardData = {
  user: { id: string; name: string; avatar: string | null; membershipTier: string };
  courses: {
    id: string; title: string; slug: string; tagline: string;
    difficulty: string; accessLevel: string; thumbnail: string | null;
    instructor: { id: string; name: string; avatar: string | null };
    category: { id: string; name: string; slug: string } | null;
    totalLessons: number; completedLessons: number; percentage: number;
    enrolledAt: string; completedAt: string | null;
  }[];
  access: { tier: string; claimedTier: string; expiresAt: string | null; isExpired: boolean; entitlementCount: number; enrollmentCount: number; tierBenefits: string[] };
  gamification: {
    totalXP: number;
    badges: { id: string; name: string; description: string; icon: string; category: string; earnedAt: string }[];
    streak: { currentStreak: number; longestStreak: number };
    certificates: { id: string; uniqueCode: string; issuedAt: string; course: { title: string; slug: string } }[];
  };
  upcomingClasses: { id: string; title: string; startsAt: string; meetingUrl: string | null; roomName: string | null; instructor: string }[];
  // ── Community ──
  trendingPosts: {
    id: string; content: string; space: string | null; createdAt: string;
    author: { id: string; name: string; username: string; avatar: string | null; headline: string | null };
    likeCount: number; commentCount: number;
  }[];
  upcomingEvents: {
    id: string; title: string; slug: string; type: string; status: string;
    startDate: string; endDate: string | null; location: string | null;
    creator: { id: string; name: string; username: string; avatar: string | null };
    rsvpCount: number;
  }[];
  studyGroupProgress: {
    groupId: string; courseId: string; courseTitle: string; courseSlug: string;
    courseThumbnail: string | null; memberCount: number; postCount: number; joinedAt: string;
    recentPosts: { id: string; content: string; createdAt: string; author: { id: string; name: string; avatar: string | null } }[];
  }[];
  communityStats: { followers: number; following: number; groups: number; posts: number; comments: number };
  recentFeed: {
    id: string; type: string; entityType: string; entityId: string;
    metadata: unknown; createdAt: string;
    actor: { id: string; name: string; username: string; avatar: string | null };
  }[];
};

async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch('/api/dashboard');
  if (!res.ok) throw new Error('Failed to load dashboard');
  return res.json();
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    staleTime: 10_000, // 10s — dashboard changes frequently
    retry: 2,
  });
}
