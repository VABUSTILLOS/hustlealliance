import { CommunityHeader } from './CommunityHeader';
import { getTrendingTopics, getCommunityStats } from '@/lib/db/community';
import type { TrendingTopic } from '@/lib/db/community';
import { PostFeedSkeleton } from './PostFeedSkeleton';
import { CommunitySidebar } from './CommunitySidebar';
import { PostFeedServer } from './PostFeedServer';
import { Suspense } from 'react';
import type { FeedTab } from './FeedTabs';

// ISR: revalidate the feed every 30s — fresh content without cold starts
export const revalidate = 30;

const VALID_TABS: FeedTab[] = ['personal', 'global', 'spaces'];

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab: FeedTab = tab && VALID_TABS.includes(tab as FeedTab) ? (tab as FeedTab) : 'spaces';

  // Fetch trending topics & community stats gracefully
  let trending: TrendingTopic[] = [];
  let stats = { memberCount: 0, postCount: 0 };
  try {
    [trending, stats] = await Promise.all([
      getTrendingTopics(5),
      getCommunityStats(),
    ]);
  } catch (err) {
    console.error('[community] Failed to load sidebar data:', (err as Error).message);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <CommunityHeader />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <Suspense fallback={<PostFeedSkeleton />}>
            <PostFeedServer trending={trending} initialTab={initialTab} />
          </Suspense>
        </div>
        <aside className="hidden lg:block w-80 shrink-0">
          <CommunitySidebar trending={trending} memberCount={stats.memberCount} postCount={stats.postCount} />
        </aside>
      </div>
    </div>
  );
}
