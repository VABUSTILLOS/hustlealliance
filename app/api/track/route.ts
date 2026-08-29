import { NextRequest, NextResponse } from 'next/server';
import { recordPageEvent, type UtmParams } from '@/lib/track';

const ALLOWED_TYPES = new Set(['VIEW', 'LEAD']);

function sanitizeUtm(raw: unknown): UtmParams | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const pick = (k: keyof UtmParams) =>
    typeof obj[k] === 'string' ? (obj[k] as string).slice(0, 200) : undefined;
  const utm: UtmParams = {
    source: pick('source'),
    medium: pick('medium'),
    campaign: pick('campaign'),
    term: pick('term'),
    content: pick('content'),
  };
  return Object.values(utm).some(Boolean) ? utm : null;
}

/**
 * POST /api/track — public first-party analytics beacon.
 * Body: { type: 'VIEW'|'LEAD', path, sessionId, landingPageId?, utm? }
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return new NextResponse(null, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  if (typeof b.type !== 'string' || !ALLOWED_TYPES.has(b.type)) {
    return new NextResponse(null, { status: 400 });
  }
  if (typeof b.path !== 'string' || !b.path || b.path.length > 500 || !b.path.startsWith('/')) {
    return new NextResponse(null, { status: 400 });
  }
  if (typeof b.sessionId !== 'string' || !b.sessionId || b.sessionId.length > 128) {
    return new NextResponse(null, { status: 400 });
  }

  await recordPageEvent({
    type: b.type as 'VIEW' | 'LEAD',
    path: b.path,
    sessionId: b.sessionId,
    landingPageId: typeof b.landingPageId === 'string' ? b.landingPageId : null,
    utm: sanitizeUtm(b.utm),
  });

  return new NextResponse(null, { status: 204 });
}
