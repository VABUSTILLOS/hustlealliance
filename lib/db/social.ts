import { cache } from "react";
import prisma from "@/lib/db/prisma";
import type { FriendshipStatus } from "@/lib/generated/prisma/client";
import { normalizeAvatarUrl } from "@/lib/utils/avatar";

// ── Follow / Unfollow ──────────────────────────────────────────────────

export async function followUser(followerId: string, followedId: string) {
  return prisma.follow.create({
    data: { followerId, followedId },
  });
}

export async function unfollowUser(followerId: string, followedId: string) {
  return prisma.follow.delete({
    where: {
      followerId_followedId: { followerId, followedId },
    },
  });
}

export async function isFollowing(followerId: string, followedId: string) {
  const follow = await prisma.follow.findUnique({
    where: { followerId_followedId: { followerId, followedId } },
  });
  return !!follow;
}

export async function getFollowers(userId: string, limit = 20, cursor?: string) {
  return prisma.follow.findMany({
    where: { followedId: userId },
    include: { follower: { select: { id: true, name: true, username: true, avatar: true, headline: true } } },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });
}

export async function getFollowing(userId: string, limit = 20, cursor?: string) {
  return prisma.follow.findMany({
    where: { followerId: userId },
    include: { followed: { select: { id: true, name: true, username: true, avatar: true, headline: true } } },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });
}

export async function getFollowerCount(userId: string) {
  return prisma.follow.count({ where: { followedId: userId } });
}

export async function getFollowingCount(userId: string) {
  return prisma.follow.count({ where: { followerId: userId } });
}

// ── Friend Requests ────────────────────────────────────────────────────

export async function sendFriendRequest(senderId: string, receiverId: string) {
  return prisma.friendship.create({
    data: { userAId: senderId, userBId: receiverId, status: "PENDING" as FriendshipStatus },
  });
}

export async function respondToFriendRequest(friendshipId: string, accept: boolean) {
  return prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: accept ? "ACCEPTED" : "REJECTED" },
  });
}

export async function getFriends(userId: string, limit = 20, cursor?: string) {
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED" as FriendshipStatus,
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: {
      userA: { select: { id: true, name: true, username: true, avatar: true, headline: true } },
      userB: { select: { id: true, name: true, username: true, avatar: true, headline: true } },
    },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { updatedAt: "desc" },
  });
  return friendships.map((f) => (f.userAId === userId ? f.userB : f.userA));
}

export async function getPendingFriendRequests(userId: string) {
  return prisma.friendship.findMany({
    where: { userBId: userId, status: "PENDING" as FriendshipStatus },
    include: {
      userA: { select: { id: true, name: true, username: true, avatar: true, headline: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get friend requests for a user — both incoming and outgoing, all statuses.
 * @param direction "incoming" or "outgoing"
 */
export async function getFriendRequests(
  userId: string,
  direction: "incoming" | "outgoing",
  limit = 20,
  cursor?: string,
) {
  const isIncoming = direction === "incoming";

  const requests = await prisma.friendship.findMany({
    where: isIncoming ? { userBId: userId } : { userAId: userId },
    include: {
      userA: { select: { id: true, name: true, username: true, avatar: true, headline: true } },
      userB: { select: { id: true, name: true, username: true, avatar: true, headline: true } },
    },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });

  return requests.map((r) => ({
    id: r.id,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    user: isIncoming ? r.userA : r.userB,
    counterpart: isIncoming ? r.userB : r.userA,
  }));
}

/**
 * Check the friend request status between two users.
 * Returns the friendship record if one exists, or null.
 */
export async function getFriendRequestStatus(userId1: string, userId2: string) {
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userAId: userId1, userBId: userId2 },
        { userAId: userId2, userBId: userId1 },
      ],
    },
  });
  return friendship;
}

/**
 * Count mutual friends between two users.
 */
export async function getMutualFriendCount(userId: string, otherUserId: string) {
  const userFriends = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED" as FriendshipStatus,
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    select: { userAId: true, userBId: true },
  });

  const otherFriends = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED" as FriendshipStatus,
      OR: [{ userAId: otherUserId }, { userBId: otherUserId }],
    },
    select: { userAId: true, userBId: true },
  });

  const userFriendIds = new Set(
    userFriends.map((f) => (f.userAId === userId ? f.userBId : f.userAId)),
  );

  return otherFriends.filter((f) =>
    userFriendIds.has(f.userAId === otherUserId ? f.userBId : f.userAId),
  ).length;
}

/**
 * Accept a friend request by ID.
 */
export async function acceptFriendRequest(friendshipId: string) {
  return prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: "ACCEPTED" as FriendshipStatus },
  });
}

/**
 * Reject a friend request by ID.
 */
export async function rejectFriendRequest(friendshipId: string) {
  return prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: "REJECTED" as FriendshipStatus },
  });
}

export async function areFriends(userId1: string, userId2: string) {
  const friendship = await prisma.friendship.findFirst({
    where: {
      status: "ACCEPTED" as FriendshipStatus,
      OR: [
        { userAId: userId1, userBId: userId2 },
        { userAId: userId2, userBId: userId1 },
      ],
    },
  });
  return !!friendship;
}

// ── Blocking ────────────────────────────────────────────────────────────

export async function blockUser(blockedById: string, blockedUserId: string) {
  // Remove any follow relationships
  await prisma.$transaction([
    prisma.follow.deleteMany({
      where: {
        OR: [
          { followerId: blockedById, followedId: blockedUserId },
          { followerId: blockedUserId, followedId: blockedById },
        ],
      },
    }),
    prisma.blockedUser.create({
      data: { blockedById, blockedUserId },
    }),
  ]);
}

export async function unblockUser(blockedById: string, blockedUserId: string) {
  return prisma.blockedUser.delete({
    where: {
      blockedById_blockedUserId: { blockedById, blockedUserId },
    },
  });
}

export async function isBlocked(userId: string, otherUserId: string) {
  const block = await prisma.blockedUser.findFirst({
    where: {
      OR: [
        { blockedById: userId, blockedUserId: otherUserId },
        { blockedById: otherUserId, blockedUserId: userId },
      ],
    },
  });
  return !!block;
}

// ── Profile Data ────────────────────────────────────────────────────────

export interface UserProfileData {
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

/**
 * Fetch full profile data for a user by username.
 * Wrapped with React cache() for request deduplication.
 */
export const getUserProfileData = cache(
  async (username: string): Promise<UserProfileData | null> => {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        coverPhoto: true,
        bio: true,
        headline: true,
        role: true,
        membershipTier: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            location: true,
            website: true,
            socialLinks: true,
            skills: true,
            industries: true,
            yearsExperience: true,
            headline: true,
            summary: true,
            interests: true,
            canHelpWith: true,
            lookingFor: true,
            businessInfo: true,
            hasOpportunities: true,
            marketplaceSeller: true,
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    if (!user) return null;

    // Count friends (accepted friendships)
    const friendCount = await prisma.friendship.count({
      where: {
        status: "ACCEPTED" as FriendshipStatus,
        OR: [{ userAId: user.id }, { userBId: user.id }],
      },
    });

    return {
      ...user,
      avatar: normalizeAvatarUrl(user.avatar),
      createdAt: user.createdAt.toISOString(),
      profile: user.profile
        ? {
            ...user.profile,
            socialLinks: user.profile.socialLinks as Record<string, string> | null,
          }
        : null,
      _counts: {
        followers: user._count.followers,
        following: user._count.following,
        friends: friendCount,
        posts: user._count.posts,
      },
    };
  },
);

/**
 * Get posts for a specific user with pagination.
 */
export const getUserPosts = cache(
  async (userId: string, limit = 20, cursor?: string) => {
    const take = limit + 1;

    const posts = await prisma.communityPost.findMany({
      where: { authorId: userId },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    const hasMore = posts.length > limit;
    const items = (hasMore ? posts.slice(0, limit) : posts).map((post) => ({
      id: post.id,
      author: { ...post.author, avatar: normalizeAvatarUrl(post.author.avatar) },
      content: post.content,
      space: post.space,
      visibility: post.visibility,
      imageUrls: post.imageUrls,
      createdAt: post.createdAt.toISOString(),
      likeCount: post._count.likes,
      commentCount: post._count.comments,
    }));

    return {
      items,
      hasMore,
      nextCursor: hasMore ? items[items.length - 1]?.id ?? null : null,
    };
  },
);

/**
 * Get friends list for a user with pagination (returns user objects).
 */
export const getFriendsList = cache(
  async (userId: string, limit = 20, cursor?: string) => {
    return getFriends(userId, limit, cursor);
  },
);
