import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import {
  rangeToDays,
  getRevenueOverTime,
  getSalesByProduct,
  getCouponUsage,
  getCampaignPerformance,
  getReferralFunnel,
} from '../route';

/**
 * GET /api/admin/analytics/store/export?range=<7|30|90>&section=<section>
 *
 * Streams the requested section's table data as text/csv, for the same date
 * range semantics as the JSON analytics endpoint.
 */

type CsvRow = Record<string, string | number | boolean | null | undefined>;

function toCsv(rows: CsvRow[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const s = value == null ? '' : String(value);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

const SECTIONS = ['revenue', 'products', 'coupons', 'campaigns', 'referrals'] as const;
type Section = (typeof SECTIONS)[number];

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = request.nextUrl;
    const days = rangeToDays(searchParams.get('range'));
    const section = searchParams.get('section') as Section | null;

    if (!section || !SECTIONS.includes(section)) {
      return NextResponse.json(
        { error: `section must be one of: ${SECTIONS.join(', ')}` },
        { status: 400 }
      );
    }

    let rows: CsvRow[];
    switch (section) {
      case 'revenue':
        rows = await getRevenueOverTime(days);
        break;
      case 'products':
        rows = await getSalesByProduct();
        break;
      case 'coupons':
        rows = await getCouponUsage();
        break;
      case 'campaigns':
        rows = (await getCampaignPerformance()).map((c) => ({ ...c, sentAt: c.sentAt?.toString() ?? '' }));
        break;
      case 'referrals': {
        const funnel = await getReferralFunnel();
        rows = [funnel];
        break;
      }
    }

    const csv = toCsv(rows);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${section}-${days}d.csv"`,
        'Cache-Control': 'private, max-age=60',
      },
    });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[GET /api/admin/analytics/store/export]', err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}
