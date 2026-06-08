import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import { useApp } from '@/store';
import { getMonthDays, formatDuration } from '@/utils';
import styles from './index.module.scss';

export default function StatsPage() {
  const { checkInRecords, userProfile, studyGoals } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthDays = useMemo(() => getMonthDays(currentYear, currentMonth), [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    setCurrentDate(newDate);
  };

  const today = new Date().toISOString().split('T')[0];
  
  const getDayStatus = (fullDate: string) => {
    if (!fullDate) return 'empty';
    const record = checkInRecords.find(r => r.date === fullDate);
    if (fullDate === today) return 'today';
    return record?.checkedIn ? 'checked' : 'notChecked';
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  const weekData = useMemo(() => {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const record = checkInRecords.find(r => r.date === dateStr);
      weekData.push({
        day: weekDays[date.getDay()],
        duration: record?.duration || 0,
        date: date.getDate()
      });
    }
    return weekData;
  }, [checkInRecords]);

  const maxWeekDuration = Math.max(...weekData.map(d => d.duration), 1);

  const monthStats = useMemo(() => {
    const monthRecords = checkInRecords.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate.getFullYear() === currentYear && recordDate.getMonth() === currentMonth;
    });
    
    const checkedDays = monthRecords.filter(r => r.checkedIn).length;
    const totalDuration = monthRecords.reduce((sum, r) => sum + r.duration, 0);
    const avgDuration = checkedDays > 0 ? Math.round(totalDuration / checkedDays) : 0;
    
    return {
      totalDays: monthDays.filter(d => d.date > 0).length,
      checkedDays,
      totalDuration,
      avgDuration
    };
  }, [checkInRecords, currentYear, currentMonth, monthDays]);

  const completedGoals = studyGoals.filter(g => g.completed).length;
  const totalGoals = studyGoals.length;

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>学习统计</Text>
        <Text className={styles.desc}>记录你的学习轨迹</Text>
      </View>

      <View className={styles.statsSection}>
        <View className={styles.statsCard}>
          <View className={styles.statsGrid}>
            <View className={styles.statItem}>
              <Text className={styles.value}>{userProfile.currentStreak}</Text>
              <Text className={styles.label}>连续打卡天数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.value}>{userProfile.longestStreak}</Text>
              <Text className={styles.label}>最长连续天数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.value}>{totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}%</Text>
              <Text className={styles.label}>目标完成率</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.value}>{completedGoals}</Text>
              <Text className={styles.label}>已完成目标</Text>
            </View>
          </View>
        </View>

        <View className={styles.calendarCard}>
          <View className={styles.calendarHeader}>
            <View className={styles.navBtn} onClick={handlePrevMonth}>
              <Text className={styles.icon}>‹</Text>
            </View>
            <Text className={styles.month}>{currentYear}年{currentMonth + 1}月</Text>
            <View className={styles.navBtn} onClick={handleNextMonth}>
              <Text className={styles.icon}>›</Text>
            </View>
          </View>
          
          <View className={styles.calendarWeekdays}>
            {weekDays.map(day => (
              <Text key={day} className={styles.day}>{day}</Text>
            ))}
          </View>
          
          <View className={styles.calendarDays}>
            {monthDays.map((day, index) => {
              const status = getDayStatus(day.fullDate);
              return (
                <View key={index} className={`${styles.calendarDay} ${styles[status]}`}>
                  {day.date > 0 && (
                    <>
                      <Text className={styles.date}>{day.date}</Text>
                      {status === 'checked' && <View className={styles.dot} />}
                    </>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <View className={styles.weekStatsCard}>
          <View className={styles.weekStatsHeader}>
            <Text className={styles.icon}>📊</Text>
            <Text className={styles.title}>本周学习时长</Text>
          </View>
          <View className={styles.weekChart}>
            {weekData.map((day, index) => (
              <View key={index} className={styles.weekBar}>
                <Text className={styles.value}>{day.duration > 0 ? Math.round(day.duration / 60) + 'h' : '-'}</Text>
                <View className={styles.barContainer}>
                  <View 
                    className={styles.bar} 
                    style={{ height: `${(day.duration / maxWeekDuration) * 100}%` }} 
                  />
                </View>
                <Text className={styles.label}>{day.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.monthStatsCard}>
          <View className={styles.monthStatsHeader}>
            <Text className={styles.icon}>📈</Text>
            <Text className={styles.title}>{currentMonth + 1}月统计</Text>
          </View>
          <View className={styles.monthStatsRow}>
            <Text className={styles.label}>本月天数</Text>
            <Text className={styles.value}>{monthStats.totalDays} 天</Text>
          </View>
          <View className={styles.monthStatsRow}>
            <Text className={styles.label}>已打卡</Text>
            <Text className={styles.value}>{monthStats.checkedDays} 天</Text>
          </View>
          <View className={styles.monthStatsRow}>
            <Text className={styles.label}>本月学习</Text>
            <Text className={styles.value}>{formatDuration(monthStats.totalDuration)}</Text>
          </View>
          <View className={styles.monthStatsRow}>
            <Text className={styles.label}>日均学习</Text>
            <Text className={styles.value}>{formatDuration(monthStats.avgDuration)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
