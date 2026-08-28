'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Campaign = {
  id: string;
  name: string;
  subject: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT';
  createdAt: string;
  sentAt: string | null;
  stats: { total: number; sent: number; opened: number; clicked: number; bounced: number; failed: number };
};

const statusColors: Record<string, string> = {
  DRAFT: 'bg-surface-light text-muted',
  SCHEDULED: 'bg-blue-500/20 text-blue-400',
  SENDING: 'bg-yellow-500/20 text-yellow-400',
  SENT: 'bg-green-500/20 text-green-400',
};

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/email/campaigns')
      .then((r) => r.json())
      .then((data) => setCampaigns(data.campaigns || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Email Campaigns</h1>
          <p className="text-muted text-sm">Broadcast emails to segments of your users.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/admin/email/automations"
            className="px-4 py-2 bg-surface border border-surface-light rounded-xl text-sm text-foreground hover:border-accent transition"
          >
            Automations
          </Link>
          <Link
            href="/admin/email/referrals"
            className="px-4 py-2 bg-surface border border-surface-light rounded-xl text-sm text-foreground hover:border-accent transition"
          >
            Referrals
          </Link>
          <Link
            href="/admin/email/contacts"
            className="px-4 py-2 bg-surface border border-surface-light rounded-xl text-sm text-foreground hover:border-accent transition"
          >
            Contacts
          </Link>
          <Link
            href="/admin/email/compose"
            className="px-4 py-2 bg-accent rounded-xl text-sm text-white font-medium hover:opacity-90 transition"
          >
            + New Campaign
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : campaigns.length === 0 ? (
        <p className="text-muted text-sm">No campaigns yet. Create your first one.</p>
      ) : (
        <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-light text-left text-muted">
                <th className="p-4">Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Recipients</th>
                <th className="p-4">Opened</th>
                <th className="p-4">Clicked</th>
                <th className="p-4">Sent</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-surface-light last:border-0">
                  <td className="p-4">
                    <Link href={`/admin/email/compose?id=${c.id}`} className="text-foreground hover:text-accent font-medium">
                      {c.name}
                    </Link>
                    <p className="text-muted text-xs mt-1">{c.subject}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="p-4 text-foreground">{c.stats.total}</td>
                  <td className="p-4 text-foreground">{c.stats.opened}</td>
                  <td className="p-4 text-foreground">{c.stats.clicked}</td>
                  <td className="p-4 text-muted text-xs">{c.sentAt ? new Date(c.sentAt).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
