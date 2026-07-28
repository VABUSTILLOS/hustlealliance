import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/live-classes/[id] — get live class details with registration status
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    const { id } = await params;

    const liveClass = await prisma.liveClass.findUnique({
      where: { id },
      include: {
        instructor: { select: { id: true, name: true, avatar: true } },
        course: { select: { id: true, title: true, slug: true } },
        _count: { select: { registrations: true } },
      },
    });

    if (!liveClass) {
      return NextResponse.json({ error: 'Live class not found' }, { status: 404 });
    }

    let isRegistered = false;
    let registrationId: string | null = null;

    if (user) {
      const registration = await prisma.liveClassRegistration.findUnique({
        where: { userId_liveClassId: { userId: user.id, liveClassId: id } },
        select: { id: true },
      });
      if (registration) {
        isRegistered = true;
        registrationId = registration.id;
      }
    }

    return NextResponse.json({ class: liveClass, isRegistered, registrationId });
  } catch (error) {
    console.error('[GET /api/live-classes/[id]] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch live class' }, { status: 500 });
  }
}
