'use client';

import clsx from 'clsx';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface JoinButtonProps {
  isMember: boolean;
  isPending: boolean;
  role: string | null;
  onJoin: () => void;
  onLeave: () => void;
}

export function JoinButton({
  isMember,
  isPending,
  role,
  onJoin,
  onLeave,
}: JoinButtonProps) {
  const { t } = useTranslation();

  if (isMember) {
    return (
      <button
        onClick={onLeave}
        className={clsx(
          'px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all',
          'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400',
        )}
        title={role === 'OWNER' ? 'You are the owner' : undefined}
      >
        {t.spaces.joined} ✓
      </button>
    );
  }

  if (isPending) {
    return (
      <span className="px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
        Pending...
      </span>
    );
  }

  return (
    <button
      onClick={onJoin}
      className="px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all bg-accent text-foreground hover:bg-accent-glow"
    >
      {t.spaces.join}
    </button>
  );
}
