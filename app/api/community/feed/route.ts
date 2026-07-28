import { NextRequest, NextResponse } from 'next/server';
import { getCommunityPosts } from '@/lib/db/community';
import type { GetCommunityPostsOpts } from '@/lib/db/community';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const sort = (searchParams.get('sort') as GetCommunityPostsOpts['sort']) ?? 'latest';
  const cursor = searchParams.get('cursor') ?? undefined;
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);
  const space = searchParams.get('space') ?? undefined;

  const data = await getCommunityPosts({ sort, cursor, limit, space });

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
    },
  });
}
