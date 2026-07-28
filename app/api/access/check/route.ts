// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
// Bypass: always grant access during development
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  return NextResponse.json(
    { allowed: true, reason: 'tier_granted' },
    {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    }
  );
}
