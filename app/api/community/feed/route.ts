import { NextRequest, NextResponse } from 'next/server';
import { getCommunityPosts } from '@/lib/db/community';
import type { GetCommunityPostsOpts } from '@/lib/db/community';
import { getCurrentUser } from '@/lib/auth/user';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const sort = (searchParams.get('sort') as GetCommunityPostsOpts['sort']) ?? 'latest';
  const cursor = searchParams.get('cursor') ?? undefined;
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);
  const space = searchParams.get('space') ?? undefined;

  try {
    const user = await getCurrentUser();
    const data = await getCommunityPosts({ sort, cursor, limit, space, currentUserId: user.id });
    return NextResponse.json(data, {
      headers: {
        // Response is user-specific (isLiked depends on the requesting user) — never cache publicly.
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('[api/community/feed] Failed to fetch posts:', (err as Error).message);
    return NextResponse.json(
      { items: [], hasMore: false, nextCursor: null },
      { status: 200 }
    );
  }
}
