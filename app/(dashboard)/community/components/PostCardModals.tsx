'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

interface PostCardModalsProps {
  shareModalOpen: boolean;
  reportModalOpen: boolean;
  shareComment: string;
  reportReason: string;
  onShareCommentChange: (text: string) => void;
  onReportReasonChange: (text: string) => void;
  onShareSubmit: () => void;
  onReportSubmit: () => void;
  onCloseShare: () => void;
  onCloseReport: () => void;
}

export function PostCardModals({
  shareModalOpen,
  reportModalOpen,
  shareComment,
  reportReason,
  onShareCommentChange,
  onReportReasonChange,
  onShareSubmit,
  onReportSubmit,
  onCloseShare,
  onCloseReport,
}: PostCardModalsProps) {
  const { t } = useTranslation();

  return (
    <>
      {shareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={onCloseShare}
          role="dialog"
          aria-modal="true"
          aria-label={t.community.sharePostTitle}
        >
          <div
            className="bg-surface border border-surface-light rounded-2xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading font-bold text-foreground text-lg mb-4">{t.community.sharePostTitle}</h3>
            <textarea
              value={shareComment}
              onChange={(e) => onShareCommentChange(e.target.value)}
              placeholder={t.community.shareCommentPlaceholder}
              rows={3}
              className="w-full bg-surface-light rounded-xl px-3 py-2 text-foreground text-sm outline-none border border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/20 resize-none mb-4"
              aria-label="Share comment"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onCloseShare}
                className="px-4 py-2 rounded-lg bg-surface-light text-muted text-sm focus-visible:ring-2 focus-visible:ring-accent/20"
              >
                {t.community.cancel}
              </button>
              <button
                onClick={onShareSubmit}
                className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-heading font-bold focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                {t.community.sharing}
              </button>
            </div>
          </div>
        </div>
      )}

      {reportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={onCloseReport}
          role="dialog"
          aria-modal="true"
          aria-label={t.community.reportPostTitle}
        >
          <div
            className="bg-surface border border-surface-light rounded-2xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading font-bold text-foreground text-lg mb-4">{t.community.reportPostTitle}</h3>
            <p className="text-foreground-muted text-sm mb-3">{t.community.reportPostQuestion}</p>
            <textarea
              value={reportReason}
              onChange={(e) => onReportReasonChange(e.target.value)}
              placeholder={t.community.reportIssuePlaceholder}
              rows={3}
              className="w-full bg-surface-light rounded-xl px-3 py-2 text-foreground text-sm outline-none border border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/20 resize-none mb-4"
              aria-label="Report reason"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onCloseReport}
                className="px-4 py-2 rounded-lg bg-surface-light text-muted text-sm focus-visible:ring-2 focus-visible:ring-accent/20"
              >
                {t.community.cancel}
              </button>
              <button
                onClick={onReportSubmit}
                disabled={!reportReason.trim()}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-heading font-bold disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-red-400/50"
              >
                {t.community.report}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
