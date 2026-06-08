import type { CheckInRecord, StudyGoal, Achievement, UserProfile } from '@/types';

const today = new Date();

export const generateMockRecords = (): CheckInRecord[] => {
  const records: CheckInRecord[] = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const isChecked = Math.random() > 0.3;
    records.push({
      date: dateStr,
      duration: isChecked ? Math.floor(Math.random() * 180) + 30 : 0,
      note: isChecked ? ['今日学习很充实', '完成了计划内容', '继续加油！'][Math.floor(Math.random() * 3)] : '',
      checkedIn: isChecked
    });
  }
  return records;
};

export const mockGoals: StudyGoal[] = [
  {
    id: '1',
    title: '英语学习',
    description: '每天背诵20个单词，阅读一篇英文文章',
    targetDuration: 3000,
    currentDuration: 1850,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: '2',
    title: '编程练习',
    description: '每天完成一道算法题，学习一个新技术',
    targetDuration: 2000,
    currentDuration: 1420,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: '3',
    title: '阅读计划',
    description: '每月阅读一本书，做好读书笔记',
    targetDuration: 1200,
    currentDuration: 1200,
    deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: '初出茅庐',
    description: '完成第一次打卡',
    icon: '🌟',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: '坚持不懈',
    description: '连续打卡7天',
    icon: '🔥',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: '学霸养成',
    description: '连续打卡30天',
    icon: '👑',
    unlocked: false
  },
  {
    id: '4',
    title: '时间管理',
    description: '单日学习超过3小时',
    icon: '⏰',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    title: '知识海洋',
    description: '累计学习超过100小时',
    icon: '📚',
    unlocked: false
  },
  {
    id: '6',
    title: '全能选手',
    description: '完成所有学习目标',
    icon: '🏆',
    unlocked: false
  }
];

export const mockUserProfile: UserProfile = {
  nickname: '学习达人',
  avatar: '',
  totalStudyDays: 22,
  totalStudyHours: 86,
  longestStreak: 12,
  currentStreak: 5
};
