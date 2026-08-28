import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from '@/lib/auth/user';

type NotificationPreferenceKey =
  | 'email_follow'
  | 'email_like'
  | 'email_comment'
  | 'email_mention'
  | 'email_message'
  | 'email_friend_request'
  | 'email_group'
  | 'email_event'
  | 'email_digest'
  | 'browser_follow'
  | 'browser_like'
  | 'browser_comment'
  | 'browser_mention'
  | 'browser_message'
  | 'browser_friend_request'
  | 'browser_group'
  | 'browser_event';

const DEFAULT_PREFS: Record<NotificationPreferenceKey, boolean> = {
  email_follow: true, email_like: true, email_comment: true, email_mention: true,
  email_message: true, email_friend_request: true, email_group: true, email_event: true,
  email_digest: true,
  browser_follow: true, browser_like: true, browser_comment: true, browser_mention: true,
  browser_message: true, browser_friend_request: true, browser_group: true, browser_event: true,
};

// GET /api/notifications/settings
export async function GET() {
  try {
    const user = await getCurrentUser();

    const record = await prisma.notificationPreference.findUnique({
      where: { userId: user.id },
    });

    const prefs = record ? (record.preferences as Record<string, boolean>) : { ...DEFAULT_PREFS };

    return NextResponse.json({ preferences: { ...DEFAULT_PREFS, ...prefs } });
  } catch (err) {
    console.error('[GET /api/notifications/settings]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// PUT /api/notifications/settings — update preferences
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const updates: Record<string, boolean> = {};

    for (const [key, value] of Object.entries(body)) {
      if (key in DEFAULT_PREFS && typeof value === 'boolean') {
        updates[key] = value;
      }
    }

    await prisma.notificationPreference.upsert({
      where: { userId: user.id },
      create: { userId: user.id, preferences: updates },
      update: { preferences: updates },
    });

    return NextResponse.json({ success: true, preferences: updates });
  } catch (err) {
    console.error('[PUT /api/notifications/settings]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
