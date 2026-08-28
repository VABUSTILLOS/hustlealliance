'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type Segment = {
  tiers?: string[];
  roles?: string[];
  lastActiveDays?: number;
};

type Broadcast = {
  id: string;
  name: string;
  subject: string;
  body: string;
  channels: ('EMAIL' | 'IN_APP' | 'FEED')[];
  segmentFilter: Segment | null;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';
  scheduledAt: string | null;
  sentAt: string | null;
  emailCount: number;
  inAppCount: number;
  feedPostId: string | null;
};

const CHANNELS: { key: 'EMAIL' | 'IN_APP' | 'FEED'; label: string }[] = [
  { key: 'EMAIL', label: 'Email' },
  { key: 'IN_APP', label: 'In-app notification' },
  { key: 'FEED', label: 'Feed post' },
];

const TIERS = ['FREE', 'BASIC', 'PRO'];
const ROLES = ['STUDENT', 'INSTRUCTOR', 'ADMIN'];

export default function BroadcastComposer({ broadcastId }: { broadcastId?: string }) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [channels, setChannels] = useState<('EMAIL' | 'IN_APP' | 'FEED')[]>(['EMAIL']);
  const [segment, setSegment] = useState<Segment>({});
  const [status, setStatus] = useState<Broadcast['status']>('DRAFT');
  const [scheduledAt, setScheduledAt] = useState('');
  const [sentAt, setSentAt] = useState<string | null>(null);
  const [counts, setCounts] = useState({ emailCount: 0, inAppCount: 0, feedPostId: null as string | null });
  const [audienceCount, setAudienceCount] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!broadcastId);

  useEffect(() => {
    if (!broadcastId) return;
    fetch(`/api/admin/broadcasts/${broadcastId}`)
      .then((r) => r.json())
      .then((data) => {
        const b: Broadcast = data.broadcast;
        if (!b) return;
        setName(b.name);
        setSubject(b.subject);
        setBody(b.body);
        setChannels(b.channels);
        setSegment(b.segmentFilter || {});
        setStatus(b.status);
        setScheduledAt(b.scheduledAt ? b.scheduledAt.slice(0, 16) : '');
        setSentAt(b.sentAt);
        setCounts({ emailCount: b.emailCount, inAppCount: b.inAppCount, feedPostId: b.feedPostId });
      })
      .finally(() => setLoading(false));
  }, [broadcastId]);

  const refreshAudience = useCallback((seg: Segment) => {
    const params = new URLSearchParams();
    if (seg.tiers?.length) params.set('tiers', seg.tiers.join(','));
    if (seg.roles?.length) params.set('roles', seg.roles.join(','));
    if (seg.lastActiveDays) params.set('lastActiveDays', String(seg.lastActiveDays));
    fetch(`/api/admin/broadcasts/audience-count?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setAudienceCount(data.count ?? null))
      .catch(() => setAudienceCount(null));
  }, []);

  useEffect(() => {
    refreshAudience(segment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(segment)]);

  const isEditable = status === 'DRAFT' || status === 'SCHEDULED';

  const toggleChannel = (key: 'EMAIL' | 'IN_APP' | 'FEED') => {
    setChannels((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]));
  };

  const toggleTier = (tier: string) => {
    setSegment((s) => {
      const tiers = new Set(s.tiers || []);
      if (tiers.has(tier)) tiers.delete(tier);
      else tiers.add(tier);
      return { ...s, tiers: Array.from(tiers) };
    });
  };

  const toggleRole = (role: string) => {
    setSegment((s) => {
      const roles = new Set(s.roles || []);
      if (roles.has(role)) roles.delete(role);
      else roles.add(role);
      return { ...s, roles: Array.from(roles) };
    });
  };

  const save = async (): Promise<string | null> => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = { name, subject, body, channels, segmentFilter: segment };
      const res = broadcastId
        ? await fetch(`/api/admin/broadcasts/${broadcastId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/admin/broadcasts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      const id = data.broadcast?.id ?? broadcastId;
      if (!broadcastId && id) {
        router.replace(`/admin/broadcasts/${id}`);
      }
      setMessage('Saved.');
      return id ?? null;
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to save');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const saveDraft = () => { void save(); };

  const schedule = async () => {
    if (!scheduledAt) {
      setMessage('Choose a date/time to schedule.');
      return;
    }
    const id = await save();
    if (!id) return;
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/broadcasts/${id}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledAt: new Date(scheduledAt).toISOString() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule');
      setStatus('SCHEDULED');
      setMessage('Scheduled.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to schedule');
    }
  };

  const unschedule = async () => {
    if (!broadcastId) return;
    try {
      const res = await fetch(`/api/admin/broadcasts/${broadcastId}/unschedule`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to unschedule');
      setStatus('DRAFT');
      setMessage('Unscheduled — back to draft.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to unschedule');
    }
  };

  const sendNow = async () => {
    if (!confirm(`Send this broadcast now to ${audienceCount ?? 'the matching'} users across ${channels.join(', ')}?`)) return;
    const id = await save();
    if (!id) return;
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/broadcasts/${id}/send`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      const b: Broadcast = data.broadcast;
      setStatus(b.status);
      setSentAt(b.sentAt);
      setCounts({ emailCount: b.emailCount, inAppCount: b.inAppCount, feedPostId: b.feedPostId });
      setMessage(`Broadcast ${b.status.toLowerCase()}.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to send');
    }
  };

  if (loading) return <p className="text-muted text-sm">Loading…</p>;

  const isSent = status === 'SENT' || status === 'FAILED';

  return (
    <div className="max-w-3xl">
      <p className="text-muted text-sm mb-6">Status: {status}{sentAt ? ` · Sent ${new Date(sentAt).toLocaleString()}` : ''}</p>

      {message && (
        <div className="mb-4 px-4 py-2 bg-surface border border-surface-light rounded-xl text-sm text-foreground">
          {message}
        </div>
      )}

      {isSent && (
        <div className="mb-6 bg-surface border border-surface-light rounded-2xl p-4">
          <h3 className="text-sm font-medium text-foreground mb-2">Stats</h3>
          <div className="flex gap-6 text-sm text-muted">
            <div>Email delivered: {counts.emailCount}</div>
            <div>In-app notified: {counts.inAppCount}</div>
            <div>Feed post: {counts.feedPostId ? 'posted' : '—'}</div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-muted mb-1">Internal name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditable}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Subject / title</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={!isEditable}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Body</label>
          <p className="text-xs text-muted mb-1">HTML is supported for the email channel; plain text works for all channels.</p>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={!isEditable}
            rows={10}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm font-mono focus:outline-none focus:border-accent disabled:opacity-50"
          />
        </div>

        <div className="bg-surface border border-surface-light rounded-2xl p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Channels</h3>
          <div className="flex gap-2 flex-wrap">
            {CHANNELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleChannel(key)}
                disabled={!isEditable}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition disabled:opacity-50 ${
                  channels.includes(key)
                    ? 'bg-accent border-accent text-white'
                    : 'bg-surface-light border-surface-light text-muted hover:border-accent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-surface-light rounded-2xl p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Audience segment</h3>
          <div className="mb-3">
            <p className="text-xs text-muted mb-1">Tiers</p>
            <div className="flex gap-2 flex-wrap">
              {TIERS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => toggleTier(tier)}
                  disabled={!isEditable}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition disabled:opacity-50 ${
                    segment.tiers?.includes(tier)
                      ? 'bg-accent border-accent text-white'
                      : 'bg-surface-light border-surface-light text-muted hover:border-accent'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <p className="text-xs text-muted mb-1">Roles</p>
            <div className="flex gap-2 flex-wrap">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  disabled={!isEditable}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition disabled:opacity-50 ${
                    segment.roles?.includes(role)
                      ? 'bg-accent border-accent text-white'
                      : 'bg-surface-light border-surface-light text-muted hover:border-accent'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
          <label className="text-xs text-muted flex items-center gap-2">
            Active in last (days)
            <input
              type="number"
              min={0}
              disabled={!isEditable}
              value={segment.lastActiveDays ?? ''}
              onChange={(e) =>
                setSegment((s) => ({
                  ...s,
                  lastActiveDays: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-24 px-3 py-1.5 bg-surface-light border border-surface-light rounded-lg text-foreground text-xs focus:outline-none focus:border-accent disabled:opacity-50"
            />
          </label>
          <p className="text-xs text-muted mt-3">
            Estimated audience: <span className="text-foreground font-medium">{audienceCount ?? '—'}</span> users
          </p>
        </div>

        {isEditable && (
          <div className="bg-surface border border-surface-light rounded-2xl p-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Schedule for</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="px-3 py-2 bg-surface-light border border-surface-light rounded-lg text-foreground text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={saveDraft}
                disabled={saving}
                className="px-4 py-2 bg-surface-light border border-surface-light rounded-xl text-sm text-foreground hover:border-accent transition disabled:opacity-50"
              >
                Save draft
              </button>
              {status === 'SCHEDULED' ? (
                <button
                  onClick={unschedule}
                  className="px-4 py-2 bg-surface-light border border-surface-light rounded-xl text-sm text-foreground hover:border-accent transition"
                >
                  Unschedule
                </button>
              ) : (
                <button
                  onClick={schedule}
                  className="px-4 py-2 bg-surface-light border border-surface-light rounded-xl text-sm text-foreground hover:border-accent transition"
                >
                  Schedule
                </button>
              )}
              <button
                onClick={sendNow}
                className="px-4 py-2 bg-accent rounded-xl text-sm text-white font-medium hover:opacity-90 transition"
              >
                Send now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
