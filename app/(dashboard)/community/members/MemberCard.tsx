import Link from 'next/link';
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

/** Generate a deterministic hue from a name string for avatar background color */
function nameToHue(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return ((hash % 360) + 360) % 360;
}

/** Get initials (up to 2 chars) from a name */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';
}

/** Renders an inline SVG avatar with the member's initials on a colored circle */
function MemberAvatar({ name }: { name: string }) {
  const initials = getInitials(name);
  const hue = nameToHue(name);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="w-full h-full"
      aria-label={name}
    >
      <circle cx="50" cy="50" r="50" fill={`hsl(${hue},65%,45%)`} />
      <text
        x="50"
        y="50"
        fill="#fff"
        dominantBaseline="central"
        fontFamily="system-ui,-apple-system,sans-serif"
        fontSize="36"
        fontWeight="600"
        letterSpacing="1"
        textAnchor="middle"
      >
        {initials}
      </text>
    </svg>
  );
}

export function MemberCard({ member }: { member: CommunityMemberItem }) {
  return (
    <Link href={`/community/members/${member.username || member.id}`} className="block">
    <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5 hover:border-[var(--color-accent)] transition-colors group cursor-pointer h-full">
      {/* Top: Avatar + Name */}
      <div className="flex items-start gap-4 mb-3">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
          <MemberAvatar name={member.name} />
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
    </Link>
  );
}
