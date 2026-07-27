import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { getAdminUsers } from '@/lib/db/admin';
import { UserRole, MembershipTier } from '@/lib/generated/prisma/client';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search') || undefined;
    const role = searchParams.get('role') as UserRole | undefined;
    const tier = searchParams.get('tier') as MembershipTier | undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await getAdminUsers({ search, role, tier, limit, offset });

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, no-cache' },
    });
  } catch (err) {
    console.error('[GET /api/admin/users]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
