import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@/lib/generated/prisma/client';
import { safeParsePageDocument } from '@/lib/pages/blocks';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'page';
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search')?.trim();
    const status = searchParams.get('status');

    const pages = await prisma.landingPage.findMany({
      where: {
        ...(status ? { status: status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ pages });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[GET /api/admin/pages]', err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json().catch(() => ({}));
    const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim() : 'Untitled Page';

    let slug = typeof body.slug === 'string' && body.slug.trim() ? slugify(body.slug) : slugify(title);
    // Ensure slug uniqueness by suffixing if needed.
    let attempt = slug;
    let n = 1;
    while (await prisma.landingPage.findUnique({ where: { slug: attempt } })) {
      attempt = `${slug}-${n++}`;
    }
    slug = attempt;

    const blocksResult = safeParsePageDocument(body.blocks ?? []);
    if (!blocksResult.success) {
      return NextResponse.json({ error: 'Invalid blocks', issues: blocksResult.error.issues }, { status: 400 });
    }

    const page = await prisma.landingPage.create({
      data: {
        title,
        slug,
        status: 'DRAFT',
        blocks: blocksResult.data as unknown as Prisma.InputJsonValue,
        seo: (body.seo ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });

    return NextResponse.json({ page }, { status: 201 });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[POST /api/admin/pages]', err);
      return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
    }
  }
}
