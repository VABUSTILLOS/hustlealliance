'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type LandingPageSummary = {
  id: string;
  slug: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const statusColors: Record<string, string> = {
  PUBLISHED: 'text-green-400 bg-green-400/10',
  DRAFT: 'text-yellow-400 bg-yellow-400/10',
  ARCHIVED: 'text-muted bg-surface-light',
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState<LandingPageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPages = useCallback(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (search) qs.set('search', search);
    if (statusFilter) qs.set('status', statusFilter);
    fetch(`/api/admin/pages?${qs}`)
      .then((r) => r.json())
      .then((data) => setPages(data.pages || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const handleDuplicate = async (id: string) => {
    const res = await fetch(`/api/admin/pages/${id}/duplicate`, { method: 'POST' });
    if (res.ok) fetchPages();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
    fetchPages();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Landing Pages</h1>
          <p className="text-muted text-sm mt-1">{pages.length} page{pages.length === 1 ? '' : 's'}</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="px-4 py-2.5 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
        >
          New Page
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by title or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-surface-light rounded-xl text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-surface-light rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : pages.length === 0 ? (
        <p className="text-muted text-sm">No landing pages yet.</p>
      ) : (
        <div className="rounded-2xl bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border/50">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b border-border/30 last:border-0">
                  <td className="px-4 py-3 text-foreground font-medium">{page.title}</td>
                  <td className="px-4 py-3 text-muted font-mono text-xs">/p/{page.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[page.status]}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <Link
                      href={`/admin/pages/${page.id}/edit`}
                      className="text-accent hover:underline text-xs font-medium"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/pages/${page.id}/funnel`}
                      className="text-muted hover:text-foreground text-xs font-medium"
                    >
                      Funnel
                    </Link>
                    <button
                      onClick={() => handleDuplicate(page.id)}
                      className="text-muted hover:text-foreground text-xs font-medium"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleDelete(page.id, page.title)}
                      className="text-red-400 hover:text-red-300 text-xs font-medium"
                    >
                      Delete
                    </button>
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
