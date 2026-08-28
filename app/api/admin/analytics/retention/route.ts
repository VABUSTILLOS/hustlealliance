import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { getRetentionAnalytics, clampDays } from '@/lib/db/analytics';

/** GET /api/admin/analytics/retention?days=90 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const days = clampDays(request.nextUrl.searchParams.get('days'));
    const data = await getRetentionAnalytics(days);
    return NextResponse.json(data, { headers: { 'Cache-Control': 'private, max-age=300' } });
  } catch (err) {
    console.error('[GET /api/admin/analytics/retention]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
