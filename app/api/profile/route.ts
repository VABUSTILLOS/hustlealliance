import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/profile — get current user's profile
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
        posts: { take: 5, orderBy: { createdAt: "desc" } },
      },
    });
    return NextResponse.json(profile);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// PUT /api/profile — update current user's profile
export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    // Update base user fields
    const updateData: Record<string, unknown> = {};
    if ("name" in body) updateData.name = body.name;
    if ("username" in body) updateData.username = body.username;
    if ("bio" in body) updateData.bio = body.bio;
    if ("headline" in body) updateData.headline = body.headline;
    if ("avatar" in body) updateData.avatar = body.avatar;
    if ("coverPhoto" in body) updateData.coverPhoto = body.coverPhoto;

    // Update extended profile fields
    const profileData: Record<string, unknown> = {};
    if ("displayName" in body) profileData.displayName = body.displayName;
    if ("location" in body) profileData.location = body.location;
    if ("website" in body) profileData.website = body.website;
    if ("socialLinks" in body) profileData.socialLinks = body.socialLinks;
    if ("skills" in body) profileData.skills = body.skills;
    if ("industries" in body) profileData.industries = body.industries;
    if ("summary" in body) profileData.summary = body.summary;
    if ("phone" in body) profileData.phone = body.phone;

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: updateData }),
      ...(Object.keys(profileData).length > 0
        ? [
            prisma.profile.upsert({
              where: { userId: user.id },
              create: { userId: user.id, ...profileData },
              update: profileData,
            }),
          ]
        : []),
    ]);

    return NextResponse.json(updatedUser);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
