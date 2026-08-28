import { NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { getFunnelAnalytics } from '@/lib/db/analytics';

/** GET /api/admin/analytics/funnel */
export async function GET() {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const data = await getFunnelAnalytics();
    return NextResponse.json(data, { headers: { 'Cache-Control': 'private, max-age=300' } });
  } catch (err) {
    console.error('[GET /api/admin/analytics/funnel]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
