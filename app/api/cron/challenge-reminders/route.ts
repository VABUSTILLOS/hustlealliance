import { NextRequest, NextResponse } from "next/server";
import { sendChallengeReminders } from "@/lib/db/challenges";

// GET /api/cron/challenge-reminders
// Runs daily (see vercel.json). Nudges members enrolled in active challenges
// who still have incomplete tasks (deduped to at most one reminder per 24h).
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sendChallengeReminders();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[CRON /challenge-reminders] Error:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
