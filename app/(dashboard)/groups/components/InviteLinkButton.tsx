'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export function InviteLinkButton({ groupId, isAdmin }: { groupId: string; isAdmin: boolean }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [pending, setPending] = useState(false);

  const copyLink = async (regenerate: boolean) => {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch(`/api/groups/${groupId}/invite-link`, {
        method: regenerate ? 'POST' : 'GET',
      });
      if (!res.ok) return;
      const { url } = await res.json();
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => copyLink(false)}
        disabled={pending}
        className="px-4 py-2 rounded-lg border border-surface-light text-muted text-sm font-mono hover:text-foreground hover:border-accent/30 transition-colors disabled:opacity-50"
      >
        {copied ? t.groups.inviteCopied : t.groups.copyInviteLink}
      </button>
      {isAdmin && (
        <button
          onClick={() => copyLink(true)}
          disabled={pending}
          title={t.groups.regenerateInvite}
          className="px-2.5 py-2 rounded-lg border border-surface-light text-muted text-sm hover:text-foreground hover:border-accent/30 transition-colors disabled:opacity-50"
        >
          ↻
        </button>
      )}
    </div>
  );
}
