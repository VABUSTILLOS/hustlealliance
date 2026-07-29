import { NextRequest, NextResponse } from "next/server";
import { listJobs, createJob, searchJobs } from "@/lib/db/jobs";
import { getCurrentUser } from "@/lib/auth/user";
import type { JobType } from "@/lib/generated/prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const type = searchParams.get("type") ?? undefined;
  const limit = parseInt(searchParams.get("limit") ?? "20");

  try {
    if (query) {
      const jobs = await searchJobs(query, limit);
      return NextResponse.json(jobs);
    }
    const jobs = await listJobs({ type: type as JobType, limit });
    return NextResponse.json(jobs);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const job = await createJob({ ...body, postedById: user.id });
    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
