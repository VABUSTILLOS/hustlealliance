'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

interface OgData {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
}

// First external http(s) link, skipping video URLs that get embedded players
const VIDEO_RE = /(?:youtube\.com|youtu\.be|vimeo\.com)/i;

export function extractPreviewUrl(content: string): string | null {
  const matches = content.match(/https?:\/\/[^\s<>"']+/g);
  if (!matches) return null;
  for (const raw of matches) {
    const url = raw.replace(/[),.!?'"]+$/, '');
    if (!VIDEO_RE.test(url)) return url;
  }
  return null;
}

export function LinkPreviewCard({ url }: { url: string }) {
  const { data } = useQuery<OgData>({
    queryKey: ['link-preview', url],
    queryFn: async () => {
      const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error('preview failed');
      return res.json();
    },
    staleTime: 1000 * 60 * 30,
    retry: false,
  });

  if (!data || !data.title) return null;

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 flex overflow-hidden rounded-xl border border-white/10 bg-surface-light/40 hover:border-accent/40 transition-colors"
    >
      {data.image && (
        <div className="relative w-24 sm:w-32 shrink-0 self-stretch">
          <Image
            src={data.image}
            alt=""
            fill
            unoptimized
            className="object-cover"
            sizes="128px"
          />
        </div>
      )}
      <div className="min-w-0 p-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted truncate">
          {data.siteName}
        </p>
        <p className="mt-0.5 text-sm font-bold text-foreground line-clamp-2">{data.title}</p>
        {data.description && (
          <p className="mt-1 text-xs text-foreground-muted line-clamp-2">{data.description}</p>
        )}
      </div>
    </a>
  );
}

export function LinkPreview({ content }: { content: string }) {
  const url = extractPreviewUrl(content);
  if (!url) return null;
  return <LinkPreviewCard url={url} />;
}
