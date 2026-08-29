import { NextResponse } from 'next/server';

// GET /api/push/vapid-key — public VAPID public key for the browser to subscribe.
// Returns enabled:false when Web Push isn't configured so the client stays quiet.
export async function GET() {
  const key = process.env.VAPID_PUBLIC_KEY;
  if (!key) {
    return NextResponse.json({ enabled: false, key: null });
  }
  return NextResponse.json({ enabled: true, key });
}
