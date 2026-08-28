'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Broadcast = {
  id: string;
  name: string;
  subject: string;
  channels: ('EMAIL' | 'IN_APP' | 'FEED')[];
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';
  scheduledAt: string | null;
  sentAt: string | null;
  emailCount: number;
  inAppCount: number;
  feedPostId: string | null;
  createdAt: string;
};

const statusColors: Record<string, string> = {
  DRAFT: 'bg-surface-light text-muted',
  SCHEDULED: 'bg-blue-500/20 text-blue-400',
  SENDING: 'bg-yellow-500/20 text-yellow-400',
  SENT: 'bg-green-500/20 text-green-400',
  FAILED: 'bg-red-500/20 text-red-400',
};

const channelLabels: Record<string, string> = {
  EMAIL: 'Email',
  IN_APP: 'In-app',
  FEED: 'Feed',
};

export default function BroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [duplicating, setDuplicating] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/broadcasts')
      .then((r) => r.json())
      .then((data) => setBroadcasts(data.broadcasts || []))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  async function handleDuplicate(id: string) {
    setDuplicating(id);
    try {
      const res = await fetch(`/api/admin/broadcasts/${id}/duplicate`, { method: 'POST' });
      if (!res.ok) throw new Error((await res.json()).error || 'Duplicate failed');
      load();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setDuplicating(null);
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Magic Reach</h1>
          <p className="text-muted text-sm">Broadcast a message across email, in-app notifications, and the feed.</p>
        </div>
        <Link
          href="/admin/broadcasts/new"
          className="px-4 py-2 bg-accent rounded-xl text-sm text-white font-medium hover:opacity-90 transition"
        >
          + New broadcast
        </Link>
      </div>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : broadcasts.length === 0 ? (
        <p className="text-muted text-sm">No broadcasts yet. Create your first one.</p>
      ) : (
        <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-light text-left text-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Channels</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Sent / Scheduled</th>
                <th className="px-4 py-3 font-medium">Counts</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {broadcasts.map((b) => (
                <tr key={b.id} className="border-b border-surface-light last:border-0 hover:bg-surface-light/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/broadcasts/${b.id}`} className="text-foreground hover:text-accent font-medium">
                      {b.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{b.subject}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {b.channels.map((c) => (
                        <span key={c} className="px-2 py-0.5 bg-surface-light rounded-lg text-xs text-muted">
                          {channelLabels[c] ?? c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[b.status] ?? ''}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {b.sentAt
                      ? `Sent ${new Date(b.sentAt).toLocaleString()}`
                      : b.scheduledAt
                        ? `Scheduled ${new Date(b.scheduledAt).toLocaleString()}`
                        : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {b.emailCount > 0 && <div>Email: {b.emailCount}</div>}
                    {b.inAppCount > 0 && <div>In-app: {b.inAppCount}</div>}
                    {b.feedPostId && <div>Feed: posted</div>}
                    {!b.emailCount && !b.inAppCount && !b.feedPostId && '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDuplicate(b.id)}
                      disabled={duplicating === b.id}
                      className="px-3 py-1.5 rounded-lg border border-surface-light text-xs text-muted hover:text-foreground hover:border-accent/50 transition disabled:opacity-50"
                    >
                      {duplicating === b.id ? 'Duplicating…' : 'Duplicate'}
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
