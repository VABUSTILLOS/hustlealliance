import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';
import { courseOutlineSchema } from '@/lib/ai/schemas';
import { CourseStatus } from '@/lib/generated/prisma/client';

const bodySchema = z.object({
  output: courseOutlineSchema,
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

/**
 * Creates a draft Course → Modules → Lessons from an AI-generated course
 * outline (the AI Studio "Apply" action), reusing the same shape createCourse/
 * createModule/createLesson expect elsewhere in the admin area.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { output } = parsed.data;

    const category = await prisma.category.findFirst({ orderBy: { name: 'asc' } });
    if (!category) {
      return NextResponse.json(
        { error: 'No category exists yet. Create a category before generating a draft course.' },
        { status: 400 }
      );
    }

    const baseSlug = slugify(output.title) || `ai-course-${Date.now()}`;
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.course.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const course = await prisma.course.create({
      data: {
        title: output.title,
        slug,
        tagline: output.description.slice(0, 140),
        description: output.description,
        difficulty: 'BEGINNER',
        accessLevel: 'FREE',
        status: CourseStatus.DRAFT,
        categoryId: category.id,
        instructorId: user.id,
      },
    });

    for (let m = 0; m < output.modules.length; m++) {
      const mod = output.modules[m];
      const createdModule = await prisma.module.create({
        data: { courseId: course.id, title: mod.title, sortOrder: m },
      });

      for (let l = 0; l < mod.lessons.length; l++) {
        const lesson = mod.lessons[l];
        await prisma.lesson.create({
          data: {
            moduleId: createdModule.id,
            title: lesson.title,
            slug: slugify(lesson.title) || `lesson-${l}`,
            content: lesson.summary,
            sortOrder: l,
          },
        });
      }
    }

    return NextResponse.json({ courseId: course.id }, { status: 201 });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[POST /api/admin/ai/apply-course-outline]', err);
      return NextResponse.json({ error: 'Failed to create draft course' }, { status: 500 });
    }
  }
}
