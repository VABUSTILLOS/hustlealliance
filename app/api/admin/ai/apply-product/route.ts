import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';
import { ProductType } from '@/lib/generated/prisma/client';

const bodySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative().optional(),
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

/**
 * Creates a draft (unpublished) DIGITAL Product from AI-generated
 * product-description / business-idea output.
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, price } = parsed.data;

    const baseSlug = slugify(title) || `ai-product-${Date.now()}`;
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        type: ProductType.DIGITAL,
        price: price ?? 0,
        isPublished: false,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[POST /api/admin/ai/apply-product]', err);
      return NextResponse.json({ error: 'Failed to create draft product' }, { status: 500 });
    }
  }
}
