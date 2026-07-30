"use client";

import { useState, useEffect, useCallback, useRef, useOptimistic } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useScrollContainer } from "../@modal/(.)[postId]/PostModalClient";

// ── Types ────────────────────────────────────────────────────────────────────

interface Author {
  id: string;
  name: string | null;
  username: string;
  avatar: string | null;
}

interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  _count?: { likes: number };
}

interface RelatedPost {
  id: string;
  content: string;
  excerpt: string | null;
  imageUrls: string[];
  space: string | null;
  createdAt: string;
  author: Author;
  _count: { likes: number; comments: number };
}

interface PostData {
  id: string;
  content: string;
  excerpt: string | null;
  imageUrls: string[];
  space: string | null;
  createdAt: string;
  locale: string;
  author: Author;
  likes: { userId: string }[];
  comments: CommentData[];
  _count?: { likes: number; comments: number };
}

interface Props {
  postId: string;
  spaceSlug: string;
  post: PostData;
  initialComments: CommentData[];
  relatedPosts: RelatedPost[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function extractTitle(content: string): { title: string; body: string } {
  const match = content.match(/^## (.+?)(?:\n\n|$)/);
  if (match) {
    return { title: match[1], body: content.slice(match[0].length) };
  }
  // For short posts, use first line as title
  const firstLine = content.split("\n")[0];
  return {
    title: firstLine.length > 100 ? firstLine.slice(0, 100) + "..." : firstLine,
    body: firstLine.length > 100 ? content : content.slice(firstLine.length).trim(),
  };
}

function renderArticleBody(content: string): string {
  let html = "";
  const paragraphs = content.split("\n\n").filter(Boolean);

  for (const p of paragraphs) {
    const trimmed = p.trim();

    if (trimmed.startsWith("## ")) {
      html += `<h2 class="font-display text-2xl sm:text-3xl text-foreground mt-12 mb-4 leading-tight">${trimmed.slice(3)}</h2>`;
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.includes("\n")) {
      html += `<h3 class="font-heading font-bold text-foreground text-lg mt-8 mb-3">${trimmed.slice(2, -2)}</h3>`;
    } else {
      const processed = trimmed
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="bg-surface-light px-1.5 py-0.5 rounded text-sm font-mono text-accent-glow">$1</code>');
      html += `<p class="text-foreground-muted leading-relaxed mb-5 text-[15px]">${processed}</p>`;
    }
  }
  return html;
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      setProgress(pct);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-surface-light">
      <motion.div
        className="h-full bg-accent"
        style={{ width: `${progress}%` }}
        animate={{ opacity: progress > 99 ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}

function AuthorAvatar({
  src,
  name,
  size = 44,
}: {
  src: string | null;
  name: string | null;
  size?: number;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        unoptimized
        className="rounded-full border border-white/10 object-cover shrink-0"
      />
    );
  }

  // Fallback: initials on a colored circle
  const initials = (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="rounded-full border border-white/10 shrink-0 flex items-center justify-center
                 bg-accent/20 text-accent font-heading font-bold select-none"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

const CommentAvatar = ({
  src,
  name,
}: {
  src: string | null;
  name: string | null;
}) => {
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={36}
        height={36}
        unoptimized
        className="rounded-full border border-white/10 object-cover shrink-0"
      />
    );
  }

  const initials = (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="rounded-full border border-white/10 shrink-0 flex items-center justify-center
                 bg-accent/20 text-accent font-heading font-bold text-[11px] select-none"
      style={{ width: 36, height: 36 }}
      aria-hidden
    >
      {initials}
    </div>
  );
};

function ArticleHeader({ post }: { post: PostData }) {
  const { title } = extractTitle(post.content);

  return (
    <header className="mb-10">
      {/* Breadcrumb */}
      {post.space && (
        <Link
          href={`/spaces/${post.space}`}
          className="inline-flex items-center gap-1 text-muted font-mono text-xs hover:text-accent mb-6 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to {post.space.replace(/-/g, " ")}
        </Link>
      )}

      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground leading-[1.1] mb-4">
        {title}
      </h1>

      {/* Author row */}
      <div className="flex items-center gap-3 mb-4">
        <AuthorAvatar src={post.author.avatar} name={post.author.name} size={44} />
        <div>
          <p className="font-heading font-bold text-foreground text-sm">{post.author.name}</p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-muted">@{post.author.username}</span>
            <span className="text-muted text-[10px]">•</span>
            <span className="text-muted text-[10px]">{formatDate(post.createdAt)}</span>
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

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-muted text-sm italic leading-relaxed border-l-2 border-accent/30 pl-4">
          {post.excerpt}
        </p>
      )}
    </header>
  );
}

function ArticleImage({ src }: { src: string }) {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10">
      <Image
        src={src}
        alt=""
        fill
        unoptimized
        className="object-cover"
        sizes="(max-width: 720px) 100vw, 720px"
      />
    </div>
  );
}

function RelatedPosts({ posts, spaceSlug }: { posts: RelatedPost[]; spaceSlug: string }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-20 pt-12 border-t border-surface-light">
      <h2 className="font-display text-2xl text-foreground mb-8">Recommended Reading</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((related) => {
          const { title } = extractTitle(related.content);
          return (
            <motion.div
              key={related.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/spaces/${related.space ?? spaceSlug}/${related.id}`}
                className="group block bg-surface border border-surface-light rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300"
              >
                {related.imageUrls.length > 0 && (
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <Image
                      src={related.imageUrls[0]}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-heading font-bold text-foreground text-sm mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                    {title}
                  </h3>
                  {related.excerpt && (
                    <p className="text-muted text-xs line-clamp-2 mb-3">{related.excerpt}</p>
                  )}
                  <div className="flex items-center gap-2 text-muted text-[10px] font-mono">
                    <span>❤️ {related._count.likes}</span>
                    <span>💬 {related._count.comments}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ── Comment Form ─────────────────────────────────────────────────────────────

function CommentForm({
  postId,
  onCommentAdded,
}: {
  postId: string;
  onCommentAdded: (comment: CommentData) => void;
}) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      if (!res.ok) throw new Error("Failed to post comment");

      const newComment: CommentData = await res.json();
      onCommentAdded(newComment);
      setText("");
    } catch {
      // Silently fail — could add toast here
    } finally {
      setSubmitting(false);
    }
  }, [text, submitting, postId, onCommentAdded]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-surface border border-surface-light rounded-2xl p-4">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a comment... (⌘+Enter to post)"
        rows={3}
        maxLength={2000}
        className="w-full bg-transparent text-foreground text-sm placeholder:text-muted resize-none focus:outline-none"
      />
      <div className="flex items-center justify-between mt-3">
        <span className="text-muted text-[10px] font-mono">{text.length}/2000</span>
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || submitting}
          className="px-4 py-2 rounded-lg bg-accent text-foreground text-xs font-mono font-bold uppercase
                     hover:bg-accent-glow disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}

// ── Comment Item ─────────────────────────────────────────────────────────────

function CommentItem({
  comment,
}: {
  comment: CommentData;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment._count?.likes ?? 0);
  const [replying, setReplying] = useState(false);

  const handleLike = useCallback(async () => {
    const commentId = comment.id;
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
      await fetch(`/api/community/comments/${commentId}/like`, { method: "DELETE" }).catch(() => {});
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      const res = await fetch(`/api/community/comments/${commentId}/like`, { method: "POST" });
      if (!res.ok) {
        setLiked(false);
        setLikeCount((c) => c - 1);
      }
    }
  }, [liked, comment.id]);

  return (
    <div className="group">
      <div className="flex gap-3">
        <CommentAvatar src={comment.author.avatar} name={comment.author.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-heading font-bold text-foreground text-xs">{comment.author.name}</p>
            <span className="font-mono text-[10px] text-muted">@{comment.author.username}</span>
            <span className="text-muted text-[10px]">•</span>
            <span className="text-muted text-[10px]">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-foreground-muted text-sm leading-relaxed mb-2">{comment.content}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`text-[10px] font-mono transition-colors ${
                liked ? "text-accent" : "text-muted hover:text-foreground"
              }`}
            >
              ❤️ {likeCount > 0 ? likeCount : ""} {liked ? "Liked" : "Like"}
            </button>
            <button
              onClick={() => setReplying(!replying)}
              className="text-[10px] font-mono text-muted hover:text-foreground transition-colors"
            >
              💬 Reply
            </button>
          </div>

          {/* Reply indicator (placeholder — threaded replies can be added later) */}
          {replying && (
            <div className="mt-2 pl-3 border-l-2 border-surface-light">
              <p className="text-muted text-[10px] italic">
                Reply functionality coming soon. For now, post a new comment and @mention this user.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Comments Section ─────────────────────────────────────────────────────────

function CommentsSection({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: CommentData[];
}) {
  const [comments, setComments] = useState<CommentData[]>(initialComments);

  const handleCommentAdded = useCallback((newComment: CommentData) => {
    setComments((prev) => [...prev, newComment]);
  }, []);

  return (
    <section className="mt-16 pt-12 border-t border-surface-light">
      <h2 className="font-display text-2xl text-foreground mb-6">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* Comment input */}
      <div className="mb-8">
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      </div>

      {/* Comment list */}
      {comments.length === 0 ? (
        <p className="text-muted text-sm text-center py-8">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Post Actions Bar ─────────────────────────────────────────────────────────

function PostActions({ post, postId }: { post: PostData; postId: string }) {
  const [liked, setLiked] = useState(false); // determined by current user on mount
  const [likeCount, setLikeCount] = useState(post.likes?.length ?? post._count?.likes ?? 0);

  const handleLike = useCallback(async () => {
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
      await fetch(`/api/community/posts/${postId}/like`, { method: "DELETE" }).catch(() => {});
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      const res = await fetch(`/api/community/posts/${postId}/like`, { method: "POST" });
      if (!res.ok) {
        setLiked(false);
        setLikeCount((c) => c - 1);
      }
    }
  }, [liked, postId]);

  return (
    <div className="flex items-center gap-6 py-6 border-y border-surface-light my-10">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 font-mono text-sm transition-colors ${
          liked ? "text-accent" : "text-muted hover:text-foreground"
        }`}
      >
        <span className={liked ? "animate-pulse" : ""}>❤️</span>
        <span>{likeCount} {liked ? "Liked" : "Like"}</span>
      </button>

      <button
        onClick={() => {
          document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="flex items-center gap-2 font-mono text-sm text-muted hover:text-foreground transition-colors"
      >
        💬 {post.comments?.length ?? post._count?.comments ?? 0} Comments
      </button>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="ml-auto font-mono text-xs text-muted hover:text-accent transition-colors"
      >
        ↑ Top
      </button>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function PostDetailClient({
  postId,
  spaceSlug,
  post,
  initialComments,
  relatedPosts,
}: Props) {
  const { title, body } = extractTitle(post.content);
  const inModal = !!useScrollContainer();

  return (
    <>
      {/* Only render viewport progress bar on full-page loads — modal has its own */}
      {!inModal && <ReadingProgressBar />}

      <article className="px-4 sm:px-6 lg:px-8 py-8 mx-auto" style={{ maxWidth: 720 }}>
        <ArticleHeader post={post} />

        {/* Cover image */}
        {post.imageUrls.length > 0 && <ArticleImage src={post.imageUrls[0]} />}

        {/* Article body */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: renderArticleBody(body) }}
        />

        {/* Post actions */}
        <PostActions post={post} postId={postId} />
      </article>

      {/* Related posts */}
      <div className="px-4 sm:px-6 lg:px-8 mx-auto" style={{ maxWidth: 960 }}>
        <RelatedPosts posts={relatedPosts} spaceSlug={spaceSlug} />
      </div>

      {/* Comments */}
      <div
        id="comments-section"
        className="px-4 sm:px-6 lg:px-8 py-8 mx-auto"
        style={{ maxWidth: 720 }}
      >
        <CommentsSection postId={postId} initialComments={initialComments} />
      </div>

      {/* Bottom spacer */}
      <div className="h-24" />
    </>
  );
}
