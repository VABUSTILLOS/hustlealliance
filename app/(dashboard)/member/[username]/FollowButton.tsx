'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ProfileSocial {
  user: { id: string; name: string | null; username: string | null; avatar: string | null; headline: string | null };
  followers: number;
  following: number;
  isFollowing: boolean;
}

export function FollowButton({ username, isOwnProfile }: { username: string; isOwnProfile: boolean }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data } = useQuery<ProfileSocial>({
    queryKey: ['profile-social', username],
    queryFn: async () => {
      const res = await fetch(`/api/users/by-username/${encodeURIComponent(username)}`);
      if (!res.ok) throw new Error('not found');
      return res.json();
    },
    retry: false,
    staleTime: 60_000,
  });

  const mutation = useMutation({
    mutationFn: async (following: boolean) => {
      if (!data) return;
      const res = await fetch(`/api/users/${data.user.id}/follow`, {
        method: following ? 'DELETE' : 'POST',
      });
      if (!res.ok) throw new Error('failed');
    },
    onMutate: async (following) => {
      await queryClient.cancelQueries({ queryKey: ['profile-social', username] });
      const prev = queryClient.getQueryData<ProfileSocial>(['profile-social', username]);
      if (prev) {
        queryClient.setQueryData<ProfileSocial>(['profile-social', username], {
          ...prev,
          isFollowing: !following,
          followers: prev.followers + (following ? -1 : 1),
        });
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['profile-social', username], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['profile-social', username] }),
  });

  if (!data) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="text-right font-mono text-xs text-muted">
        <span className="text-foreground font-bold">{data.followers}</span> {t.profile.followers}
        <span className="mx-1.5">·</span>
        <span className="text-foreground font-bold">{data.following}</span> {t.profile.following}
      </div>
      {!isOwnProfile && (
        <button
          onClick={() => mutation.mutate(data.isFollowing)}
          disabled={mutation.isPending}
          className={`shrink-0 px-4 py-2 font-heading font-bold text-sm rounded-xl border transition-colors disabled:opacity-50 ${
            data.isFollowing
              ? 'bg-surface-light border-surface-light text-foreground hover:border-red-500/40 hover:text-red-400'
              : 'bg-accent border-accent text-white hover:opacity-90'
          }`}
        >
          {data.isFollowing ? t.profile.unfollow : t.profile.follow}
        </button>
      )}
    </div>
  );
}
