import Link from 'next/link';
import Image from 'next/image';
import { getPostDetailCached } from '@/lib/db/community';
import { getInitialsAvatarUrl, DEFAULT_AVATAR } from '@/lib/utils/avatar';
import { getCommentsForPost } from '@/lib/db/community';
import { getCurrentUser } from '@/lib/auth/user';
import { PostCard } from '../../components/PostCard';
import { CommunityHeader } from '../../CommunityHeader';

// ISR: revalidate post detail pages every 60s
export const revalidate = 60;

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const [post, comments] = await Promise.all([
    getPostDetailCached(id),
    getCommentsForPost(id),
  ]);

  if (!post) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
        <CommunityHeader />
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="font-display text-2xl text-[var(--color-foreground)] uppercase mb-3">
            Post Not Found
          </h2>
          <p className="text-[var(--color-foreground-muted)] text-sm mb-6">
            This post may have been deleted or doesn&apos;t exist.
          </p>
          <Link
            href="/community"
            className="px-6 py-2 bg-accent text-white rounded-xl font-heading font-bold text-sm hover:bg-accent-glow transition-all"
          >
            Back to Community
          </Link>
        </div>
      </div>
    );
  }

  const mappedPost = {
    id: post.id,
    author: post.author,
    content: post.content,
    excerpt: post.excerpt,
    locale: post.locale,
    space: post.space,
    createdAt: post.createdAt,
    commentCount: post.commentCount,
    likeCount: post.likeCount,
    shareCount: post.shareCount,
    isPinned: post.isPinned,
    isEdited: post.isEdited,
    imageUrls: post.imageUrls,
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <CommunityHeader />

      {/* Back navigation */}
      <div className="mb-4">
        <Link
          href="/community"
          className="inline-flex items-center gap-1.5 text-muted hover:text-foreground text-sm font-mono transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Community
        </Link>
      </div>

      {/* Main post */}
      <PostCard
        post={mappedPost}
        currentUserId={user?.id}
        currentUserRole={user?.role}
        commentsOpen={true}
        commentChildren={
          <div className="mt-4 pt-4 border-t border-surface-light space-y-3">
            {comments.length === 0 ? (
              <p className="text-muted text-xs text-center py-4">No comments yet. Be the first!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-2 ml-4">
                  <Image
                    src={comment.author.avatar ?? getInitialsAvatarUrl(comment.author.name)}
                    alt=""
                    width={24}
                    height={24}
                    className="rounded-full border border-white/10 object-cover shrink-0 mt-0.5"
                  />
                  <div className="bg-surface-light rounded-xl px-3 py-2 flex-1">
                    <p className="font-heading font-bold text-foreground text-xs">{comment.author.name}</p>
                    <p className="text-foreground-muted text-xs">{comment.content}</p>
                    <p className="text-[10px] text-muted mt-1">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        }
      />

      {/* Post metadata */}
      <div className="mt-4 bg-surface border border-surface-light rounded-2xl p-5">
        <h3 className="font-heading font-bold text-foreground text-sm mb-3">Post Details</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-surface-light rounded-xl p-3 text-center">
            <p className="text-2xl font-heading font-bold text-foreground">{post.likeCount}</p>
            <p className="text-[10px] text-muted font-mono uppercase">Likes</p>
          </div>
          <div className="bg-surface-light rounded-xl p-3 text-center">
            <p className="text-2xl font-heading font-bold text-foreground">{post.commentCount}</p>
            <p className="text-[10px] text-muted font-mono uppercase">Comments</p>
          </div>
          <div className="bg-surface-light rounded-xl p-3 text-center">
            <p className="text-2xl font-heading font-bold text-foreground">{post.shareCount}</p>
            <p className="text-[10px] text-muted font-mono uppercase">Shares</p>
          </div>
          <div className="bg-surface-light rounded-xl p-3 text-center">
            <p className="text-2xl font-heading font-bold text-foreground">
              {post.visibility === 'PUBLIC' ? '🌐' : '👥'}
            </p>
            <p className="text-[10px] text-muted font-mono uppercase">Visibility</p>
          </div>
        </div>
      </div>
    </div>
  );
}
