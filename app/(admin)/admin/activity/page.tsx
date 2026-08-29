'use client';

import { useCallback, useEffect, useState } from 'react';

type ActivityItem = {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  meta: Record<string, unknown> | null;
  createdAt: string;
  actor: { name: string | null; email: string } | null;
};

const ENTITIES = ['', 'Product', 'LandingPage', 'EmailCampaign', 'EmailAutomation', 'StoreOrder', 'AffiliatePayout'];

export default function AdminActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [entity, setEntity] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (entity) params.set('entity', entity);
    const res = await fetch(`/api/admin/activity?${params}`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
      setTotal(data.total);
    }
    setLoading(false);
  }, [page, entity]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / 50));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <select
          value={entity}
          onChange={(e) => { setEntity(e.target.value); setPage(1); }}
          className="border rounded px-3 py-2 text-sm bg-white dark:bg-zinc-900"
        >
          {ENTITIES.map((e) => (
            <option key={e} value={e}>{e || 'All entities'}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-500">No activity recorded yet.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">When</th>
                <th className="px-4 py-2 font-medium">Actor</th>
                <th className="px-4 py-2 font-medium">Action</th>
                <th className="px-4 py-2 font-medium">Entity</th>
                <th className="px-4 py-2 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-800">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-zinc-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{item.actor?.name || item.actor?.email || '—'}</td>
                  <td className="px-4 py-2">
                    <code className="text-xs bg-zinc-100 dark:bg-zinc-800 rounded px-1.5 py-0.5">{item.action}</code>
                  </td>
                  <td className="px-4 py-2">
                    {item.entity}
                    {item.entityId && <span className="text-zinc-400 text-xs ml-1">({item.entityId.slice(0, 8)}…)</span>}
                  </td>
                  <td className="px-4 py-2 text-xs text-zinc-500 max-w-xs truncate">
                    {item.meta ? JSON.stringify(item.meta) : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center gap-3 mt-4 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-zinc-500">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
