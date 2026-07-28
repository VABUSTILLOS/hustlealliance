// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
// Returns hardcoded mock user profile for client-side auth
import { NextResponse } from 'next/server';
import { MOCK_USER } from '@/lib/auth/mock';

export async function GET() {
  return NextResponse.json(
    {
      user: {
        id: MOCK_USER.id,
        email: MOCK_USER.email,
        name: MOCK_USER.name,
        role: MOCK_USER.role,
        membershipTier: MOCK_USER.membershipTier,
        avatar: MOCK_USER.avatar,
        membershipExpiresAt: null,
        bio: 'Mock development user',
        createdAt: new Date().toISOString(),
        stripeCustomerId: null,
      },
    },
    { headers: { 'Cache-Control': 'private, no-cache' } }
  );
}
