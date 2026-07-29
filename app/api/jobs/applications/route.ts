import { NextResponse } from "next/server";
import { getUserApplications } from "@/lib/db/jobs";
import { getCurrentUser } from "@/lib/auth/user";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const applications = await getUserApplications(user.id);
    return NextResponse.json(applications);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
