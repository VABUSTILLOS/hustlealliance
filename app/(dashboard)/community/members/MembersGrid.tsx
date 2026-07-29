import type { CommunityMemberItem } from '@/lib/db/community';
import { MemberCard } from './MemberCard';

export function MembersGrid({ members }: { members: CommunityMemberItem[] }) {
  if (members.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-[var(--color-foreground-muted)] font-mono">
          No members found matching your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}
