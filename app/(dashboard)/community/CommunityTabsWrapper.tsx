'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FeedTabs } from './FeedTabs';
import type { FeedTab } from './FeedTabs';
import { PostCreator } from './PostCreator';
import { CommunityFeedClient } from './CommunityFeedClient';
import type { GetCommunityPostsResult, TrendingTopic } from '@/lib/db/community';

const VALID_TABS: FeedTab[] = ['personal', 'global', 'spaces'];

function parseTab(tab: string | null): FeedTab {
  if (tab && VALID_TABS.includes(tab as FeedTab)) return tab as FeedTab;
  return 'spaces';
}

export function CommunityTabsWrapper({ initialData, trending }: {
  initialData: GetCommunityPostsResult;
  trending: TrendingTopic[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<FeedTab>(() => parseTab(searchParams.get('tab')));

  const handleTabChange = useCallback(
    (tab: FeedTab) => {
      setActiveTab(tab);
      const params = new URLSearchParams(searchParams.toString());
      if (tab === 'spaces') {
        params.delete('tab');
      } else {
        params.set('tab', tab);
      }
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <>
      <FeedTabs active={activeTab} onChange={handleTabChange} />
      {activeTab !== 'personal' && <PostCreator />}
      <CommunityFeedClient initialData={initialData} trending={trending} activeTab={activeTab} />
    </>
  );
}
