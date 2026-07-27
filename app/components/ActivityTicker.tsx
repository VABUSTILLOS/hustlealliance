'use client';

import { useEffect, useRef } from 'react';
import { useToast } from './ToastProvider';

interface ActivityEvent {
  message: string;
  icon: string;
  type: 'success' | 'info' | 'streak';
}

const events: ActivityEvent[] = [
  { message: 'Sarah K. unlocked Growth Marketing', icon: '🔓', type: 'streak' },
  { message: 'Diego R. just joined the Alliance', icon: '🎉', type: 'info' },
  { message: 'Marcus C. completed Fundraising 101', icon: '✅', type: 'success' },
  { message: 'Priya P. started a new mastermind', icon: '🧠', type: 'info' },
  { message: 'James O. unlocked SaaS Pricing Models', icon: '🔓', type: 'streak' },
  { message: 'Elena T. closed $2.5M seed round', icon: '💰', type: 'success' },
  { message: 'Devon W. launched on Product Hunt', icon: '🚀', type: 'info' },
  { message: 'Amara O. hit a 30-day streak', icon: '🔥', type: 'streak' },
  { message: 'Alex N. unlocked Term Sheet Guide', icon: '🔓', type: 'streak' },
  { message: 'Lisa W. got featured in TechCrunch', icon: '📰', type: 'success' },
  { message: 'Tomás F. completed PMF Framework', icon: '✅', type: 'success' },
  { message: 'Rachel A. landed first enterprise deal', icon: '💼', type: 'success' },
  { message: 'Kevin L. joined Fintech mastermind', icon: '🤝', type: 'info' },
  { message: 'Maya S. shared a cold email template', icon: '📧', type: 'info' },
  { message: 'Jordan P. unlocked Zero-Budget Launch', icon: '🔓', type: 'streak' },
  { message: 'Nina K. crossed $10K MRR milestone', icon: '📈', type: 'success' },
  { message: 'Omar H. started a community challenge', icon: '🏆', type: 'streak' },
  { message: 'Grace T. hired her first employee', icon: '👋', type: 'info' },
  { message: 'Felix R. completed Growth Playbook', icon: '✅', type: 'success' },
  { message: 'Zara M. just upgraded to Pro', icon: '⭐', type: 'info' },
];

export default function ActivityTicker() {
  const { addToast } = useToast();
  const usedIndices = useRef<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function scheduleNext() {
      // Pick an event we haven't shown recently
      if (usedIndices.current.size >= events.length) {
        usedIndices.current.clear();
      }
      let index: number;
      do {
        index = Math.floor(Math.random() * events.length);
      } while (usedIndices.current.has(index));

      usedIndices.current.add(index);
      const event = events[index];
      const delay = 8000 + Math.random() * 7000; // 8–15 seconds

      timerRef.current = setTimeout(() => {
        addToast({
          message: event.message,
          icon: event.icon,
          type: event.type,
          duration: 4500,
        });
        scheduleNext();
      }, delay);
    }

    // Initial delay: 3–6 seconds before first toast
    timerRef.current = setTimeout(scheduleNext, 3000 + Math.random() * 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [addToast]);

  // This component renders nothing — it just triggers toasts
  return null;
}
