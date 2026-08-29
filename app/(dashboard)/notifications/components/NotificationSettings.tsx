'use client';

import { useEffect, useState } from 'react';
import { useNotificationSettings, useUpdateNotificationSettings } from '@/app/(dashboard)/notifications/hooks/useNotifications';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getPushState, subscribeToPush, unsubscribeFromPush, type PushState } from '@/lib/push-client';

interface CategoryToggle {
  key: string;
  label: string;
  description: string;
}

const EMAIL_CATEGORIES: CategoryToggle[] = [
  { key: 'email_follow', label: 'New followers', description: 'When someone follows you' },
  { key: 'email_like', label: 'Likes', description: 'When someone likes your post or comment' },
  { key: 'email_comment', label: 'Comments', description: 'When someone comments on your post' },
  { key: 'email_mention', label: 'Mentions', description: 'When someone @mentions you' },
  { key: 'email_message', label: 'Messages', description: 'When you receive a new message' },
  { key: 'email_friend_request', label: 'Friend requests', description: 'When someone sends a friend request' },
  { key: 'email_group', label: 'Group activity', description: 'Group invites and join requests' },
  { key: 'email_event', label: 'Events', description: 'Event invites and reminders' },
  { key: 'email_digest', label: 'Weekly digest', description: 'A weekly summary of top community posts' },
];

const BROWSER_CATEGORIES: CategoryToggle[] = [
  { key: 'browser_follow', label: 'New followers', description: 'When someone follows you' },
  { key: 'browser_like', label: 'Likes', description: 'When someone likes your post or comment' },
  { key: 'browser_comment', label: 'Comments', description: 'When someone comments on your post' },
  { key: 'browser_mention', label: 'Mentions', description: 'When someone @mentions you' },
  { key: 'browser_message', label: 'Messages', description: 'When you receive a new message' },
  { key: 'browser_friend_request', label: 'Friend requests', description: 'When someone sends a friend request' },
  { key: 'browser_group', label: 'Group activity', description: 'Group invites and join requests' },
  { key: 'browser_event', label: 'Events', description: 'Event invites and reminders' },
];

export function NotificationSettings() {
  const { t } = useTranslation();
  const { data: prefs, isLoading } = useNotificationSettings();
  const updateSettings = useUpdateNotificationSettings();
  const [pushState, setPushState] = useState<PushState | null>(null);
  const [pushBusy, setPushBusy] = useState(false);

  useEffect(() => {
    getPushState().then(setPushState).catch(() => setPushState('unsupported'));
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-surface-light rounded-lg" />
        ))}
      </div>
    );
  }

  const handleToggle = (key: string, current: boolean) => {
    if (!prefs) return;
    updateSettings.mutate({ [key]: !current });
  };

  const pushEnabled = prefs?.['push_enabled'] ?? true;

  const handlePushToggle = async () => {
    if (pushBusy) return;
    setPushBusy(true);
    try {
      if (pushEnabled) {
        await unsubscribeFromPush();
        updateSettings.mutate({ push_enabled: false });
        setPushState(await getPushState());
      } else {
        const state = await subscribeToPush();
        setPushState(state);
        if (state === 'subscribed') updateSettings.mutate({ push_enabled: true });
      }
    } finally {
      setPushBusy(false);
    }
  };

  const pushStatusText: Record<PushState, string> = {
    unsupported: 'Not supported in this browser',
    denied: 'Blocked by the browser — allow notifications in your browser site settings to enable',
    subscribed: 'This device is subscribed',
    unsubscribed: 'This device is not subscribed yet',
  };

  return (
    <div className="space-y-8">
      {/* Push notifications (master toggle) */}
      <div>
        <h3 className="text-foreground font-heading font-bold text-base mb-4">Push notifications</h3>
        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
          <div>
            <p className="text-sm text-foreground font-medium">Enable push notifications</p>
            <p className="text-xs text-muted">
              {pushState ? pushStatusText[pushState] : 'Checking device…'}
            </p>
          </div>
          <button
            onClick={handlePushToggle}
            disabled={pushBusy || pushState === 'unsupported' || pushState === 'denied' || pushState === null}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
              pushEnabled && pushState === 'subscribed' ? 'bg-accent' : 'bg-surface-light'
            }`}
            role="switch"
            aria-checked={pushEnabled && pushState === 'subscribed'}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                pushEnabled && pushState === 'subscribed' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      {/* Email notifications */}
      <div>
        <h3 className="text-foreground font-heading font-bold text-base mb-4">{t.notifications.sectionEmailNotifications}</h3>
        <div className="space-y-2">
          {EMAIL_CATEGORIES.map((cat) => {
            const enabled = prefs?.[cat.key] ?? true;
            return (
              <div
                key={cat.key}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)]"
              >
                <div>
                  <p className="text-sm text-foreground font-medium">{cat.label}</p>
                  <p className="text-xs text-muted">{cat.description}</p>
                </div>
                <button
                  onClick={() => handleToggle(cat.key, enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enabled ? 'bg-accent' : 'bg-surface-light'
                  }`}
                  role="switch"
                  aria-checked={enabled}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Browser notifications */}
      <div>
        <h3 className="text-foreground font-heading font-bold text-base mb-4">{t.notifications.sectionInAppNotifications}</h3>
        <div className="space-y-2">
          {BROWSER_CATEGORIES.map((cat) => {
            const enabled = prefs?.[cat.key] ?? true;
            return (
              <div
                key={cat.key}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)]"
              >
                <div>
                  <p className="text-sm text-foreground font-medium">{cat.label}</p>
                  <p className="text-xs text-muted">{cat.description}</p>
                </div>
                <button
                  onClick={() => handleToggle(cat.key, enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enabled ? 'bg-accent' : 'bg-surface-light'
                  }`}
                  role="switch"
                  aria-checked={enabled}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {updateSettings.isSuccess && (
        <p className="text-sm text-green-400">{t.notifications.successPreferencesSaved}</p>
      )}
    </div>
  );
}
