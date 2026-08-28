import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import prisma from '@/lib/db/prisma';

/**
 * GET /api/admin/reports — list reported posts with their reports, grouped by post.
 * Query params:
 *   status=open|all (default open; "open" excludes posts already resolved via dismissal)
 *   limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const posts = await prisma.communityPost.findMany({
      where: {
        reports: { some: {} },
        ...(includeDeleted ? {} : { isDeleted: false }),
      },
      select: {
        id: true,
        content: true,
        imageUrls: true,
        isDeleted: true,
        createdAt: true,
        author: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        group: { select: { id: true, name: true, slug: true } },
        reports: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            reason: true,
            createdAt: true,
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
        _count: { select: { reports: true } },
      },
      orderBy: { reports: { _count: 'desc' } },
      take: limit,
      skip: offset,
    });

    const total = await prisma.communityPost.count({
      where: {
        reports: { some: {} },
        ...(includeDeleted ? {} : { isDeleted: false }),
      },
    });

    return NextResponse.json(
      { posts, total },
      { headers: { 'Cache-Control': 'private, no-cache' } }
    );
  } catch (err) {
    console.error('[GET /api/admin/reports]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/reports — moderation actions.
 * Body: { postId: string, action: 'dismiss' | 'deletePost' | 'restorePost' }
 *  - dismiss: remove all reports for the post, keep the post
 *  - deletePost: soft-delete the post and clear its reports
 *  - restorePost: un-delete a previously soft-deleted post
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { postId, action } = body as { postId?: string; action?: string };

    if (!postId || typeof postId !== 'string') {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }
    if (!action || !['dismiss', 'deletePost', 'restorePost'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { id: true, isDeleted: true },
    });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (action === 'dismiss') {
      await prisma.communityReport.deleteMany({ where: { postId } });
    } else if (action === 'deletePost') {
      await prisma.$transaction([
        prisma.communityPost.update({
          where: { id: postId },
          data: { isDeleted: true, deletedAt: new Date() },
        }),
        prisma.communityReport.deleteMany({ where: { postId } }),
      ]);
    } else {
      // restorePost
      await prisma.communityPost.update({
        where: { id: postId },
        data: { isDeleted: false, deletedAt: null },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/admin/reports]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
