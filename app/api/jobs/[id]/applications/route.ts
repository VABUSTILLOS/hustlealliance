import { NextRequest, NextResponse } from "next/server";
import { applyToJob, getJobApplications } from "@/lib/db/jobs";
import { getCurrentUser } from "@/lib/auth/user";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const applications = await getJobApplications(id);
    return NextResponse.json(applications);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const application = await applyToJob({ jobId: id, applicantId: user.id, ...body });
    return NextResponse.json(application, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
