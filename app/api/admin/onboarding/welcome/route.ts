import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { getWelcomeSettings, setWelcomeSettings } from "@/lib/db/onboarding";

// GET /api/admin/onboarding/welcome
export async function GET() {
  try {
    await requireAdmin();
  } catch (e) {
    return authErrorResponse(e);
  }

  try {
    const settings = await getWelcomeSettings();
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// PUT /api/admin/onboarding/welcome
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e) {
    return authErrorResponse(e);
  }

  try {
    const body = await req.json();
    const settings = await setWelcomeSettings({
      title: body.title,
      message: body.message,
      sendEmail: Boolean(body.sendEmail),
    });
    return NextResponse.json(settings.value);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
