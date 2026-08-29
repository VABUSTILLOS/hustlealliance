import { getCommunityPosts } from '@/lib/db/community';
import type { GetCommunityPostsResult } from '@/lib/db/community';
import { getSpaceBySlug } from '@/lib/db/spaces';
import { getCurrentUser } from '@/lib/auth/user';
import { SpaceDetailClient } from './SpaceDetailClient';

export const dynamic = 'force-dynamic';

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();
  const space = await getSpaceBySlug(slug, user?.id);

  let feed: GetCommunityPostsResult = { items: [], hasMore: false, nextCursor: null };
  try {
    feed = await getCommunityPosts({ space: slug, limit: 30 });
  } catch (err) {
    console.error('[spaces] Failed to load space posts:', (err as Error).message);
  }

  return <SpaceDetailClient slug={slug} space={space} feed={feed} />;
}
