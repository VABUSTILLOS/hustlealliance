import { NextRequest, NextResponse } from 'next/server';
import { markLessonComplete, awardXP, updateStreak, checkAndAwardBadges, awardCertificate } from '@/lib/db/progress';
import { fanoutToFollowers } from '@/lib/db/feed';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from "@/lib/auth/user";
import { notifyCourseComplete, notifyCertificateEarned, notifyBadgeEarned } from '@/lib/notifications/service';
import prisma from '@/lib/db/prisma';

// POST /api/progress/lesson-complete — mark a lesson as complete
// Body: { lessonId: string }
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { lessonId } = await request.json();
    if (!lessonId || typeof lessonId !== 'string') {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
    }

    const progress = await markLessonComplete(user.id, lessonId);

    // Flywheel: fan out "completed a lesson" feed items to followers
    try {
      const lessonInfo = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { title: true },
      });
      await fanoutToFollowers({
        actorId: user.id,
        type: 'LESSON_COMPLETED',
        entityType: 'Lesson',
        entityId: lessonId,
        metadata: { title: lessonInfo?.title ?? lessonId },
      });
    } catch (feedErr) {
      console.error('[POST /api/progress/lesson-complete] Lesson feed fanout failed (non-fatal):', feedErr);
    }

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

          // Flywheel: fan out "completed a course" feed items to followers
          try {
            await fanoutToFollowers({
              actorId: user.id,
              type: 'CERTIFICATE_ISSUED',
              entityType: 'Course',
              entityId: course.id,
              metadata: { title: course.title, slug: course.slug, certificateId: certificate.id },
            });
          } catch (feedErr) {
            console.error('[POST /api/progress/lesson-complete] Certificate feed fanout failed (non-fatal):', feedErr);
          }
        }
      }
    }

    // Fire badge notifications for newly earned badges
    if (newlyEarnedBadges.length > 0 && user.email) {
      for (const badgeId of newlyEarnedBadges) {
        const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
        if (badge) {
          notifyBadgeEarned(user.id, user.email, badge.name, badge.icon || '🏅').catch(() => {});

          // Flywheel: fan out "earned a badge" feed items to followers
          try {
            await fanoutToFollowers({
              actorId: user.id,
              type: 'BADGE_EARNED',
              entityType: 'Badge',
              entityId: badgeId,
              metadata: { name: badge.name, icon: badge.icon || '🏅' },
            });
          } catch (feedErr) {
            console.error('[POST /api/progress/lesson-complete] Badge feed fanout failed (non-fatal):', feedErr);
          }
        }
      }
    }

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('[POST /api/progress/lesson-complete] Error:', error);
    return NextResponse.json({ error: 'Failed to mark lesson complete' }, { status: 500 });
  }
}
