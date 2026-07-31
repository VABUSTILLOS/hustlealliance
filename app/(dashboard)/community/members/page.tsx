import { getCommunityMembers } from '@/lib/db/community';
import type { GetCommunityMembersOpts, GetCommunityMembersResult } from '@/lib/db/community';
import { MembersHeader } from './MembersHeader';
import { MembersGrid } from './MembersGrid';
import { MembersFilters } from './MembersFilters';

// ISR: revalidate member listing every 60s
export const revalidate = 60;

const VALID_SORTS = ['activity', 'newest', 'name'] as const;
const VALID_ROLES = ['STUDENT', 'INSTRUCTOR', 'ADMIN'] as const;
const VALID_TIERS = ['FREE', 'BASIC', 'PRO'] as const;

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;

  const sort = (VALID_SORTS.includes(sp.sort as any) ? sp.sort : 'activity') as GetCommunityMembersOpts['sort'];
  const role = VALID_ROLES.includes(sp.role as any) ? (sp.role as GetCommunityMembersOpts['role']) : undefined;
  const tier = VALID_TIERS.includes(sp.tier as any) ? (sp.tier as GetCommunityMembersOpts['tier']) : undefined;
  const search = sp.search || undefined;

  let result: GetCommunityMembersResult = { items: [], total: 0, hasMore: false, nextCursor: null };
  try {
    result = await getCommunityMembers({ sort, role, tier, search, limit: 36 });
  } catch (err) {
    console.error('[community] Failed to load members:', (err as Error).message);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <MembersHeader total={result.total} />
      <MembersFilters
        initialSort={sort}
        initialRole={role}
        initialTier={tier}
        initialSearch={search}
      />
      <MembersGrid members={result.items} />
    </div>
  );
}
