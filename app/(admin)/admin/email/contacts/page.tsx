'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';

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
  tags: string[];
  emailUnsubscribed: boolean;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [tierFilter, setTierFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number; updated: number; skipped: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const buildFilter = useCallback(() => {
    const filter: { tiers?: string[]; tags?: string[] } = {};
    if (tierFilter) filter.tiers = [tierFilter];
    if (tagFilter.trim()) filter.tags = tagFilter.split(',').map((t) => t.trim()).filter(Boolean);
    return filter;
  }, [tierFilter, tagFilter]);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ segmentFilter: JSON.stringify(buildFilter()) });
    fetch(`/api/admin/email/contacts?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setContacts(data.contacts || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [buildFilter]);

  useEffect(load, [load]);

  const exportCsv = () => {
    const params = new URLSearchParams({ segmentFilter: JSON.stringify(buildFilter()) });
    window.open(`/api/admin/email/contacts/export?${params}`, '_blank');
  };

  const importCsv = async (file: File) => {
    setImporting(true);
    setImportResult(null);
    try {
      const text = await file.text();
      const res = await fetch('/api/admin/email/contacts/import', {
        method: 'POST',
        headers: { 'Content-Type': 'text/csv' },
        body: text,
      });
      const data = await res.json();
      setImportResult(data);
      load();
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Contacts</h1>
      <p className="text-muted text-sm mb-8">{total} users match this segment.</p>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
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
        <input
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          placeholder="Filter by tags (comma-separated, must have all)"
          className="px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm min-w-[280px]"
        />
        <div className="flex-1" />
        <button onClick={exportCsv} className="px-4 py-2 bg-surface-light rounded-xl text-sm text-foreground hover:opacity-90">
          Export CSV
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
          className="px-4 py-2 bg-surface-light rounded-xl text-sm text-foreground hover:opacity-90 disabled:opacity-50"
        >
          {importing ? 'Importing…' : 'Import CSV'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])}
        />
      </div>

      {importResult && (
        <p className="text-xs text-muted mb-4">
          Import complete: {importResult.created} created, {importResult.updated} updated, {importResult.skipped} skipped.
        </p>
      )}

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : (
        <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-light text-left text-muted">
                <th className="p-4">Name</th>
                <th className="p-4">Tier</th>
                <th className="p-4">Tags</th>
                <th className="p-4">Enrollments</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Last active</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-b border-surface-light last:border-0 hover:bg-surface-light/50">
                  <td className="p-4 text-foreground">
                    <Link href={`/admin/email/contacts/${c.id}`} className="hover:underline">
                      {c.name}
                    </Link>
                    <p className="text-muted text-xs">
                      {c.email}
                      {c.emailUnsubscribed && <span className="ml-2 text-red-400">(unsubscribed)</span>}
                    </p>
                  </td>
                  <td className="p-4 text-foreground">{c.membershipTier}</td>
                  <td className="p-4 text-foreground">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.slice(0, 3).map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-surface-light rounded-full text-xs">
                          {t}
                        </span>
                      ))}
                      {c.tags.length > 3 && <span className="text-muted text-xs">+{c.tags.length - 3}</span>}
                    </div>
                  </td>
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
