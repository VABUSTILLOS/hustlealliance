'use client';

import { useEffect, useState, useCallback } from 'react';

type Contact = {
  id: string;
  name: string;
  email: string;
  role: string;
  membershipTier: string;
  createdAt: string;
  lastActiveAt: string | null;
  enrollmentCount: number;
  orderCount: number;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [tierFilter, setTierFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const filter = tierFilter ? { tiers: [tierFilter] } : {};
    const params = new URLSearchParams({ segmentFilter: JSON.stringify(filter) });
    fetch(`/api/admin/email/contacts?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setContacts(data.contacts || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [tierFilter]);

  useEffect(load, [load]);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Contacts</h1>
      <p className="text-muted text-sm mb-8">{total} users match this segment.</p>

      <div className="flex gap-2 mb-6">
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm"
        >
          <option value="">All tiers</option>
          <option value="FREE">Free</option>
          <option value="BASIC">Basic</option>
          <option value="PRO">Pro</option>
        </select>
      </div>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : (
        <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-light text-left text-muted">
                <th className="p-4">Name</th>
                <th className="p-4">Tier</th>
                <th className="p-4">Enrollments</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Last active</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-b border-surface-light last:border-0">
                  <td className="p-4 text-foreground">{c.name}<p className="text-muted text-xs">{c.email}</p></td>
                  <td className="p-4 text-foreground">{c.membershipTier}</td>
                  <td className="p-4 text-foreground">{c.enrollmentCount}</td>
                  <td className="p-4 text-foreground">{c.orderCount}</td>
                  <td className="p-4 text-muted text-xs">{c.lastActiveAt ? new Date(c.lastActiveAt).toLocaleDateString() : '—'}</td>
                  <td className="p-4 text-muted text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
