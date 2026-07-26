import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { feedPosts as initialPosts, type FeedPost, type Comment } from '@/lib/data/community';
import { currentUser as fallbackUser } from '@/lib/data/users';
import { spaces as initialSpaces } from '@/lib/data/spaces';
import { badges as allBadges, XP_REWARDS, type Badge } from '@/lib/data/gamification';

export interface UserInfo {
  id?: string;
  email?: string;
  name: string;
  avatar: string;
  username?: string;
}

export interface UserProgress {
  [pathSlug: string]: {
    completedLessons: string[];
    startedAt: string;
    cheeredLessons: string[];
  };
}

export interface GamificationState {
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  earnedBadges: string[];
  totalLessonsCompleted: number;
  totalPostsCreated: number;
  totalCheersGiven: number;
  studyGroups: string[];
  latestUnlockedBadge: string | null;
}

interface AppState {
  // Auth
  currentUser: UserInfo | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: UserInfo | null) => void;
  signOut: () => Promise<void>;

  // Progress tracking
  progress: UserProgress;
  completeLesson: (pathSlug: string, lessonSlug: string) => void;
  isLessonComplete: (pathSlug: string, lessonSlug: string) => boolean;
  getPathProgress: (pathSlug: string, totalLessons: number) => number;
  getCompletedLessonsCount: () => number;
  toggleCheer: (pathSlug: string, lessonSlug: string) => void;
  hasCheered: (pathSlug: string, lessonSlug: string) => boolean;

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

  // Gamification
  gamification: GamificationState;
  addXP: (amount: number) => void;
  checkDailyLogin: () => void;
  getStreak: () => number;
  getXP: () => number;
  getNextBadge: () => { badge: Badge; progress: number } | null;
  getNewBadges: () => Badge[];
  clearLatestBadge: () => void;
  getPathCompletedBadge: (pathName: string) => Badge | null;
  addStudyGroup: (pathSlug: string) => void;
  isInStudyGroup: (pathSlug: string) => boolean;
}

const todayStr = () => new Date().toISOString().split('T')[0];

function checkAndUnlockBadges(state: GamificationState): { earnedBadges: string[]; latestBadge: string | null } {
  const earned = new Set(state.earnedBadges);
  let latestBadge: string | null = state.latestUnlockedBadge;
  let changed = false;

  for (const badge of allBadges) {
    if (earned.has(badge.id)) continue;
    let unlocked = false;
    switch (badge.id) {
      case 'first-lesson': unlocked = state.totalLessonsCompleted >= 1; break;
      case '5-lessons': unlocked = state.totalLessonsCompleted >= 5; break;
      case '10-lessons': unlocked = state.totalLessonsCompleted >= 10; break;
      case '25-lessons': unlocked = state.totalLessonsCompleted >= 25; break;
      case '3-day-streak': unlocked = state.streak >= 3; break;
      case '7-day-streak': unlocked = state.streak >= 7; break;
      case '14-day-streak': unlocked = state.streak >= 14; break;
      case '30-day-streak': unlocked = state.streak >= 30; break;
      case 'first-post': unlocked = state.totalPostsCreated >= 1; break;
      case '10-posts': unlocked = state.totalPostsCreated >= 10; break;
      case 'first-cheer': unlocked = state.totalCheersGiven >= 1; break;
      case 'social-butterfly': unlocked = state.totalCheersGiven + state.totalPostsCreated >= 50; break;
      case '100-xp': unlocked = state.xp >= 100; break;
      case '500-xp': unlocked = state.xp >= 500; break;
      case '1000-xp': unlocked = state.xp >= 1000; break;
    }
    // Path-specific badges are handled via getPathCompletedBadge
    if (unlocked) {
      earned.add(badge.id);
      changed = true;
      if (!latestBadge) latestBadge = badge.id;
    }
  }

  return changed ? { earnedBadges: [...earned], latestBadge } : { earnedBadges: state.earnedBadges, latestBadge: state.latestUnlockedBadge };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null as UserInfo | null,
      isAuthenticated: false,

      setCurrentUser: (user) => set({ currentUser: user }),

      signOut: async () => {
        localStorage.removeItem('sb-yftgdtdvmvvqyzcdntge-auth-token');
        localStorage.removeItem('hustle_user_info');
        set({ isAuthenticated: false, currentUser: null });
      },

      // Progress
      progress: {
        'fundraising-101': {
          completedLessons: ['intro-to-fundraising', 'crafting-your-story'],
          startedAt: '2026-07-10',
          cheeredLessons: [],
        },
      },

      completeLesson: (pathSlug, lessonSlug) => {
        set((state) => {
          const pathProgress = state.progress[pathSlug] || {
            completedLessons: [],
            startedAt: todayStr(),
            cheeredLessons: [],
          };
          if (pathProgress.completedLessons.includes(lessonSlug)) {
            return state;
          }
          const newCompleted = [...pathProgress.completedLessons, lessonSlug];
          const totalCompleted = state.gamification.totalLessonsCompleted + 1;

          let updatedGamification = {
            ...state.gamification,
            totalLessonsCompleted: totalCompleted,
            lastActiveDate: todayStr(),
            xp: state.gamification.xp + XP_REWARDS.LESSON_COMPLETE,
          };

          // Check streak
          if (state.gamification.lastActiveDate) {
            const last = new Date(state.gamification.lastActiveDate);
            const yesterday = new Date(Date.now() - 86400000);
            if (last.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
              updatedGamification.streak = state.gamification.streak + 1;
              // Streak milestones
              if (updatedGamification.streak === 7) updatedGamification.xp += XP_REWARDS.STREAK_BONUS_7;
              if (updatedGamification.streak === 14) updatedGamification.xp += XP_REWARDS.STREAK_BONUS_14;
              if (updatedGamification.streak === 30) updatedGamification.xp += XP_REWARDS.STREAK_BONUS_30;
            } else if (last.toISOString().split('T')[0] !== todayStr()) {
              updatedGamification.streak = 1;
            }
          } else {
            updatedGamification.streak = 1;
          }

          // Check badges
          const badgeResult = checkAndUnlockBadges(updatedGamification);
          updatedGamification.earnedBadges = badgeResult.earnedBadges;
          if (badgeResult.latestBadge) {
            updatedGamification.latestUnlockedBadge = badgeResult.latestBadge;
          }

          return {
            progress: {
              ...state.progress,
              [pathSlug]: {
                ...pathProgress,
                completedLessons: newCompleted,
              },
            },
            gamification: updatedGamification,
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

      getCompletedLessonsCount: () => {
        let count = 0;
        const progress = get().progress;
        for (const key in progress) {
          count += progress[key].completedLessons.length;
        }
        return count;
      },

      toggleCheer: (pathSlug, lessonSlug) => {
        set((state) => {
          const pathProgress = state.progress[pathSlug];
          if (!pathProgress) return state;
          const cheered = pathProgress.cheeredLessons || [];
          const hasCheered = cheered.includes(lessonSlug);
          const newCheered = hasCheered
            ? cheered.filter((s) => s !== lessonSlug)
            : [...cheered, lessonSlug];

          let updatedGamification = { ...state.gamification };
          if (!hasCheered) {
            updatedGamification.totalCheersGiven += 1;
            updatedGamification.xp += XP_REWARDS.CHEER_LESSON;
            const badgeResult = checkAndUnlockBadges(updatedGamification);
            updatedGamification.earnedBadges = badgeResult.earnedBadges;
            if (badgeResult.latestBadge) updatedGamification.latestUnlockedBadge = badgeResult.latestBadge;
          }

          return {
            progress: {
              ...state.progress,
              [pathSlug]: { ...pathProgress, cheeredLessons: newCheered },
            },
            gamification: updatedGamification,
          };
        });
      },

      hasCheered: (pathSlug, lessonSlug) => {
        return get().progress[pathSlug]?.cheeredLessons?.includes(lessonSlug) ?? false;
      },

      // Feed
      posts: initialPosts,

      addPost: (post) => {
        set((state) => {
          let updatedGamification = {
            ...state.gamification,
            totalPostsCreated: state.gamification.totalPostsCreated + 1,
            xp: state.gamification.xp + XP_REWARDS.COMMUNITY_POST,
            lastActiveDate: todayStr(),
          };
          const badgeResult = checkAndUnlockBadges(updatedGamification);
          updatedGamification.earnedBadges = badgeResult.earnedBadges;
          if (badgeResult.latestBadge) updatedGamification.latestUnlockedBadge = badgeResult.latestBadge;
          return {
            posts: [post, ...state.posts],
            gamification: updatedGamification,
          };
        });
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
        set((state) => {
          const updatedGamification = {
            ...state.gamification,
            xp: state.gamification.xp + XP_REWARDS.COMMUNITY_COMMENT,
            lastActiveDate: todayStr(),
          };
          return {
            posts: state.posts.map((p) =>
              p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
            ),
            gamification: updatedGamification,
          };
        });
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

      // Gamification
      gamification: {
        xp: 35,
        streak: 2,
        lastActiveDate: null,
        earnedBadges: [],
        totalLessonsCompleted: 2,
        totalPostsCreated: 0,
        totalCheersGiven: 0,
        studyGroups: [],
        latestUnlockedBadge: null,
      },

      addXP: (amount) => {
        set((state) => {
          const updated = {
            ...state.gamification,
            xp: state.gamification.xp + amount,
          };
          const badgeResult = checkAndUnlockBadges(updated);
          updated.earnedBadges = badgeResult.earnedBadges;
          if (badgeResult.latestBadge) updated.latestUnlockedBadge = badgeResult.latestBadge;
          return { gamification: updated };
        });
      },

      checkDailyLogin: () => {
        set((state) => {
          const today = todayStr();
          if (state.gamification.lastActiveDate === today) return state;
          const isYesterday =
            state.gamification.lastActiveDate ===
            new Date(Date.now() - 86400000).toISOString().split('T')[0];
          let updated = {
            ...state.gamification,
            lastActiveDate: today,
            xp: state.gamification.xp + XP_REWARDS.DAILY_LOGIN,
          };
          if (isYesterday) {
            updated.streak = state.gamification.streak + 1;
            if (updated.streak === 7) updated.xp += XP_REWARDS.STREAK_BONUS_7;
            if (updated.streak === 14) updated.xp += XP_REWARDS.STREAK_BONUS_14;
            if (updated.streak === 30) updated.xp += XP_REWARDS.STREAK_BONUS_30;
          } else if (state.gamification.lastActiveDate !== today) {
            updated.streak = 1;
          }
          const badgeResult = checkAndUnlockBadges(updated);
          updated.earnedBadges = badgeResult.earnedBadges;
          if (badgeResult.latestBadge) updated.latestUnlockedBadge = badgeResult.latestBadge;
          return { gamification: updated };
        });
      },

      getStreak: () => get().gamification.streak,
      getXP: () => get().gamification.xp,

      getNextBadge: () => {
        const g = get().gamification;
        const earned = new Set(g.earnedBadges);
        for (const badge of allBadges) {
          if (earned.has(badge.id)) continue;
          let progress = 0;
          switch (badge.id) {
            case 'first-lesson': progress = Math.min((g.totalLessonsCompleted / 1) * 100, 100); break;
            case '5-lessons': progress = Math.min((g.totalLessonsCompleted / 5) * 100, 100); break;
            case '10-lessons': progress = Math.min((g.totalLessonsCompleted / 10) * 100, 100); break;
            case '25-lessons': progress = Math.min((g.totalLessonsCompleted / 25) * 100, 100); break;
            case '3-day-streak': progress = Math.min((g.streak / 3) * 100, 100); break;
            case '7-day-streak': progress = Math.min((g.streak / 7) * 100, 100); break;
            case '14-day-streak': progress = Math.min((g.streak / 14) * 100, 100); break;
            case '30-day-streak': progress = Math.min((g.streak / 30) * 100, 100); break;
            case 'first-post': progress = Math.min((g.totalPostsCreated / 1) * 100, 100); break;
            case '10-posts': progress = Math.min((g.totalPostsCreated / 10) * 100, 100); break;
            case 'first-cheer': progress = Math.min((g.totalCheersGiven / 1) * 100, 100); break;
            case 'social-butterfly': progress = Math.min(((g.totalCheersGiven + g.totalPostsCreated) / 50) * 100, 100); break;
            case '100-xp': progress = Math.min((g.xp / 100) * 100, 100); break;
            case '500-xp': progress = Math.min((g.xp / 500) * 100, 100); break;
            case '1000-xp': progress = Math.min((g.xp / 1000) * 100, 100); break;
            default: continue;
          }
          return { badge, progress };
        }
        return null;
      },

      getNewBadges: () => {
        const earned = new Set(get().gamification.earnedBadges);
        return allBadges.filter((b) => earned.has(b.id));
      },

      clearLatestBadge: () => {
        set((state) => ({
          gamification: { ...state.gamification, latestUnlockedBadge: null },
        }));
      },

      getPathCompletedBadge: (pathName) => {
        return {
          id: `path-${pathName.toLowerCase().replace(/\s+/g, '-')}`,
          name: `${pathName} Champion`,
          description: `Completed the ${pathName} learning path`,
          icon: '🏅',
          category: 'learning' as const,
          requirement: 100,
        };
      },

      addStudyGroup: (pathSlug) => {
        set((state) => {
          const groups = state.gamification.studyGroups;
          if (groups.includes(pathSlug)) return state;
          return {
            gamification: {
              ...state.gamification,
              studyGroups: [...groups, pathSlug],
            },
          };
        });
      },

      isInStudyGroup: (pathSlug) => {
        return get().gamification.studyGroups.includes(pathSlug);
      },
    }),
    {
      name: 'hustle-alliance-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        progress: state.progress,
        gamification: state.gamification,
        joinedSpaces: state.joinedSpaces,
        // Don't persist feed posts — they reset on reload
      }),
    }
  )
);
