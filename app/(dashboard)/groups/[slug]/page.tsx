'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useGroup, useGroupMembers, useGroupFeed, useJoinGroup, useLeaveGroup } from '../components/hooks/useGroups';
import { GroupHeader } from '../components/GroupHeader';
import { GroupTabs } from '../components/GroupTabs';
import { MemberList } from '../components/MemberList';
import { GroupEventsTab } from '../components/GroupEventsTab';
import { GroupFilesTab } from '../components/GroupFilesTab';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getInitialsAvatarUrl } from '@/lib/utils/avatar';
import Image from 'next/image';

export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'about' | 'events' | 'files'>('feed');

  const { data: group, isLoading, error } = useGroup(slug);
  const { data: members } = useGroupMembers(group?.id ?? '');
  const { data: feedPages, fetchNextPage, hasNextPage, isFetchingNextPage } = useGroupFeed(group?.id ?? '');

  const joinMutation = useJoinGroup(group?.id ?? '');
  const leaveMutation = useLeaveGroup(group?.id ?? '');

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto animate-pulse">
        <div className="h-48 bg-surface-light rounded-2xl mb-4" />
        <div className="h-8 bg-surface-light rounded w-1/2 mb-2" />
        <div className="h-4 bg-surface-light rounded w-1/4" />
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="px-8 py-20 text-center">
        <h1 className="font-display text-3xl text-foreground mb-4">{t.spaces.notFound}</h1>
        <Link href="/groups" className="text-accent font-mono text-sm hover:underline">
          ← {t.spaces.backToSpaces}
        </Link>
      </div>
    );
  }

  const feedPosts = feedPages?.pages.flat() ?? [];
  const isAdmin = group.currentUserRole === 'OWNER' || group.currentUserRole === 'ADMIN';

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/groups"
        className="inline-flex items-center gap-1 text-muted font-mono text-xs hover:text-accent mb-6 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {t.spaces.allSpaces}
      </Link>

      <GroupHeader
        name={group.name}
        description={group.description}
        coverImage={group.coverImage}
        avatar={group.avatar}
        memberCount={group.memberCount}
        currentUserMember={group.currentUserMember ?? false}
        currentUserRole={group.currentUserRole}
        onJoin={() => joinMutation.mutate()}
        onLeave={() => leaveMutation.mutate()}
        joinPending={joinMutation.isPending}
        isAdmin={isAdmin}
      />

      <GroupTabs active={activeTab} onChange={setActiveTab} />

      {/* Feed tab */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {feedPosts.length === 0 ? (
            <p className="text-muted text-sm py-8 text-center">{t.spaces.noPosts}</p>
          ) : (
            feedPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-surface-light rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={post.author.avatar ?? getInitialsAvatarUrl(post.author.name)}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full border border-white/10 object-cover"
                  />
                  <div>
                    <p className="font-heading font-bold text-foreground text-sm">{post.author.name}</p>
                    <p className="font-mono text-[10px] text-muted">
                      @{post.author.username ?? 'user'}
                    </p>
                  </div>
                  {post.isPinned && (
                    <span className="ml-auto text-[10px] text-accent font-mono uppercase">📌 Pinned</span>
                  )}
                </div>
                <p className="text-foreground-muted text-sm mb-3">{post.content}</p>
                {post.comments.length > 0 && (
                  <div className="border-t border-surface-light pt-3 mt-3 space-y-2">
                    {post.comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-2">
                        <Image
                          src={c.author.avatar ?? getInitialsAvatarUrl(c.author.name)}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded-full border border-white/10 object-cover shrink-0 mt-0.5"
                        />
                        <div>
                          <span className="font-heading font-bold text-foreground text-xs">{c.author.name}</span>{' '}
                          <span className="text-foreground-muted text-xs">{c.content}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          )}
          {hasNextPage && (
            <div className="text-center mt-4">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-2 bg-surface border border-surface-light rounded-xl text-muted font-mono text-sm hover:border-accent/30 hover:text-accent transition-all disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Members tab */}
      {activeTab === 'members' && members && (
        <MemberList
          members={members}
          currentUserRole={group.currentUserRole}
        />
      )}

      {/* About tab */}
      {activeTab === 'about' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-surface-light rounded-2xl p-6 space-y-4"
        >
          <div>
            <h3 className="font-heading font-bold text-foreground text-sm mb-1">Description</h3>
            <p className="text-foreground-muted text-sm">
              {group.description || 'No description provided.'}
            </p>
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground text-sm mb-1">Visibility</h3>
            <span className="px-2 py-0.5 rounded-full bg-surface-light text-muted text-xs font-mono uppercase">
              {group.visibility}
            </span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground text-sm mb-1">Created</h3>
            <p className="text-muted text-xs font-mono">
              {new Date(group.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          {group.creator && (
            <div>
              <h3 className="font-heading font-bold text-foreground text-sm mb-1">Created by</h3>
              <div className="flex items-center gap-2">
                <Image
                  src={group.creator.avatar ?? getInitialsAvatarUrl(group.creator.name)}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded-full border border-white/10 object-cover"
                />
                <span className="text-foreground-muted text-sm">{group.creator.name}</span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Events tab */}
      {activeTab === 'events' && (
        <GroupEventsTab
          groupId={group.id}
          isMember={group.currentUserMember ?? false}
        />
      )}

      {/* Files tab */}
      {activeTab === 'files' && (
        <GroupFilesTab
          groupId={group.id}
          isMember={group.currentUserMember ?? false}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
