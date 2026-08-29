import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';

// GET /api/admin/email/contacts/[id]
// Full CRM-lite contact detail: profile, tags, and an activity timeline (campaigns received,
// store orders, enrollments, referrals).
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        membershipTier: true,
        createdAt: true,
        lastSeenAt: true,
        tags: true,
        emailUnsubscribed: true,
        leadScore: true,
        streak: { select: { lastActiveDate: true } },
      },
    });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [campaignRecipients, orders, enrollments, referralsMade, referralReceived, notes] = await Promise.all([
      prisma.campaignRecipient.findMany({
        where: { userId: id },
        include: { campaign: { select: { id: true, name: true, subject: true, sentAt: true } } },
        orderBy: { id: 'desc' },
        take: 50,
      }),
      prisma.storeOrder.findMany({
        where: { userId: id },
        include: { items: { include: { product: { select: { title: true } } } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.enrollment.findMany({
        where: { userId: id },
        include: { course: { select: { id: true, title: true } } },
        orderBy: { enrolledAt: 'desc' },
        take: 50,
      }),
      prisma.referral.findMany({
        where: { referrerId: id },
        include: { referee: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.referral.findFirst({
        where: { refereeId: id },
        include: { referrer: { select: { id: true, name: true, email: true } } },
      }),
      prisma.contactNote.findMany({
        where: { userId: id },
        include: { author: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    return NextResponse.json({
      contact: {
        ...user,
        lastActiveAt: user.streak?.lastActiveDate ?? null,
      },
      timeline: {
        campaigns: campaignRecipients.map((r) => ({
          campaignId: r.campaign.id,
          name: r.campaign.name,
          subject: r.campaign.subject,
          sentAt: r.sentAt,
          openedAt: r.openedAt,
          clickedAt: r.clickedAt,
          status: r.status,
        })),
        orders: orders.map((o) => ({
          id: o.id,
          status: o.status,
          totalAmount: o.totalAmount,
          currency: o.currency,
          paidAt: o.paidAt,
          createdAt: o.createdAt,
          items: o.items.map((i) => ({ productName: i.product.title, quantity: i.quantity, totalPrice: i.totalPrice })),
        })),
        enrollments: enrollments.map((e) => ({
          courseId: e.course.id,
          courseTitle: e.course.title,
          enrolledAt: e.enrolledAt,
          completedAt: e.completedAt,
          progressPct: e.progressPct,
        })),
        referralsMade: referralsMade.map((r) => ({
          id: r.id,
          status: r.status,
          referee: r.referee,
          createdAt: r.createdAt,
          convertedAt: r.convertedAt,
        })),
        referredBy: referralReceived
          ? { id: referralReceived.id, referrer: referralReceived.referrer, status: referralReceived.status }
          : null,
      },
    });
  } catch (err) {
    return authErrorResponse(err);
  }
}

// PUT /api/admin/email/contacts/[id]
// Body: { tags?: string[], emailUnsubscribed?: boolean }
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { tags, emailUnsubscribed } = body as { tags?: string[]; emailUnsubscribed?: boolean };

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(tags !== undefined ? { tags } : {}),
        ...(emailUnsubscribed !== undefined ? { emailUnsubscribed } : {}),
      },
      select: { id: true, tags: true, emailUnsubscribed: true },
    });

    return NextResponse.json({ contact: user });
  } catch (err) {
    return authErrorResponse(err);
  }
}
