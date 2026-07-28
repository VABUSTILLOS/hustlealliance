// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
// Bypass: always allow drip content during development
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { allowed: true },
    { headers: { 'Cache-Control': 'private, max-age=30' } }
  );
}
