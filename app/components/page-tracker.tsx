'use client';

import { useEffect } from 'react';
import type { UtmParams } from '@/lib/track';

const SESSION_KEY = 'ha_sid';
const UTM_KEY = 'ha_utm';

function getOrCreateSessionId(): string {
  try {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return 'anonymous';
  }
}

function captureUtm(): UtmParams | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl: UtmParams = {
      source: params.get('utm_source') ?? undefined,
      medium: params.get('utm_medium') ?? undefined,
      campaign: params.get('utm_campaign') ?? undefined,
      term: params.get('utm_term') ?? undefined,
      content: params.get('utm_content') ?? undefined,
    };
    if (Object.values(fromUrl).some(Boolean)) {
      sessionStorage.setItem(UTM_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const stored = sessionStorage.getItem(UTM_KEY);
    return stored ? (JSON.parse(stored) as UtmParams) : null;
  } catch {
    return null;
  }
}

/** Current attribution for checkout flows: session id + first-seen UTM. */
export function getAttribution(): { sessionId: string; utm: UtmParams | null } {
  return { sessionId: getOrCreateSessionId(), utm: captureUtm() };
}

/**
 * First-party view tracker. Renders nothing; fires one VIEW beacon per mount.
 * Wire into public pages (landing pages, payment links).
 */
export default function PageTracker({ path, landingPageId }: { path: string; landingPageId?: string }) {
  useEffect(() => {
    const payload = JSON.stringify({
      type: 'VIEW',
      path,
      landingPageId: landingPageId ?? null,
      sessionId: getOrCreateSessionId(),
      utm: captureUtm(),
    });
    try {
      const blob = new Blob([payload], { type: 'application/json' });
      if (!navigator.sendBeacon('/api/track', blob)) {
        void fetch('/api/track', { method: 'POST', body: payload, keepalive: true, headers: { 'Content-Type': 'application/json' } });
      }
    } catch {
      // tracking must never break the page
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, landingPageId]);

  return null;
}
