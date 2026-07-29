import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getUserProfileData, getUserPosts } from "@/lib/db/social";
import { getCurrentUser } from "@/lib/auth/user";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileContent } from "./ProfileContent";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} — Hustle Alliance`,
    description: `View ${username}'s profile on Hustle Alliance`,
  };
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const { username } = await params;
  const { tab } = await searchParams;
  const profile = await getUserProfileData(username);

  if (!profile) notFound();

  const currentUser = await getCurrentUser();
  const isOwnProfile = currentUser?.id === profile.id;

  // Fetch initial posts for the Posts tab
  const initialPosts = await getUserPosts(profile.id, 20);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />

      <Suspense fallback={<div className="mt-8 animate-pulse"><div className="h-10 bg-surface-light/50 rounded-xl mb-6" /><div className="space-y-4"><div className="h-32 bg-surface-light/30 rounded-2xl" /><div className="h-32 bg-surface-light/30 rounded-2xl" /></div></div>}>
        <ProfileContent
          profile={profile}
          isOwnProfile={isOwnProfile}
          initialTab={(tab as string) ?? "posts"}
          initialPosts={initialPosts}
        />
      </Suspense>
    </div>
  );
}
