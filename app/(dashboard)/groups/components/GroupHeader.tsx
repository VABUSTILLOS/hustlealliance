'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { JoinButton } from './JoinButton';
import { InviteLinkButton } from './InviteLinkButton';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface GroupHeaderProps {
  groupId: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  avatar: string | null;
  memberCount: number;
  currentUserMember: boolean;
  currentUserRole: string | null;
  onJoin: () => void;
  onLeave: () => void;
  joinPending: boolean;
  isAdmin: boolean;
}

export function GroupHeader({
  groupId,
  name,
  description,
  coverImage,
  avatar,
  memberCount,
  currentUserMember,
  currentUserRole,
  onJoin,
  onLeave,
  joinPending,
  isAdmin,
}: GroupHeaderProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Cover image */}
      <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden mb-4">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 700px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-surface to-surface-light flex items-center justify-center">
            <span className="text-7xl opacity-20">👥</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50" />
      </div>

      {/* Name and meta */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          {avatar && (
            <Image
              src={avatar}
              alt={name}
              width={64}
              height={64}
              className="rounded-xl border-2 border-surface-light object-cover -mt-12 mb-3 relative z-10 bg-surface"
            />
          )}
          <h1 className="font-display text-3xl sm:text-4xl text-foreground uppercase leading-none mb-2">
            {name}
          </h1>
          <p className="text-muted text-sm font-mono">
            {memberCount} {t.spaces.members}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUserMember && <InviteLinkButton groupId={groupId} isAdmin={isAdmin} />}
          <JoinButton
            isMember={currentUserMember}
            isPending={joinPending}
            role={currentUserRole}
            onJoin={onJoin}
            onLeave={onLeave}
          />
          {isAdmin && (
            <a
              href="settings"
              className="px-4 py-2 rounded-lg border border-surface-light text-muted text-sm font-mono hover:text-foreground hover:border-accent/30 transition-colors"
            >
              ⚙️ Settings
            </a>
          )}
        </div>
      </div>

      {description && (
        <p className="text-foreground-muted text-sm mb-2">{description}</p>
      )}
    </motion.div>
  );
}
