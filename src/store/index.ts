import { createContext, useContext } from 'react';
import type { CheckInRecord, StudyGoal, Achievement, UserProfile } from '@/types';

export interface AppState {
  checkInRecords: CheckInRecord[];
  studyGoals: StudyGoal[];
  achievements: Achievement[];
  userProfile: UserProfile;
}

export interface AppContextType extends AppState {
  checkIn: (duration: number, note?: string) => void;
  addGoal: (goal: Omit<StudyGoal, 'id' | 'completed' | 'currentDuration' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<StudyGoal>) => void;
  deleteGoal: (id: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
