import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import { useApp } from '@/store';
import styles from './index.module.scss';

export default function MinePage() {
  const { userProfile, achievements, updateProfile } = useApp();
  const [editingNickname, setEditingNickname] = useState(false);
  const [nickname, setNickname] = useState(userProfile.nickname);
  const [showEditModal, setShowEditModal] = useState(false);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const handleSaveNickname = () => {
    updateProfile({ nickname });
    setEditingNickname(false);
  };

  const menuItems = [
    { icon: '📊', text: '学习报告', action: () => {} },
    { icon: '🏆', text: '成就中心', action: () => {} },
    { icon: '💬', text: '学习社区', action: () => {} },
    { icon: '⚙️', text: '设置', action: () => {} },
    { icon: '❓', text: '帮助与反馈', action: () => {} }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.avatar}>
          <Text className={styles.icon}>👤</Text>
        </View>
        <View className={styles.info}>
          {editingNickname ? (
            <Input
              className={styles.input}
              style={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: '#fff',
                width: '300rpx'
              }}
              value={nickname}
              onChange={e => setNickname(e.detail.value)}
              autoFocus
              confirmType="done"
              onConfirm={handleSaveNickname}
            />
          ) : (
            <>
              <Text className={styles.nickname} onClick={() => setEditingNickname(true)}>
                {userProfile.nickname}
              </Text>
              <Text className={styles.stats}>
                累计学习 {userProfile.totalStudyHours} 小时 · {unlockedCount}/{totalCount} 成就
              </Text>
            </>
          )}
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <View className={styles.statsCard}>
            <View className={styles.statItem}>
              <Text className={styles.value}>{userProfile.totalStudyDays}</Text>
              <Text className={styles.label}>学习天数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.value}>{userProfile.totalStudyHours}</Text>
              <Text className={styles.label}>学习小时</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.value}>{userProfile.longestStreak}</Text>
              <Text className={styles.label}>最长连续</Text>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.icon}>🏆</Text>
            成就徽章
          </Text>
          <View className={styles.achievementsGrid}>
            {achievements.map(achievement => (
              <View 
                key={achievement.id} 
                className={`${styles.achievementItem} ${achievement.unlocked ? styles.unlocked : ''}`}
              >
                <Text className={styles.icon}>{achievement.icon}</Text>
                <Text className={styles.title}>{achievement.title}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.menuList}>
          {menuItems.map((item, index) => (
            <View key={index} className={styles.menuItem} onClick={item.action}>
              <Text className={styles.icon}>{item.icon}</Text>
              <Text className={styles.text}>{item.text}</Text>
              <Text className={styles.arrow}>›</Text>
            </View>
          ))}
        </View>
      </View>

      {showEditModal && (
        <View className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>编辑资料</Text>
            <View className={styles.editSection}>
              <Text className={styles.label}>昵称</Text>
              <Input
                className={styles.input}
                placeholder="请输入昵称"
                value={nickname}
                onChange={e => setNickname(e.detail.value)}
              />
            </View>
            <View className={styles.saveBtn} onClick={handleSaveNickname}>
              <Text className={styles.text}>保存</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
