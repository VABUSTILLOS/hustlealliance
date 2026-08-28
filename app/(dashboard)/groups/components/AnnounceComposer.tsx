'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ToastProvider';

export function AnnounceComposer({ groupId }: { groupId: string }) {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [pending, setPending] = useState(false);

  const submit = async () => {
    if (!content.trim() || pending) return;
    setPending(true);
    try {
      const res = await fetch(`/api/groups/${groupId}/announce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to publish announcement');
      }
      const data = await res.json();
      addToast({ message: `Announcement published — ${data.notified} members notified`, type: 'success' });
      setContent('');
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['group-feed', groupId] });
    } catch (err) {
      addToast({ message: (err as Error).message, type: 'error' });
    } finally {
      setPending(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full px-4 py-3 rounded-2xl border border-accent/30 bg-accent/5 text-accent font-heading font-bold text-sm hover:bg-accent/10 transition-colors"
      >
        📣 Post an announcement
      </button>
    );
  }

  return (
    <div className="bg-surface border border-accent/30 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-foreground text-sm">📣 Announcement</h3>
        <span className="text-[10px] text-muted font-mono uppercase">Pinned + notifies all members</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share something important with the whole group…"
        rows={4}
        maxLength={5000}
        className="w-full bg-surface-light border border-surface-light rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none"
      />
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => { setOpen(false); setContent(''); }}
          className="px-4 py-2 rounded-xl text-muted text-sm hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={pending || !content.trim()}
          className="px-4 py-2 rounded-xl bg-accent text-background font-heading font-bold text-sm hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {pending ? 'Publishing…' : 'Publish announcement'}
        </button>
      </div>
    </div>
  );
}
