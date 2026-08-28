import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import prisma from "@/lib/db/prisma";
import { normalizeAvatarUrl } from "@/lib/utils/avatar";

export const ONLINE_WINDOW_MINUTES = 10;
const HEARTBEAT_MIN_INTERVAL_MS = 60 * 1000;

function showsOnlineStatus(privacySettings: unknown): boolean {
  if (!privacySettings || typeof privacySettings !== "object") return true;
  return (privacySettings as Record<string, unknown>).showOnlineStatus !== false;
}

// POST /api/community/presence — heartbeat; throttled to one write per minute
export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const current = await prisma.user.findUnique({
      where: { id: user.id },
      select: { lastSeenAt: true },
    });
    const stale =
      !current?.lastSeenAt ||
      Date.now() - current.lastSeenAt.getTime() > HEARTBEAT_MIN_INTERVAL_MS;
    if (stale) {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastSeenAt: new Date() },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// GET /api/community/presence?limit= — members currently online
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "12"), 50);
  const cutoff = new Date(Date.now() - ONLINE_WINDOW_MINUTES * 60 * 1000);

  try {
    const users = await prisma.user.findMany({
      where: { lastSeenAt: { gte: cutoff } },
      orderBy: { lastSeenAt: "desc" },
      take: limit + 1,
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        lastSeenAt: true,
        profile: { select: { privacySettings: true } },
      },
    });

    const items = users
      .filter((u) => u.id !== user.id && showsOnlineStatus(u.profile?.privacySettings))
      .slice(0, limit)
      .map((u) => ({
        id: u.id,
        name: u.name,
        username: u.username,
        avatar: normalizeAvatarUrl(u.avatar),
      }));

    return NextResponse.json({ items, total: items.length });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
