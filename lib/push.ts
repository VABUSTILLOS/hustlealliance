import prisma from '@/lib/db/prisma';
import webpush from 'web-push';

/**
 * Web Push helper. All send paths are fire-and-forget and degrade silently
 * when VAPID keys aren't configured (demo/dev without env) — the DB
 * notification still works.
 */

const vapidConfigured =
  !!process.env.VAPID_PUBLIC_KEY &&
  !!process.env.VAPID_PRIVATE_KEY &&
  !!process.env.VAPID_SUBJECT;

if (vapidConfigured) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
}

export const isPushEnabled = vapidConfigured;

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  badge?: string;
  /** NotificationType — used to respect per-category browser_* preferences. */
  type?: string;
}

/** Maps a NotificationType to its browser_* preference key (null = no category pref). */
function browserPrefKeyFor(type?: string): string | null {
  switch (type) {
    case 'FOLLOWED':
      return 'browser_follow';
    case 'POST_LIKED':
    case 'COMMENT_LIKED':
      return 'browser_like';
    case 'COMMENTED':
      return 'browser_comment';
    case 'MENTIONED':
      return 'browser_mention';
    case 'NEW_MESSAGE':
      return 'browser_message';
    case 'FRIEND_REQUEST':
    case 'FRIEND_ACCEPTED':
      return 'browser_friend_request';
    case 'GROUP_INVITE':
    case 'GROUP_JOIN_REQUEST':
    case 'GROUP_POST':
    case 'GROUP_ANNOUNCEMENT':
      return 'browser_group';
    case 'EVENT_INVITE':
    case 'EVENT_REMINDER':
    case 'EVENT_PROMOTED':
      return 'browser_event';
    default:
      return null;
  }
}

/** False when the user has opted out of push entirely or for this category. */
async function pushAllowedFor(userId: string, type?: string): Promise<boolean> {
  const record = await prisma.notificationPreference.findUnique({
    where: { userId },
    select: { preferences: true },
  });
  const prefs = (record?.preferences ?? {}) as Record<string, boolean>;
  if (prefs.push_enabled === false) return false;
  const categoryKey = browserPrefKeyFor(type);
  if (categoryKey && prefs[categoryKey] === false) return false;
  return true;
}

/** Push a notification to every active subscription owned by the user. */
export async function sendPushNotification(userId: string, payload: PushPayload): Promise<void> {
  if (!vapidConfigured) return;

  try {
    if (!(await pushAllowedFor(userId, payload.type))) return;

    const subs = await prisma.pushSubscription.findMany({
      where: { userId },
      select: { id: true, endpoint: true, p256dh: true, auth: true },
    });
    if (subs.length === 0) return;

    const body = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url ?? '/dashboard',
      badge: payload.badge ?? '/icons/icon-192.png',
      icon: '/icons/icon-192.png',
    });

    // Send all in parallel; drop dead endpoints (410 Gone) from the DB.
    await Promise.all(
      subs.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            body,
          );
        } catch (err) {
          const status = (err as { statusCode?: number })?.statusCode;
          if (status === 404 || status === 410) {
            await prisma.pushSubscription
              .delete({ where: { id: sub.id } })
              .catch(() => {});
          } else {
            console.warn('[Push] send failed:', err);
          }
        }
      }),
    );
  } catch (err) {
    console.error('[Push] sendPushNotification error:', err);
  }
}
