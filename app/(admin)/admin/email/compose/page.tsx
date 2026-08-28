'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type SegmentFilter = {
  tiers?: string[];
  roles?: string[];
  lastActiveBeforeDays?: number;
  lastActiveAfterDays?: number;
};

function ComposerInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('id');

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [segment, setSegment] = useState<SegmentFilter>({});
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    fetch(`/api/admin/email/campaigns/${campaignId}`)
      .then((r) => r.json())
      .then((data) => {
        const c = data.campaign;
        if (!c) return;
        setName(c.name);
        setSubject(c.subject);
        setHtml(c.html);
        setStatus(c.status);
        setSegment(c.segmentFilter || {});
      });
  }, [campaignId]);

  const refreshCount = useCallback((filter: SegmentFilter) => {
    fetch('/api/admin/email/segment-preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ segmentFilter: filter }),
    })
      .then((r) => r.json())
      .then((data) => setRecipientCount(data.count ?? null))
      .catch(() => setRecipientCount(null));
  }, []);

  useEffect(() => {
    refreshCount(segment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(segment)]);

  const toggleTier = (tier: string) => {
    setSegment((s) => {
      const tiers = new Set(s.tiers || []);
      if (tiers.has(tier)) tiers.delete(tier);
      else tiers.add(tier);
      return { ...s, tiers: Array.from(tiers) };
    });
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = { name, subject, html, segmentFilter: segment };
      const res = campaignId
        ? await fetch(`/api/admin/email/campaigns/${campaignId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/admin/email/campaigns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      if (!campaignId && data.campaign?.id) {
        router.replace(`/admin/email/compose?id=${data.campaign.id}`);
      }
      setMessage('Saved.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const sendTest = async () => {
    if (!campaignId) {
      setMessage('Save the campaign first.');
      return;
    }
    if (!testEmail) return;
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/email/campaigns/${campaignId}/test-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send test');
      setMessage(data.demo ? 'Test sent (demo mode — check server logs).' : 'Test email sent.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to send test');
    }
  };

  const sendCampaign = async () => {
    if (!campaignId) {
      setMessage('Save the campaign first.');
      return;
    }
    if (!confirm(`Send this campaign to ${recipientCount ?? 'the'} matching recipients?`)) return;
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/email/campaigns/${campaignId}/send`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setMessage(`Sent to ${data.sentCount}/${data.total} recipients (${data.failedCount} failed).`);
      setStatus('SENT');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to send campaign');
    }
  };

  const generateWithAI = async () => {
    setAiLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'email-copy', prompt: subject || name || 'promotional email' }),
      });
      if (!res.ok) throw new Error('AI assist is unavailable right now.');
      const data = await res.json();
      if (data.subject) setSubject(data.subject);
      if (data.html) setHtml(data.html);
      else if (data.content) setHtml(data.content);
      setMessage('AI draft inserted — review before sending.');
    } catch {
      setMessage('AI assist is unavailable right now — write your copy manually.');
    } finally {
      setAiLoading(false);
    }
  };

  const isDraft = status === 'DRAFT';

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
        {campaignId ? 'Edit Campaign' : 'New Campaign'}
      </h1>
      <p className="text-muted text-sm mb-8">Status: {status}</p>

      {message && (
        <div className="mb-4 px-4 py-2 bg-surface border border-surface-light rounded-xl text-sm text-foreground">
          {message}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-muted mb-1">Internal name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isDraft}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Subject</label>
          <div className="flex gap-2">
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={!isDraft}
              className="flex-1 px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent disabled:opacity-50"
            />
            <button
              onClick={generateWithAI}
              disabled={aiLoading || !isDraft}
              className="px-4 py-2 bg-surface border border-surface-light rounded-xl text-sm text-foreground hover:border-accent transition disabled:opacity-50 whitespace-nowrap"
            >
              {aiLoading ? 'Generating…' : '✨ Generate with AI'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">HTML body</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            disabled={!isDraft}
            rows={12}
            className="w-full px-4 py-2 bg-surface border border-surface-light rounded-xl text-foreground text-sm font-mono focus:outline-none focus:border-accent disabled:opacity-50"
          />
          <button onClick={() => setShowPreview((v) => !v)} className="mt-2 text-xs text-accent hover:underline">
            {showPreview ? 'Hide preview' : 'Show preview'}
          </button>
          {showPreview && (
            <div className="mt-2 border border-surface-light rounded-xl overflow-hidden">
              <iframe title="preview" srcDoc={html} className="w-full h-96 bg-white" />
            </div>
          )}
        </div>

        <div className="bg-surface border border-surface-light rounded-2xl p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Segment</h3>
          <div className="flex gap-2 flex-wrap mb-3">
            {['FREE', 'BASIC', 'PRO'].map((tier) => (
              <button
                key={tier}
                onClick={() => toggleTier(tier)}
                disabled={!isDraft}
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
          <div className="flex gap-4 items-center flex-wrap">
            <label className="text-xs text-muted flex items-center gap-2">
              Active in last
              <input
                type="number"
                min={0}
                disabled={!isDraft}
                value={segment.lastActiveAfterDays ?? ''}
                onChange={(e) =>
                  setSegment((s) => ({
                    ...s,
                    lastActiveAfterDays: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                className="w-20 px-2 py-1 bg-surface-light border border-surface-light rounded-lg text-foreground text-xs disabled:opacity-50"
              />
              days
            </label>
          </div>
          <p className="text-sm text-foreground mt-4">
            Matches <strong>{recipientCount ?? '…'}</strong> users
          </p>
        </div>

        {isDraft && (
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving || !name || !subject || !html}
              className="px-6 py-2.5 bg-surface border border-surface-light rounded-xl text-sm text-foreground hover:border-accent transition disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save draft'}
            </button>
            <button
              onClick={sendCampaign}
              disabled={!campaignId}
              className="px-6 py-2.5 bg-accent rounded-xl text-sm text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              Send now
            </button>
          </div>
        )}

        <div className="bg-surface border border-surface-light rounded-2xl p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Test send</h3>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1 px-4 py-2 bg-surface-light border border-surface-light rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
            />
            <button
              onClick={sendTest}
              disabled={!campaignId || !testEmail}
              className="px-4 py-2 bg-surface-light rounded-xl text-sm text-foreground hover:border-accent border border-surface-light transition disabled:opacity-50"
            >
              Send test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComposePage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted text-sm">Loading…</div>}>
      <ComposerInner />
    </Suspense>
  );
}
