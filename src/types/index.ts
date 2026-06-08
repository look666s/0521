export interface CheckInRecord {
  date: string;
  duration: number;
  note: string;
  checkedIn: boolean;
}

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  targetDuration: number;
  currentDuration: number;
  deadline: string;
  completed: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  nickname: string;
  avatar: string;
  totalStudyDays: number;
  totalStudyHours: number;
  longestStreak: number;
  currentStreak: number;
}
