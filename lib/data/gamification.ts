// Gamification types & mock data

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'social' | 'milestone';
  requirement: number; // e.g., X lessons, Y streak days, Z posts
}

export const badges: Badge[] = [
  { id: 'first-lesson', name: 'First Step', description: 'Complete your first lesson', icon: '👣', category: 'learning', requirement: 1 },
  { id: 'first-path', name: 'Pathfinder', description: 'Complete your first learning path', icon: '🗺️', category: 'learning', requirement: 100 },
  { id: '5-lessons', name: 'Quick Learner', description: 'Complete 5 lessons', icon: '📚', category: 'learning', requirement: 5 },
  { id: '10-lessons', name: 'Knowledge Seeker', description: 'Complete 10 lessons', icon: '🧠', category: 'learning', requirement: 10 },
  { id: '25-lessons', name: 'Scholar', description: 'Complete 25 lessons', icon: '🎓', category: 'learning', requirement: 25 },
  { id: '3-day-streak', name: 'Warming Up', description: '3-day learning streak', icon: '🔥', category: 'streak', requirement: 3 },
  { id: '7-day-streak', name: 'On Fire', description: '7-day learning streak', icon: '🔥', category: 'streak', requirement: 7 },
  { id: '14-day-streak', name: 'Unstoppable', description: '14-day learning streak', icon: '🌋', category: 'streak', requirement: 14 },
  { id: '30-day-streak', name: 'Legendary', description: '30-day learning streak', icon: '👑', category: 'streak', requirement: 30 },
  { id: 'first-post', name: 'First Words', description: 'Post in the community', icon: '💬', category: 'social', requirement: 1 },
  { id: '10-posts', name: 'Conversationalist', description: 'Make 10 community posts', icon: '🗣️', category: 'social', requirement: 10 },
  { id: 'first-cheer', name: 'Cheerleader', description: 'Cheer a lesson for the first time', icon: '👏', category: 'social', requirement: 1 },
  { id: 'social-butterfly', name: 'Social Butterfly', description: '50 community interactions', icon: '🦋', category: 'social', requirement: 50 },
  { id: '100-xp', name: 'Centurion', description: 'Earn 100 XP', icon: '⚡', category: 'milestone', requirement: 100 },
  { id: '500-xp', name: 'Power User', description: 'Earn 500 XP', icon: '💪', category: 'milestone', requirement: 500 },
  { id: '1000-xp', name: 'Grandmaster', description: 'Earn 1,000 XP', icon: '🏆', category: 'milestone', requirement: 1000 },
];

// XP earning rules
export const XP_REWARDS = {
  LESSON_COMPLETE: 10,
  DAILY_LOGIN: 5,
  COMMUNITY_POST: 8,
  COMMUNITY_COMMENT: 3,
  CHEER_LESSON: 2,
  PATH_COMPLETED: 50,
  STREAK_BONUS_7: 25,
  STREAK_BONUS_14: 50,
  STREAK_BONUS_30: 100,
};

// Mock leaderboard entries
export interface LeaderboardEntry {
  rank: number;
  username: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  badges: string[];
  completedLessons: number;
}

export const weeklyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'sarahj', name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Sarah+Johnson&backgroundColor=7c3aed', xp: 340, streak: 12, badges: ['fire', 'quick-learner'], completedLessons: 23 },
  { rank: 2, username: 'marcusw', name: 'Marcus Wong', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Marcus+Wong&backgroundColor=059669', xp: 285, streak: 8, badges: ['fire', 'learning'], completedLessons: 19 },
  { rank: 3, username: 'elenak', name: 'Elena Kim', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Elena+Kim&backgroundColor=9333ea', xp: 260, streak: 14, badges: ['fire', 'quick-learner', 'social'], completedLessons: 17 },
  { rank: 4, username: 'alexk', name: 'Alex Kurosawa', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Alex+Kurosawa&backgroundColor=ea580c', xp: 215, streak: 5, badges: ['learning'], completedLessons: 14 },
  { rank: 5, username: 'jamesc', name: 'James Chen', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=James+Chen&backgroundColor=dc2626', xp: 190, streak: 7, badges: ['fire'], completedLessons: 13 },
  { rank: 6, username: 'mariat', name: 'Maria Torres', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Maria+Torres&backgroundColor=ca8a04', xp: 165, streak: 3, badges: [], completedLessons: 11 },
  { rank: 7, username: 'priyap', name: 'Priya Patel', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Priya+Patel&backgroundColor=db2777', xp: 140, streak: 4, badges: [], completedLessons: 9 },
  { rank: 8, username: 'davidl', name: 'David Liu', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=David+Liu&backgroundColor=0d9488', xp: 120, streak: 2, badges: [], completedLessons: 8 },
  { rank: 9, username: 'annaw', name: 'Anna Williams', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Anna+Williams&backgroundColor=2563eb', xp: 95, streak: 6, badges: [], completedLessons: 6 },
  { rank: 10, username: 'tomb', name: 'Tom Baker', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Tom+Baker&backgroundColor=4f46e5', xp: 75, streak: 1, badges: [], completedLessons: 5 },
];

export const monthlyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'elenak', name: 'Elena Kim', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Elena+Kim&backgroundColor=9333ea', xp: 1240, streak: 14, badges: ['fire', 'quick-learner', 'social', 'butterfly'], completedLessons: 62 },
  { rank: 2, username: 'marcusw', name: 'Marcus Wong', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Marcus+Wong&backgroundColor=059669', xp: 980, streak: 8, badges: ['fire', 'learning', 'pathfinder'], completedLessons: 49 },
  { rank: 3, username: 'sarahj', name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Sarah+Johnson&backgroundColor=7c3aed', xp: 850, streak: 12, badges: ['fire', 'quick-learner'], completedLessons: 43 },
  { rank: 4, username: 'alexk', name: 'Alex Kurosawa', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Alex+Kurosawa&backgroundColor=ea580c', xp: 620, streak: 5, badges: ['learning'], completedLessons: 31 },
  { rank: 5, username: 'jamesc', name: 'James Chen', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=James+Chen&backgroundColor=dc2626', xp: 510, streak: 7, badges: ['fire', 'social'], completedLessons: 26 },
  { rank: 6, username: 'mariat', name: 'Maria Torres', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Maria+Torres&backgroundColor=ca8a04', xp: 445, streak: 3, badges: [], completedLessons: 22 },
  { rank: 7, username: 'priyap', name: 'Priya Patel', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Priya+Patel&backgroundColor=db2777', xp: 380, streak: 4, badges: [], completedLessons: 19 },
  { rank: 8, username: 'davidl', name: 'David Liu', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=David+Liu&backgroundColor=0d9488', xp: 310, streak: 2, badges: [], completedLessons: 15 },
  { rank: 9, username: 'annaw', name: 'Anna Williams', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Anna+Williams&backgroundColor=2563eb', xp: 250, streak: 6, badges: [], completedLessons: 12 },
  { rank: 10, username: 'tomb', name: 'Tom Baker', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Tom+Baker&backgroundColor=4f46e5', xp: 185, streak: 1, badges: [], completedLessons: 9 },
];

// Key insight cards for bite-sized previews
export interface KeyInsight {
  icon: string;
  title: string;
  insight: string;
}

// Friends' activity mock data
export interface FriendActivity {
  id: string;
  username: string;
  name: string;
  avatar: string;
  action: 'completed_lesson' | 'completed_path' | 'earned_badge' | 'started_path';
  target: string;
  timestamp: string;
}

export const friendsActivity: FriendActivity[] = [
  { id: 'fa1', username: 'sarahj', name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Sarah+Johnson&backgroundColor=7c3aed', action: 'completed_lesson', target: 'Crafting Your Story', timestamp: '2h ago' },
  { id: 'fa2', username: 'marcusw', name: 'Marcus Wong', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Marcus+Wong&backgroundColor=059669', action: 'earned_badge', target: '7-Day Streak', timestamp: '4h ago' },
  { id: 'fa3', username: 'elenak', name: 'Elena Kim', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Elena+Kim&backgroundColor=9333ea', action: 'completed_path', target: 'Growth Marketing', timestamp: '6h ago' },
  { id: 'fa4', username: 'jamesc', name: 'James Chen', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=James+Chen&backgroundColor=dc2626', action: 'started_path', target: 'Product-Led Growth', timestamp: '8h ago' },
  { id: 'fa5', username: 'priyap', name: 'Priya Patel', avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Priya+Patel&backgroundColor=db2777', action: 'completed_lesson', target: 'Nailing the First Meeting', timestamp: '12h ago' },
];
