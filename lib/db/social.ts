import prisma from "@/lib/db/prisma";
import type { FriendshipStatus } from "@/lib/generated/prisma/client";

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
