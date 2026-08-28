'use client';

import { useState, useEffect, use } from 'react';
import { ProductForm, type ProductFormValue } from '../components/ProductForm';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initial, setInitial] = useState<Partial<ProductFormValue> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const p = data.product;
        if (!p) return;
        const metadata = (p.metadata as Record<string, unknown> | null) ?? {};
        setInitial({
          title: p.title,
          slug: p.slug,
          description: p.description,
          type: p.type,
          price: p.price,
          compareAt: p.compareAt,
          currency: p.currency,
          images: p.images ?? [],
          stock: p.stock,
          isPublished: p.isPublished,
          stripePriceId: p.stripePriceId ?? '',
          recurringInterval: p.recurringInterval ?? '',
          trialDays: p.trialDays ?? null,
          upsellProductId: p.upsellProductId ?? '',
          bundleItems: (p.bundleItems ?? []).map((b: { productId: string; quantity: number }) => ({
            productId: b.productId,
            quantity: b.quantity,
          })),
          courseId: typeof metadata.courseId === 'string' ? metadata.courseId : '',
          sessionCount: typeof metadata.sessionCount === 'number' ? metadata.sessionCount : 1,
          sessionDurationMinutes:
            typeof metadata.sessionDurationMinutes === 'number' ? metadata.sessionDurationMinutes : 60,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-8">Edit Product</h1>
      {loading ? (
        <div className="glass-card p-8 text-center text-muted">Loading…</div>
      ) : initial ? (
        <ProductForm initial={initial} productId={id} />
      ) : (
        <div className="glass-card p-8 text-center text-muted">Product not found.</div>
      )}
    </div>
  );
}
