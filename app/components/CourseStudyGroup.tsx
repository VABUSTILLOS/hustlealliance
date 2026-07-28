'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import {
  createGroupPost,
  createGroupReply,
  type StudyGroupWithMembers,
} from '@/app/(dashboard)/learning/[slug]/study-group/actions';

// ── Types ─────────────────────────────────────────────────────────

type GroupData = NonNullable<StudyGroupWithMembers>;
type PostData = GroupData['posts'][number];
type ReplyData = PostData['replies'][number];
type MemberData = GroupData['members'][number];

// ── Props ─────────────────────────────────────────────────────────

interface CourseStudyGroupProps {
  courseSlug: string;
  group: GroupData;
}

// ── Component: State lives HERE, NOT in Zustand ──────────────────

export function CourseStudyGroup({
  courseSlug,
  group,
}: CourseStudyGroupProps) {
  const router = useRouter();

  // Local state — completely isolated from global community Zustand store
  const [posts, setPosts] = useState<PostData[]>(group.posts);
  const [members] = useState<MemberData[]>(group.members);
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isReplying, setIsReplying] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────

  const handlePost = async () => {
    const trimmed = content.trim();
    if (!trimmed || isPosting) return;

    setIsPosting(true);
    setError(null);
    try {
      const newPost = await createGroupPost(courseSlug, trimmed);
      if (newPost) {
        setPosts((prev) => [newPost as PostData, ...prev]);
        setContent('');
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleReply = async (postId: string) => {
    const trimmed = (replyContent[postId] ?? '').trim();
    if (!trimmed || isReplying) return;

    setIsReplying(true);
    setError(null);
    try {
      const reply = await createGroupReply(courseSlug, postId, trimmed);
      if (reply) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, replies: [...p.replies, reply as ReplyData] }
              : p
          )
        );
        setReplyContent((prev) => ({ ...prev, [postId]: '' }));
        setReplyingTo(null);
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reply');
    } finally {
      setIsReplying(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* ── Main: Compose + Posts ── */}
      <div className="lg:col-span-3 space-y-6">
        {/* Compose */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError(null);
            }}
            placeholder="Ask a question, share a resource, or discuss the course material..."
            className="w-full bg-transparent text-foreground placeholder:text-muted text-sm resize-none outline-none min-h-[100px]"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handlePost();
              }
            }}
          />
          {error && (
            <p className="text-red-400 text-xs mt-2 mb-2">{error}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="text-muted text-xs">
              {content.length > 0
                ? `${content.length} characters`
                : '⌘+Enter to post'}
            </span>
            <button
              onClick={handlePost}
              disabled={!content.trim() || isPosting}
              className={clsx(
                'px-5 py-2.5 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all',
                content.trim() && !isPosting
                  ? 'bg-accent text-white shadow-[0_0_20px_rgba(255,59,48,0.15)] hover:shadow-[0_0_35px_rgba(255,59,48,0.3)]'
                  : 'bg-[var(--color-surface-light)] text-muted cursor-not-allowed'
              )}
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] flex items-center justify-center">
              <svg
                className="w-7 h-7 text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <p className="text-muted text-sm">No posts yet.</p>
            <p className="text-muted text-xs mt-1">
              Be the first to start a discussion!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                replyContent={replyContent}
                replyingTo={replyingTo}
                isReplying={isReplying}
                onReplyContentChange={(id, val) =>
                  setReplyContent((prev) => ({ ...prev, [id]: val }))
                }
                onToggleReply={(id) =>
                  setReplyingTo((prev) => (prev === id ? null : id))
                }
                onReply={handleReply}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Sidebar: Members ── */}
      <div className="lg:col-span-1">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5 sticky top-24">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
            Members ({members.length})
          </h3>
          <div className="space-y-2.5">
            {members.map((m) => (
              <div
                key={m.userId}
                className="flex items-center gap-3 group"
              >
                <img
                  src={
                    m.user.avatar ??
                    'https://api.dicebear.com/9.x/initials/svg?seed=User'
                  }
                  alt={m.user.name}
                  className="w-8 h-8 rounded-full border border-white/10 object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-sm font-medium truncate">
                    {m.user.name}
                  </p>
                  {m.user.username && (
                    <p className="text-muted text-xs truncate">
                      @{m.user.username}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-component: Single Post Card ───────────────────────────────

function PostCard({
  post,
  replyContent,
  replyingTo,
  isReplying,
  onReplyContentChange,
  onToggleReply,
  onReply,
}: {
  post: PostData;
  replyContent: Record<string, string>;
  replyingTo: string | null;
  isReplying: boolean;
  onReplyContentChange: (postId: string, val: string) => void;
  onToggleReply: (postId: string) => void;
  onReply: (postId: string) => Promise<void>;
}) {
  const isReplyingToThis = replyingTo === post.id;

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5">
      {/* Author */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={
            post.author.avatar ??
            'https://api.dicebear.com/9.x/initials/svg?seed=User'
          }
          alt={post.author.name}
          className="w-9 h-9 rounded-full border border-white/10 object-cover"
        />
        <div>
          <p className="font-heading font-bold text-foreground text-sm">
            {post.author.name}
          </p>
          <p className="text-muted text-xs font-mono">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-foreground-muted text-sm leading-relaxed whitespace-pre-wrap mb-3">
        {post.content}
      </p>

      {/* Reply button */}
      <button
        onClick={() => onToggleReply(post.id)}
        className={clsx(
          'inline-flex items-center gap-1.5 text-xs transition-colors',
          isReplyingToThis
            ? 'text-accent'
            : 'text-muted hover:text-foreground'
        )}
      >
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        Reply{post.replies.length > 0 ? ` (${post.replies.length})` : ''}
      </button>

      {/* Replies */}
      {post.replies.length > 0 && (
        <div className="mt-3 pl-4 border-l-2 border-[var(--color-border-subtle)] space-y-3">
          {post.replies.map((reply) => (
            <div key={reply.id}>
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={
                    reply.author.avatar ??
                    'https://api.dicebear.com/9.x/initials/svg?seed=User'
                  }
                  alt={reply.author.name}
                  className="w-5 h-5 rounded-full border border-white/10 object-cover"
                />
                <span className="font-bold text-foreground text-xs">
                  {reply.author.name}
                </span>
                <span className="text-muted text-[10px] font-mono">
                  {new Date(reply.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-foreground-muted text-sm leading-relaxed whitespace-pre-wrap ml-7">
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Reply composer */}
      {isReplyingToThis && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
          <textarea
            value={replyContent[post.id] ?? ''}
            onChange={(e) => onReplyContentChange(post.id, e.target.value)}
            placeholder="Write a reply..."
            className="w-full bg-transparent text-foreground placeholder:text-muted text-sm resize-none outline-none min-h-[60px]"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onReply(post.id);
              }
            }}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-muted text-xs">⌘+Enter to send</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleReply(post.id)}
                className="px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onReply(post.id)}
                disabled={
                  !(replyContent[post.id] ?? '').trim() || isReplying
                }
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  (replyContent[post.id] ?? '').trim() && !isReplying
                    ? 'bg-accent text-white'
                    : 'bg-[var(--color-surface-light)] text-muted cursor-not-allowed'
                )}
              >
                {isReplying ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
