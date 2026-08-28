import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { reorderQuestions } from "@/lib/db/onboarding";

// PUT /api/admin/onboarding/questions/reorder
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e) {
    return authErrorResponse(e);
  }

  try {
    const body = await req.json();
    const orderedIds: string[] = body.orderedIds ?? [];
    await reorderQuestions(orderedIds);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
