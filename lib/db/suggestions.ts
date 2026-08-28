import prisma from "@/lib/db/prisma";
import { normalizeAvatarUrl } from "@/lib/utils/avatar";

export interface MemberSuggestion {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
  headline: string | null;
  score: number;
  reasons: string[];
}

// "People you may know" — scored by mutual groups, mutual follows, and
// shared skills/interests. Excludes self, friends, pending requests, and
// users the viewer already follows.
export async function getMemberSuggestions(
  userId: string,
  limit = 6,
): Promise<MemberSuggestion[]> {
  const [myMemberships, myProfile, myFollowing, myFriendships] = await Promise.all([
    prisma.communityGroupMember.findMany({
      where: { userId, status: "ACTIVE" },
      select: { groupId: true },
    }),
    prisma.profile.findUnique({
      where: { userId },
      select: { skills: true, interests: true },
    }),
    prisma.follow.findMany({
      where: { followerId: userId },
      select: { followedId: true },
    }),
    prisma.friendship.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      select: { userAId: true, userBId: true },
    }),
  ]);

  const myGroupIds = new Set(myMemberships.map((m) => m.groupId));
  const myFollowingIds = myFollowing.map((f) => f.followedId);
  const excludedIds = new Set<string>([userId, ...myFollowingIds]);
  for (const f of myFriendships) {
    excludedIds.add(f.userAId === userId ? f.userBId : f.userAId);
  }

  const [candidates, mutualFollowCounts] = await Promise.all([
    prisma.user.findMany({
      where: { id: { notIn: [...excludedIds] } },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        profile: { select: { headline: true, skills: true, interests: true } },
        communityGroupMemberships: {
          where: { status: "ACTIVE" },
          select: { groupId: true },
        },
      },
    }),
    myFollowingIds.length > 0
      ? prisma.follow.groupBy({
          by: ["followedId"],
          where: {
            followerId: { in: myFollowingIds },
            followedId: { notIn: [...excludedIds] },
          },
          _count: { followedId: true },
        })
      : Promise.resolve([]),
  ]);

  const mutualFollowMap = new Map(
    mutualFollowCounts.map((r) => [r.followedId, r._count.followedId]),
  );
  const mySkills = new Set((myProfile?.skills ?? []).map((s) => s.toLowerCase()));
  const myInterests = new Set((myProfile?.interests ?? []).map((s) => s.toLowerCase()));

  const scored = candidates
    .map((c) => {
      let score = 0;
      const reasons: string[] = [];

      const mutualGroups = c.communityGroupMemberships.filter((m) =>
        myGroupIds.has(m.groupId),
      ).length;
      if (mutualGroups > 0) {
        score += mutualGroups * 3;
        reasons.push(
          mutualGroups === 1 ? "1 group in common" : `${mutualGroups} groups in common`,
        );
      }

      const mutualFollows = mutualFollowMap.get(c.id) ?? 0;
      if (mutualFollows > 0) {
        score += mutualFollows * 2;
        reasons.push(
          mutualFollows === 1
            ? "Followed by 1 person you follow"
            : `Followed by ${mutualFollows} people you follow`,
        );
      }

      const sharedSkills = (c.profile?.skills ?? []).filter((s) =>
        mySkills.has(s.toLowerCase()),
      ).length;
      const sharedInterests = (c.profile?.interests ?? []).filter((s) =>
        myInterests.has(s.toLowerCase()),
      ).length;
      if (sharedSkills > 0) {
        score += sharedSkills;
        reasons.push("Similar skills");
      }
      if (sharedInterests > 0) {
        score += sharedInterests;
        reasons.push("Similar interests");
      }

      return {
        id: c.id,
        name: c.name,
        username: c.username,
        avatar: normalizeAvatarUrl(c.avatar),
        headline: c.profile?.headline ?? null,
        score,
        reasons: reasons.slice(0, 2),
      };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}
