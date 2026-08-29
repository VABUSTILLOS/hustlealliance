import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { getSetting, setSetting } from '@/lib/settings';
import { safeParsePageDocument, type Block } from '@/lib/pages/blocks';

/**
 * Global header/footer block trees rendered on every published landing page.
 * Stored in SiteSetting under `globalHeader` / `globalFooter`.
 */
export async function GET() {
  try {
    await requireAdmin();
    const [header, footer] = await Promise.all([
      getSetting<Block[]>('globalHeader', []),
      getSetting<Block[]>('globalFooter', []),
    ]);
    return NextResponse.json({ header, footer });
  } catch (err) {
    return authErrorResponse(err);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json().catch(() => ({}));

    for (const key of ['header', 'footer'] as const) {
      if (body[key] === undefined) continue;
      const result = safeParsePageDocument(body[key]);
      if (!result.success) {
        return NextResponse.json(
          { error: `Invalid ${key} blocks`, issues: result.error.issues },
          { status: 400 }
        );
      }
      await setSetting(key === 'header' ? 'globalHeader' : 'globalFooter', result.data);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return authErrorResponse(err);
  }
}
