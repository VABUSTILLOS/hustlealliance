import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

// Vercel Cron: runs daily at 3am UTC
// Cleans up feed items older than 30 days
export async function GET() {
  try {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await prisma.feedItem.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });

    return NextResponse.json({
      ok: true,
      deleted: result.count,
      cutoff: cutoff.toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
