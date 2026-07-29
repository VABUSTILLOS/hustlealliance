'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FeedTabs } from './FeedTabs';
import type { FeedTab } from './FeedTabs';
import { PostCreator } from './PostCreator';
import { CommunityFeedClient } from './CommunityFeedClient';
import type { GetCommunityPostsResult, TrendingTopic } from '@/lib/db/community';

export function CommunityTabsWrapper({ initialData, trending, initialTab }: {
  initialData: GetCommunityPostsResult;
  trending: TrendingTopic[];
  initialTab: FeedTab;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FeedTab>(initialTab);

  const handleTabChange = useCallback(
    (tab: FeedTab) => {
      setActiveTab(tab);
      const newUrl = tab === 'spaces' ? window.location.pathname : `?tab=${tab}`;
      router.replace(newUrl, { scroll: false });
    },
    [router]
  );

  return (
    <>
      <FeedTabs active={activeTab} onChange={handleTabChange} />
      {activeTab !== 'personal' && <PostCreator />}
      <CommunityFeedClient initialData={initialData} trending={trending} activeTab={activeTab} />
    </>
  );
}
