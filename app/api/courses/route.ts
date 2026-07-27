import { NextRequest, NextResponse } from 'next/server';
import { getCourses, getCategories } from '@/lib/db/courses';
import { Difficulty } from '@/lib/generated/prisma/client';

// GET /api/courses — list courses with optional filters
// Query params: category, level, search, limit, offset
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category') || undefined;
    const difficulty = searchParams.get('difficulty') as Difficulty | undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

    if (difficulty && !Object.values(Difficulty).includes(difficulty)) {
      return NextResponse.json(
        { error: `Invalid difficulty. Must be one of: ${Object.values(Difficulty).join(', ')}` },
        { status: 400 }
      );
    }

    const [courses, categories] = await Promise.all([
      getCourses({ categorySlug: category, difficulty, search, limit, offset }),
      getCategories(),
    ]);

    return NextResponse.json(
      { courses, categories },
      {
        headers: {
          'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('[GET /api/courses] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
