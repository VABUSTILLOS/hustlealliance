import type { CommunityMemberItem } from '@/lib/db/community';

const tierBadge = {
  PRO: 'bg-[var(--color-accent)] text-white',
  BASIC: 'bg-[var(--color-surface-light)] text-[var(--color-foreground-muted)]',
  FREE: 'bg-transparent text-[var(--color-muted)] border border-[var(--color-border-subtle)]',
} as const;

const tierLabel = {
  PRO: 'PRO',
  BASIC: 'BASIC',
  FREE: 'FREE',
} as const;

const roleLabel: Record<string, string> = {
  ADMIN: 'Admin',
  INSTRUCTOR: 'Instructor',
  STUDENT: 'Member',
};

export function MemberCard({ member }: { member: CommunityMemberItem }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5 hover:border-[var(--color-border-light)] transition-colors group">
      {/* Top: Avatar + Name */}
      <div className="flex items-start gap-4 mb-3">
        <div className="w-12 h-12 rounded-full bg-[var(--color-surface-light)] overflow-hidden shrink-0">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-bold text-[var(--color-foreground-muted)] uppercase">
              {member.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading font-bold text-[var(--color-foreground)] text-sm truncate">
              {member.name}
            </h3>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${tierBadge[member.membershipTier as keyof typeof tierBadge] || tierBadge.FREE}`}>
              {tierLabel[member.membershipTier as keyof typeof tierLabel] || member.membershipTier}
            </span>
          </div>
          <p className="text-xs text-[var(--color-muted)] font-mono mt-0.5">
            @{member.username || 'anonymous'} · {roleLabel[member.role] || member.role}
          </p>
        </div>
      </div>

      {/* Headline */}
      {member.headline && (
        <p className="text-sm text-[var(--color-foreground-muted)] line-clamp-2 mb-3 leading-relaxed">
          {member.headline}
        </p>
      )}

      {/* Location + Experience */}
      {(member.location || member.yearsExperience) && (
        <div className="flex items-center gap-3 text-xs text-[var(--color-muted)] font-mono mb-3">
          {member.location && <span>📍 {member.location}</span>}
          {member.yearsExperience && <span>🕐 {member.yearsExperience}y exp</span>}
        </div>
      )}

      {/* Skills */}
      {member.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {member.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--color-surface-light)] text-[var(--color-foreground-muted)]"
            >
              {skill}
            </span>
          ))}
          {member.skills.length > 4 && (
            <span className="text-[10px] font-mono text-[var(--color-muted)]">
              +{member.skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-[var(--color-muted)] font-mono pt-3 border-t border-[var(--color-border-subtle)]">
        <span>{member.postCount} posts</span>
        <span>{member.commentCount} comments</span>
        <span className="ml-auto">
          Joined {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
}
