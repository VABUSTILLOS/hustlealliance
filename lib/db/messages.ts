import "server-only";
import prisma from "@/lib/db/prisma";
import { notifyNewMessage } from "@/lib/notifications/service";
import type { MessageType } from "@/lib/generated/prisma/client";

// ── Types ───────────────────────────────────────────────────────────────

export interface ConversationUser {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
}

export interface LastMessageInfo {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string };
}

export interface ConversationItem {
  id: string;
  name: string | null;
  isGroup: boolean;
  participants: { user: ConversationUser }[];
  lastMessage: LastMessageInfo | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDetail extends ConversationItem {
  // full data; participants may include lastReadAt info
  participants: (ConversationItem["participants"][number] & { lastReadAt: string; isArchived: boolean; mutedAt: string | null })[];
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string;
  attachmentUrl: string | null;
  createdAt: string;
  editedAt: string | null;
  sender: ConversationUser;
  reads: { userId: string; readAt: string }[];
}

export interface PaginatedResult<T> {
  items: T[];
  hasMore: boolean;
  nextCursor: string | null;
}

// ── Unread counts (single batched query) ───────────────────────────────

interface UnreadCountRow {
  conversationId: string;
  cnt: number;
}

/**
 * Fetch unread message counts for a user in a single query, optionally
 * restricted to a set of conversations. Counts messages from other senders
 * newer than the user's last-read timestamp per conversation (same semantics
 * as the previous per-conversation queries, but one round-trip instead of N+1).
 */
async function fetchUnreadCounts(
  userId: string,
  conversationIds?: string[],
): Promise<Map<string, number>> {
  const where = conversationIds
    ? `AND cp."conversationId" = ANY($2::text[])`
    : "";
  const params: unknown[] = conversationIds ? [userId, conversationIds] : [userId];
  const rows = await prisma.$queryRawUnsafe<UnreadCountRow[]>(
    `
    SELECT cp."conversationId", COUNT(m.id)::int AS "cnt"
    FROM "ConversationParticipant" cp
    LEFT JOIN "Message" m
      ON m."conversationId" = cp."conversationId"
     AND m."senderId" <> $1
     AND m."createdAt" > cp."lastReadAt"
    WHERE cp."userId" = $1
      AND cp."isArchived" = false
      ${where}
    GROUP BY cp."conversationId"
    `,
    ...params,
  );
  return new Map(rows.map((r) => [r.conversationId, r.cnt]));
}

// ── Helper ──────────────────────────────────────────────────────────────

const PARTICIPANT_INCLUDE = {
  user: { select: { id: true, name: true, username: true, avatar: true } as const },
} as const;

const SENDER_SELECT = { id: true, name: true, username: true, avatar: true } as const;

// ── Conversations ──────────────────────────────────────────────────────

/**
 * Get paginated list of conversations for a user with last message + unread count.
 */
export async function getConversations(
  userId: string,
  cursor?: string,
  limit = 20,
): Promise<PaginatedResult<ConversationItem>> {
  const take = limit + 1;

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: { some: { userId, isArchived: false } },
    },
    include: {
      participants: { include: PARTICIPANT_INCLUDE },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        include: { sender: { select: { id: true, name: true } } },
      },
    },
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { updatedAt: "desc" },
  });

  const hasMore = conversations.length > limit;
  const items = (hasMore ? conversations.slice(0, limit) : conversations);

  // Unread counts for all page conversations in one batched query
  const unreadCounts = await fetchUnreadCounts(userId, items.map((c) => c.id));

  return {
    items: items.map((conv) => ({
      id: conv.id,
      name: conv.name,
      isGroup: conv.isGroup,
      participants: conv.participants,
      lastMessage: conv.messages[0]
        ? {
            id: conv.messages[0].id,
            content: conv.messages[0].content,
            createdAt: conv.messages[0].createdAt.toISOString(),
            sender: conv.messages[0].sender,
          }
        : null,
      unreadCount: unreadCounts.get(conv.id) ?? 0,
      createdAt: conv.createdAt.toISOString(),
      updatedAt: conv.updatedAt.toISOString(),
    })),
    hasMore,
    nextCursor: hasMore ? items[items.length - 1]?.id ?? null : null,
  };
}

/**
 * Get a single conversation with participants. Verifies user is a participant.
 */
export async function getConversation(
  conversationId: string,
  userId: string,
): Promise<ConversationDetail | null> {
  const conv = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: { some: { userId } },
    },
    include: {
      participants: {
        include: PARTICIPANT_INCLUDE,
      },
    },
  });

  if (!conv) return null;

  return {
    id: conv.id,
    name: conv.name,
    isGroup: conv.isGroup,
    participants: conv.participants.map((p) => ({
      user: p.user,
      lastReadAt: p.lastReadAt.toISOString(),
      isArchived: p.isArchived,
      mutedAt: p.mutedAt ? p.mutedAt.toISOString() : null,
    })),
    lastMessage: null,
    unreadCount: 0,
    createdAt: conv.createdAt.toISOString(),
    updatedAt: conv.updatedAt.toISOString(),
  };
}

/**
 * Create a 1-on-1 or group conversation.
 */
export async function createConversation(
  creatorId: string,
  participantIds: string[],
  title?: string,
  isGroup = false,
) {
  const allIds = [creatorId, ...participantIds.filter((id) => id !== creatorId)];
  return prisma.conversation.create({
    data: {
      name: title ?? null,
      isGroup,
      participants: {
        create: allIds.map((userId) => ({ userId })),
      },
    },
    include: {
      participants: { include: PARTICIPANT_INCLUDE },
    },
  });
}

/**
 * Find existing 1-on-1 conversation or create a new one.
 */
export async function getOrCreateDirectConversation(userId1: string, userId2: string) {
  const existing = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [
        { participants: { some: { userId: userId1 } } },
        { participants: { some: { userId: userId2 } } },
      ],
    },
    include: {
      participants: { include: PARTICIPANT_INCLUDE },
    },
  });

  if (existing) return existing;

  return prisma.conversation.create({
    data: {
      isGroup: false,
      participants: {
        create: [{ userId: userId1 }, { userId: userId2 }],
      },
    },
    include: {
      participants: { include: PARTICIPANT_INCLUDE },
    },
  });
}

/**
 * Create a group conversation (convenience wrapper).
 */
export async function createGroupConversation(name: string, creatorId: string, participantIds: string[]) {
  return createConversation(creatorId, participantIds, name, true);
}

// ── Participant Management ─────────────────────────────────────────────

/**
 * Add a participant to a group conversation. Only current participants can add.
 */
export async function addParticipant(conversationId: string, adderId: string, newUserId: string) {
  // Verify adder is participant and conversation is a group
  const conv = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      isGroup: true,
      participants: { some: { userId: adderId } },
    },
  });
  if (!conv) throw new Error("Not authorized or not a group conversation");

  // Check not already a participant
  const existing = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId: newUserId } },
  });
  if (existing) return existing;

  return prisma.conversationParticipant.create({
    data: { conversationId, userId: newUserId },
  });
}

/**
 * Remove a participant from a group conversation. Only current participants can remove.
 */
export async function removeParticipant(
  conversationId: string,
  removerId: string,
  targetUserId: string,
) {
  const conv = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      isGroup: true,
      participants: { some: { userId: removerId } },
    },
  });
  if (!conv) throw new Error("Not authorized or not a group conversation");

  return prisma.conversationParticipant.delete({
    where: { conversationId_userId: { conversationId, userId: targetUserId } },
  });
}

/**
 * Leave a group conversation. Cannot leave a 1-on-1 conversation.
 */
export async function leaveConversation(conversationId: string, userId: string) {
  const conv = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: { some: { userId } },
    },
    include: { _count: { select: { participants: true } } },
  });

  if (!conv) throw new Error("Conversation not found");
  if (!conv.isGroup) throw new Error("Cannot leave a 1-on-1 conversation");

  return prisma.conversationParticipant.delete({
    where: { conversationId_userId: { conversationId, userId } },
  });
}

/**
 * Archive a conversation for a user.
 */
export async function archiveConversation(conversationId: string, userId: string) {
  return prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { isArchived: true },
  });
}

// ── Messages ────────────────────────────────────────────────────────────

/**
 * Get paginated messages for a conversation. Verifies user is a participant.
 */
export async function getMessages(
  conversationId: string,
  userId: string,
  cursor?: string,
  limit = 50,
): Promise<PaginatedResult<MessageItem>> {
  // Verify user is participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!participant) throw new Error("Not a participant of this conversation");

  const take = limit + 1;

  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: {
      sender: { select: SENDER_SELECT },
      reads: { select: { userId: true, readAt: true } },
    },
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  });

  const hasMore = messages.length > limit;
  const items = (hasMore ? messages.slice(0, limit) : messages);

  return {
    items: items.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
      editedAt: m.editedAt?.toISOString() ?? null,
      reads: m.reads.map((r) => ({ ...r, readAt: r.readAt.toISOString() })),
    })),
    hasMore,
    nextCursor: hasMore ? items[items.length - 1]?.id ?? null : null,
  };
}

/**
 * Send a message and update conversation metadata.
 */
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
        sender: { select: SENDER_SELECT },
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

  // Notify other participants, skipping those who muted the conversation
  notifyParticipants(params.conversationId, params.senderId, message.sender.name, params.content).catch(() => {});

  return {
    ...message,
    createdAt: message.createdAt.toISOString(),
    editedAt: null,
  };
}

/**
 * In-app NEW_MESSAGE notification for every participant except the sender
 * and those who muted the conversation.
 */
async function notifyParticipants(
  conversationId: string,
  senderId: string,
  senderName: string,
  content: string,
) {
  const recipients = await prisma.conversationParticipant.findMany({
    where: { conversationId, userId: { not: senderId }, mutedAt: null },
    include: { user: { select: { id: true, email: true } } },
  });
  for (const r of recipients) {
    if (!r.user.email) continue;
    await notifyNewMessage(r.user.id, r.user.email, senderName, conversationId, content);
  }
}

// ── Read Status ────────────────────────────────────────────────────────
/**
 * Mark all messages up to and including messageId as read for the user.
 */
export async function markRead(conversationId: string, userId: string, messageId: string) {
  // Get the message to find its createdAt
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    select: { createdAt: true },
  });
  if (!message) throw new Error("Message not found");

  // Find all unread messages up to this messageId
  const unreadMessages = await prisma.message.findMany({
    where: {
      conversationId,
      createdAt: { lte: message.createdAt },
      senderId: { not: userId },
      reads: { none: { userId } },
    },
    select: { id: true },
  });

  if (unreadMessages.length > 0) {
    // Create read records for all unread messages
    await prisma.messageRead.createMany({
      data: unreadMessages.map((m) => ({
        messageId: m.id,
        userId,
      })),
      skipDuplicates: true,
    });
  }

  // Update participant's lastReadAt
  await prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { lastReadAt: new Date() },
  });
}

/**
 * Mark a single message as read.
 */
export async function markMessageRead(messageId: string, userId: string) {
  return prisma.messageRead.upsert({
    where: { messageId_userId: { messageId, userId } },
    create: { messageId, userId },
    update: { readAt: new Date() },
  });
}

/**
 * Mark conversation as read (updates lastReadAt).
 */
export async function markConversationRead(conversationId: string, userId: string) {
  return prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { lastReadAt: new Date() },
  });
}

/**
 * Get total unread message count for a user across all conversations.
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const unreadCounts = await fetchUnreadCounts(userId);

  let total = 0;
  for (const cnt of unreadCounts.values()) total += cnt;
  return total;
}

// ── Typing Indicator ───────────────────────────────────────────────────

/**
 * Update the typing indicator timestamp for a user in a conversation.
 */
export async function updateTypingIndicator(conversationId: string, userId: string) {
  return prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { lastTypedAt: new Date() },
  });
}
