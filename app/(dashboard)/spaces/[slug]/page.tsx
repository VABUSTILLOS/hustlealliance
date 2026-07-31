import { getCommunityPosts } from '@/lib/db/community';
import type { GetCommunityPostsResult } from '@/lib/db/community';
import { spaces } from '@/lib/data/spaces';
import { SpaceDetailClient } from './SpaceDetailClient';

export const dynamic = 'force-dynamic';

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const space = spaces.find((s) => s.slug === slug);

  let feed: GetCommunityPostsResult = { items: [], hasMore: false, nextCursor: null };
  try {
    feed = await getCommunityPosts({ space: slug, limit: 30 });
  } catch (err) {
    console.error('[spaces] Failed to load space posts:', (err as Error).message);
  }

  return <SpaceDetailClient slug={slug} space={space ?? null} feed={feed} />;
}
