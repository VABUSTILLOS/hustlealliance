'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Product = {
  id: string;
  title: string;
  slug: string;
  type: string;
  price: number;
  compareAt: number | null;
  isPublished: boolean;
  stock: number;
  createdAt: string;
  _count: { reviews: number; orders: number };
};

const TYPE_COLORS: Record<string, string> = {
  DIGITAL: 'text-blue-400 bg-blue-400/10',
  PHYSICAL: 'text-orange-400 bg-orange-400/10',
  COURSE: 'text-purple-400 bg-purple-400/10',
  MEMBERSHIP: 'text-pink-400 bg-pink-400/10',
  BUNDLE: 'text-cyan-400 bg-cyan-400/10',
  COACHING: 'text-yellow-400 bg-yellow-400/10',
};

export default function AdminStorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (typeFilter) params.set('type', typeFilter);

    fetch(`/api/admin/products?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [search, typeFilter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Store Products</h1>
          <p className="text-muted text-sm mt-1">{total} product{total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/store/orders"
            className="px-4 py-2.5 bg-surface border border-surface-light text-foreground rounded-xl font-medium text-sm hover:bg-surface-light transition-colors"
          >
            Orders
          </Link>
          <Link
            href="/admin/store/coupons"
            className="px-4 py-2.5 bg-surface border border-surface-light text-foreground rounded-xl font-medium text-sm hover:bg-surface-light transition-colors"
          >
            Coupons
          </Link>
          <Link
            href="/admin/store/new"
            className="px-4 py-2.5 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
          >
            New Product
          </Link>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-xs px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
        >
          <option value="">All types</option>
          <option value="DIGITAL">Digital</option>
          <option value="PHYSICAL">Physical</option>
          <option value="COURSE">Course</option>
          <option value="MEMBERSHIP">Membership</option>
          <option value="BUNDLE">Bundle</option>
          <option value="COACHING">Coaching</option>
        </select>
      </div>

      {loading ? (
        <div className="glass-card p-8 text-center text-muted">Loading…</div>
      ) : products.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted">No products found.</div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-light text-left text-muted">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-surface-light last:border-0">
                  <td className="px-4 py-3 text-foreground font-medium">{p.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[p.type] || 'text-muted bg-surface-light'}`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    ${p.price.toFixed(2)}
                    {p.compareAt && p.compareAt > p.price && (
                      <span className="text-muted line-through ml-1 text-xs">${p.compareAt.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.isPublished ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                      {p.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{p._count?.orders ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/store/${p.id}`}
                        className="px-3 py-1.5 text-xs font-medium text-foreground bg-surface-light rounded-lg hover:bg-surface-light/70 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-400/10 rounded-lg hover:bg-red-400/20 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
