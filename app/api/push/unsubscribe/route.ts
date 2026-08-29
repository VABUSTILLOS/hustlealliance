import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/user';
import { authErrorResponse, AuthError } from '@/lib/auth/guard';

const bodySchema = z.object({
  endpoint: z.string().min(1),
});

// POST /api/push/unsubscribe — remove a Web Push subscription.
export async function POST(request: NextRequest) {
  let user;
  try {
    user = await getCurrentUser();
  } catch (err) {
    return authErrorResponse(err);
  }
  if (!user) {
    return authErrorResponse(new AuthError(401, 'Sign in to manage notifications'));
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    await prisma.pushSubscription.deleteMany({
      where: { endpoint: parsed.data.endpoint, userId: user.id },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/push/unsubscribe]', err);
    return NextResponse.json({ error: 'Failed to remove subscription' }, { status: 500 });
  }
}
