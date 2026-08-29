'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Contact = {
  id: string;
  name: string;
  email: string;
  role: string;
  membershipTier: string;
  createdAt: string;
  lastSeenAt: string | null;
  lastActiveAt: string | null;
  tags: string[];
  emailUnsubscribed: boolean;
  leadScore: number;
};

type Note = {
  id: string;
  body: string;
  createdAt: string;
  author: { id: string; name: string; email: string };
};

type Timeline = {
  campaigns: { campaignId: string; name: string; subject: string; sentAt: string | null; openedAt: string | null; clickedAt: string | null; status: string }[];
  orders: { id: string; status: string; totalAmount: number; currency: string; paidAt: string | null; createdAt: string; items: { productName: string; quantity: number; totalPrice: number }[] }[];
  enrollments: { courseId: string; courseTitle: string; enrolledAt: string; completedAt: string | null; progressPct: number }[];
  referralsMade: { id: string; status: string; referee: { id: string; name: string; email: string } | null; createdAt: string; convertedAt: string | null }[];
  referredBy: { id: string; referrer: { id: string; name: string; email: string }; status: string } | null;
};

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [contact, setContact] = useState<Contact | null>(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/email/contacts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setContact(data.contact ?? null);
        setTimeline(data.timeline ?? null);
        setNotes(data.notes ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(load, [load]);

  const patch = async (data: { tags?: string[]; emailUnsubscribed?: boolean }) => {
    setSaving(true);
    try {
      await fetch(`/api/admin/email/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      load();
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || !contact) return;
    if (contact.tags.includes(tag)) {
      setTagInput('');
      return;
    }
    patch({ tags: [...contact.tags, tag] });
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    if (!contact) return;
    patch({ tags: contact.tags.filter((t) => t !== tag) });
  };

  const addNote = async () => {
    const body = noteInput.trim();
    if (!body) return;
    setSavingNote(true);
    try {
      await fetch(`/api/admin/email/contacts/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });
      setNoteInput('');
      load();
    } finally {
      setSavingNote(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    await fetch(`/api/admin/email/contacts/${id}/notes?noteId=${noteId}`, { method: 'DELETE' });
    load();
  };

  if (loading) return <div className="p-4 md:p-8 text-muted text-sm">Loading…</div>;
  if (!contact) return <div className="p-4 md:p-8 text-muted text-sm">Contact not found.</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <button onClick={() => router.push('/admin/email/contacts')} className="text-xs text-accent hover:underline mb-4">
        ← Back to contacts
      </button>

      <div className="bg-surface border border-surface-light rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">{contact.name}</h1>
        <p className="text-muted text-sm">{contact.email}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted">
          <span>Role: {contact.role}</span>
          <span>Tier: {contact.membershipTier}</span>
          <span className={contact.leadScore >= 50 ? 'text-accent font-medium' : ''}>
            Lead score: {contact.leadScore}
          </span>
          <span>Joined: {new Date(contact.createdAt).toLocaleDateString()}</span>
          <span>Last active: {contact.lastActiveAt ? new Date(contact.lastActiveAt).toLocaleDateString() : '—'}</span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-muted">Email status:</span>
          <button
            onClick={() => patch({ emailUnsubscribed: !contact.emailUnsubscribed })}
            disabled={saving}
            className={`px-3 py-1 rounded-lg text-xs font-medium ${
              contact.emailUnsubscribed ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}
          >
            {contact.emailUnsubscribed ? 'Unsubscribed' : 'Subscribed'}
          </button>
        </div>

        <div className="mt-4">
          <p className="text-xs text-muted mb-2">Tags</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {contact.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-surface-light rounded-full text-xs text-foreground flex items-center gap-1">
                {tag}
                <button onClick={() => removeTag(tag)} className="text-muted hover:text-red-400">
                  ×
                </button>
              </span>
            ))}
            {contact.tags.length === 0 && <span className="text-muted text-xs">No tags yet.</span>}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              placeholder="Add a tag…"
              className="px-3 py-1.5 bg-surface-light border border-surface-light rounded-lg text-foreground text-xs"
            />
            <button onClick={addTag} className="px-3 py-1.5 bg-accent rounded-lg text-xs text-white font-medium hover:opacity-90">
              Add
            </button>
          </div>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-sm font-medium text-foreground mb-2">Internal notes ({notes.length})</h2>
        <div className="bg-surface border border-surface-light rounded-xl p-4 mb-3">
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            rows={2}
            placeholder="Add a private note about this contact…"
            className="w-full px-3 py-2 bg-surface-light border border-surface-light rounded-lg text-foreground text-sm focus:outline-none"
          />
          <button
            onClick={addNote}
            disabled={savingNote || !noteInput.trim()}
            className="mt-2 px-4 py-1.5 bg-accent rounded-lg text-xs text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {savingNote ? 'Saving…' : 'Add note'}
          </button>
        </div>
        <div className="space-y-2">
          {notes.map((n) => (
            <div key={n.id} className="bg-surface border border-surface-light rounded-xl p-3 text-xs">
              <div className="flex justify-between items-start gap-2">
                <p className="text-foreground whitespace-pre-wrap">{n.body}</p>
                <button onClick={() => deleteNote(n.id)} className="text-muted hover:text-red-400 shrink-0">
                  ×
                </button>
              </div>
              <p className="text-muted mt-1">
                {n.author.name} · {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
          {notes.length === 0 && <p className="text-muted text-xs">No notes yet.</p>}
        </div>
      </section>

      {timeline && (
        <div className="space-y-6">
          <section>
            <h2 className="text-sm font-medium text-foreground mb-2">Campaigns received ({timeline.campaigns.length})</h2>
            <div className="bg-surface border border-surface-light rounded-xl divide-y divide-surface-light">
              {timeline.campaigns.map((c, i) => (
                <div key={i} className="p-3 text-xs flex justify-between items-center">
                  <div>
                    <p className="text-foreground">{c.name}</p>
                    <p className="text-muted">{c.subject}</p>
                  </div>
                  <div className="text-right text-muted">
                    <p>{c.status}</p>
                    <p>{c.sentAt ? new Date(c.sentAt).toLocaleDateString() : '—'}</p>
                  </div>
                </div>
              ))}
              {timeline.campaigns.length === 0 && <p className="p-3 text-muted text-xs">No campaigns sent yet.</p>}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium text-foreground mb-2">Orders ({timeline.orders.length})</h2>
            <div className="bg-surface border border-surface-light rounded-xl divide-y divide-surface-light">
              {timeline.orders.map((o) => (
                <div key={o.id} className="p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-foreground">{o.items.map((i) => i.productName).join(', ')}</span>
                    <span className="text-muted">
                      {o.currency} {o.totalAmount.toFixed(2)} · {o.status}
                    </span>
                  </div>
                  <p className="text-muted">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
              {timeline.orders.length === 0 && <p className="p-3 text-muted text-xs">No orders yet.</p>}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium text-foreground mb-2">Enrollments ({timeline.enrollments.length})</h2>
            <div className="bg-surface border border-surface-light rounded-xl divide-y divide-surface-light">
              {timeline.enrollments.map((e) => (
                <div key={e.courseId} className="p-3 text-xs flex justify-between">
                  <span className="text-foreground">{e.courseTitle}</span>
                  <span className="text-muted">{Math.round(e.progressPct)}% · enrolled {new Date(e.enrolledAt).toLocaleDateString()}</span>
                </div>
              ))}
              {timeline.enrollments.length === 0 && <p className="p-3 text-muted text-xs">No enrollments yet.</p>}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium text-foreground mb-2">Referrals</h2>
            <div className="bg-surface border border-surface-light rounded-xl divide-y divide-surface-light">
              {timeline.referredBy && (
                <div className="p-3 text-xs text-foreground">
                  Referred by {timeline.referredBy.referrer.name} ({timeline.referredBy.referrer.email})
                </div>
              )}
              {timeline.referralsMade.map((r) => (
                <div key={r.id} className="p-3 text-xs flex justify-between">
                  <span className="text-foreground">{r.referee ? `${r.referee.name} (${r.referee.email})` : 'Pending referral'}</span>
                  <span className="text-muted">{r.status}</span>
                </div>
              ))}
              {timeline.referralsMade.length === 0 && !timeline.referredBy && (
                <p className="p-3 text-muted text-xs">No referral activity.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
