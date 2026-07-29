import prisma from "@/lib/db/prisma";
import type { MessageType } from "@/lib/generated/prisma/client";

// ── Conversations ──────────────────────────────────────────────────────

export async function getOrCreateDirectConversation(userId1: string, userId2: string) {
  // Find existing 1-on-1 conversation
  const existing = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [
        { participants: { some: { userId: userId1 } } },
        { participants: { some: { userId: userId2 } } },
      ],
    },
    include: {
      participants: { include: { user: { select: { id: true, name: true, username: true, avatar: true } } } },
    },
  });

  if (existing) return existing;

  // Create new
  return prisma.conversation.create({
    data: {
      isGroup: false,
      participants: {
        create: [{ userId: userId1 }, { userId: userId2 }],
      },
    },
    include: {
      participants: { include: { user: { select: { id: true, name: true, username: true, avatar: true } } } },
    },
  });
}

export async function createGroupConversation(name: string, creatorId: string, participantIds: string[]) {
  const allIds = [creatorId, ...participantIds.filter((id) => id !== creatorId)];
  return prisma.conversation.create({
    data: {
      name,
      isGroup: true,
      participants: {
        create: allIds.map((userId) => ({ userId })),
      },
    },
    include: {
      participants: { include: { user: { select: { id: true, name: true, username: true, avatar: true } } } },
    },
  });
}

export async function getUserConversations(userId: string, limit = 20) {
  return prisma.conversation.findMany({
    where: {
      participants: { some: { userId, isArchived: false } },
    },
    include: {
      participants: { include: { user: { select: { id: true, name: true, username: true, avatar: true } } } },
      messages: { take: 1, orderBy: { createdAt: "desc" }, include: { sender: { select: { id: true, name: true } } } },
    },
    take: limit,
    orderBy: { updatedAt: "desc" },
  });
}

export async function archiveConversation(conversationId: string, userId: string) {
  return prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { isArchived: true },
  });
}

// ── Messages ────────────────────────────────────────────────────────────

export async function sendMessage(params: {
  conversationId: string;
  senderId: string;
  content: string;
  type?: MessageType;
  attachmentUrl?: string;
}) {
  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: {
        conversationId: params.conversationId,
        senderId: params.senderId,
        content: params.content,
        type: params.type ?? "TEXT",
        attachmentUrl: params.attachmentUrl ?? null,
      },
      include: {
        sender: { select: { id: true, name: true, username: true, avatar: true } },
      },
    }),
    prisma.conversation.update({
      where: { id: params.conversationId },
      data: { updatedAt: new Date() },
    }),
    prisma.conversationParticipant.updateMany({
      where: { conversationId: params.conversationId, userId: { not: params.senderId } },
      data: { isArchived: false },
    }),
  ]);
  return message;
}

export async function getMessages(conversationId: string, limit = 50, cursor?: string) {
  return prisma.message.findMany({
    where: { conversationId },
    include: {
      sender: { select: { id: true, name: true, username: true, avatar: true } },
      reads: { select: { userId: true, readAt: true } },
    },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });
}

export async function markMessageRead(messageId: string, userId: string) {
  return prisma.messageRead.upsert({
    where: { messageId_userId: { messageId, userId } },
    create: { messageId, userId },
    update: { readAt: new Date() },
  });
}

export async function markConversationRead(conversationId: string, userId: string) {
  return prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { lastReadAt: new Date() },
  });
}

export async function getUnreadCount(userId: string) {
  const conversations = await prisma.conversationParticipant.findMany({
    where: { userId, isArchived: false },
    select: { conversationId: true, lastReadAt: true },
  });

  if (!conversations.length) return 0;

  let total = 0;
  for (const cp of conversations) {
    const count = await prisma.message.count({
      where: {
        conversationId: cp.conversationId,
        senderId: { not: userId },
        createdAt: { gt: cp.lastReadAt },
      },
    });
    total += count;
  }
  return total;
}
