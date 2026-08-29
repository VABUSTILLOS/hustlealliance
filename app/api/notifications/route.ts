import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from '@/lib/auth/user';

// GET /api/notifications — paginated list with actor info resolved from sourceId/metadata
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = request.nextUrl;
    const unreadOnly = searchParams.get('unread') === 'true';
    const cursor = searchParams.get('cursor');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    const where: Record<string, unknown> = { userId: user.id };
    if (unreadOnly) where.read = false;
    if (cursor) {
      where.createdAt = { lt: new Date(cursor) };
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    });

    const hasMore = notifications.length > limit;
    const items = hasMore ? notifications.slice(0, limit) : notifications;
    const nextCursor = hasMore ? items[items.length - 1].createdAt.toISOString() : null;

    // Resolve actor info from sourceId for actor-driven notifications
    const actorTypes = ['FOLLOWED', 'POST_LIKED', 'COMMENT_LIKED', 'COMMENTED', 'MENTIONED',
      'FRIEND_REQUEST', 'FRIEND_ACCEPTED', 'GROUP_INVITE', 'GROUP_JOIN_REQUEST', 'NEW_MESSAGE'];

    const enriched = await Promise.all(
      items.map(async (n) => {
        const meta = (n.metadata as Record<string, unknown> | null) ?? {};
        let actorName: string | null = null;
        let actorAvatar: string | null = null;

        if (actorTypes.includes(n.type) && n.sourceId) {
          const actor = await prisma.user.findUnique({
            where: { id: n.sourceId },
            select: { name: true, avatar: true },
          });
          if (actor) {
            actorName = actor.name;
            actorAvatar = actor.avatar;
          }
        }

        // Fallback: extract actor name from metadata
        if (!actorName) {
          actorName = (meta.followerName
            || meta.likerName
            || meta.commenterName
            || meta.mentionedByName
            || meta.requesterName
            || meta.friendName
            || meta.inviterName
            || meta.senderName) as string | null;
        }

        return {
          id: n.id,
          type: n.type,
          title: n.title,
          body: n.body,
          read: n.read,
          sourceId: n.sourceId,
          metadata: meta,
          createdAt: n.createdAt,
          actor: actorName ? { name: actorName, avatar: actorAvatar } : null,
        };
      })
    );

    return NextResponse.json({
      notifications: enriched,
      nextCursor,
      hasMore,
    });
  } catch (err) {
    console.error('[GET /api/notifications]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
