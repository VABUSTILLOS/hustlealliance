'use client';

import Link from "next/link";
import type { TrendingTopic } from "@/lib/db/community";
import { useTranslation } from '@/lib/i18n/useTranslation';
import { OnlineNow } from './components/OnlineNow';
import { PeopleYouMayKnow } from './components/PeopleYouMayKnow';

interface TrendingHashtag {
  name: string;
  postCount: number;
}

interface CommunitySidebarProps {
  trending: TrendingTopic[];
  trendingTags?: TrendingHashtag[];
  memberCount?: number;
  postCount?: number;
}

export function CommunitySidebar({ trending, trendingTags = [], memberCount, postCount }: CommunitySidebarProps) {
  const { t } = useTranslation();

  const links = [
    { label: t.community.sidebarGroups, href: '#', icon: '👥', soon: true },
    { label: t.community.sidebarEvents, href: '#', icon: '📅', soon: true },
    { label: t.community.sidebarMessages, href: '#', icon: '💬', soon: true },
    { label: t.community.sidebarMembers, href: '#', icon: '🙋', soon: true },
    { label: 'Saved posts', href: '/community/saved', icon: '🔖', soon: false },
  ];

  return (
    <aside className="space-y-6">
      <OnlineNow />

      <PeopleYouMayKnow compact />

      <div className="bg-surface border border-white/5 rounded-2xl p-5">
        <h3 className="font-heading font-bold text-white text-sm mb-4 uppercase tracking-wider">
          {t.community.quickLinks}
        </h3>
        <nav className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-disabled={link.soon}
              onClick={link.soon ? (e) => e.preventDefault() : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground-muted hover:text-white hover:bg-surface-light transition-colors aria-disabled:opacity-50 aria-disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
              {link.soon && (
                <span className="ml-auto text-[10px] font-mono uppercase text-muted">
                  soon
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {trending.length > 0 && (
        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <h3 className="font-heading font-bold text-white text-sm mb-4 uppercase tracking-wider">
            {t.community.trendingSpaces}
          </h3>
          <div className="space-y-2">
            {trending.map((topic) => (
              <Link
                key={topic.space}
                href={`/spaces/${topic.space}`}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface-light transition-colors focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
              >
                <span className="text-sm text-foreground-muted font-mono">
                  {topic.space}
                </span>
                <span className="text-xs text-muted font-mono">
                  {topic.postCount} {t.community.postsLabel}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {trendingTags.length > 0 && (
        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <h3 className="font-heading font-bold text-white text-sm mb-4 uppercase tracking-wider">
            Trending topics
          </h3>
          <div className="space-y-2">
            {trendingTags.map((tag) => (
              <Link
                key={tag.name}
                href={`/community/hashtag/${encodeURIComponent(tag.name)}`}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface-light transition-colors focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
              >
                <span className="text-sm text-accent font-mono">
                  #{tag.name}
                </span>
                <span className="text-xs text-muted font-mono">
                  {tag.postCount} {t.community.postsLabel}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface border border-white/5 rounded-2xl p-5">
        <h3 className="font-heading font-bold text-white text-sm mb-4 uppercase tracking-wider">
          {t.community.communityStats}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-light rounded-xl p-3 text-center">
            <p className="font-display text-xl text-accent">
              {memberCount != null ? memberCount.toLocaleString() : '—'}
            </p>
            <p className="text-[10px] text-muted font-mono uppercase mt-1">
              {t.community.statsMembers}
            </p>
          </div>
          <div className="bg-surface-light rounded-xl p-3 text-center">
            <p className="font-display text-xl text-accent">
              {postCount != null ? postCount.toLocaleString() : '—'}
            </p>
            <p className="text-[10px] text-muted font-mono uppercase mt-1">
              {t.community.statsPosts || 'Posts'}
            </p>
          </div>
          <div className="bg-surface-light rounded-xl p-3 text-center">
            <p className="font-display text-xl text-accent">12</p>
            <p className="text-[10px] text-muted font-mono uppercase mt-1">
              {t.community.statsSpaces}
            </p>
          </div>
          <div className="bg-surface-light rounded-xl p-3 text-center">
            <p className="font-display text-xl text-accent">24/7</p>
            <p className="text-[10px] text-muted font-mono uppercase mt-1">
              {t.community.support}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
