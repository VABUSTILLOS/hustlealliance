"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import {
  useUserFollowers,
  useUserFollowing,
  useUserFriends,
} from "../../hooks/useProfile";

type ConnectionTab = "followers" | "following" | "friends";

interface Props {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}

function ConnectionsContent({
  initialTab,
  userId,
}: {
  initialTab: ConnectionTab;
  userId: string;
}) {
  const [activeTab, setActiveTab] = useState<ConnectionTab>(initialTab);
  const router = useRouter();

  const { data: followers, isLoading: loadingFollowers } = useUserFollowers(userId);
  const { data: following, isLoading: loadingFollowing } = useUserFollowing(userId);
  const { data: friendsData, isLoading: loadingFriends } = useUserFriends(userId);

  const tabs: { key: ConnectionTab; label: string; count?: number }[] = [
    { key: "followers", label: "Followers", count: followers?.length },
    { key: "following", label: "Following", count: following?.length },
    { key: "friends", label: "Friends", count: friendsData?.friends?.length },
  ];

  const isLoading =
    (activeTab === "followers" && loadingFollowers) ||
    (activeTab === "following" && loadingFollowing) ||
    (activeTab === "friends" && loadingFriends);

  const getData = () => {
    switch (activeTab) {
      case "followers":
        return (
          followers?.map((f: { follower: { id: string; name: string; username: string | null; avatar: string | null; headline: string | null } }) => f.follower) ?? []
        );
      case "following":
        return (
          following?.map((f: { followed: { id: string; name: string; username: string | null; avatar: string | null; headline: string | null } }) => f.followed) ?? []
        );
      case "friends":
        return friendsData?.friends ?? [];
    }
  };

  const items = getData();

  return (
    <>
      {/* Tab bar */}
      <div className="flex border-b border-surface-light mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "px-5 py-3 text-sm font-heading font-semibold transition-all border-b-2 -mb-px",
              activeTab === tab.key
                ? "text-accent border-accent"
                : "text-muted border-transparent hover:text-foreground hover:border-surface-light",
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs font-mono opacity-60">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-surface-light/30 rounded-xl"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">
            {activeTab === "followers" ? "👀" : activeTab === "following" ? "🔭" : "👥"}
          </div>
          <h3 className="font-display text-xl text-foreground mb-2">
            No {activeTab} yet
          </h3>
          <p className="text-muted text-sm">
            {activeTab === "followers"
              ? "No one is following this user yet."
              : activeTab === "following"
                ? "This user isn't following anyone yet."
                : "No friends yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(
            (item: {
              id: string;
              name: string;
              username: string | null;
              avatar: string | null;
              headline: string | null;
            }) => (
              <button
                key={item.id}
                onClick={() =>
                  router.push(`/profile/${item.username ?? item.id}`)
                }
                className="w-full flex items-center gap-4 p-3 rounded-xl bg-surface border border-surface-light hover:border-accent/30 transition-all group"
              >
                <Image
                  src={
                    item.avatar ??
                    `https://api.dicebear.com/9.x/initials/svg?seed=${item.name}`
                  }
                  alt={item.name}
                  width={44}
                  height={44}
                  className="rounded-full border border-white/10 object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-heading font-bold text-sm text-foreground group-hover:text-accent transition-colors">
                    {item.name}
                  </p>
                  <p className="font-mono text-xs text-muted">
                    @{item.username ?? "member"}
                  </p>
                  {item.headline && (
                    <p className="text-foreground-muted text-xs mt-0.5 truncate">
                      {item.headline}
                    </p>
                  )}
                </div>
                <svg
                  className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ),
          )}
        </div>
      )}
    </>
  );
}

export default function ConnectionsPage({ params, searchParams }: Props) {
  const { username } = use(params);
  const { tab } = use(searchParams);
  const initialTab: ConnectionTab = ["followers", "following", "friends"].includes(tab ?? "")
    ? (tab as ConnectionTab)
    : "followers";

  // Fetch user ID from username
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-surface border border-surface-light text-muted hover:text-foreground transition-colors"
        >
          ←
        </button>
        <h1 className="font-display text-2xl text-foreground font-bold">
          @{username}
        </h1>
      </div>

      <ConnectionsUserIdResolver username={username} initialTab={initialTab} />
    </div>
  );
}

/** Resolves username to userId then renders the content. */
function ConnectionsUserIdResolver({
  username,
  initialTab,
}: {
  username: string;
  initialTab: ConnectionTab;
}) {
  const { data: profile } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const res = await fetch(`/api/profile/${encodeURIComponent(username)}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    staleTime: 30_000,
  });

  if (!profile) {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-surface-light/30 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <ConnectionsContent
      initialTab={initialTab}
      userId={profile.id}
    />
  );
}
