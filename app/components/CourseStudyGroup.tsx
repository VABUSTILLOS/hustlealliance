'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import {
  createGroupPost,
  createGroupReply,
  uploadGroupFile,
  type StudyGroupWithMembers,
} from '@/app/(dashboard)/learning/[slug]/study-group/actions';

// ── Types ─────────────────────────────────────────────────────────

type GroupData = NonNullable<StudyGroupWithMembers>;
type PostData = GroupData['posts'][number];
type ReplyData = PostData['replies'][number];
type MemberData = GroupData['members'][number];
type FileData = GroupData['files'][number];

type Tab = 'discussions' | 'files' | 'members';

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  {
    key: 'discussions',
    label: 'Discussions',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    key: 'files',
    label: 'Files',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    key: 'members',
    label: 'Members',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

// ── Format helpers ─────────────────────────────────────────────────

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(date: string | Date) {
  const now = Date.now();
  const then = new Date(date).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// ── Props ─────────────────────────────────────────────────────────

interface CourseStudyGroupProps {
  userEmail: string;
  courseSlug: string;
  group: GroupData;
}

// ── Component ─────────────────────────────────────────────────────

export function CourseStudyGroup({
  userEmail,
  courseSlug,
  group,
}: CourseStudyGroupProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state
  const [activeTab, setActiveTab] = useState<Tab>('discussions');
  const [posts, setPosts] = useState<PostData[]>(group.posts ?? []);
  const [members] = useState<MemberData[]>(group.members ?? []);
  const [files, setFiles] = useState<FileData[]>(group.files ?? []);
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isReplying, setIsReplying] = useState(false);

  // ── Post handler ──────────────────────────────────────────────

  const handlePost = async () => {
    const trimmed = content.trim();
    if (!trimmed || isPosting ) return;

    setIsPosting(true);
    setError(null);
    try {
      const newPost = await createGroupPost(userEmail, courseSlug, trimmed);
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

  // ── Reply handler ─────────────────────────────────────────────

  const handleReply = async (postId: string) => {
    const trimmed = (replyContent[postId] ?? '').trim();
    if (!trimmed || isReplying ) return;

    setIsReplying(true);
    setError(null);
    try {
      const reply = await createGroupReply(userEmail, courseSlug, postId, trimmed);
      if (reply) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, replies: [...(p.replies ?? []), reply as ReplyData] }
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

  // ── File upload handler ───────────────────────────────────────

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file ) return;

    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadedFile = await uploadGroupFile(userEmail, courseSlug, formData);
      if (uploadedFile) {
        setFiles((prev) => [uploadedFile as FileData, ...prev]);
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Tab counts ────────────────────────────────────────────────

  const tabCounts: Record<Tab, number> = {
    discussions: posts.length,
    files: files.length,
    members: members.length,
  };

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[var(--color-border-subtle)] pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl transition-colors relative',
              activeTab === tab.key
                ? 'text-accent bg-accent/5 border border-[var(--color-border-subtle)] border-b-transparent -mb-px'
                : 'text-muted hover:text-foreground hover:bg-surface-light'
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span
              className={clsx(
                'text-xs px-1.5 py-0.5 rounded-full',
                activeTab === tab.key
                  ? 'bg-accent/10 text-accent'
                  : 'bg-surface-light text-muted'
              )}
            >
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:text-red-300 ml-2">
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ── Main Content ── */}
        <div className="lg:col-span-3">
          {activeTab === 'discussions' && (
            <DiscussionsTab
              posts={posts}
              content={content}
              isPosting={isPosting}
              replyContent={replyContent}
              replyingTo={replyingTo}
              isReplying={isReplying}
              onContentChange={setContent}
              onPost={handlePost}
              onReplyContentChange={(id, val) =>
                setReplyContent((prev) => ({ ...prev, [id]: val }))
              }
              onToggleReply={(id) =>
                setReplyingTo((prev) => (prev === id ? null : id))
              }
              onReply={handleReply}
            />
          )}

          {activeTab === 'files' && (
            <FilesTab
              files={files}
              isUploading={isUploading}
              fileInputRef={fileInputRef}
              onFileSelect={handleFileUpload}
            />
          )}

          {activeTab === 'members' && (
            <MembersTab members={members} />
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-1">
          <Sidebar
            activeTab={activeTab}
            members={members}
            posts={posts}
            files={files}
          />
        </div>
      </div>
    </div>
  );
}

// ── Discussions Tab ─────────────────────────────────────────────────

function DiscussionsTab({
  posts,
  content,
  isPosting,
  replyContent,
  replyingTo,
  isReplying,
  onContentChange,
  onPost,
  onReplyContentChange,
  onToggleReply,
  onReply,
}: {
  posts: PostData[];
  content: string;
  isPosting: boolean;
  replyContent: Record<string, string>;
  replyingTo: string | null;
  isReplying: boolean;
  onContentChange: (v: string) => void;
  onPost: () => Promise<void>;
  onReplyContentChange: (postId: string, val: string) => void;
  onToggleReply: (postId: string) => void;
  onReply: (postId: string) => Promise<void>;
}) {
  return (
    <div className="space-y-6">
      {/* Compose */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5">
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Ask a question, share a resource, or discuss the course material..."
          className="w-full bg-transparent text-foreground placeholder:text-muted text-sm resize-none outline-none min-h-[100px]"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              onPost();
            }
          }}
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-muted text-xs">
            {content.length > 0
              ? `${content.length} characters`
              : '⌘+Enter to post'}
          </span>
          <button
            onClick={onPost}
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
        <EmptyState
          icon={
            <svg className="w-7 h-7 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          }
          title="No posts yet"
          subtitle="Be the first to start a discussion!"
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              replyContent={replyContent}
              replyingTo={replyingTo}
              isReplying={isReplying}
              onReplyContentChange={onReplyContentChange}
              onToggleReply={onToggleReply}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Files Tab ────────────────────────────────────────────────────────

function FilesTab({
  files,
  isUploading,
  fileInputRef,
  onFileSelect,
}: {
  files: FileData[];
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Upload */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5">
        <div
          className={clsx(
            'border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
            isUploading
              ? 'border-accent/30 bg-accent/5'
              : 'border-[var(--color-border-subtle)] hover:border-accent/30 hover:bg-surface-light'
          )}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={onFileSelect}
            disabled={isUploading}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              <span className="text-muted text-sm">Uploading...</span>
            </div>
          ) : (
            <>
              <svg
                className="w-10 h-10 text-muted mx-auto mb-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-foreground-muted text-sm font-medium">
                Drop files here or click to browse
              </p>
              <p className="text-muted text-xs mt-1">
                Images, PDFs, documents — max 10 MB
              </p>
            </>
          )}
        </div>
      </div>

      {/* File list */}
      {files.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-7 h-7 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
          title="No files shared yet"
          subtitle="Upload course materials, templates, or resources."
        />
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Members Tab ──────────────────────────────────────────────────────

function MembersTab({ members }: { members: MemberData[] }) {
  return (
    <div className="space-y-6">
      {members.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-7 h-7 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          }
          title="No members yet"
          subtitle="Enrolled students will appear here."
        />
      ) : (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl divide-y divide-[var(--color-border-subtle)]">
          {members.map((m, i) => (
            <div
              key={m.userId}
              className="flex items-center gap-4 px-5 py-4 hover:bg-surface-light/50 transition-colors"
            >
              <span className="text-muted text-xs font-mono w-6 text-right">
                {i + 1}
              </span>
              <Image
                src={
                  m.user.avatar ??
                  'https://api.dicebear.com/9.x/initials/svg?seed=User'
                }
                alt={m.user.name}
                width={40}
                height={40}
                className="rounded-full border border-white/10 object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-bold">
                  {m.user.name}
                </p>
                {m.user.username && (
                  <p className="text-muted text-xs">@{m.user.username}</p>
                )}
              </div>
              <span className="text-muted text-xs shrink-0">
                Joined {timeAgo(m.joinedAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────

function Sidebar({
  activeTab,
  members,
  posts,
  files,
}: {
  activeTab: Tab;
  members: MemberData[];
  posts: PostData[];
  files: FileData[];
}) {
  return (
    <div className="space-y-4">
      {/* Quick stats */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5">
        <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
          Group Stats
        </h3>
        <div className="space-y-3">
          <StatRow label="Members" value={members.length} />
          <StatRow label="Discussions" value={posts.length} />
          <StatRow label="Files" value={files.length} />
        </div>
      </div>

      {/* Recent members (compact) */}
      {activeTab !== 'members' && members.length > 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5 sticky top-24">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
            Members ({members.length})
          </h3>
          <div className="space-y-2.5">
            {members.slice(0, 10).map((m) => (
              <div key={m.userId} className="flex items-center gap-3 group">
                <Image
                  src={
                    m.user.avatar ??
                    'https://api.dicebear.com/9.x/initials/svg?seed=User'
                  }
                  alt={m.user.name}
                  width={32}
                  height={32}
                  className="rounded-full border border-white/10 object-cover shrink-0"
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
          {members.length > 10 && (
            <p className="text-muted text-xs mt-3">
              +{members.length - 10} more
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-foreground-muted text-sm">{label}</span>
      <span className="font-heading font-bold text-foreground text-sm">
        {value}
      </span>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] flex items-center justify-center">
        {icon}
      </div>
      <p className="text-foreground-muted text-sm font-medium">{title}</p>
      <p className="text-muted text-xs mt-1">{subtitle}</p>
    </div>
  );
}

function FileRow({ file }: { file: FileData }) {
  const ext = file.fileName.split('.').pop()?.toLowerCase() ?? '';
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext);
  const isPdf = ext === 'pdf';

  return (
    <a
      href={file.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 px-5 py-3.5 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-xl hover:border-accent/20 transition-colors group"
    >
      <div
        className={clsx(
          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
          isImage && 'bg-blue-500/10 text-blue-400',
          isPdf && 'bg-red-500/10 text-red-400',
          !isImage && !isPdf && 'bg-accent/10 text-accent'
        )}
      >
        {isImage ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        ) : isPdf ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-foreground text-sm font-medium truncate group-hover:text-accent transition-colors">
          {file.fileName}
        </p>
        <p className="text-muted text-xs">
          {formatFileSize(file.fileSize)} · Uploaded by {file.uploader.name} ·{' '}
          {timeAgo(file.createdAt)}
        </p>
      </div>
      <svg
        className="w-4 h-4 text-muted group-hover:text-foreground transition-colors shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </a>
  );
}

// ── Post Card ────────────────────────────────────────────────────────

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
        <Image
          src={
            post.author.avatar ??
            'https://api.dicebear.com/9.x/initials/svg?seed=User'
          }
          alt={post.author.name}
          width={36}
          height={36}
          className="rounded-full border border-white/10 object-cover"
        />
        <div>
          <p className="font-heading font-bold text-foreground text-sm">
            {post.author.name}
          </p>
          <p className="text-muted text-xs font-mono">
            {timeAgo(post.createdAt)}
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
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        Reply{(post.replies ?? []).length > 0 ? ` (${(post.replies ?? []).length})` : ''}
      </button>

      {/* Replies */}
      {(post.replies ?? []).length > 0 && (
        <div className="mt-3 pl-4 border-l-2 border-[var(--color-border-subtle)] space-y-3">
          {post.replies!.map((reply) => (
            <div key={reply.id}>
              <div className="flex items-center gap-2 mb-1">
                <Image
                  src={
                    reply.author.avatar ??
                    'https://api.dicebear.com/9.x/initials/svg?seed=User'
                  }
                  alt={reply.author.name}
                  width={20}
                  height={20}
                  className="rounded-full border border-white/10 object-cover"
                />
                <span className="font-bold text-foreground text-xs">
                  {reply.author.name}
                </span>
                <span className="text-muted text-[10px] font-mono">
                  {timeAgo(reply.createdAt)}
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
                disabled={!(replyContent[post.id] ?? '').trim() || isReplying}
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
