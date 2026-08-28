import { NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';

/**
 * Returns the last 50 AiGeneration records for the AI Studio history panel.
 */
export async function GET() {
  try {
    await requireAdmin();

    const generations = await prisma.aiGeneration.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ generations });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[GET /api/admin/ai/history]', err);
      return NextResponse.json({ error: 'Failed to load AI generation history' }, { status: 500 });
    }
  }
}
