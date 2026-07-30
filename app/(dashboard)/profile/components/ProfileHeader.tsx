import Image from "next/image";
import { getInitialsAvatarUrl, DEFAULT_AVATAR } from '@/lib/utils/avatar';
import Link from "next/link";
import { FollowButton } from "./FollowButton";
import { FriendButton } from "./FriendButton";
import type { UserProfileData } from "@/lib/db/social";

interface ProfileHeaderProps {
  profile: UserProfileData;
  isOwnProfile: boolean;
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const displayName =
    profile.profile?.displayName || profile.name || "Member";
  const headline = profile.profile?.headline || profile.headline || "";
  const location = profile.profile?.location || "";
  const website = profile.profile?.website || "";
  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="relative">
      {/* Cover Photo */}
      <div className="h-48 sm:h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-accent/30 via-surface to-surface-light">
        {profile.coverPhoto ? (
          <Image
            src={profile.coverPhoto}
            alt=""
            fill
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
      </div>

      {/* Avatar + Actions */}
      <div className="relative px-4 sm:px-6 -mt-20 sm:-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          {/* Avatar */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-surface overflow-hidden bg-surface-light shadow-xl">
            <Image
              src={
                profile.avatar ??
                getInitialsAvatarUrl(profile.name)
              }
              alt={displayName}
              fill
              className="object-cover"
            />
            {/* Online indicator placeholder */}
            <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-surface" />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {isOwnProfile ? (
              <Link
                href="/profile/edit"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold font-heading bg-surface-light border border-surface-light text-foreground hover:border-accent/30 hover:text-accent transition-all"
              >
                Edit Profile
              </Link>
            ) : (
              <>
                <FollowButton userId={profile.id} />
                <FriendButton userId={profile.id} />
                <button className="px-5 py-2.5 rounded-xl text-sm font-semibold font-heading bg-surface-light border border-surface-light text-foreground hover:border-accent/30 transition-all">
                  Message
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-4">
          <h1 className="font-display text-2xl sm:text-3xl text-foreground font-bold">
            {displayName}
          </h1>
          <p className="font-mono text-sm text-muted mt-1">
            @{profile.username ?? "member"}
          </p>

          {headline && (
            <p className="text-foreground-muted mt-2 max-w-lg">{headline}</p>
          )}

          {profile.bio && !profile.profile?.summary && (
            <p className="text-foreground-muted text-sm mt-1 max-w-lg">
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted font-mono">
            {location && (
              <span className="flex items-center gap-1">
                📍 {location}
              </span>
            )}
            {website && (
              <a
                href={website.startsWith("http") ? website : `https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-accent hover:underline"
              >
                🔗 {website.replace(/^https?:\/\//, "")}
              </a>
            )}
            <span className="flex items-center gap-1">
              📅 Joined {joinDate}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-5">
            <Link
              href={`/profile/${profile.username}/connections?tab=followers`}
              className="group"
            >
              <span className="font-bold text-foreground">
                {profile._counts.followers}
              </span>{" "}
              <span className="text-muted text-sm group-hover:text-accent transition-colors">
                Followers
              </span>
            </Link>
            <Link
              href={`/profile/${profile.username}/connections?tab=following`}
              className="group"
            >
              <span className="font-bold text-foreground">
                {profile._counts.following}
              </span>{" "}
              <span className="text-muted text-sm group-hover:text-accent transition-colors">
                Following
              </span>
            </Link>
            <Link
              href={`/profile/${profile.username}/connections?tab=friends`}
              className="group"
            >
              <span className="font-bold text-foreground">
                {profile._counts.friends}
              </span>{" "}
              <span className="text-muted text-sm group-hover:text-accent transition-colors">
                Friends
              </span>
            </Link>
            <div>
              <span className="font-bold text-foreground">
                {profile._counts.posts}
              </span>{" "}
              <span className="text-muted text-sm">Posts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
