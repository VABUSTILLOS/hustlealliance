import { notFound } from 'next/navigation';
import { getMemberProfile } from '@/lib/db/community';
import { getCurrentUser } from '@/lib/auth/user';
import { MemberProfileClient } from './MemberProfileClient';

// ISR: revalidate member profile pages every 120s
export const revalidate = 120;

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getCurrentUser();
  const currentUserId = user?.id;

  const { profile, isFollowing } = await getMemberProfile(username, currentUserId);

  if (!profile) notFound();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      <MemberProfileClient
        profile={profile}
        isFollowing={isFollowing}
        currentUserId={currentUserId}
      />
    </div>
  );
}
