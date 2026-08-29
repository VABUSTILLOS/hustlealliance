import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const perPage = 50;

    const where = entity ? { entity } : {};
    const [items, total] = await Promise.all([
      prisma.adminActivity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        include: { actor: { select: { name: true, email: true } } },
      }),
      prisma.adminActivity.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, perPage });
  } catch (err) {
    return authErrorResponse(err);
  }
}
