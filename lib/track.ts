import { prisma } from '@/lib/db/prisma';
import type { PageEventType } from '@/lib/generated/prisma/client';

export type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

/**
 * Record a first-party funnel event (view / lead / sale).
 * Fire-and-forget safe: never throws, so callers can `await` or float it.
 */
export async function recordPageEvent(input: {
  type: PageEventType;
  path: string;
  sessionId: string;
  landingPageId?: string | null;
  utm?: UtmParams | null;
}): Promise<void> {
  try {
    if (!input.sessionId || !input.path) return;
    await prisma.pageEvent.create({
      data: {
        type: input.type,
        path: input.path.slice(0, 500),
        sessionId: input.sessionId.slice(0, 128),
        landingPageId: input.landingPageId ?? null,
        utm: input.utm ?? undefined,
      },
    });
  } catch (err) {
    console.error('[track] failed to record page event', err);
  }
}

/** Extract UTM params from a URL/search params object. */
export function extractUtm(searchParams: URLSearchParams | Record<string, string | undefined>): UtmParams | null {
  const get = (k: string) =>
    searchParams instanceof URLSearchParams ? searchParams.get(k) ?? undefined : searchParams[k];
  const utm: UtmParams = {
    source: get('utm_source'),
    medium: get('utm_medium'),
    campaign: get('utm_campaign'),
    term: get('utm_term'),
    content: get('utm_content'),
  };
  return Object.values(utm).some(Boolean) ? utm : null;
}
