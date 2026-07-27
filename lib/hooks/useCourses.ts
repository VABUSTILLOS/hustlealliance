'use client';

import { useQuery } from '@tanstack/react-query';

export type CourseListItem = {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  difficulty: string;
  accessLevel: string;
  durationWeeks: number;
  totalMinutes: number;
  studentCount: number;
  thumbnail: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  instructor: {
    id: string;
    name: string;
    avatar: string | null;
    headline: string | null;
    bio: string | null;
  } | null;
  _count: { modules: number };
};

export type CourseDetail = CourseListItem & {
  modules: {
    id: string;
    title: string;
    sortOrder: number;
    lessons: {
      id: string;
      title: string;
      slug: string;
      durationMinutes: number;
      videoUrl: string | null;
      content: string | null;
      sortOrder: number;
    }[];
  }[];
};

export type LessonDetail = {
  id: string;
  title: string;
  slug: string;
  durationMinutes: number;
  videoUrl: string | null;
  content: string | null;
  sortOrder: number;
  accessLevel: string | null;
  module: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
      slug: string;
      accessLevel: string;
      communitySpaceSlug: string | null;
    };
  };
};

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const data = await res.json();
  // Unwrap { courses } / { course } envelope
  if (data.courses) return data.courses as T;
  if (data.course) return data.course as T;
  return data;
}

// ─── Courses ────────────────────────────────────────────────────────────────

export function useCourses(params?: {
  category?: string;
  difficulty?: string;
  search?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
  if (params?.search) searchParams.set('search', params.search);

  const qs = searchParams.toString();

  return useQuery<CourseListItem[]>({
    queryKey: ['courses', params],
    queryFn: () => fetchJSON(`/api/courses${qs ? `?${qs}` : ''}`),
  });
}

export function useCourse(slug: string) {
  return useQuery<CourseDetail>({
    queryKey: ['course', slug],
    queryFn: () => fetchJSON(`/api/courses/${slug}`),
    enabled: !!slug,
  });
}

export function useLesson(slug: string, lessonSlug: string) {
  return useQuery<LessonDetail>({
    queryKey: ['lesson', slug, lessonSlug],
    queryFn: () => fetchJSON(`/api/courses/${slug}/lessons/${lessonSlug}`),
    enabled: !!slug && !!lessonSlug,
  });
}
