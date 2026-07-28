import { Suspense } from 'react';
import { CommunityHeader } from './CommunityHeader';
import { PostCreator } from './PostCreator';
import { PostFeedServer } from './PostFeedServer';
import { PostFeedSkeleton } from './PostFeedSkeleton';

export const dynamic = 'force-dynamic';

export default function CommunityPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <CommunityHeader />
      <PostCreator />
      <Suspense fallback={<PostFeedSkeleton />}>
        <PostFeedServer />
      </Suspense>
    </div>
  );
}
