import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from '@/lib/auth/user';

// GET /api/notifications/unread-count — unread badge count
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const count = await prisma.notification.count({
      where: { userId: user.id, read: false },
    });
    return NextResponse.json({ count });
  } catch (err) {
    console.error('[GET /api/notifications/unread-count]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
