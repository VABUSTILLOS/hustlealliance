import { getCommunityPosts, getTrendingTopics } from '@/lib/db/community';
import { CommunityTabsWrapper } from './CommunityTabsWrapper';
import type { TrendingTopic } from '@/lib/db/community';
import type { FeedTab } from './FeedTabs';

export async function PostFeedServer({ trending, initialTab }: {
  trending: TrendingTopic[];
  initialTab: FeedTab;
}) {
  const data = await getCommunityPosts({ sort: 'latest', limit: 20 });

  return <CommunityTabsWrapper initialData={data} trending={trending} initialTab={initialTab} />;
}
