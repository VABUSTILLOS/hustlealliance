'use client';

import { useState } from 'react';
import { getInitialsAvatarUrl, DEFAULT_AVATAR } from '@/lib/utils/avatar';
import Image from 'next/image';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface Member {
  id: string;
  user: {
    id: string;
    name: string;
    username: string | null;
    avatar: string | null;
    headline?: string | null;
  };
  role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: string;
}

interface MemberListProps {
  members: Member[];
  currentUserRole: string | null;
  onRoleChange?: (userId: string, role: string) => void;
  onRemove?: (userId: string) => void;
  onInvite?: () => void;
}

const roleBadge: Record<string, { label: string; color: string }> = {
  OWNER: { label: 'Owner', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  ADMIN: { label: 'Admin', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
  MODERATOR: { label: 'Mod', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  MEMBER: { label: 'Member', color: 'bg-muted/10 text-muted border-muted/30' },
};

export function MemberList({
  members,
  currentUserRole,
  onRoleChange,
  onRemove,
  onInvite,
}: MemberListProps) {
  const [search, setSearch] = useState('');
  const isAdmin = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.user.name.toLowerCase().includes(q) ||
      (m.user.username?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div>
      {/* Search + Invite */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-light border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted outline-none focus:border-accent/30"
          />
        </div>
        {isAdmin && onInvite && (
          <button
            onClick={onInvite}
            className="px-3 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold uppercase hover:bg-accent/20 transition-colors shrink-0"
          >
            + Invite
          </button>
        )}
      </div>

      {/* Members list */}
      {filtered.length === 0 ? (
        <p className="text-muted text-sm py-8 text-center">
          {search ? 'No members match your search.' : 'No members yet.'}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-surface-light"
            >
              <Image
                src={member.user.avatar ?? getInitialsAvatarUrl(member.user.name)}
                alt={member.user.name}
                width={40}
                height={40}
                className="rounded-full border border-white/10 object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-foreground text-sm truncate">
                  {member.user.name}
                </p>
                <p className="font-mono text-[10px] text-muted">
                  @{member.user.username ?? 'user'}
                </p>
              </div>
              <span
                className={clsx(
                  'px-2 py-0.5 rounded-full text-[9px] font-mono uppercase border shrink-0',
                  roleBadge[member.role]?.color ?? roleBadge.MEMBER.color,
                )}
              >
                {roleBadge[member.role]?.label ?? member.role}
              </span>
              {isAdmin && member.role !== 'OWNER' && (
                <div className="flex gap-1 shrink-0">
                  {onRoleChange && (
                    <select
                      value={member.role}
                      onChange={(e) => onRoleChange(member.user.id, e.target.value)}
                      className="bg-surface-light border border-white/10 rounded text-[10px] text-muted px-1 py-0.5 outline-none"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="MODERATOR">Mod</option>
                      <option value="MEMBER">Member</option>
                    </select>
                  )}
                  {onRemove && (
                    <button
                      onClick={() => onRemove(member.user.id)}
                      className="text-red-400 hover:text-red-300 text-xs px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
