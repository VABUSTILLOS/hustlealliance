import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { resolveSegmentFilter, type SegmentFilter } from '@/lib/email/segments';

// GET /api/admin/email/contacts?segmentFilter=<json>&limit=&offset=
// CRM-lite contact list: applies the same segment filter format used by campaigns.
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = request.nextUrl;
    const rawFilter = searchParams.get('segmentFilter');
    let segmentFilter: SegmentFilter | undefined;
    if (rawFilter) {
      try {
        segmentFilter = JSON.parse(rawFilter);
      } catch {
        return NextResponse.json({ error: 'Invalid segmentFilter JSON' }, { status: 400 });
      }
    }

    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = resolveSegmentFilter(segmentFilter);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          membershipTier: true,
          createdAt: true,
          streak: { select: { lastActiveDate: true } },
          _count: { select: { enrollments: true, storeOrders: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where }),
    ]);

    const contacts = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      membershipTier: u.membershipTier,
      createdAt: u.createdAt,
      lastActiveAt: u.streak?.lastActiveDate ?? null,
      enrollmentCount: u._count.enrollments,
      orderCount: u._count.storeOrders,
    }));

    return NextResponse.json({ contacts, total });
  } catch (err) {
    return authErrorResponse(err);
  }
}
