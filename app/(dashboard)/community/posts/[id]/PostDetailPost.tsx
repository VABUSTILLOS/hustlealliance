'use client';

import { useState } from 'react';
import type { CommunityPostItem } from '@/lib/db/community';
import { useLikeToggle } from '../../hooks/useLikeToggle';
import { PostCard } from '../../components/PostCard';

interface PostDetailPostProps {
  post: CommunityPostItem;
  currentUserId?: string;
  currentUserRole?: string;
  initialIsLiked: boolean;
  commentChildren?: React.ReactNode;
}

/**
 * Detail-page wrapper that gives PostCard a working like toggle.
 * The feed pages manage like state via TanStack Query caches; the detail
 * page is server-rendered, so we keep a local optimistic state here.
 */
export function PostDetailPost({
  post,
  currentUserId,
  currentUserRole,
  initialIsLiked,
  commentChildren,
}: PostDetailPostProps) {
  const [liked, setLiked] = useState(initialIsLiked);
  const { mutate: toggleLikeApi } = useLikeToggle();

  const handleToggleLike = () => {
    const next = !liked;
    setLiked(next);
    toggleLikeApi(
      { postId: post.id, action: next ? 'like' : 'unlike' },
      { onError: () => setLiked(!next) },
    );
  };

  return (
    <PostCard
      post={{ ...post, isLiked: initialIsLiked }}
      currentUserId={currentUserId}
      currentUserRole={currentUserRole}
      isLiked={liked}
      onToggleLike={handleToggleLike}
      commentsOpen={true}
      commentChildren={commentChildren}
    />
  );
}
