'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

interface PostCardMenuProps {
  isOwner: boolean;
  isAdmin: boolean;
  isPinned: boolean;
  copied: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPin: () => void;
  onCopyLink: () => void;
  onShare: () => void;
  onReport: () => void;
}

export function PostCardMenu({
  isOwner,
  isAdmin,
  isPinned,
  copied,
  onEdit,
  onDelete,
  onPin,
  onCopyLink,
  onShare,
  onReport,
}: PostCardMenuProps) {
  const { t } = useTranslation();

  return (
    <div
      className="absolute right-0 top-full mt-1 w-48 bg-surface border border-surface-light rounded-xl shadow-xl z-50 py-1"
      role="menu"
      aria-label="Post actions"
    >
      {isOwner && (
        <>
          <button
            onClick={onEdit}
            role="menuitem"
            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface-light transition-colors flex items-center gap-2"
          >
            ✏️ {t.community.edit}
          </button>
          <button
            onClick={onDelete}
            role="menuitem"
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-surface-light transition-colors flex items-center gap-2"
          >
            🗑 {t.community.delete}
          </button>
        </>
      )}
      {(isOwner || isAdmin) && (
        <button
          onClick={onPin}
          role="menuitem"
          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface-light transition-colors flex items-center gap-2"
        >
          📌 {isPinned ? t.community.unpin : t.community.pin}
        </button>
      )}
      <button
        onClick={onCopyLink}
        role="menuitem"
        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface-light transition-colors flex items-center gap-2"
      >
        {copied ? '✅' : '🔗'} {copied ? t.community.copied : t.community.copyLink}
      </button>
      <button
        onClick={onShare}
        role="menuitem"
        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface-light transition-colors flex items-center gap-2"
      >
        🔄 {t.community.sharing}
      </button>
      {!isOwner && (
        <button
          onClick={onReport}
          role="menuitem"
          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-surface-light transition-colors flex items-center gap-2"
        >
          🚩 {t.community.report}
        </button>
      )}
    </div>
  );
}
