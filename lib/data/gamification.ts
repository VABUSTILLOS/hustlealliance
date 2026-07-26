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
  { rank: 1, username: 'sarahj', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face', xp: 340, streak: 12, badges: ['fire', 'quick-learner'], completedLessons: 23 },
  { rank: 2, username: 'marcusw', name: 'Marcus Wong', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face', xp: 285, streak: 8, badges: ['fire', 'learning'], completedLessons: 19 },
  { rank: 3, username: 'elenak', name: 'Elena Kim', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face', xp: 260, streak: 14, badges: ['fire', 'quick-learner', 'social'], completedLessons: 17 },
  { rank: 4, username: 'alexk', name: 'Alex Kurosawa', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face', xp: 215, streak: 5, badges: ['learning'], completedLessons: 14 },
  { rank: 5, username: 'jamesc', name: 'James Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face', xp: 190, streak: 7, badges: ['fire'], completedLessons: 13 },
  { rank: 6, username: 'mariat', name: 'Maria Torres', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face', xp: 165, streak: 3, badges: [], completedLessons: 11 },
  { rank: 7, username: 'priyap', name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face', xp: 140, streak: 4, badges: [], completedLessons: 9 },
  { rank: 8, username: 'davidl', name: 'David Liu', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face', xp: 120, streak: 2, badges: [], completedLessons: 8 },
  { rank: 9, username: 'annaw', name: 'Anna Williams', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop&crop=face', xp: 95, streak: 6, badges: [], completedLessons: 6 },
  { rank: 10, username: 'tomb', name: 'Tom Baker', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=face', xp: 75, streak: 1, badges: [], completedLessons: 5 },
];

export const monthlyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'elenak', name: 'Elena Kim', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face', xp: 1240, streak: 14, badges: ['fire', 'quick-learner', 'social', 'butterfly'], completedLessons: 62 },
  { rank: 2, username: 'marcusw', name: 'Marcus Wong', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face', xp: 980, streak: 8, badges: ['fire', 'learning', 'pathfinder'], completedLessons: 49 },
  { rank: 3, username: 'sarahj', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face', xp: 850, streak: 12, badges: ['fire', 'quick-learner'], completedLessons: 43 },
  { rank: 4, username: 'alexk', name: 'Alex Kurosawa', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face', xp: 620, streak: 5, badges: ['learning'], completedLessons: 31 },
  { rank: 5, username: 'jamesc', name: 'James Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face', xp: 510, streak: 7, badges: ['fire', 'social'], completedLessons: 26 },
  { rank: 6, username: 'mariat', name: 'Maria Torres', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face', xp: 445, streak: 3, badges: [], completedLessons: 22 },
  { rank: 7, username: 'priyap', name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face', xp: 380, streak: 4, badges: [], completedLessons: 19 },
  { rank: 8, username: 'davidl', name: 'David Liu', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face', xp: 310, streak: 2, badges: [], completedLessons: 15 },
  { rank: 9, username: 'annaw', name: 'Anna Williams', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop&crop=face', xp: 250, streak: 6, badges: [], completedLessons: 12 },
  { rank: 10, username: 'tomb', name: 'Tom Baker', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=face', xp: 185, streak: 1, badges: [], completedLessons: 9 },
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
  { id: 'fa1', username: 'sarahj', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=face', action: 'completed_lesson', target: 'Crafting Your Story', timestamp: '2h ago' },
  { id: 'fa2', username: 'marcusw', name: 'Marcus Wong', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face', action: 'earned_badge', target: '7-Day Streak', timestamp: '4h ago' },
  { id: 'fa3', username: 'elenak', name: 'Elena Kim', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=face', action: 'completed_path', target: 'Growth Marketing', timestamp: '6h ago' },
  { id: 'fa4', username: 'jamesc', name: 'James Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&crop=face', action: 'started_path', target: 'Product-Led Growth', timestamp: '8h ago' },
  { id: 'fa5', username: 'priyap', name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&crop=face', action: 'completed_lesson', target: 'Nailing the First Meeting', timestamp: '12h ago' },
];
