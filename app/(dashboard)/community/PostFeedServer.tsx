import { getCommunityPosts, getTrendingTopics } from '@/lib/db/community';
import { CommunityFeedClient } from './CommunityFeedClient';

export async function PostFeedServer() {
  const [data, trending] = await Promise.all([
    getCommunityPosts({ sort: 'latest', limit: 20 }),
    getTrendingTopics(5),
  ]);

  return <CommunityFeedClient initialData={data} trending={trending} />;
}
