import Link from 'next/link';
import { useMemo } from 'react';

const HASHTAG_SPLIT_RE = /(#[\p{L}\p{N}_]+)/gu;

// Renders post content with hashtags turned into links to the hashtag feed.
export function RichPostContent({ content, className }: { content: string; className?: string }) {
  const parts = useMemo(() => content.split(HASHTAG_SPLIT_RE), [content]);

  return (
    <p className={className}>
      {parts.map((part, i) =>
        part.startsWith('#') && part.length > 2 ? (
          <Link
            key={i}
            href={`/community/hashtag/${encodeURIComponent(part.slice(1).toLowerCase())}`}
            className="text-accent hover:underline"
          >
            {part}
          </Link>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  );
}
