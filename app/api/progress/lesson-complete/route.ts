import { NextRequest, NextResponse } from 'next/server';
import { markLessonComplete, awardXP, updateStreak, checkAndAwardBadges, awardCertificate } from '@/lib/db/progress';
import { createClient } from '@/lib/supabase/server';
import { notifyCourseComplete, notifyCertificateEarned, notifyBadgeEarned } from '@/lib/notifications/service';
import prisma from '@/lib/db/prisma';

// POST /api/progress/lesson-complete — mark a lesson as complete
// Body: { lessonId: string }
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await request.json();
    if (!lessonId || typeof lessonId !== 'string') {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
    }

    const progress = await markLessonComplete(user.id, lessonId);

    // Award XP and update streak
    const [newlyEarnedBadges] = await Promise.all([
      checkAndAwardBadges(user.id, 'lessons'),
      awardXP(user.id, 10, `Completed lesson: ${lessonId}`),
      updateStreak(user.id),
    ]);

    // Check if the course this lesson belongs to is now complete
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: { include: { course: { include: { modules: { include: { lessons: true } } } } } },
      },
    });

    if (lesson) {
      const course = lesson.module.course;
      const allLessons = course.modules.flatMap((m) => m.lessons);
      const totalLessons = allLessons.length;

      const completedLessons = await prisma.lessonProgress.count({
        where: { userId: user.id, lessonId: { in: allLessons.map((l) => l.id) }, completed: true },
      });

      // Course completion check
      if (completedLessons === totalLessons && totalLessons > 0) {
        const certificate = await awardCertificate(user.id, course.id);
        const userRecord = await prisma.user.findUnique({ where: { id: user.id }, select: { name: true } });

        notifyCourseComplete(
          user.id, user.email!, userRecord?.name || 'Student', course.title, course.slug
        ).catch(() => {});

        if (certificate) {
          const certUrl = `https://hustlealliance.vercel.app/api/certificates/${certificate.id}`;
          notifyCertificateEarned(
            user.id, user.email!, userRecord?.name || 'Student', course.title, certUrl
          ).catch(() => {});
        }
      }
    }

    // Fire badge notifications for newly earned badges
    if (newlyEarnedBadges.length > 0 && user.email) {
      for (const badgeId of newlyEarnedBadges) {
        const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
        if (badge) {
          notifyBadgeEarned(user.id, user.email, badge.name, badge.icon || '🏅').catch(() => {});
        }
      }
    }

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('[POST /api/progress/lesson-complete] Error:', error);
    return NextResponse.json({ error: 'Failed to mark lesson complete' }, { status: 500 });
  }
}
