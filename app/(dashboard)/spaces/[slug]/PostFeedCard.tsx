"use client";

import Link from "next/link";
import Image from "next/image";

export interface PostFeedCardData {
  id: string;
  content: string;
  excerpt: string | null;
  imageUrls: string[];
  createdAt: string;
  locale?: string;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    avatar: string | null;
  };
  likeCount: number;
  commentCount: number;
}

function getPreview(post: PostFeedCardData): { title: string; preview: string } {
  // Extract title from ## Title format, or first line
  const titleMatch = post.content.match(/^## (.+?)(?:\n\n|$)/);
  const title = titleMatch
    ? titleMatch[1]
    : post.content.split("\n")[0].slice(0, 120);

  // Use excerpt if available, otherwise strip markdown from first 200 chars of body
  if (post.excerpt) return { title, preview: post.excerpt };

  const body = titleMatch ? post.content.slice(titleMatch[0].length) : post.content;
  const plain = body
    .replace(/^## .+(\n\n|$)/, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\n\n/g, " ")
    .replace(/\n/g, " ")
    .trim();

  return { title, preview: plain.slice(0, 200) + (plain.length > 200 ? "..." : "") };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostFeedCard({
  post,
  spaceSlug,
}: {
  post: PostFeedCardData;
  spaceSlug: string;
}) {
  const { title, preview } = getPreview(post);

  return (
    <Link
      href={`/spaces/${spaceSlug}/${post.id}`}
      className="group block bg-surface border border-surface-light rounded-2xl p-5
                 hover:border-accent/25 hover:shadow-lg hover:shadow-accent/5
                 transition-all duration-300"
    >
      {/* Author header */}
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={post.author.avatar ?? ""}
          alt=""
          width={40}
          height={40}
          className="rounded-full border border-white/10 object-cover shrink-0"
        />
        <div className="min-w-0">
          <p className="font-heading font-bold text-foreground text-sm truncate">
            {post.author.name}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-muted">
              @{post.author.username ?? "anonymous"}
            </span>
            <span className="text-muted text-[10px]">•</span>
            <span className="text-muted text-[10px]">
              {formatDate(post.createdAt)}
            </span>
            {post.locale && post.locale !== "en" && (
              <>
                <span className="text-muted text-[10px]">•</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent uppercase">
                  {post.locale}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cover image */}
      {post.imageUrls.length > 0 && (
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-3">
          <Image
            src={post.imageUrls[0]}
            alt=""
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 700px"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="font-heading font-bold text-foreground text-sm mb-1.5 group-hover:text-accent transition-colors">
        {title}
      </h3>

      {/* Preview — truncated with line-clamp */}
      <p className="text-muted text-xs leading-relaxed line-clamp-3 mb-3">
        {preview}
      </p>

      {/* Engagement */}
      <div className="flex items-center gap-4 text-xs font-mono text-muted">
        <span>❤️ {post.likeCount}</span>
        <span>💬 {post.commentCount}</span>
        <span className="ml-auto text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          Read more →
        </span>
      </div>
    </Link>
  );
}
