import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import prisma from '@/lib/db/prisma';
import { Prisma } from '@/lib/generated/prisma/client';

/**
 * GET /api/admin/analytics/store?section=<section>&range=<7|30|90>
 *
 * Read-only aggregation over StoreOrder / StoreOrderItem / Product / Coupon /
 * CouponRedemption / EmailCampaign / CampaignRecipient / Referral / LandingPage.
 * Tolerates empty tables — all queries return sensible empty defaults.
 *
 * Sections:
 *   revenue    — revenue over time, grouped by day, for the selected range
 *   products   — top products by revenue and units
 *   coupons    — redemptions per coupon + discounted revenue
 *   funnel     — landing pages published -> orders started -> paid orders
 *   campaigns  — per-campaign sent/opened/clicked/bounced rates
 *   referrals  — referred -> converted -> rewarded funnel
 *   revenueSeries — zero-filled per-day revenue + order counts across the range
 *   cohorts    — monthly signup cohorts of membership purchasers + M1-M3 retention
 *   all        — every section combined (default)
 */

export function rangeToDays(range: string | null): number {
  const n = Number(range);
  if (n === 7 || n === 30 || n === 90) return n;
  return 30;
}

export async function getRevenueOverTime(days: number) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const rows = await prisma.$queryRaw<Array<{ day: Date; revenue: Prisma.Decimal | number | null; orders: bigint }>>`
    SELECT date_trunc('day', "createdAt") AS day,
           SUM("totalAmount") AS revenue,
           COUNT(*) AS orders
    FROM "StoreOrder"
    WHERE "createdAt" >= ${since} AND status IN ('PAID', 'FULFILLED')
    GROUP BY day
    ORDER BY day ASC
  `;

  return rows.map((r) => ({
    date: new Date(r.day).toISOString().slice(0, 10),
    revenue: Number(r.revenue ?? 0),
    orders: Number(r.orders),
  }));
}

export async function getSalesByProduct() {
  const items = await prisma.storeOrderItem.groupBy({
    by: ['productId'],
    _sum: { totalPrice: true, quantity: true },
    orderBy: { _sum: { totalPrice: 'desc' } },
    take: 20,
  });

  if (items.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    select: { id: true, title: true, slug: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  return items.map((i) => ({
    productId: i.productId,
    title: byId.get(i.productId)?.title ?? 'Unknown product',
    slug: byId.get(i.productId)?.slug ?? '',
    revenue: Number(i._sum.totalPrice ?? 0),
    units: Number(i._sum.quantity ?? 0),
  }));
}

export async function getCouponUsage() {
  const redemptions = await prisma.couponRedemption.groupBy({
    by: ['couponId'],
    _count: { _all: true },
  });

  if (redemptions.length === 0) return [];

  const coupons = await prisma.coupon.findMany({
    where: { id: { in: redemptions.map((r) => r.couponId) } },
    select: { id: true, code: true, discountType: true, amount: true, maxUses: true, usedCount: true },
  });
  const byId = new Map(coupons.map((c) => [c.id, c]));

  // Discounted revenue: sum of order totals for orders where this coupon was redeemed.
  const redemptionOrders = await prisma.couponRedemption.findMany({
    select: { couponId: true, orderId: true },
  });
  const orderIdsByCoupon = new Map<string, string[]>();
  for (const r of redemptionOrders) {
    const arr = orderIdsByCoupon.get(r.couponId) ?? [];
    arr.push(r.orderId);
    orderIdsByCoupon.set(r.couponId, arr);
  }
  const allOrderIds = redemptionOrders.map((r) => r.orderId);
  const orders = allOrderIds.length
    ? await prisma.storeOrder.findMany({
        where: { id: { in: allOrderIds } },
        select: { id: true, totalAmount: true },
      })
    : [];
  const orderTotalById = new Map(orders.map((o) => [o.id, o.totalAmount]));

  return redemptions
    .map((r) => {
      const coupon = byId.get(r.couponId);
      const orderIdsForCoupon = orderIdsByCoupon.get(r.couponId) ?? [];
      const discountedRevenue = orderIdsForCoupon.reduce(
        (sum, oid) => sum + (orderTotalById.get(oid) ?? 0),
        0
      );
      return {
        couponId: r.couponId,
        code: coupon?.code ?? 'Unknown',
        discountType: coupon?.discountType ?? null,
        amount: coupon?.amount ?? 0,
        redemptions: r._count._all,
        maxUses: coupon?.maxUses ?? null,
        discountedRevenue,
      };
    })
    .sort((a, b) => b.redemptions - a.redemptions);
}

async function getConversionFunnel() {
  const [publishedLandingPages, ordersStarted, paidOrders] = await Promise.all([
    prisma.landingPage.count({ where: { status: 'PUBLISHED' } }),
    prisma.storeOrder.count(),
    prisma.storeOrder.count({ where: { status: { in: ['PAID', 'FULFILLED'] } } }),
  ]);

  return {
    publishedLandingPages,
    ordersStarted,
    paidOrders,
    // Approximation: landing pages aren't directly linked to orders in the
    // schema, so this funnel step is illustrative only, not a true attribution.
    note: 'Landing page -> order attribution is not tracked in the schema; steps are shown independently rather than as a strict conversion chain.',
  };
}

export async function getCampaignPerformance() {
  const campaigns = await prisma.emailCampaign.findMany({
    select: { id: true, name: true, status: true, sentAt: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  if (campaigns.length === 0) return [];

  const recipientCounts = await prisma.campaignRecipient.groupBy({
    by: ['campaignId', 'status'],
    _count: { _all: true },
  });

  const countsByCampaign = new Map<string, Record<string, number>>();
  for (const rc of recipientCounts) {
    const entry = countsByCampaign.get(rc.campaignId) ?? {};
    entry[rc.status] = rc._count._all;
    countsByCampaign.set(rc.campaignId, entry);
  }

  return campaigns.map((c) => {
    const counts = countsByCampaign.get(c.id) ?? {};
    const sent = counts.SENT ?? 0;
    const opened = counts.OPENED ?? 0;
    const clicked = counts.CLICKED ?? 0;
    const bounced = counts.BOUNCED ?? 0;
    const failed = counts.FAILED ?? 0;
    const pending = counts.PENDING ?? 0;
    const total = sent + opened + clicked + bounced + failed + pending;
    const delivered = sent + opened + clicked; // counted as reaching inbox
    return {
      campaignId: c.id,
      name: c.name,
      status: c.status,
      sentAt: c.sentAt,
      total,
      sent,
      opened,
      clicked,
      bounced,
      failed,
      openRate: delivered > 0 ? Number(((opened / delivered) * 100).toFixed(1)) : 0,
      clickRate: delivered > 0 ? Number(((clicked / delivered) * 100).toFixed(1)) : 0,
      bounceRate: total > 0 ? Number(((bounced / total) * 100).toFixed(1)) : 0,
    };
  });
}

export async function getReferralFunnel() {
  const [referred, converted, rewarded] = await Promise.all([
    prisma.referral.count(),
    prisma.referral.count({ where: { status: { in: ['CONVERTED', 'REWARDED'] } } }),
    prisma.referral.count({ where: { status: 'REWARDED' } }),
  ]);

  return { referred, converted, rewarded };
}

/** Zero-filled per-day revenue + order-count series across the selected range. */
async function getRevenueSeries(days: number) {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const rows = await prisma.$queryRaw<Array<{ day: Date; revenue: Prisma.Decimal | number | null; orders: bigint }>>`
    SELECT date_trunc('day', "paidAt") AS day,
           SUM("totalAmount") AS revenue,
           COUNT(*) AS orders
    FROM "StoreOrder"
    WHERE "paidAt" >= ${since} AND status IN ('PAID', 'FULFILLED')
    GROUP BY day
    ORDER BY day ASC
  `;

  const byDate = new Map(
    rows.map((r) => [
      new Date(r.day).toISOString().slice(0, 10),
      { revenue: Number(r.revenue ?? 0), orders: Number(r.orders) },
    ])
  );

  const series: Array<{ date: string; revenue: number; orders: number }> = [];
  const cursor = new Date(since);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  while (cursor <= today) {
    const key = cursor.toISOString().slice(0, 10);
    const entry = byDate.get(key);
    series.push({ date: key, revenue: entry?.revenue ?? 0, orders: entry?.orders ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  return series;
}

/**
 * Monthly signup cohorts (last 6 months) for MEMBERSHIP purchasers: users who
 * have at least one PAID/FULFILLED order containing a MEMBERSHIP product.
 * Retention at month+N = % of the cohort still "active" (membershipExpiresAt
 * is null [lifetime] or > that month boundary) at that offset.
 */
async function getMembershipCohorts() {
  const membershipOrderItems = await prisma.storeOrderItem.findMany({
    where: {
      product: { type: 'MEMBERSHIP' },
      order: { status: { in: ['PAID', 'FULFILLED'] } },
    },
    select: { order: { select: { userId: true, paidAt: true, createdAt: true } } },
  });

  if (membershipOrderItems.length === 0) return [];

  // First membership purchase date per user -> assigns the signup cohort.
  const firstPurchaseByUser = new Map<string, Date>();
  for (const item of membershipOrderItems) {
    const userId = item.order.userId;
    const purchasedAt = item.order.paidAt ?? item.order.createdAt;
    const existing = firstPurchaseByUser.get(userId);
    if (!existing || purchasedAt < existing) {
      firstPurchaseByUser.set(userId, purchasedAt);
    }
  }

  const userIds = Array.from(firstPurchaseByUser.keys());
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, membershipExpiresAt: true },
  });
  const expiresByUser = new Map(users.map((u) => [u.id, u.membershipExpiresAt]));

  const now = new Date();
  const cohortStarts: Date[] = [];
  for (let i = 5; i >= 0; i--) {
    cohortStarts.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
  }

  return cohortStarts.map((start) => {
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    const cohortUserIds = userIds.filter((uid) => {
      const purchasedAt = firstPurchaseByUser.get(uid)!;
      return purchasedAt >= start && purchasedAt < end;
    });
    const size = cohortUserIds.length;

    const retention = [1, 2, 3].map((offset) => {
      const boundary = new Date(start.getFullYear(), start.getMonth() + offset, 1);
      if (size === 0) return 0;
      if (boundary > now) return null; // not enough time has passed yet
      const activeCount = cohortUserIds.reduce((count, uid) => {
        const expiresAt = expiresByUser.get(uid);
        const active = expiresAt == null || expiresAt > boundary;
        return active ? count + 1 : count;
      }, 0);
      return Number(((activeCount / size) * 100).toFixed(1));
    });

    return {
      month: start.toISOString().slice(0, 7),
      size,
      retention,
    };
  });
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = request.nextUrl;
    const section = searchParams.get('section') ?? 'all';
    const days = rangeToDays(searchParams.get('range'));

    const result: Record<string, unknown> = {};

    if (section === 'revenue' || section === 'all') {
      result.revenue = await getRevenueOverTime(days);
    }
    if (section === 'products' || section === 'all') {
      result.products = await getSalesByProduct();
    }
    if (section === 'coupons' || section === 'all') {
      result.coupons = await getCouponUsage();
    }
    if (section === 'funnel' || section === 'all') {
      result.funnel = await getConversionFunnel();
    }
    if (section === 'campaigns' || section === 'all') {
      result.campaigns = await getCampaignPerformance();
    }
    if (section === 'referrals' || section === 'all') {
      result.referrals = await getReferralFunnel();
    }
    if (section === 'revenueSeries' || section === 'all') {
      result.revenueSeries = await getRevenueSeries(days);
    }
    if (section === 'cohorts' || section === 'all') {
      result.cohorts = await getMembershipCohorts();
    }

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, max-age=60' },
    });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[GET /api/admin/analytics/store]', err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}
