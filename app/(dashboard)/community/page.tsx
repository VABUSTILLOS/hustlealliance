import { Suspense } from 'react';
import { CommunityHeader } from './CommunityHeader';
import { PostFeedServer } from './PostFeedServer';
import { PostFeedSkeleton } from './PostFeedSkeleton';
import { CommunitySidebar } from './CommunitySidebar';
import { getTrendingTopics } from '@/lib/db/community';

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  const trending = await getTrendingTopics(5);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <CommunityHeader />
          <Suspense fallback={<PostFeedSkeleton />}>
            <PostFeedServer trending={trending} />
          </Suspense>
        </div>

        {/* Sidebar — server-rendered */}
        <aside className="hidden lg:block w-80 shrink-0">
          <CommunitySidebar trending={trending} />
        </aside>
      </div>
    </div>
  );
}
