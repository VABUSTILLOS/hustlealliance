import { getCommunityPosts, getTrendingTopics } from '@/lib/db/community';
import type { GetCommunityPostsResult, TrendingTopic } from '@/lib/db/community';
import { CommunityTabsWrapper } from './CommunityTabsWrapper';
import type { FeedTab } from './FeedTabs';

export async function PostFeedServer({ trending, initialTab }: {
  trending: TrendingTopic[];
  initialTab: FeedTab;
}) {
  // Fetch initial posts gracefully — don't crash if the DB is unreachable
  let data: GetCommunityPostsResult = { items: [], hasMore: false, nextCursor: null };
  try {
    data = await getCommunityPosts({ sort: 'latest', limit: 20 });
  } catch (err) {
    console.error('[community] Failed to load posts:', (err as Error).message);
  }

  return <CommunityTabsWrapper initialData={data} trending={trending} initialTab={initialTab} />;
}
