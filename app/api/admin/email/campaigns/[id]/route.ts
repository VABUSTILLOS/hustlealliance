import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { resolveSegmentFilter, type SegmentFilter } from '@/lib/email/segments';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
      include: { recipients: { include: { user: { select: { id: true, email: true, name: true } } } } },
    });
    if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ campaign });
  } catch (err) {
    return authErrorResponse(err);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { name, subject, html, segmentFilter, scheduledAt } = body as {
      name?: string;
      subject?: string;
      html?: string;
      segmentFilter?: SegmentFilter | null;
      scheduledAt?: string | null;
    };

    const existing = await prisma.emailCampaign.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (existing.status !== 'DRAFT') {
      return NextResponse.json({ error: 'Only draft campaigns can be edited' }, { status: 400 });
    }

    if (segmentFilter) resolveSegmentFilter(segmentFilter);

    const campaign = await prisma.emailCampaign.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(subject !== undefined ? { subject } : {}),
        ...(html !== undefined ? { html } : {}),
        ...(segmentFilter !== undefined ? { segmentFilter: segmentFilter as object | undefined } : {}),
        ...(scheduledAt !== undefined
          ? { scheduledAt: scheduledAt ? new Date(scheduledAt) : null, status: scheduledAt ? 'SCHEDULED' : 'DRAFT' }
          : {}),
      },
    });

    return NextResponse.json({ campaign });
  } catch (err) {
    return authErrorResponse(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.emailCampaign.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return authErrorResponse(err);
  }
}
