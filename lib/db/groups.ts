import prisma from "@/lib/db/prisma";
import type { GroupVisibility, CommunityGroupRole, CommunityGroupMemberStatus } from "@/lib/generated/prisma/client";

// ── CRUD ────────────────────────────────────────────────────────────────

export async function createGroup(params: {
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  visibility?: GroupVisibility;
  creatorId: string;
}) {
  const group = await prisma.communityGroup.create({
    data: {
      name: params.name,
      slug: params.slug,
      description: params.description ?? null,
      avatar: params.avatar ?? null,
      coverImage: params.coverImage ?? null,
      visibility: params.visibility ?? "PUBLIC",
      creatorId: params.creatorId,
      memberCount: 1,
      members: {
        create: {
          userId: params.creatorId,
          role: "OWNER",
          status: "ACTIVE",
        },
      },
    },
    include: {
      creator: { select: { id: true, name: true, username: true, avatar: true } },
      _count: { select: { members: true } },
    },
  });
  return group;
}

export async function getGroupBySlug(slug: string) {
  return prisma.communityGroup.findUnique({
    where: { slug },
    include: {
      creator: { select: { id: true, name: true, username: true, avatar: true } },
      _count: { select: { members: true, groupPosts: true, events: true } },
    },
  });
}

export async function getGroupById(id: string) {
  return prisma.communityGroup.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, username: true, avatar: true } },
      _count: { select: { members: true, groupPosts: true, events: true } },
    },
  });
}

export async function listGroups(params: {
  visibility?: GroupVisibility;
  limit?: number;
  cursor?: string;
}) {
  return prisma.communityGroup.findMany({
    where: params.visibility ? { visibility: params.visibility } : {},
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      _count: { select: { members: true } },
    },
    take: params.limit ?? 20,
    ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
    orderBy: { memberCount: "desc" },
  });
}

export async function searchGroups(query: string, limit = 20) {
  return prisma.communityGroup.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    take: limit,
    orderBy: { memberCount: "desc" },
  });
}

export async function updateGroup(id: string, data: {
  name?: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  visibility?: GroupVisibility;
}) {
  return prisma.communityGroup.update({ where: { id }, data });
}

export async function deleteGroup(id: string) {
  return prisma.communityGroup.delete({ where: { id } });
}

export async function getGroupStats(groupId: string) {
  const [group, activeToday] = await Promise.all([
    prisma.communityGroup.findUnique({
      where: { id: groupId },
      select: {
        memberCount: true,
        _count: { select: { groupPosts: true } },
      },
    }),
    prisma.communityGroupMember.count({
      where: {
        groupId,
        status: "ACTIVE",
        joinedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return {
    memberCount: group?.memberCount ?? 0,
    postCount: group?._count.groupPosts ?? 0,
    activeToday,
  };
}

// ── Membership ──────────────────────────────────────────────────────────

export async function joinGroup(groupId: string, userId: string) {
  const group = await prisma.communityGroup.findUnique({ where: { id: groupId } });
  if (!group) throw new Error("Group not found");

  const status: CommunityGroupMemberStatus = group.visibility === "PUBLIC" ? "ACTIVE" : "REQUESTED";

  const [membership] = await prisma.$transaction([
    prisma.communityGroupMember.create({
      data: { groupId, userId, role: "MEMBER", status },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    }),
    prisma.communityGroup.update({
      where: { id: groupId },
      data: { memberCount: { increment: 1 } },
    }),
  ]);
  return membership;
}

export async function leaveGroup(groupId: string, userId: string) {
  // Check if user is the last admin/owner — reassign if needed
  const membership = await prisma.communityGroupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!membership) throw new Error("Not a member");

  const isAdmin = membership.role === "OWNER" || membership.role === "ADMIN";

  if (isAdmin) {
    const adminCount = await prisma.communityGroupMember.count({
      where: {
        groupId,
        status: "ACTIVE",
        role: { in: ["OWNER", "ADMIN"] },
      },
    });

    if (adminCount <= 1) {
      // Find oldest active member to promote
      const nextAdmin = await prisma.communityGroupMember.findFirst({
        where: {
          groupId,
          status: "ACTIVE",
          userId: { not: userId },
        },
        orderBy: { joinedAt: "asc" },
      });

      if (nextAdmin) {
        await prisma.communityGroupMember.update({
          where: { id: nextAdmin.id },
          data: { role: "OWNER" },
        });
      }
      // If no other members, group becomes ownerless — allowed, group can be deleted
    }
  }

  const [removed] = await prisma.$transaction([
    prisma.communityGroupMember.delete({
      where: { groupId_userId: { groupId, userId } },
    }),
    prisma.communityGroup.update({
      where: { id: groupId },
      data: { memberCount: { decrement: 1 } },
    }),
  ]);
  return removed;
}

export async function removeMember(groupId: string, targetUserId: string) {
  const member = await prisma.communityGroupMember.findUnique({
    where: { groupId_userId: { groupId, userId: targetUserId } },
  });
  if (!member) throw new Error("Member not found");

  const [removed] = await prisma.$transaction([
    prisma.communityGroupMember.delete({
      where: { groupId_userId: { groupId, userId: targetUserId } },
    }),
    prisma.communityGroup.update({
      where: { id: groupId },
      data: { memberCount: { decrement: 1 } },
    }),
  ]);
  return removed;
}

export async function updateMemberRole(
  groupId: string,
  userId: string,
  role: CommunityGroupRole,
) {
  return prisma.communityGroupMember.update({
    where: { groupId_userId: { groupId, userId } },
    data: { role },
  });
}

export async function approveMember(groupId: string, userId: string) {
  return prisma.communityGroupMember.update({
    where: { groupId_userId: { groupId, userId } },
    data: { status: "ACTIVE" },
  });
}

export async function banMember(groupId: string, userId: string) {
  return prisma.communityGroupMember.update({
    where: { groupId_userId: { groupId, userId } },
    data: { status: "BANNED", role: "MEMBER" },
  });
}

export async function getGroupMembers(groupId: string, limit = 50, cursor?: string) {
  return prisma.communityGroupMember.findMany({
    where: { groupId, status: "ACTIVE" },
    include: { user: { select: { id: true, name: true, username: true, avatar: true, headline: true } } },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { joinedAt: "asc" },
  });
}

export async function getUserGroups(userId: string) {
  return prisma.communityGroupMember.findMany({
    where: { userId, status: "ACTIVE" },
    include: { group: { include: { _count: { select: { members: true } } } } },
    orderBy: { joinedAt: "desc" },
  });
}

export async function isGroupMember(groupId: string, userId: string) {
  const m = await prisma.communityGroupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  return m?.status === "ACTIVE";
}

export async function getMemberRole(groupId: string, userId: string) {
  const m = await prisma.communityGroupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  return m?.role ?? null;
}

// ── Group Posts ─────────────────────────────────────────────────────────

export async function createGroupPost(params: {
  groupId: string;
  authorId: string;
  content: string;
  imageUrls?: string[];
}) {
  return prisma.communityGroupPost.create({
    data: {
      groupId: params.groupId,
      authorId: params.authorId,
      content: params.content,
      imageUrls: params.imageUrls ?? [],
    },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
    },
  });
}

export async function getGroupPosts(groupId: string, limit = 20, cursor?: string) {
  return prisma.communityGroupPost.findMany({
    where: { groupId },
    include: {
      author: { select: { id: true, name: true, username: true, avatar: true } },
      comments: {
        include: { author: { select: { id: true, name: true, username: true, avatar: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });
}

// Alias for getGroupPosts
export const getGroupFeed = getGroupPosts;

// ── Invites ─────────────────────────────────────────────────────────────

export async function inviteToGroup(groupId: string, inviteeId: string) {
  const existing = await prisma.communityGroupMember.findUnique({
    where: { groupId_userId: { groupId, userId: inviteeId } },
  });
  if (existing) throw new Error("User is already a member or has a pending invite");

  return prisma.communityGroupMember.create({
    data: { groupId, userId: inviteeId, role: "MEMBER", status: "INVITED" },
    include: {
      group: { select: { id: true, name: true, slug: true, avatar: true } },
      user: { select: { id: true, name: true, username: true, avatar: true } },
    },
  });
}

export async function acceptGroupInvite(memberId: string, userId: string) {
  const member = await prisma.communityGroupMember.findUnique({ where: { id: memberId } });
  if (!member || member.userId !== userId) throw new Error("Invite not found");
  if (member.status !== "INVITED") throw new Error("Invite already processed");

  const [updated] = await prisma.$transaction([
    prisma.communityGroupMember.update({
      where: { id: memberId },
      data: { status: "ACTIVE", joinedAt: new Date() },
      include: {
        group: { select: { id: true, name: true, slug: true, avatar: true } },
      },
    }),
    prisma.communityGroup.update({
      where: { id: member.groupId },
      data: { memberCount: { increment: 1 } },
    }),
  ]);
  return updated;
}

export async function rejectGroupInvite(memberId: string) {
  const member = await prisma.communityGroupMember.findUnique({ where: { id: memberId } });
  if (!member) throw new Error("Invite not found");

  return prisma.communityGroupMember.delete({ where: { id: memberId } });
}

export async function getGroupInvites(userId: string) {
  return prisma.communityGroupMember.findMany({
    where: { userId, status: "INVITED" },
    include: {
      group: {
        select: {
          id: true,
          name: true,
          slug: true,
          avatar: true,
          description: true,
          memberCount: true,
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });
}

export async function getPendingMembers(groupId: string) {
  return prisma.communityGroupMember.findMany({
    where: { groupId, status: { in: ["REQUESTED", "INVITED"] } },
    include: {
      user: { select: { id: true, name: true, username: true, avatar: true } },
    },
    orderBy: { joinedAt: "asc" },
  });
}
