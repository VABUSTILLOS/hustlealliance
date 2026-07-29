import { CommunityHeader } from './CommunityHeader';
import { getTrendingTopics } from '@/lib/db/community';
import type { FeedTab } from './FeedTabs';

export const dynamic = 'force-dynamic';

const VALID_TABS: FeedTab[] = ['personal', 'global', 'spaces'];

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab: FeedTab = tab && VALID_TABS.includes(tab as FeedTab) ? (tab as FeedTab) : 'spaces';
  const trending = await getTrendingTopics(5);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <CommunityHeader />
      <div className="p-8 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border-subtle)]">
        <p className="text-[var(--color-foreground)] font-heading text-lg">Community page loading...</p>
        <p className="text-[var(--color-muted)] text-sm mt-2">Tab: {initialTab} | Trending topics: {trending.length}</p>
      </div>
    </div>
  );
}
