import React, { useState, useMemo } from 'react';
import { View, Text, Input } from '@tarojs/components';
import { useApp } from '@/store';
import { calculateProgress, formatDuration } from '@/utils';
import styles from './index.module.scss';

const durationOptions = [30, 60, 90, 120];

export default function HomePage() {
  const { userProfile, studyGoals, checkInRecords, checkIn } = useApp();
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [note, setNote] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = useMemo(() => 
    checkInRecords.find(r => r.date === today)
  , [checkInRecords]);

  const isCheckedIn = !!todayRecord?.checkedIn;
  const todayDuration = todayRecord?.duration || 0;
  const activeGoals = studyGoals.filter(g => !g.completed).slice(0, 3);

  const handleCheckIn = () => {
    checkIn(selectedDuration, note);
    setShowSuccessModal(true);
    setNote('');
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  const greetings = ['早上好', '中午好', '下午好', '晚上好'];
  const hour = new Date().getHours();
  const greeting = hour < 6 ? greetings[3] : hour < 12 ? greetings[0] : hour < 14 ? greetings[1] : hour < 18 ? greetings[2] : greetings[3];

  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekDay = weekDays[new Date().getDay()];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.greeting}>
          <Text className={styles.title}>{greeting}，{userProfile.nickname}</Text>
          <Text className={styles.date}>{month}月{day}日 {weekDay}</Text>
        </View>
        <View className={styles.avatar}>
          <Text className={styles.icon}>👤</Text>
        </View>
      </View>

      <View className={styles.statsCard}>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.value}>{userProfile.currentStreak}</Text>
            <Text className={styles.label}>连续天数</Text>
          </View>
          <View className={styles.divider} />
          <View className={styles.statItem}>
            <Text className={styles.value}>{userProfile.totalStudyDays}</Text>
            <Text className={styles.label}>累计天数</Text>
          </View>
          <View className={styles.divider} />
          <View className={styles.statItem}>
            <Text className={styles.value}>{userProfile.totalStudyHours}</Text>
            <Text className={styles.label}>累计小时</Text>
          </View>
        </View>
      </View>

      <View className={styles.checkInCard}>
        <View className={styles.checkInHeader}>
          <Text className={styles.title}>今日学习</Text>
          <Text className={isCheckedIn ? styles.status : styles.statusNot}>
            {isCheckedIn ? '已打卡' : '未打卡'}
          </Text>
        </View>
        
        {!isCheckedIn ? (
          <>
            <View className={styles.durationSelector}>
              {durationOptions.map(duration => (
                <View
                  key={duration}
                  className={`${styles.durationBtn} ${selectedDuration === duration ? styles.active : ''}`}
                  onClick={() => setSelectedDuration(duration)}
                >
                  <Text className={styles.text}>{duration}分钟</Text>
                </View>
              ))}
            </View>
            
            <Input
              className={styles.noteInput}
              placeholder="记录今天的学习收获..."
              value={note}
              onChange={e => setNote(e.detail.value)}
              multiline
            />
            
            <View className={styles.checkInBtn} onClick={handleCheckIn}>
              <Text className={styles.icon}>✓</Text>
              <Text className={styles.text}>完成打卡</Text>
            </View>
          </>
        ) : (
          <View>
            <Text className={styles.title} style={{ marginBottom: '16rpx' }}>🎉 今日打卡成功！</Text>
            <Text className={styles.text} style={{ color: '#64748B' }}>
              今日学习时长：{formatDuration(todayDuration)}
            </Text>
            {todayRecord?.note && (
              <Text className={styles.text} style={{ color: '#64748B', marginTop: '16rpx', display: 'block' }}>
                学习笔记：{todayRecord.note}
              </Text>
            )}
          </View>
        )}
      </View>

      <View className={styles.todayGoalCard}>
        <View className={styles.todayGoalHeader}>
          <Text className={styles.icon}>📚</Text>
          <Text className={styles.title}>学习目标</Text>
        </View>
        
        {activeGoals.length > 0 ? (
          activeGoals.map(goal => {
            const progress = calculateProgress(goal.currentDuration, goal.targetDuration);
            return (
              <View key={goal.id} className={styles.goalItem}>
                <View className={styles.info}>
                  <Text className={styles.goalTitle}>{goal.title}</Text>
                  <Text className={styles.progressText}>
                    {formatDuration(goal.currentDuration)} / {formatDuration(goal.targetDuration)}
                  </Text>
                </View>
                <View className={styles.progressBar}>
                  <View className={styles.progress} style={{ width: `${progress}%` }} />
                </View>
                <Text className={styles.progressValue}>{progress}%</Text>
              </View>
            );
          })
        ) : (
          <View style={{ textAlign: 'center', padding: '32rpx 0' }}>
            <Text style={{ color: '#94A3B8' }}>暂无学习目标，去设置一个吧！</Text>
          </View>
        )}
      </View>

      {showSuccessModal && (
        <View className={styles.modalOverlay} onClick={closeModal}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.modalIcon}>
              <Text className={styles.icon}>🎉</Text>
            </View>
            <Text className={styles.modalTitle}>打卡成功！</Text>
            <Text className={styles.modalDesc}>坚持就是胜利，继续加油！</Text>
            <View className={styles.modalBtn} onClick={closeModal}>
              <Text className={styles.text}>确定</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
