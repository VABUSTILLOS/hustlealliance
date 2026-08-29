import Link from 'next/link';
import { useMemo } from 'react';

const SPLIT_RE = /(#[\p{L}\p{N}_]+|@\w{3,30})/gu;

// Renders post content with hashtags linked to the hashtag feed and
// @mentions linked to member profiles.
export function RichPostContent({ content, className }: { content: string; className?: string }) {
  const parts = useMemo(() => content.split(SPLIT_RE), [content]);

  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('#') && part.length > 2) {
          return (
            <Link
              key={i}
              href={`/community/hashtag/${encodeURIComponent(part.slice(1).toLowerCase())}`}
              className="text-accent hover:underline"
            >
              {part}
            </Link>
          );
        }
        if (part.startsWith('@') && part.length > 3) {
          return (
            <Link
              key={i}
              href={`/member/${encodeURIComponent(part.slice(1))}`}
              className="text-accent hover:underline font-semibold"
            >
              {part}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}
