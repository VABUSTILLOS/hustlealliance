import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from '@/lib/auth/user';

// POST /api/notifications/read-all — mark all notifications as read
export async function POST() {
  try {
    const user = await getCurrentUser();
    await prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/notifications/read-all]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
