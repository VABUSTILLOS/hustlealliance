"use client";

import { useState } from "react";
import { getInitialsAvatarUrl, DEFAULT_AVATAR } from '@/lib/utils/avatar';
import Image from "next/image";
import { ProfileTabs, type ProfileTab } from "../components/ProfileTabs";
import { useUserFriends } from "../hooks/useProfile";
import type { UserProfileData } from "@/lib/db/social";

interface ProfileContentProps {
  profile: UserProfileData;
  isOwnProfile: boolean;
  initialTab: string;
  initialPosts: {
    items: {
      id: string;
      author: { id: string; name: string; username: string | null; avatar: string | null };
      content: string;
      space: string | null;
      createdAt: string;
      likeCount: number;
      commentCount: number;
    }[];
    hasMore: boolean;
    nextCursor: string | null;
  };
}

export function ProfileContent({
  profile,
  isOwnProfile,
  initialTab,
  initialPosts,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>(
    (["posts", "about", "friends", "photos"].includes(initialTab)
      ? initialTab
      : "posts") as ProfileTab,
  );

  const { data: friendsList } = useUserFriends(profile.id);

  return (
    <>
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            {initialPosts.items.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="font-display text-xl text-foreground mb-2">
                  No posts yet
                </h3>
                <p className="text-muted text-sm">
                  {isOwnProfile
                    ? "Share your first post with the community!"
                    : `${profile.name} hasn't posted yet.`}
                </p>
              </div>
            ) : (
              initialPosts.items.map((post) => (
                <div
                  key={post.id}
                  className="bg-surface border border-surface-light rounded-2xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src={
                        post.author.avatar ??
                        getInitialsAvatarUrl(post.author.name)
                      }
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full border border-white/10 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-foreground text-sm">
                        {post.author.name}
                      </p>
                      <p className="font-mono text-[10px] text-muted">
                        @{post.author.username}
                      </p>
                    </div>
                    {post.space && (
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-mono uppercase">
                        {post.space}
                      </span>
                    )}
                  </div>
                  <p className="text-foreground-muted text-sm mb-3 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-6 text-muted text-xs font-mono">
                    <span>
                      ❤️ {post.likeCount} likes
                    </span>
                    <span>
                      💬 {post.commentCount} comments
                    </span>
                    <span className="ml-auto">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="bg-surface border border-surface-light rounded-2xl p-6 space-y-6">
            {profile.profile?.summary && (
              <div>
                <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider mb-2">
                  About
                </h3>
                <p className="text-foreground-muted text-sm leading-relaxed">
                  {profile.profile.summary}
                </p>
              </div>
            )}

            {profile.bio && !profile.profile?.summary && (
              <div>
                <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider mb-2">
                  Bio
                </h3>
                <p className="text-foreground-muted text-sm leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {profile.profile?.location && (
                <div>
                  <h3 className="font-heading font-bold text-xs text-muted uppercase tracking-wider mb-1">
                    Location
                  </h3>
                  <p className="text-foreground text-sm">{profile.profile.location}</p>
                </div>
              )}

              {profile.profile?.website && (
                <div>
                  <h3 className="font-heading font-bold text-xs text-muted uppercase tracking-wider mb-1">
                    Website
                  </h3>
                  <a
                    href={
                      profile.profile.website.startsWith("http")
                        ? profile.profile.website
                        : `https://${profile.profile.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent text-sm hover:underline"
                  >
                    {profile.profile.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}

              {profile.profile?.yearsExperience != null && (
                <div>
                  <h3 className="font-heading font-bold text-xs text-muted uppercase tracking-wider mb-1">
                    Experience
                  </h3>
                  <p className="text-foreground text-sm">
                    {profile.profile.yearsExperience}+ years
                  </p>
                </div>
              )}

              {profile.membershipTier && (
                <div>
                  <h3 className="font-heading font-bold text-xs text-muted uppercase tracking-wider mb-1">
                    Membership
                  </h3>
                  <p className="text-foreground text-sm capitalize">
                    {profile.membershipTier.toLowerCase()}
                  </p>
                </div>
              )}
            </div>

            {/* Skills */}
            {profile.profile?.skills && profile.profile.skills.length > 0 && (
              <div>
                <h3 className="font-heading font-bold text-xs text-muted uppercase tracking-wider mb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-surface-light text-foreground-muted text-xs font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Industries */}
            {profile.profile?.industries &&
              profile.profile.industries.length > 0 && (
                <div>
                  <h3 className="font-heading font-bold text-xs text-muted uppercase tracking-wider mb-2">
                    Industries
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.profile.industries.map((industry) => (
                      <span
                        key={industry}
                        className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-mono"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Social Links */}
            {profile.profile?.socialLinks && (
              <div>
                <h3 className="font-heading font-bold text-xs text-muted uppercase tracking-wider mb-2">
                  Social Links
                </h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(profile.profile.socialLinks).map(
                    ([platform, url]) =>
                      url && (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-surface-light text-muted hover:text-accent text-xs font-mono capitalize transition-colors"
                        >
                          {platform}
                        </a>
                      ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === "friends" && (
          <div>
            {!friendsList || friendsList.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="font-display text-xl text-foreground mb-2">
                  No friends yet
                </h3>
                <p className="text-muted text-sm">
                  {profile.name} hasn&apos;t added any friends yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {friendsList.map((friend: { id: string; name: string; username: string | null; avatar: string | null }) => (
                  <a
                    key={friend.id}
                    href={`/profile/${friend.username ?? friend.id}`}
                    className="bg-surface border border-surface-light rounded-xl p-4 flex flex-col items-center gap-2 hover:border-accent/30 transition-all group"
                  >
                    <Image
                      src={
                        friend.avatar ??
                        getInitialsAvatarUrl(friend.name)
                      }
                      alt={friend.name}
                      width={56}
                      height={56}
                      className="rounded-full border-2 border-white/10 object-cover"
                    />
                    <p className="font-heading font-bold text-sm text-foreground group-hover:text-accent transition-colors text-center">
                      {friend.name}
                    </p>
                    {friend.username && (
                      <p className="font-mono text-[10px] text-muted">
                        @{friend.username}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Photos Tab (placeholder) */}
        {activeTab === "photos" && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📸</div>
            <h3 className="font-display text-xl text-foreground mb-2">
              Photos coming soon
            </h3>
            <p className="text-muted text-sm">
              Photo sharing will be available in a future update.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
