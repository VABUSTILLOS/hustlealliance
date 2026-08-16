'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser, saveUserInfo } from '@/lib/hooks/useCurrentUser';
import { heroUsers, memberUsers, noviceUsers, type SeedUser } from '@/lib/seed/users';
import { TEST_USER_COOKIE } from '@/lib/auth/test-user-constants';

const GROUPS: { label: string; users: SeedUser[] }[] = [
  { label: 'Heroes', users: heroUsers },
  { label: 'Members', users: memberUsers },
  { label: 'Novices', users: noviceUsers },
];

export function TestUserSwitcher() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = useCallback(
    (seedUser: SeedUser) => {
      // Persist to cookie (used by server-side getCurrentUser)
      document.cookie = `${TEST_USER_COOKIE}=${seedUser.email};path=/;max-age=86400;SameSite=Lax`;

      // Persist to localStorage + Zustand (used by client-side useCurrentUser)
      saveUserInfo({
        id: '', // will be resolved server-side
        email: seedUser.email,
        name: seedUser.name,
        username: seedUser.username,
        role: seedUser.role,
        membershipTier: seedUser.membershipTier,
        avatar: seedUser.avatar,
      });

      setIsOpen(false);
      router.refresh();
    },
    [router],
  );

  const handleClear = useCallback(() => {
    document.cookie = `${TEST_USER_COOKIE}=;path=/;max-age=0`;
    saveUserInfo({
      id: '00000000-0000-0000-0000-000000000001',
      email: 'founder@hustlealliance.com',
      name: 'Founder (Admin)',
      username: 'founder',
      role: 'ADMIN',
      membershipTier: 'PRO',
      avatar: '/images/avatars/alexk.jpg',
    });
    setIsOpen(false);
    router.refresh();
  }, [router]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-light border border-white/5 hover:border-accent/30 transition-colors text-xs focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
      >
        <span className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-[10px] overflow-hidden">
          {currentUser?.avatar ? (
            <img src={currentUser.avatar} alt="" className="w-full h-full object-cover rounded-full" />
          ) : (
            (currentUser?.name || '?')[0]
          )}
        </span>
        <span className="text-foreground-muted font-mono max-w-[100px] truncate">
          {currentUser?.name || 'Founder'}
        </span>
        <span className="text-[10px] text-accent">▾</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 max-h-80 overflow-y-auto bg-surface border border-white/5 rounded-xl shadow-2xl z-50">
            <div className="p-2 border-b border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-muted font-mono px-2 py-1">
                Test User Picker
              </p>
            </div>
            {GROUPS.map((group) => (
              <div key={group.label}>
                <div className="px-3 pt-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-muted">
                  {group.label}
                </div>
                {group.users.map((u) => (
                  <button
                    key={u.email}
                    onClick={() => handleSelect(u)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-light transition-colors text-left focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                  >
                    <img
                      src={u.avatar}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm text-white truncate">{u.name}</div>
                      <div className="text-[10px] text-muted font-mono">
                        {u.headline.split('|')[0].trim().slice(0, 40)}
                      </div>
                    </div>
                    <span className="ml-auto shrink-0 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-light text-muted">
                      {u.membershipTier}
                    </span>
                  </button>
                ))}
              </div>
            ))}
            <div className="border-t border-white/5 p-2">
              <button
                onClick={handleClear}
                className="w-full text-center text-[10px] font-mono text-muted hover:text-white py-1 transition-colors focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none rounded"
              >
                ↺ Reset to Founder (Admin)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
