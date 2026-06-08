export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`;
  }
  return `${mins}分钟`;
};

export const getWeekDays = () => ['日', '一', '二', '三', '四', '五', '六'];

export const getMonthDays = (year: number, month: number): { date: number; day: string; fullDate: string }[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: { date: number; day: string; fullDate: string }[] = [];
  
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push({ date: 0, day: '', fullDate: '' });
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({
      date: i,
      day: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
      fullDate: formatDate(date)
    });
  }
  
  return days;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calculateProgress = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
};
