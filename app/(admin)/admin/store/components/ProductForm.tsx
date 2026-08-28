'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type ProductFormValue = {
  title: string;
  slug: string;
  description: string;
  type: string;
  price: number;
  compareAt: number | null;
  currency: string;
  images: string[];
  stock: number;
  isPublished: boolean;
  stripePriceId: string;
  recurringInterval: string;
  trialDays: number | null;
  upsellProductId: string;
  bundleItems: { productId: string; quantity: number }[];
  courseId: string; // for type=COURSE, stored in metadata
  sessionCount: number; // for type=COACHING, stored in metadata
  sessionDurationMinutes: number; // for type=COACHING, stored in metadata
};

const EMPTY_FORM: ProductFormValue = {
  title: '',
  slug: '',
  description: '',
  type: 'DIGITAL',
  price: 0,
  compareAt: null,
  currency: 'USD',
  images: [],
  stock: 0,
  isPublished: false,
  stripePriceId: '',
  recurringInterval: '',
  trialDays: null,
  upsellProductId: '',
  bundleItems: [],
  courseId: '',
  sessionCount: 1,
  sessionDurationMinutes: 60,
};

type PickerProduct = { id: string; title: string; slug: string; price: number };
type PickerCourse = { id: string; title: string };

export function ProductForm({
  initial,
  productId,
}: {
  initial?: Partial<ProductFormValue>;
  productId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValue>({ ...EMPTY_FORM, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [allProducts, setAllProducts] = useState<PickerProduct[]>([]);
  const [courses, setCourses] = useState<PickerCourse[]>([]);

  useEffect(() => {
    fetch('/api/admin/products?limit=100')
      .then((r) => r.json())
      .then((data) => setAllProducts((data.products || []).filter((p: { id?: string }) => p.id !== productId)))
      .catch(() => {});
    fetch('/api/admin/courses?limit=200')
      .then((r) => r.json())
      .then((data) => setCourses(data.courses || []))
      .catch(() => {});
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleImagesChange = (value: string) => {
    setForm((prev) => ({ ...prev, images: value.split(',').map((s) => s.trim()).filter(Boolean) }));
  };

  const addBundleItem = () => {
    if (allProducts.length === 0) return;
    setForm((prev) => ({
      ...prev,
      bundleItems: [...prev.bundleItems, { productId: allProducts[0].id, quantity: 1 }],
    }));
  };

  const updateBundleItem = (idx: number, patch: Partial<{ productId: string; quantity: number }>) => {
    setForm((prev) => ({
      ...prev,
      bundleItems: prev.bundleItems.map((b, i) => (i === idx ? { ...b, ...patch } : b)),
    }));
  };

  const removeBundleItem = (idx: number) => {
    setForm((prev) => ({ ...prev, bundleItems: prev.bundleItems.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.description) return;
    setSaving(true);
    setError('');

    const metadata: Record<string, unknown> = {};
    if (form.type === 'COURSE' && form.courseId) metadata.courseId = form.courseId;
    if (form.type === 'COACHING') {
      metadata.sessionCount = form.sessionCount;
      metadata.sessionDurationMinutes = form.sessionDurationMinutes;
    }

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      type: form.type,
      price: form.price,
      compareAt: form.compareAt || null,
      currency: form.currency,
      images: form.images,
      stock: form.stock,
      isPublished: form.isPublished,
      metadata,
      stripePriceId: form.stripePriceId || null,
      recurringInterval: form.type === 'MEMBERSHIP' ? (form.recurringInterval || null) : null,
      trialDays: form.type === 'MEMBERSHIP' && form.trialDays ? form.trialDays : null,
      upsellProductId: form.upsellProductId || null,
      bundleItems: form.type === 'BUNDLE' ? form.bundleItems : [],
    };

    try {
      const res = await fetch(productId ? `/api/admin/products/${productId}` : '/api/admin/products', {
        method: productId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }
      router.push('/admin/store');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-3 bg-red-400/10 text-red-400 rounded-xl text-sm">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Slug</label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
          className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
          >
            <option value="DIGITAL">Digital</option>
            <option value="PHYSICAL">Physical</option>
            <option value="COURSE">Course</option>
            <option value="MEMBERSHIP">Membership</option>
            <option value="BUNDLE">Bundle</option>
            <option value="COACHING">Coaching</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Currency</label>
          <input
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">Price</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Compare-at price</label>
          <input
            type="number"
            step="0.01"
            name="compareAt"
            value={form.compareAt ?? ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Stock</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">Images (comma-separated URLs)</label>
        <input
          value={form.images.join(', ')}
          onChange={(e) => handleImagesChange(e.target.value)}
          className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">Stripe Price ID (optional)</label>
          <input
            name="stripePriceId"
            value={form.stripePriceId}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">Order bump / upsell product</label>
          <select
            name="upsellProductId"
            value={form.upsellProductId}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
          >
            <option value="">None</option>
            {allProducts.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {form.type === 'MEMBERSHIP' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Recurring interval</label>
            <select
              name="recurringInterval"
              value={form.recurringInterval}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
            >
              <option value="">One-time (not recurring)</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Free trial (days)</label>
            <input
              type="number"
              min={0}
              name="trialDays"
              value={form.trialDays ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, trialDays: e.target.value ? Number(e.target.value) : null }))}
              placeholder="0"
              className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      )}

      {form.type === 'COURSE' && (
        <div>
          <label className="block text-sm text-muted mb-1.5">Linked course</label>
          <select
            name="courseId"
            value={form.courseId}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
          >
            <option value="">Select a course…</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      )}

      {form.type === 'COACHING' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Session count</label>
            <input
              type="number"
              name="sessionCount"
              value={form.sessionCount}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Session duration (minutes)</label>
            <input
              type="number"
              name="sessionDurationMinutes"
              value={form.sessionDurationMinutes}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      )}

      {form.type === 'BUNDLE' && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm text-muted">Bundle items</label>
            <button
              type="button"
              onClick={addBundleItem}
              className="text-xs text-accent hover:underline"
            >
              + Add item
            </button>
          </div>
          <div className="space-y-2">
            {form.bundleItems.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <select
                  value={item.productId}
                  onChange={(e) => updateBundleItem(idx, { productId: e.target.value })}
                  className="flex-1 px-3 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
                >
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateBundleItem(idx, { quantity: Number(e.target.value) })}
                  className="w-20 px-3 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => removeBundleItem(idx)}
                  className="px-3 py-2 text-xs text-red-400 bg-red-400/10 rounded-lg hover:bg-red-400/20"
                >
                  Remove
                </button>
              </div>
            ))}
            {form.bundleItems.length === 0 && (
              <p className="text-xs text-muted">No items yet — add products or courses to include.</p>
            )}
          </div>
        </div>
      )}

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isPublished"
          checked={form.isPublished}
          onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
        />
        <span className="text-sm text-foreground">Published</span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Product'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/store')}
          className="px-6 py-2.5 bg-surface border border-surface-light text-foreground rounded-xl font-medium text-sm hover:bg-surface-light transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
