import { create } from 'zustand';
import { feedPosts as initialPosts, type FeedPost, type Comment } from '@/lib/data/community';
import { currentUser } from '@/lib/data/users';
import { spaces as initialSpaces } from '@/lib/data/spaces';

export interface UserProgress {
  [pathSlug: string]: {
    completedLessons: string[];
    startedAt: string;
  };
}

interface AppState {
  // Auth
  currentUser: typeof currentUser;
  isAuthenticated: boolean;

  // Progress tracking
  progress: UserProgress;
  completeLesson: (pathSlug: string, lessonSlug: string) => void;
  isLessonComplete: (pathSlug: string, lessonSlug: string) => boolean;
  getPathProgress: (pathSlug: string, totalLessons: number) => number;

  // Feed
  posts: FeedPost[];
  addPost: (post: FeedPost) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  getPostsBySpace: (spaceSlug?: string) => FeedPost[];

  // Spaces
  joinedSpaces: string[];
  toggleJoinSpace: (spaceSlug: string) => void;
  isSpaceJoined: (spaceSlug: string) => boolean;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  currentUser,
  isAuthenticated: true,

  // Progress
  progress: {
    'fundraising-101': {
      completedLessons: ['intro-to-fundraising', 'crafting-your-story'],
      startedAt: '2026-07-10',
    },
  },

  completeLesson: (pathSlug, lessonSlug) => {
    set((state) => {
      const pathProgress = state.progress[pathSlug] || {
        completedLessons: [],
        startedAt: new Date().toISOString().split('T')[0],
      };
      if (pathProgress.completedLessons.includes(lessonSlug)) {
        return state;
      }
      return {
        progress: {
          ...state.progress,
          [pathSlug]: {
            ...pathProgress,
            completedLessons: [...pathProgress.completedLessons, lessonSlug],
          },
        },
      };
    });
  },

  isLessonComplete: (pathSlug, lessonSlug) => {
    return get().progress[pathSlug]?.completedLessons.includes(lessonSlug) ?? false;
  },

  getPathProgress: (pathSlug, totalLessons) => {
    const completed = get().progress[pathSlug]?.completedLessons.length ?? 0;
    return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  },

  // Feed
  posts: initialPosts,

  addPost: (post) => {
    set((state) => ({ posts: [post, ...state.posts] }));
  },

  toggleLike: (postId) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      ),
    }));
  },

  addComment: (postId, comment) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
      ),
    }));
  },

  getPostsBySpace: (spaceSlug) => {
    if (!spaceSlug) return get().posts;
    return get().posts.filter(
      (p) => p.space === spaceSlug || !p.space
    );
  },

  // Spaces
  joinedSpaces: ['saas-founders', 'ai-ml-builders', 'fundraising-hub'],

  toggleJoinSpace: (spaceSlug) => {
    set((state) => {
      const joined = state.joinedSpaces;
      if (joined.includes(spaceSlug)) {
        return { joinedSpaces: joined.filter((s) => s !== spaceSlug) };
      }
      return { joinedSpaces: [...joined, spaceSlug] };
    });
  },

  isSpaceJoined: (spaceSlug) => {
    return get().joinedSpaces.includes(spaceSlug);
  },
}));
