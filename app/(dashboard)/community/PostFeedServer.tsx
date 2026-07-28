import { getCommunityPosts } from '@/lib/db/community';
import { PostFeedUI } from './PostFeedUI';

export async function PostFeedServer() {
  const { items, hasMore, nextCursor } = await getCommunityPosts({
    sort: 'latest',
    limit: 20,
  });

  return (
    <PostFeedUI
      initialPosts={items}
      initialHasMore={hasMore}
      initialCursor={nextCursor}
    />
  );
}
