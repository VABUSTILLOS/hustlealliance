'use client';

import { useState } from 'react';

interface VideoRef {
  provider: 'youtube' | 'vimeo';
  id: string;
  url: string;
}

const VIDEO_PATTERNS: { provider: VideoRef['provider']; re: RegExp }[] = [
  { provider: 'youtube', re: /https?:\/\/(?:www\.)?youtube\.com\/watch\?[^\s]*v=([\w-]{6,})/g },
  { provider: 'youtube', re: /https?:\/\/youtu\.be\/([\w-]{6,})/g },
  { provider: 'youtube', re: /https?:\/\/(?:www\.)?youtube\.com\/shorts\/([\w-]{6,})/g },
  { provider: 'vimeo', re: /https?:\/\/(?:www\.)?vimeo\.com\/(\d{6,})/g },
];

export function extractVideos(content: string): VideoRef[] {
  const found: VideoRef[] = [];
  const seen = new Set<string>();
  for (const { provider, re } of VIDEO_PATTERNS) {
    for (const match of content.matchAll(re)) {
      const key = `${provider}:${match[1]}`;
      if (!seen.has(key)) {
        seen.add(key);
        found.push({ provider, id: match[1], url: match[0] });
      }
    }
  }
  return found.slice(0, 2);
}

function embedUrl(video: VideoRef): string {
  return video.provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`
    : `https://player.vimeo.com/video/${video.id}?autoplay=1`;
}

function VideoEmbed({ video }: { video: VideoRef }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 bg-black">
        <iframe
          src={embedUrl(video)}
          title="Video"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 bg-surface-light group"
    >
      {video.provider === 'youtube' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-14 h-14 rounded-full bg-black/70 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
      <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/80 bg-black/60 px-2 py-0.5 rounded">
        {video.provider === 'youtube' ? 'YouTube' : 'Vimeo'}
      </span>
    </button>
  );
}

export function VideoEmbeds({ content }: { content: string }) {
  const videos = extractVideos(content);
  if (videos.length === 0) return null;
  return (
    <>
      {videos.map((v) => (
        <VideoEmbed key={`${v.provider}:${v.id}`} video={v} />
      ))}
    </>
  );
}
