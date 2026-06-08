import React, { useState, useCallback } from 'react';
import { AppContext } from '@/store';
import type { StudyGoal } from '@/types';
import { generateMockRecords, mockGoals, mockAchievements, mockUserProfile } from '@/data/mockData';
import { generateId } from '@/utils';

interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  const [checkInRecords, setCheckInRecords] = useState(() => generateMockRecords());
  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>(mockGoals);
  const [achievements] = useState(mockAchievements);
  const [userProfile, setUserProfile] = useState(mockUserProfile);

  const checkIn = useCallback((duration: number, note = '') => {
    const today = new Date().toISOString().split('T')[0];
    setCheckInRecords(prev => {
      const existingIndex = prev.findIndex(r => r.date === today);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          duration: updated[existingIndex].duration + duration,
          note: note || updated[existingIndex].note,
          checkedIn: true
        };
        return updated;
      }
      return [...prev, { date: today, duration, note, checkedIn: true }];
    });

    setUserProfile(prev => ({
      ...prev,
      totalStudyDays: prev.totalStudyDays + 1,
      totalStudyHours: prev.totalStudyHours + Math.floor(duration / 60),
      currentStreak: prev.currentStreak + 1,
      longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1)
    }));
  }, []);

  const addGoal = useCallback((goal: Omit<StudyGoal, 'id' | 'completed' | 'currentDuration' | 'createdAt'>) => {
    const newGoal: StudyGoal = {
      ...goal,
      id: generateId(),
      completed: false,
      currentDuration: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStudyGoals(prev => [...prev, newGoal]);
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<StudyGoal>) => {
    setStudyGoals(prev => 
      prev.map(goal => goal.id === id ? { ...goal, ...updates } : goal)
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setStudyGoals(prev => prev.filter(goal => goal.id !== id));
  }, []);

  const updateProfile = useCallback((updates: Partial<typeof mockUserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <AppContext.Provider value={{
      checkInRecords,
      studyGoals,
      achievements,
      userProfile,
      checkIn,
      addGoal,
      updateGoal,
      deleteGoal,
      updateProfile
    }}>
      {children}
    </AppContext.Provider>
  );
}
