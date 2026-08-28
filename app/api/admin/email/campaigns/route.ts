import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { resolveSegmentFilter, type SegmentFilter } from '@/lib/email/segments';

export async function GET() {
  try {
    await requireAdmin();
    const campaigns = await prisma.emailCampaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { recipients: true } },
        recipients: {
          select: { status: true },
        },
      },
    });

    const withStats = campaigns.map(({ recipients, ...c }) => {
      const stats = {
        total: recipients.length,
        sent: recipients.filter((r) => r.status !== 'PENDING' && r.status !== 'FAILED').length,
        opened: recipients.filter((r) => r.status === 'OPENED' || r.status === 'CLICKED').length,
        clicked: recipients.filter((r) => r.status === 'CLICKED').length,
        bounced: recipients.filter((r) => r.status === 'BOUNCED').length,
        failed: recipients.filter((r) => r.status === 'FAILED').length,
      };
      return { ...c, stats };
    });

    return NextResponse.json({ campaigns: withStats });
  } catch (err) {
    return authErrorResponse(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { name, subject, html, segmentFilter } = body as {
      name: string;
      subject: string;
      html: string;
      segmentFilter?: SegmentFilter;
    };

    if (!name || !subject || !html) {
      return NextResponse.json({ error: 'name, subject, and html are required' }, { status: 400 });
    }

    // Validate segment filter resolves without throwing.
    if (segmentFilter) resolveSegmentFilter(segmentFilter);

    const campaign = await prisma.emailCampaign.create({
      data: {
        name,
        subject,
        html,
        segmentFilter: segmentFilter ? (segmentFilter as object) : undefined,
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err) {
    return authErrorResponse(err);
  }
}
