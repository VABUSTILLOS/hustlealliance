import { getCommunityMembers } from '@/lib/db/community';
import { MembersHeader } from './MembersHeader';
import { MembersGrid } from './MembersGrid';
import { MembersFilters } from './MembersFilters';
import type { GetCommunityMembersOpts } from '@/lib/db/community';

export const dynamic = 'force-dynamic';

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

  const { items, total } = await getCommunityMembers({ sort, role, tier, search, limit: 36 });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <MembersHeader total={total} />
      <MembersFilters
        initialSort={sort}
        initialRole={role}
        initialTier={tier}
        initialSearch={search}
      />
      <MembersGrid members={items} />
    </div>
  );
}
