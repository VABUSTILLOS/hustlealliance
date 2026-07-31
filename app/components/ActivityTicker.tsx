'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useToast } from './ToastProvider';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ActivityEventTemplate {
  key: keyof typeof import('@/lib/i18n/translations').default.en.activityTicker;
  params: Record<string, string>;
  icon: string;
  type: 'success' | 'info' | 'streak';
}

const eventTemplates: ActivityEventTemplate[] = [
  { key: 'unlocked', params: { name: 'Sarah K.', resource: 'Growth Marketing' }, icon: '🔓', type: 'streak' },
  { key: 'joinedAlliance', params: { name: 'Diego R.' }, icon: '🎉', type: 'info' },
  { key: 'completed', params: { name: 'Marcus C.', course: 'Fundraising 101' }, icon: '✅', type: 'success' },
  { key: 'startedMastermind', params: { name: 'Priya P.' }, icon: '🧠', type: 'info' },
  { key: 'unlocked', params: { name: 'James O.', resource: 'SaaS Pricing Models' }, icon: '🔓', type: 'streak' },
  { key: 'closedSeed', params: { name: 'Elena T.', amount: '$2.5M' }, icon: '💰', type: 'success' },
  { key: 'launchedPH', params: { name: 'Devon W.' }, icon: '🚀', type: 'info' },
  { key: 'hitStreak', params: { name: 'Amara O.', days: '30' }, icon: '🔥', type: 'streak' },
  { key: 'unlocked', params: { name: 'Alex N.', resource: 'Term Sheet Guide' }, icon: '🔓', type: 'streak' },
  { key: 'featuredTC', params: { name: 'Lisa W.' }, icon: '📰', type: 'success' },
  { key: 'completed', params: { name: 'Tomás F.', course: 'PMF Framework' }, icon: '✅', type: 'success' },
  { key: 'landedDeal', params: { name: 'Rachel A.' }, icon: '💼', type: 'success' },
  { key: 'joinedMastermind', params: { name: 'Kevin L.', niche: 'Fintech' }, icon: '🤝', type: 'info' },
  { key: 'sharedTemplate', params: { name: 'Maya S.' }, icon: '📧', type: 'info' },
  { key: 'unlocked', params: { name: 'Jordan P.', resource: 'Zero-Budget Launch' }, icon: '🔓', type: 'streak' },
  { key: 'crossedMRR', params: { name: 'Nina K.', amount: '$10K' }, icon: '📈', type: 'success' },
  { key: 'startedChallenge', params: { name: 'Omar H.' }, icon: '🏆', type: 'streak' },
  { key: 'hiredFirst', params: { name: 'Grace T.' }, icon: '👋', type: 'info' },
  { key: 'completed', params: { name: 'Felix R.', course: 'Growth Playbook' }, icon: '✅', type: 'success' },
  { key: 'upgradedPro', params: { name: 'Zara M.' }, icon: '⭐', type: 'info' },
];

function interpolate(template: string, params: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`);
}

export default function ActivityTicker() {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const usedIndices = useRef<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildMessage = useCallback(
    (template: ActivityEventTemplate): string => {
      const raw = t.activityTicker[template.key];
      return interpolate(raw, template.params);
    },
    [t.activityTicker],
  );

  useEffect(() => {
    function scheduleNext() {
      if (usedIndices.current.size >= eventTemplates.length) {
        usedIndices.current.clear();
      }
      let index: number;
      do {
        index = Math.floor(Math.random() * eventTemplates.length);
      } while (usedIndices.current.has(index));

      usedIndices.current.add(index);
      const template = eventTemplates[index];
      const delay = 8000 + Math.random() * 7000;

      timerRef.current = setTimeout(() => {
        addToast({
          message: buildMessage(template),
          icon: template.icon,
          type: template.type,
          duration: 4500,
        });
        scheduleNext();
      }, delay);
    }

    timerRef.current = setTimeout(scheduleNext, 3000 + Math.random() * 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [addToast, buildMessage]);

  return null;
}
