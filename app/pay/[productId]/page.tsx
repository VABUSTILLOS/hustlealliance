import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db/prisma';
import { getServerT } from '@/lib/i18n/server';
import { interpolateMsg } from '@/lib/i18n/getErrorMsg';
import PageTracker from '@/app/components/page-tracker';
import PayButton from './pay-button';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ coupon?: string; ref?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getServerT();
  const { productId } = await params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: productId }, { slug: productId }] },
    select: { title: true, description: true },
  });
  if (!product) return { title: t.pay.checkoutTitle };
  return {
    title: interpolateMsg(t.pay.buyTitle, { title: product.title }),
    description: product.description.slice(0, 160),
    robots: { index: false },
  };
}

export default async function PaymentLinkPage({ params, searchParams }: Props) {
  const { t } = await getServerT();
  const { productId } = await params;
  const { coupon, ref } = await searchParams;

  const product = await prisma.product.findFirst({
    where: { OR: [{ id: productId }, { slug: productId }], isPublished: true },
  });
  if (!product) notFound();

  const soldOut = product.trackStock && product.stock <= 0;
  const path = `/pay/${product.slug}`;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <PageTracker path={path} />
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 border border-border/40">
        {product.images?.[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover rounded-xl mb-6" />
        )}
        <h1 className="text-2xl font-heading font-bold text-foreground">{product.title}</h1>
        <p className="text-muted text-sm mt-2 line-clamp-4">{product.description}</p>

        <div className="flex items-baseline gap-2 mt-5">
          <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-muted line-through">${product.compareAt.toFixed(2)}</span>
          )}
          <span className="text-muted text-xs uppercase">{product.currency}</span>
        </div>

        {coupon && (
          <p className="mt-3 text-xs text-emerald-400">
            {interpolateMsg(t.pay.couponApplied, { code: coupon })}
          </p>
        )}

        {soldOut ? (
          <div className="mt-6 w-full py-3 rounded-xl bg-surface-light text-center text-muted font-medium">
            {t.pay.soldOut}
          </div>
        ) : (
          <PayButton
            productId={product.id}
            couponCode={coupon ?? null}
            referralCode={ref ?? null}
            path={path}
          />
        )}

        {product.trackStock && !soldOut && product.stock <= 5 && (
          <p className="mt-3 text-xs text-amber-400 text-center">
            {interpolateMsg(t.pay.onlyLeft, { n: product.stock })}
          </p>
        )}
      </div>
    </main>
  );
}
