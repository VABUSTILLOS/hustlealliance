'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { SearchResult } from '@/lib/db/search';
import { useTranslation } from '@/lib/i18n/useTranslation';

const TYPE_CONFIG: Record<string, {
  icon: React.ReactNode;
  getHref: (id: string) => string;
}> = {
  user: {
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>,
    getHref: () => '#', // Users don't have a slug route yet
  },
  post: {
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    getHref: () => '/community',
  },
  group: {
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    getHref: (id) => `/spaces/${id}`,
  },
  event: {
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    getHref: () => '/dashboard', // Events route TBD
  },
  job: {
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
    getHref: () => '/dashboard', // Jobs route TBD
  },
};

interface SearchResultItemProps {
  result: SearchResult;
  onSelect: (() => void) | undefined;
}

export function SearchResultItem({ result, onSelect }: SearchResultItemProps) {
  const { t } = useTranslation();
  const config = TYPE_CONFIG[result.entityType] ?? TYPE_CONFIG.user;
  const href = config.getHref(result.entityId);
  const typeLabel =
    result.entityType === 'post'
      ? t.search.typePost
      : result.entityType === 'group'
        ? t.search.typeGroup
        : result.entityType === 'event'
          ? t.search.typeEvent
          : result.entityType === 'job'
            ? t.search.typeJob
            : t.search.typeMember;

  return (
    <Link
      href={href}
      onClick={onSelect}
      className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--color-surface-light)] rounded-lg transition-colors duration-150 group"
    >
      {/* Type icon + avatar */}
      <div className="relative flex-shrink-0 mt-0.5">
        {result.avatarUrl ? (
          <Image
            src={result.avatarUrl}
            alt=""
            width={36}
            height={36}
            className="rounded-full border border-[var(--color-border-subtle)] object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            {config.icon}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium text-accent uppercase tracking-wide">
            {typeLabel}
          </span>
          {result.rank > 0 && (
            <span className="text-[10px] text-muted">
              {t.search.percentMatch.replace('{pct}', (result.rank * 100).toFixed(0))}
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
          {result.title}
        </p>
        {result.subtitle && (
          <p className="text-xs text-muted truncate mt-0.5">{result.subtitle}</p>
        )}
        {result.snippet && (
          <p
            className="text-xs text-muted mt-1 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: result.snippet }}
          />
        )}
      </div>

      {/* Arrow */}
      <svg
        className="w-4 h-4 text-muted mt-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  );
}
