import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { countAudience, type BroadcastSegmentFilter } from '@/lib/db/broadcasts';
import type { MembershipTier, UserRole } from '@/lib/generated/prisma/client';

// GET /api/admin/broadcasts/audience-count?tiers=FREE,PRO&roles=STUDENT&lastActiveDays=30
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const tiersParam = searchParams.get('tiers');
    const rolesParam = searchParams.get('roles');
    const lastActiveDaysParam = searchParams.get('lastActiveDays');

    const filter: BroadcastSegmentFilter = {};
    if (tiersParam) filter.tiers = tiersParam.split(',').filter(Boolean) as MembershipTier[];
    if (rolesParam) filter.roles = rolesParam.split(',').filter(Boolean) as UserRole[];
    if (lastActiveDaysParam) {
      const n = Number(lastActiveDaysParam);
      if (!Number.isNaN(n)) filter.lastActiveDays = n;
    }

    const count = await countAudience(filter);
    return NextResponse.json({ count });
  } catch (err) {
    return authErrorResponse(err);
  }
}
