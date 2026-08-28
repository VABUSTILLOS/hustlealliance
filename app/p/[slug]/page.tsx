import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db/prisma';
import { safeParsePageDocument, type Seo } from '@/lib/pages/blocks';
import { PageBody } from '@/lib/pages/components/blocks';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPublishedPage(slug: string) {
  const page = await prisma.landingPage.findUnique({ where: { slug } });
  if (!page || page.status !== 'PUBLISHED') return null;
  return page;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) return {};

  const seo = (page.seo as Seo) || {};
  return {
    title: seo?.title || page.title,
    description: seo?.description || undefined,
    openGraph: {
      title: seo?.title || page.title,
      description: seo?.description || undefined,
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}

export default async function PublicLandingPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) notFound();

  const result = safeParsePageDocument(page.blocks);
  const blocks = result.success ? result.data : [];

  return (
    <main className="min-h-screen bg-background">
      <PageBody blocks={blocks} />
    </main>
  );
}
