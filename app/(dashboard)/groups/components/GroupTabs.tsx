'use client';

import clsx from 'clsx';
import { useTranslation } from '@/lib/i18n/useTranslation';

type GroupTab = 'feed' | 'members' | 'about' | 'events' | 'files' | 'media';

interface GroupTabsProps {
  active: GroupTab;
  onChange: (tab: GroupTab) => void;
}

export function GroupTabs({ active, onChange }: GroupTabsProps) {
  const { t } = useTranslation();

  const tabs: { id: GroupTab; label: string }[] = [
    { id: 'feed', label: t.spaces.posts },
    { id: 'members', label: t.spaces.members },
    { id: 'about', label: t.spaceDetail.about },
    { id: 'events', label: 'Events' },
    { id: 'files', label: 'Files' },
    { id: 'media', label: 'Media' },
  ];

  return (
    <div className="flex gap-1 border-b border-surface-light mb-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'px-4 py-3 text-sm font-mono font-semibold border-b-2 transition-colors shrink-0',
            active === tab.id
              ? 'border-accent text-accent'
              : 'border-transparent text-muted hover:text-foreground',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
