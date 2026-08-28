import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';
import { landingPageSchema } from '@/lib/ai/schemas';
import type { Block } from '@/lib/pages/blocks';
import { LandingPageStatus } from '@/lib/generated/prisma/client';

const bodySchema = z.object({
  output: landingPageSchema,
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

function makeBlockId(prefix: string, index: number) {
  return `${prefix}-${index}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Creates a draft LandingPage from an AI-generated "landing-page" kind output,
 * mapping it onto the block schema used by the drag-and-drop page builder
 * (lib/pages/blocks.ts): a hero, a features block from the feature sections,
 * an FAQ block, and a closing CTA block.
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

    const { output } = parsed.data;

    const blocks: Block[] = [
      {
        id: makeBlockId('hero', 0),
        type: 'hero',
        props: {
          headline: output.headline,
          subheadline: output.subheadline,
          primaryCta: { label: output.ctaText, href: '#' },
        },
      },
    ];

    if (output.featureSections.length > 0) {
      blocks.push({
        id: makeBlockId('features', 1),
        type: 'features',
        props: {
          heading: 'Features',
          items: output.featureSections.map((s) => ({ title: s.title, description: s.body })),
        },
      });
    }

    if (output.faqItems.length > 0) {
      blocks.push({
        id: makeBlockId('faq', 2),
        type: 'faq',
        props: {
          heading: 'Frequently asked questions',
          items: output.faqItems,
        },
      });
    }

    blocks.push({
      id: makeBlockId('cta', 3),
      type: 'cta',
      props: {
        heading: output.ctaText,
        button: { label: output.ctaText, href: '#' },
      },
    });

    const baseSlug = slugify(output.headline) || `ai-landing-page-${Date.now()}`;
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.landingPage.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const page = await prisma.landingPage.create({
      data: {
        slug,
        title: output.headline,
        status: LandingPageStatus.DRAFT,
        blocks: blocks as unknown as object,
      },
    });

    return NextResponse.json({ page }, { status: 201 });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[POST /api/admin/ai/apply-landing-page]', err);
      return NextResponse.json({ error: 'Failed to create draft landing page' }, { status: 500 });
    }
  }
}
