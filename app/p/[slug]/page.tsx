import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db/prisma';
import { safeParsePageDocument, type Block, type Seo, type Theme } from '@/lib/pages/blocks';
import { PageBody } from '@/lib/pages/components/blocks';
import PageTracker from '@/app/components/page-tracker';
import { getSetting } from '@/lib/settings';
import { getCurrentUser } from '@/lib/auth/user';

type MaintenanceMode = { enabled: boolean; message: string };

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

  // Maintenance mode: public visitors see a notice; admins bypass.
  const maintenance = await getSetting<MaintenanceMode>('maintenanceMode', { enabled: false, message: '' });
  if (maintenance?.enabled) {
    const user = await getCurrentUser().catch(() => null);
    if (user?.role !== 'ADMIN') {
      return (
        <main className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">We&apos;ll be right back</h1>
            <p className="text-muted">{maintenance.message || 'This page is temporarily unavailable while we make improvements.'}</p>
          </div>
        </main>
      );
    }
  }

  const result = safeParsePageDocument(page.blocks);
  const blocks = result.success ? result.data : [];
  const theme = (page.theme as Theme) || {};

  const [headerRaw, footerRaw, analyticsSnippet] = await Promise.all([
    getSetting<unknown>('globalHeader', []),
    getSetting<unknown>('globalFooter', []),
    getSetting<{ snippet?: string }>('analyticsSnippet', { snippet: '' }),
  ]);
  const headerParsed = safeParsePageDocument(headerRaw);
  const footerParsed = safeParsePageDocument(footerRaw);
  const headerBlocks: Block[] = headerParsed.success ? headerParsed.data : [];
  const footerBlocks: Block[] = footerParsed.success ? footerParsed.data : [];

  return (
    <main className="min-h-screen bg-background">
      {theme.headCode ? <div dangerouslySetInnerHTML={{ __html: theme.headCode }} /> : null}
      {analyticsSnippet?.snippet ? (
        <div dangerouslySetInnerHTML={{ __html: analyticsSnippet.snippet }} />
      ) : null}
      <PageTracker path={`/p/${slug}`} landingPageId={page.id} />
      {headerBlocks.length > 0 && <PageBody blocks={headerBlocks} />}
      <PageBody blocks={blocks} />
      {footerBlocks.length > 0 && <PageBody blocks={footerBlocks} />}
      {theme.bodyCode ? <div dangerouslySetInnerHTML={{ __html: theme.bodyCode }} /> : null}
    </main>
  );
}
