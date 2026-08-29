import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';
import { rangeToDays } from '../store/route';

type SourceRow = { source: string; medium: string; orders: bigint; revenue: number | null };
type AffiliateRow = { referralId: string; code: string; ownerName: string | null; ownerEmail: string; orders: bigint; revenue: number | null };
type PageRow = { landingPageId: string; title: string; slug: string; orders: bigint; revenue: number | null };

function csvEscape(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/**
 * GET /api/admin/analytics/sources?range=7|30|90[&format=csv]
 * Revenue attribution: by UTM source/medium, by landing page, by affiliate code.
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const days = rangeToDays(searchParams.get('range'));
    const format = searchParams.get('format');
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [bySource, byPage, byAffiliate] = await Promise.all([
      prisma.$queryRaw<SourceRow[]>`
        SELECT COALESCE(utm->>'source', '(direct)') AS source,
               COALESCE(utm->>'medium', '—') AS medium,
               COUNT(*) AS orders, SUM("totalAmount") AS revenue
        FROM "StoreOrder"
        WHERE status IN ('PAID', 'FULFILLED') AND "paidAt" >= ${since}
        GROUP BY 1, 2
        ORDER BY revenue DESC NULLS LAST
        LIMIT 50
      `,
      prisma.$queryRaw<PageRow[]>`
        SELECT o."landingPageId", p.title, p.slug,
               COUNT(*) AS orders, SUM(o."totalAmount") AS revenue
        FROM "StoreOrder" o
        JOIN "LandingPage" p ON p.id = o."landingPageId"
        WHERE o.status IN ('PAID', 'FULFILLED') AND o."paidAt" >= ${since}
          AND o."landingPageId" IS NOT NULL
        GROUP BY o."landingPageId", p.title, p.slug
        ORDER BY revenue DESC NULLS LAST
        LIMIT 20
      `,
      prisma.$queryRaw<AffiliateRow[]>`
        SELECT o."referralId", r.code, u.name AS "ownerName", u.email AS "ownerEmail",
               COUNT(*) AS orders, SUM(o."totalAmount") AS revenue
        FROM "StoreOrder" o
        JOIN "Referral" r ON r.id = o."referralId"
        JOIN "User" u ON u.id = r."referrerId"
        WHERE o.status IN ('PAID', 'FULFILLED') AND o."paidAt" >= ${since}
          AND o."referralId" IS NOT NULL
        GROUP BY o."referralId", r.code, u.name, u.email
        ORDER BY revenue DESC NULLS LAST
        LIMIT 20
      `,
    ]);

    if (format === 'csv') {
      const lines = ['kind,dimension_1,dimension_2,orders,revenue_usd'];
      for (const r of bySource) {
        lines.push(['utm', csvEscape(r.source), csvEscape(r.medium), Number(r.orders), (Number(r.revenue ?? 0)).toFixed(2)].join(','));
      }
      for (const r of byPage) {
        lines.push(['page', csvEscape(r.title), `/p/${r.slug}`, Number(r.orders), (Number(r.revenue ?? 0)).toFixed(2)].join(','));
      }
      for (const r of byAffiliate) {
        lines.push(['affiliate', csvEscape(r.code), csvEscape(r.ownerName ?? r.ownerEmail), Number(r.orders), (Number(r.revenue ?? 0)).toFixed(2)].join(','));
      }
      return new NextResponse(lines.join('\n'), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="revenue-by-source-${days}d.csv"`,
        },
      });
    }

    return NextResponse.json({
      days,
      bySource: bySource.map((r) => ({ ...r, orders: Number(r.orders), revenue: Number(r.revenue ?? 0) })),
      byPage: byPage.map((r) => ({ ...r, orders: Number(r.orders), revenue: Number(r.revenue ?? 0) })),
      byAffiliate: byAffiliate.map((r) => ({ ...r, orders: Number(r.orders), revenue: Number(r.revenue ?? 0) })),
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
