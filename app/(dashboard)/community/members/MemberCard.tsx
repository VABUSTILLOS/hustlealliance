'use client';

import Link from 'next/link';
import type { CommunityMemberItem } from '@/lib/db/community';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getInitialsAvatarUrl } from '@/lib/utils/avatar';

const tierBadge = {
  PRO: 'bg-accent text-white',
  BASIC: 'bg-surface-light text-foreground-muted',
  FREE: 'bg-transparent text-muted border border-white/5',
} as const;

export function MemberCard({ member }: { member: CommunityMemberItem }) {
  const { t, locale } = useTranslation();
  const avatarSrc = member.avatar?.startsWith('/')
    ? member.avatar
    : getInitialsAvatarUrl(member.name);
  const memberRole = t.community.rolesMembers.toLowerCase().replace(/s$/, '');
  const tierLabel = {
    PRO: t.community.tierPro,
    BASIC: t.community.tierBasic,
    FREE: t.community.tierFree,
  } as const;
  const roleLabel: Record<string, string> = {
    ADMIN: t.community.roleAdmin,
    INSTRUCTOR: t.community.roleInstructor,
    STUDENT: memberRole.charAt(0).toUpperCase() + memberRole.slice(1),
  };
  const experienceLabel = member.yearsExperience
    ? `${member.yearsExperience}${t.community.yearsExperience.startsWith('y') ? '' : ' '}${t.community.yearsExperience}`
    : null;

  return (
    <Link href={`/community/members/${member.username || member.id}`} className="block">
      <div className="bg-surface border border-white/5 rounded-2xl p-5 hover:border-accent transition-colors group cursor-pointer h-full">
        <div className="flex items-start gap-4 mb-3">
          <div className="relative w-12 h-12 rounded-full bg-surface-light overflow-hidden shrink-0">
            <img
              src={avatarSrc}
              alt={member.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
            {member.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-surface" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading font-bold text-white text-sm truncate">
                {member.name}
              </h3>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${tierBadge[member.membershipTier as keyof typeof tierBadge] || tierBadge.FREE}`}>
                {tierLabel[member.membershipTier as keyof typeof tierLabel] || member.membershipTier}
              </span>
            </div>
            <p className="text-xs text-muted font-mono mt-0.5">
              @{member.username || t.community.anonymous} · {roleLabel[member.role] || member.role}
            </p>
          </div>
        </div>

        {member.headline && (
          <p className="text-sm text-foreground-muted line-clamp-2 mb-3 leading-relaxed">
            {member.headline}
          </p>
        )}

        {(member.location || experienceLabel) && (
          <div className="flex items-center gap-3 text-xs text-muted font-mono mb-3">
            {member.location && <span>📍 {member.location}</span>}
            {experienceLabel && <span>🕐 {experienceLabel}</span>}
          </div>
        )}

        {member.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {member.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-light text-foreground-muted"
              >
                {skill}
              </span>
            ))}
            {member.skills.length > 4 && (
              <span className="text-[10px] font-mono text-muted">
                +{member.skills.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-muted font-mono pt-3 border-t border-white/5">
          <span>{member.postCount} {t.community.postsLabel}</span>
          <span>{member.commentCount} {t.community.commentsLabel}</span>
          <span className="ml-auto">
            {t.community.joined} {new Date(member.joinedAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    </Link>
  );
}
