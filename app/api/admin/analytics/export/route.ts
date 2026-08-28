import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import {
  clampDays,
  getGrowthAnalytics,
  getEngagementAnalytics,
  getRevenueAnalytics,
} from '@/lib/db/analytics';

function csvEscape(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(headers: string[], rows: Array<Array<string | number>>): string {
  const lines = [headers.map(csvEscape).join(',')];
  for (const row of rows) lines.push(row.map(csvEscape).join(','));
  return lines.join('\n');
}

// GET /api/admin/analytics/export?type=growth|engagement|revenue&days=90
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') ?? 'growth';
    const days = clampDays(searchParams.get('days'));

    let csv: string;
    switch (type) {
      case 'growth': {
        const data = await getGrowthAnalytics(days);
        csv = toCsv(
          ['date', 'new_members', 'cumulative_members'],
          data.series.map((p, i) => [p.date, p.count, data.cumulative[i]?.total ?? '']),
        );
        break;
      }
      case 'engagement': {
        const data = await getEngagementAnalytics(days);
        csv = toCsv(
          ['week', 'posts', 'comments', 'likes', 'messages', 'lesson_completions'],
          data.series.map((p) => [p.date, p.posts, p.comments, p.likes, p.messages, p.lessonCompletions]),
        );
        break;
      }
      case 'revenue': {
        const data = await getRevenueAnalytics(days);
        csv = toCsv(
          ['date', 'amount'],
          data.series.map((p) => [p.date, p.amount]),
        );
        break;
      }
      default:
        return NextResponse.json({ error: 'Invalid type — use growth|engagement|revenue' }, { status: 400 });
    }

    const filename = `analytics-${type}-${days}d-${new Date().toISOString().slice(0, 10)}.csv`;
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('[GET /api/admin/analytics/export]', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
