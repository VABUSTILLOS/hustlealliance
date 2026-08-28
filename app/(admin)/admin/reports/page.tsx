'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { formatDate } from '@/lib/utils/format-date';

type Reporter = { id: string; name: string; email: string; avatar: string | null };

type Report = {
  id: string;
  reason: string;
  createdAt: string;
  user: Reporter;
};

type ReportedPost = {
  id: string;
  content: string;
  imageUrls: string[];
  isDeleted: boolean;
  createdAt: string;
  author: Reporter;
  group: { id: string; name: string; slug: string } | null;
  reports: Report[];
  _count: { reports: number };
};

export default function AdminReportsPage() {
  const { locale } = useTranslation();
  const [posts, setPosts] = useState<ReportedPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [acting, setActing] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (includeDeleted) params.set('includeDeleted', 'true');
    fetch(`/api/admin/reports?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setPosts(data.posts || []);
        setTotal(data.total || 0);
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [includeDeleted, refreshKey]);

  const handleAction = async (postId: string, action: 'dismiss' | 'deletePost' | 'restorePost') => {
    setActing(postId + action);
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action }),
      });
      if (!res.ok) throw new Error('Action failed');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-white uppercase">🚨 Moderation queue</h1>
          <p className="text-foreground-muted text-sm mt-1">
            {total} reported {total === 1 ? 'post' : 'posts'}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground-muted cursor-pointer">
          <input
            type="checkbox"
            checked={includeDeleted}
            onChange={(e) => setIncludeDeleted(e.target.checked)}
            className="rounded"
          />
          Include deleted posts
        </label>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 bg-surface border border-surface-light rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-foreground-muted text-sm">No reports to review. All clear!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-surface border border-surface-light rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {post.author.name || post.author.email}
                    </span>
                    <span className="text-xs text-muted">
                      {formatDate(post.createdAt, { locale, month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {post.group && (
                      <span className="text-xs bg-surface-light text-foreground-muted px-2 py-0.5 rounded-full">
                        {post.group.name}
                      </span>
                    )}
                    {post.isDeleted && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                        Deleted
                      </span>
                    )}
                    <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-mono">
                      🚨 {post._count.reports} {post._count.reports === 1 ? 'report' : 'reports'}
                    </span>
                  </div>
                  <p className="text-sm text-foreground-muted line-clamp-3 whitespace-pre-wrap">
                    {post.content}
                  </p>
                  {post.imageUrls.length > 0 && (
                    <p className="text-xs text-muted mt-1">📷 {post.imageUrls.length} image(s)</p>
                  )}

                  <button
                    onClick={() => setExpanded(expanded === post.id ? null : post.id)}
                    className="text-xs text-accent hover:underline mt-2"
                  >
                    {expanded === post.id ? 'Hide reports ▲' : 'View reports ▼'}
                  </button>

                  {expanded === post.id && (
                    <div className="mt-3 space-y-2 border-t border-surface-light pt-3">
                      {post.reports.map((report) => (
                        <div key={report.id} className="flex items-start gap-2 text-xs">
                          <span className="text-muted whitespace-nowrap">
                            {formatDate(report.createdAt, { locale, month: 'short', day: 'numeric' })}
                          </span>
                          <div>
                            <span className="text-foreground font-medium">
                              {report.user.name || report.user.email}
                            </span>
                            <p className="text-foreground-muted mt-0.5">{report.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {!post.isDeleted ? (
                    <>
                      <button
                        onClick={() => handleAction(post.id, 'dismiss')}
                        disabled={acting !== null}
                        className="px-3 py-1.5 text-xs font-medium bg-surface-light hover:bg-surface-light/70 text-foreground rounded-lg transition-colors disabled:opacity-50"
                      >
                        {acting === post.id + 'dismiss' ? '…' : 'Dismiss'}
                      </button>
                      <button
                        onClick={() => handleAction(post.id, 'deletePost')}
                        disabled={acting !== null}
                        className="px-3 py-1.5 text-xs font-medium bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {acting === post.id + 'deletePost' ? '…' : 'Delete post'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleAction(post.id, 'restorePost')}
                      disabled={acting !== null}
                      className="px-3 py-1.5 text-xs font-medium bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {acting === post.id + 'restorePost' ? '…' : 'Restore'}
                    </button>
                  )}
                  <a
                    href={`/community/posts/${post.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-medium text-accent hover:underline text-center"
                  >
                    View post
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
