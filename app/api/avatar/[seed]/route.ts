import { NextRequest, NextResponse } from 'next/server';

/**
 * Avatar proxy API — serves DiceBear avatars through Vercel's Edge Cache.
 *
 * This eliminates 50+ direct DiceBear HTTP requests on community pages
 * by running all avatar fetches through a single cached endpoint.
 *
 * GET /api/avatar/:seed?style=initials
 *
 * Caching:
 *   - Browser:  30 days (max-age=2592000)
 *   - CDN:      30 days (s-maxage=2592000), stale-while-revalidate 1 day
 *   - Edge:     30 days (CDN-Cache-Control for Vercel)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ seed: string }> }
) {
  const { seed } = await params;
  const { searchParams } = new URL(request.url);
  const style = searchParams.get('style') ?? 'initials';

  // Validate style to prevent abuse — only allow known DiceBear styles
  const allowedStyles = new Set([
    'initials', 'avataaars', 'bottts', 'croodles', 'dylan',
    'fun-emoji', 'identicon', 'lorelei', 'micah', 'miniavs',
    'notionists', 'open-peeps', 'personas', 'pixel-art', 'rings',
    'shapes', 'thumbs',
  ]);
  const safeStyle = allowedStyles.has(style) ? style : 'initials';

  const diceBearUrl = `https://api.dicebear.com/9.x/${encodeURIComponent(safeStyle)}/svg?seed=${encodeURIComponent(seed)}`;

  try {
    const res = await fetch(diceBearUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Avatar fetch failed' },
        { status: res.status }
      );
    }

    const svg = await res.text();

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control':
          'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, max-age=2592000',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Avatar fetch failed' },
      { status: 502 }
    );
  }
}
