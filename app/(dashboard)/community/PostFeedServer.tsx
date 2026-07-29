import { getCommunityPosts, getTrendingTopics } from '@/lib/db/community';
import { CommunityTabsWrapper } from './CommunityTabsWrapper';
import type { TrendingTopic } from '@/lib/db/community';

export async function PostFeedServer({ trending }: { trending: TrendingTopic[] }) {
  const data = await getCommunityPosts({ sort: 'latest', limit: 20 });

  return <CommunityTabsWrapper initialData={data} trending={trending} />;
}
