"use client";

interface MessageBubbleProps {
  content: string;
  createdAt: string;
  isOwn: boolean;
  senderName?: string;
  senderAvatar?: string | null;
  isRead?: boolean;
  attachmentUrl?: string | null;
}

export function MessageBubble({
  content,
  createdAt,
  isOwn,
  senderName,
  senderAvatar,
  isRead,
  attachmentUrl,
}: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`flex max-w-[75%] gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar for other users */}
        {!isOwn && (
          <div className="flex-shrink-0">
            {senderAvatar ? (
              <img
                src={senderAvatar}
                alt={senderName || ""}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {(senderName || "?").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}

        <div>
          {/* Sender name for group chats (only for others' messages) */}
          {!isOwn && senderName && (
            <span className="mb-1 block text-xs text-muted-foreground">{senderName}</span>
          )}

          <div
            className={`rounded-2xl px-3 py-2 text-sm ${
              isOwn
                ? "rounded-br-md bg-primary text-primary-foreground"
                : "rounded-bl-md bg-muted text-foreground"
            }`}
          >
            {attachmentUrl && (
              <div className="mb-1.5 overflow-hidden rounded-lg">
                {attachmentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={attachmentUrl}
                    alt="attachment"
                    className="max-h-60 w-full object-cover"
                  />
                ) : (
                  <a
                    href={attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded bg-background/20 px-3 py-2 text-xs underline"
                  >
                    📎 Attachment
                  </a>
                )}
              </div>
            )}
            <p className="whitespace-pre-wrap break-words">{content}</p>
          </div>

          <div
            className={`mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground ${
              isOwn ? "justify-end" : "justify-start"
            }`}
          >
            {formatMessageTime(createdAt)}
            {isOwn && isRead !== undefined && (
              <span className="ml-1">{isRead ? "✓✓" : "✓"}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMessageTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
