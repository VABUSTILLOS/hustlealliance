import { getCommunityPosts } from '@/lib/db/community';
import { CommunityFeedClient } from './CommunityFeedClient';

export async function PostFeedServer() {
  const data = await getCommunityPosts({
    sort: 'latest',
    limit: 20,
  });

  return <CommunityFeedClient initialData={data} />;
}
