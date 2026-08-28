import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { resolveSegmentFilter, type SegmentFilter } from '@/lib/email/segments';

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

// GET /api/admin/email/contacts/export?segmentFilter=<json>
// Streams a CSV of contacts matching the same segment filter used by the contacts list.
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

    const where = resolveSegmentFilter(segmentFilter);
    const users = await prisma.user.findMany({
      where,
      select: {
        email: true,
        name: true,
        tags: true,
        membershipTier: true,
        emailUnsubscribed: true,
        lastSeenAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const header = 'email,name,tags,tier,unsubscribed,lastSeenAt';
    const rows = users.map((u) =>
      [
        csvEscape(u.email),
        csvEscape(u.name),
        csvEscape(u.tags.join('|')),
        u.membershipTier,
        String(u.emailUnsubscribed),
        u.lastSeenAt ? u.lastSeenAt.toISOString() : '',
      ].join(','),
    );
    const csv = [header, ...rows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="contacts.csv"',
      },
    });
  } catch (err) {
    return authErrorResponse(err);
  }
}
