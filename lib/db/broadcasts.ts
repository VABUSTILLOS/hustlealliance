import prisma from '@/lib/db/prisma';
import { Prisma, type BroadcastChannel } from '@/lib/generated/prisma/client';
import { resolveSegmentFilter, type SegmentFilter as EmailSegmentFilter } from '@/lib/email/segments';
import { sendCampaignEmail, instrumentHtml } from '@/lib/email/campaign-send';
import { createPost } from '@/lib/db/posts';

/**
 * JSON segment filter format stored on `Broadcast.segmentFilter`.
 * Reuses the same resolution semantics as email campaigns (lib/email/segments.ts),
 * with `lastActiveDays` mapped onto `lastActiveAfterDays` (i.e. "active within N days").
 */
export type BroadcastSegmentFilter = {
  tiers?: EmailSegmentFilter['tiers'];
  roles?: EmailSegmentFilter['roles'];
  purchasedProductIds?: string[];
  enrolledCourseIds?: string[];
  lastActiveDays?: number;
};

/** Resolve a BroadcastSegmentFilter into a Prisma `User` where clause. */
export function resolveBroadcastSegment(filter: BroadcastSegmentFilter | null | undefined): Prisma.UserWhereInput {
  if (!filter) return {};
  const { lastActiveDays, ...rest } = filter;
  const mapped: EmailSegmentFilter = { ...rest };
  if (typeof lastActiveDays === 'number') mapped.lastActiveAfterDays = lastActiveDays;
  return resolveSegmentFilter(mapped);
}

/** Strip HTML tags to produce a plain-text version of the body for in-app/feed channels. */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const CHUNK_SIZE = 500;

async function chunkedCreateMany<T>(items: T[], fn: (chunk: T[]) => Promise<unknown>) {
  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    await fn(items.slice(i, i + CHUNK_SIZE));
  }
}

export async function listBroadcasts() {
  const broadcasts = await prisma.broadcast.findMany({
    orderBy: { createdAt: 'desc' },
    include: { createdBy: { select: { id: true, name: true } } },
  });
  return broadcasts;
}

export async function getBroadcast(id: string) {
  return prisma.broadcast.findUnique({
    where: { id },
    include: { createdBy: { select: { id: true, name: true } } },
  });
}

export type CreateBroadcastInput = {
  name: string;
  subject: string;
  body: string;
  channels: BroadcastChannel[];
  segmentFilter?: BroadcastSegmentFilter | null;
  createdById?: string | null;
};

export function validateBroadcastInput(input: Partial<CreateBroadcastInput>): string | null {
  if (!input.name?.trim()) return 'name is required';
  if (!input.subject?.trim()) return 'subject is required';
  if (!input.body?.trim()) return 'body is required';
  if (!input.channels || !Array.isArray(input.channels) || input.channels.length === 0) {
    return 'at least one channel is required';
  }
  const validChannels: BroadcastChannel[] = ['EMAIL', 'IN_APP', 'FEED'];
  for (const c of input.channels) {
    if (!validChannels.includes(c)) return `invalid channel: ${c}`;
  }
  return null;
}

export async function createBroadcast(input: CreateBroadcastInput) {
  const error = validateBroadcastInput(input);
  if (error) throw new Error(error);

  return prisma.broadcast.create({
    data: {
      name: input.name,
      subject: input.subject,
      body: input.body,
      channels: input.channels,
      segmentFilter: input.segmentFilter ? (input.segmentFilter as object) : undefined,
      createdById: input.createdById ?? undefined,
    },
  });
}

export async function updateBroadcast(id: string, input: Partial<CreateBroadcastInput>) {
  const existing = await prisma.broadcast.findUnique({ where: { id } });
  if (!existing) throw new Error('Broadcast not found');
  if (existing.status !== 'DRAFT' && existing.status !== 'SCHEDULED') {
    throw new Error(`Cannot edit a broadcast with status ${existing.status}`);
  }

  if (input.channels || input.name || input.subject || input.body) {
    const error = validateBroadcastInput({
      name: input.name ?? existing.name,
      subject: input.subject ?? existing.subject,
      body: input.body ?? existing.body,
      channels: (input.channels ?? existing.channels) as BroadcastChannel[],
    });
    if (error) throw new Error(error);
  }

  return prisma.broadcast.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.subject !== undefined ? { subject: input.subject } : {}),
      ...(input.body !== undefined ? { body: input.body } : {}),
      ...(input.channels !== undefined ? { channels: input.channels } : {}),
      ...(input.segmentFilter !== undefined
        ? { segmentFilter: input.segmentFilter ? (input.segmentFilter as object) : Prisma.JsonNull }
        : {}),
    },
  });
}

export async function deleteBroadcast(id: string) {
  const existing = await prisma.broadcast.findUnique({ where: { id } });
  if (!existing) throw new Error('Broadcast not found');
  if (existing.status !== 'DRAFT') throw new Error('Only draft broadcasts can be deleted');
  return prisma.broadcast.delete({ where: { id } });
}

export async function scheduleBroadcast(id: string, scheduledAt: Date) {
  const existing = await prisma.broadcast.findUnique({ where: { id } });
  if (!existing) throw new Error('Broadcast not found');
  if (existing.status !== 'DRAFT' && existing.status !== 'SCHEDULED') {
    throw new Error(`Cannot schedule a broadcast with status ${existing.status}`);
  }
  return prisma.broadcast.update({
    where: { id },
    data: { status: 'SCHEDULED', scheduledAt },
  });
}

export async function unscheduleBroadcast(id: string) {
  const existing = await prisma.broadcast.findUnique({ where: { id } });
  if (!existing) throw new Error('Broadcast not found');
  if (existing.status !== 'SCHEDULED') throw new Error('Broadcast is not scheduled');
  return prisma.broadcast.update({
    where: { id },
    data: { status: 'DRAFT', scheduledAt: null },
  });
}

export async function countAudience(filter: BroadcastSegmentFilter | null | undefined) {
  const where = resolveBroadcastSegment(filter);
  return prisma.user.count({ where });
}

/**
 * Send a broadcast across its configured channels. Resolves the audience once,
 * then fans out per channel. A failure in one channel is caught and logged so it
 * doesn't block the others; counts reflect what actually succeeded.
 */
export async function sendBroadcast(broadcastId: string) {
  const broadcast = await prisma.broadcast.findUnique({ where: { id: broadcastId } });
  if (!broadcast) throw new Error('Broadcast not found');
  if (broadcast.status === 'SENDING' || broadcast.status === 'SENT') {
    throw new Error(`Broadcast already ${broadcast.status.toLowerCase()}`);
  }

  await prisma.broadcast.update({ where: { id: broadcastId }, data: { status: 'SENDING' } });

  const where = resolveBroadcastSegment(broadcast.segmentFilter as BroadcastSegmentFilter | null);
  const audience = await prisma.user.findMany({ where, select: { id: true, email: true, name: true } });

  let emailCount = 0;
  let inAppCount = 0;
  let feedPostId: string | null = null;
  let anyChannelFailed = false;

  const channels = broadcast.channels as BroadcastChannel[];

  if (channels.includes('EMAIL')) {
    try {
      for (const user of audience) {
        if (!user.email) continue;
        try {
          const html = instrumentHtml(broadcast.body, user.id);
          const result = await sendCampaignEmail({ to: user.email, subject: broadcast.subject, html });
          if (result) emailCount++;
        } catch (err) {
          console.error(`[Broadcast] Email failed for user ${user.id}:`, err);
        }
      }
    } catch (err) {
      console.error('[Broadcast] EMAIL channel failed:', err);
      anyChannelFailed = true;
    }
  }

  if (channels.includes('IN_APP')) {
    try {
      const plainBody = htmlToPlainText(broadcast.body);
      await chunkedCreateMany(audience, (chunk) =>
        prisma.notification.createMany({
          data: chunk.map((user) => ({
            userId: user.id,
            type: 'BROADCAST',
            title: broadcast.subject,
            body: plainBody,
            sourceId: broadcast.id,
          })),
        }),
      );
      inAppCount = audience.length;
    } catch (err) {
      console.error('[Broadcast] IN_APP channel failed:', err);
      anyChannelFailed = true;
    }
  }

  if (channels.includes('FEED')) {
    try {
      const plainBody = htmlToPlainText(broadcast.body);
      const authorId = broadcast.createdById;
      if (authorId) {
        const post = await createPost({
          authorId,
          content: plainBody,
          visibility: 'PUBLIC',
        });
        await chunkedCreateMany(audience, (chunk) =>
          prisma.feedItem.createMany({
            data: chunk.map((user) => ({
              ownerId: user.id,
              actorId: authorId,
              type: 'BROADCAST',
              entityType: 'Post',
              entityId: post.id,
              metadata: { preview: plainBody.slice(0, 150) } as Prisma.InputJsonValue,
            })),
          }),
        );
        feedPostId = post.id;
      } else {
        console.error('[Broadcast] FEED channel skipped: no createdById to author the post');
        anyChannelFailed = true;
      }
    } catch (err) {
      console.error('[Broadcast] FEED channel failed:', err);
      anyChannelFailed = true;
    }
  }

  const finalStatus = anyChannelFailed && emailCount === 0 && inAppCount === 0 && !feedPostId ? 'FAILED' : 'SENT';

  return prisma.broadcast.update({
    where: { id: broadcastId },
    data: {
      status: finalStatus,
      sentAt: new Date(),
      emailCount,
      inAppCount,
      feedPostId,
    },
  });
}
