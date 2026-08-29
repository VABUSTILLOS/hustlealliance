import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { getAdminStats } from '@/lib/db/admin';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [stats, todayRevenue, newLeadsToday, activeAutomations, topPageViews] = await Promise.all([
      getAdminStats(),
      prisma.storeOrder.aggregate({
        where: { status: { in: ['PAID', 'FULFILLED'] }, paidAt: { gte: startOfToday } },
        _sum: { totalAmount: true },
      }),
      prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.emailAutomation.count({ where: { isActive: true } }),
      prisma.pageEvent.groupBy({
        by: ['landingPageId'],
        where: { type: 'VIEW', createdAt: { gte: sevenDaysAgo }, landingPageId: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { landingPageId: 'desc' } },
        take: 5,
      }),
    ]);

    const pageIds = topPageViews.map((p) => p.landingPageId).filter((x): x is string => !!x);
    const pages = pageIds.length
      ? await prisma.landingPage.findMany({ where: { id: { in: pageIds } }, select: { id: true, title: true, slug: true } })
      : [];
    const pageMap = new Map(pages.map((p) => [p.id, p]));

    const kpis = {
      todayRevenue: todayRevenue._sum.totalAmount ?? 0,
      newLeadsToday,
      activeAutomations,
      topPages: topPageViews.map((p) => ({
        id: p.landingPageId as string,
        title: pageMap.get(p.landingPageId as string)?.title ?? '(deleted)',
        slug: pageMap.get(p.landingPageId as string)?.slug ?? '',
        views: p._count._all,
      })),
    };

    return NextResponse.json({ ...stats, kpis }, {
      headers: { 'Cache-Control': 'private, no-cache' },
    });
  } catch (err) {
    console.error('[GET /api/admin/stats]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
