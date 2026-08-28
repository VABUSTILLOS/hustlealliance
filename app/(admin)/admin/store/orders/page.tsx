'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
  items: { id: string }[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  PAID: 'text-green-400 bg-green-400/10',
  FULFILLED: 'text-blue-400 bg-blue-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
  REFUNDED: 'text-gray-400 bg-gray-400/10',
};

export default function AdminStoreOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);

    fetch(`/api/admin/store/orders?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || []);
        setTotal(data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Store Orders</h1>
          <p className="text-muted text-sm mt-1">{total} order{total !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/store"
          className="px-4 py-2.5 bg-surface border border-surface-light text-foreground rounded-xl font-medium text-sm hover:bg-surface-light transition-colors"
        >
          Products
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name or email…"
          className="flex-1 px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FULFILLED">Fulfilled</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-light text-left text-muted">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">Loading…</td>
              </tr>
            )}
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">No orders yet.</td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-surface-light last:border-0 hover:bg-surface-light/50">
                <td className="px-4 py-3">
                  <Link href={`/admin/store/orders/${order.id}`} className="block text-foreground hover:text-accent">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/store/orders/${order.id}`} className="block text-foreground hover:text-accent">
                    {order.user?.email ?? 'Unknown'}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{order.items.length}</td>
                <td className="px-4 py-3 text-foreground">
                  ${order.totalAmount.toFixed(2)} {order.currency}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'text-muted bg-surface-light'}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
