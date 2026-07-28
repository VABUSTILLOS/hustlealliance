import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log for now — pipe to your analytics service (e.g. Vercel Analytics, PostHog, etc.)
    console.log('[Web Vitals]', JSON.stringify(body));

    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
