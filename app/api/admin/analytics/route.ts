import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { getAnalytics } from '@/lib/db/admin';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const analytics = await getAnalytics();
    return NextResponse.json(analytics, {
      headers: { 'Cache-Control': 'private, max-age=300' },
    });
  } catch (err) {
    console.error('[GET /api/admin/analytics]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
