'use server';

import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db/prisma';
import {
  markLessonComplete,
  updateVideoPosition,
  updateStreak,
  awardXP,
  getUserGamification,
  getCourseProgress,
  getUserCertificates,
  awardCertificate,
} from '@/lib/db/progress';
import { revalidatePath } from 'next/cache';

// ─── Lesson Completion ──────────────────────────────────────────

export async function completeLessonAction(lessonId: string) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { success: false, error: 'Unauthorized' };

  try {
    await markLessonComplete(user.id, lessonId);

    const [xpResult, streakResult] = await Promise.all([
      awardXP(user.id, 10, `Completed lesson: ${lessonId}`),
      updateStreak(user.id),
    ]);

    createNotification(user.id, 'LESSON_COMPLETED', 'Lesson Completed!', { lessonId }).catch(() => {});

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { module: { select: { courseId: true } } },
    });

    if (lesson) {
      const cp = await getCourseProgress(user.id, lesson.module.courseId);
      if (cp && cp.percentage >= 100) {
        await awardCertificate(user.id, lesson.module.courseId);
        await awardXP(user.id, 100, `Course completed: ${cp.title}`);
        createNotification(user.id, 'CERTIFICATE_ISSUED', 'Certificate Earned! 🎉', { courseId: lesson.module.courseId }).catch(() => {});
      }
    }

    revalidatePath('/learning');
    return { success: true, xpEarned: 10 };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── Video Position ─────────────────────────────────────────────

export async function saveVideoPositionAction(lessonId: string, positionSeconds: number) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { success: false };

  try {
    await updateVideoPosition(user.id, lessonId, positionSeconds);
    return { success: true };
  } catch {
    return { success: false };
  }
}

// ─── Quiz Submission ────────────────────────────────────────────

export async function submitQuizAction(quizId: string, answers: Record<string, string>) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { success: false, error: 'Unauthorized' };

  try {
    const { submitQuizAttempt } = await import('@/lib/db/quizzes');
    const attempt = await submitQuizAttempt(user.id, quizId, answers);

    const xpAmount = attempt.passed ? 50 : 10;
    await Promise.all([
      awardXP(user.id, xpAmount, `Quiz ${attempt.passed ? 'passed' : 'attempted'}`),
      updateStreak(user.id),
    ]);

    createNotification(user.id, attempt.passed ? 'QUIZ_PASSED' : 'LESSON_COMPLETED',
      attempt.passed ? `Quiz passed! +${xpAmount}XP` : 'Quiz submitted', { quizId, passed: attempt.passed }
    ).catch(() => {});

    revalidatePath('/learning');
    return { success: true, attempt, xpEarned: xpAmount };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── Enrollment ─────────────────────────────────────────────────

export async function enrollInCourseAction(courseId: string) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { success: false, error: 'Unauthorized' };

  try {
    const { enrollUser } = await import('@/lib/db/courses');
    const enrollment = await enrollUser(user.id, courseId);

    // Get course info for email
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true, slug: true },
    });

    createNotification(user.id, 'COURSE_ENROLLED', 'Welcome to the course! 🚀', { courseId }).catch(() => {});

    // Send welcome email
    if (course && user.email) {
      const { courseEnrollmentEmail, sendEmail } = await import('@/lib/email/resend');
      sendEmail({ to: user.email, ...courseEnrollmentEmail(course.title, course.slug) }).catch(() => {});
    }

    revalidatePath('/learning');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── Gamification Summary ───────────────────────────────────────

export async function getGamificationSummaryAction() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  try {
    const [gamification, certificates] = await Promise.all([
      getUserGamification(user.id),
      getUserCertificates(user.id),
    ]);
    return { ...gamification, certificates };
  } catch {
    return null;
  }
}

// ─── Helper ─────────────────────────────────────────────────────

async function createNotification(userId: string, type: string, title: string, metadata?: Record<string, any>) {
  await prisma.notification.create({
    data: { userId, type: type as any, title, body: title, metadata: metadata || {} },
  });
}
