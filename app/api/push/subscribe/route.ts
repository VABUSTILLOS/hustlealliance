import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/user';
import { authErrorResponse, AuthError } from '@/lib/auth/guard';

const bodySchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

// POST /api/push/subscribe — save a Web Push subscription for the signed-in user.
export async function POST(request: NextRequest) {
  let user;
  try {
    user = await getCurrentUser();
  } catch (err) {
    return authErrorResponse(err);
  }
  if (!user) {
    return authErrorResponse(new AuthError(401, 'Sign in to enable push notifications'));
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid subscription payload' }, { status: 400 });
  }

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint: parsed.data.endpoint },
      create: {
        userId: user.id,
        endpoint: parsed.data.endpoint,
        p256dh: parsed.data.keys.p256dh,
        auth: parsed.data.keys.auth,
        userAgent: request.headers.get('user-agent')?.slice(0, 255),
      },
      update: { userId: user.id },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/push/subscribe]', err);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}
