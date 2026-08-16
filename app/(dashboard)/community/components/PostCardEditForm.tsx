'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

interface PostCardEditFormProps {
  editText: string;
  isSaving: boolean;
  onChange: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function PostCardEditForm({
  editText,
  isSaving,
  onChange,
  onSave,
  onCancel,
}: PostCardEditFormProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-3 space-y-2">
      <textarea
        value={editText}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full bg-surface-light rounded-xl px-3 py-2 text-foreground text-sm outline-none border border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/20 resize-none"
        aria-label="Edit post content"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-heading font-bold disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {isSaving ? t.community.saving : t.community.save}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg bg-surface-light text-muted text-xs focus-visible:ring-2 focus-visible:ring-accent/20"
        >
          {t.community.cancel}
        </button>
      </div>
    </div>
  );
}
