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
  const [group] = await prisma.$transaction([
    prisma.communityGroup.create({
      data: {
        name: params.name,
        slug: params.slug,
        description: params.description ?? null,
        avatar: params.avatar ?? null,
        coverImage: params.coverImage ?? null,
        visibility: params.visibility ?? "PUBLIC",
        creatorId: params.creatorId,
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
    }),
    prisma.communityGroup.update({
      where: { id: params.creatorId },
      data: { memberCount: 1 },
    }),
  ]);
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
  const [membership] = await prisma.$transaction([
    prisma.communityGroupMember.delete({
      where: { groupId_userId: { groupId, userId } },
    }),
    prisma.communityGroup.update({
      where: { id: groupId },
      data: { memberCount: { decrement: 1 } },
    }),
  ]);
  return membership;
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
