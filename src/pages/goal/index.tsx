import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import { useApp } from '@/store';
import { calculateProgress, formatDuration } from '@/utils';
import styles from './index.module.scss';

const durationOptions = [600, 1200, 1800, 3000];

interface FormData {
  title: string;
  description: string;
  targetDuration: number;
  deadline: string;
}

export default function GoalPage() {
  const { studyGoals, addGoal, deleteGoal } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    targetDuration: 1200,
    deadline: ''
  });

  const activeGoals = studyGoals.filter(g => !g.completed);
  const completedGoals = studyGoals.filter(g => g.completed);

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      targetDuration: 1200,
      deadline: ''
    });
    setShowModal(true);
  };

  const handleEditGoal = (goal: typeof studyGoals[0]) => {
    setEditingId(goal.id);
    setFormData({
      title: goal.title,
      description: goal.description,
      targetDuration: goal.targetDuration,
      deadline: goal.deadline
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      return;
    }
    
    if (editingId) {
      console.log('Editing goal:', editingId, formData);
    } else {
      addGoal({
        title: formData.title,
        description: formData.description,
        targetDuration: formData.targetDuration,
        deadline: formData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
    
    handleCloseModal();
  };

  const handleDeleteGoal = (id: string) => {
    deleteGoal(id);
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>学习目标</Text>
        <Text className={styles.desc}>设定目标，让学习更有方向</Text>
      </View>

      <View className={styles.goalList}>
        {studyGoals.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.icon}>📝</Text>
            <Text className={styles.text}>还没有学习目标</Text>
            <Text className={styles.hint}>点击右下角按钮添加目标</Text>
          </View>
        ) : (
          <>
            {activeGoals.map(goal => {
              const progress = calculateProgress(goal.currentDuration, goal.targetDuration);
              return (
                <View key={goal.id} className={styles.goalCard}>
                  <View className={styles.header}>
                    <Text className={styles.title}>{goal.title}</Text>
                    <Text className={`${styles.status} ${styles.active}`}>进行中</Text>
                  </View>
                  <Text className={styles.desc}>{goal.description}</Text>
                  <View className={styles.progressSection}>
                    <View className={styles.progressBar}>
                      <View className={styles.progress} style={{ width: `${progress}%` }} />
                    </View>
                    <View className={styles.progressText}>
                      <Text>{formatDuration(goal.currentDuration)} / {formatDuration(goal.targetDuration)}</Text>
                      <Text>{progress}%</Text>
                    </View>
                  </View>
                  <View className={styles.meta}>
                    <Text className={styles.deadline}>
                      <Text className={styles.icon}>📅</Text>
                      截止: {goal.deadline}
                    </Text>
                    <View className={styles.actions}>
                      <Text className={`${styles.actionBtn} ${styles.edit}`} onClick={() => handleEditGoal(goal)}>编辑</Text>
                      <Text className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDeleteGoal(goal.id)}>删除</Text>
                    </View>
                  </View>
                </View>
              );
            })}
            
            {completedGoals.length > 0 && (
              <>
                <Text style={{ fontSize: '28rpx', color: '#94A3B8', marginBottom: '24rpx', fontWeight: '500' }}>
                  已完成 ({completedGoals.length})
                </Text>
                {completedGoals.map(goal => (
                  <View key={goal.id} className={styles.goalCard}>
                    <View className={styles.header}>
                      <Text className={styles.title}>{goal.title}</Text>
                      <Text className={`${styles.status} ${styles.completed}`}>已完成</Text>
                    </View>
                    <Text className={styles.desc}>{goal.description}</Text>
                    <View className={styles.progressSection}>
                      <View className={styles.progressBar}>
                        <View className={styles.progress} style={{ width: '100%' }} />
                      </View>
                      <View className={styles.progressText}>
                        <Text>{formatDuration(goal.currentDuration)} / {formatDuration(goal.targetDuration)}</Text>
                        <Text>100%</Text>
                      </View>
                    </View>
                    <View className={styles.meta}>
                      <Text className={styles.deadline}>
                        <Text className={styles.icon}>✅</Text>
                        已完成
                      </Text>
                      <View className={styles.actions}>
                        <Text className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDeleteGoal(goal.id)}>删除</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </View>

      <View className={styles.addBtn} onClick={handleOpenModal}>
        <Text className={styles.icon}>+</Text>
      </View>

      {showModal && (
        <View className={styles.modalOverlay} onClick={handleCloseModal}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>{editingId ? '编辑目标' : '添加目标'}</Text>
            
            <View className={styles.formItem}>
              <Text className={styles.label}>目标名称</Text>
              <Input
                className={styles.input}
                placeholder="例如：英语学习"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.detail.value })}
              />
            </View>
            
            <View className={styles.formItem}>
              <Text className={styles.label}>目标描述</Text>
              <Input
                className={styles.textarea}
                placeholder="描述你的学习计划..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.detail.value })}
                multiline
              />
            </View>
            
            <View className={styles.formItem}>
              <Text className={styles.label}>目标时长（分钟）</Text>
              <View className={styles.durationSelector}>
                {durationOptions.map(duration => (
                  <View
                    key={duration}
                    className={`${styles.durationBtn} ${formData.targetDuration === duration ? styles.active : ''}`}
                    onClick={() => setFormData({ ...formData, targetDuration: duration })}
                  >
                    <Text className={styles.text}>{duration / 60}小时</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View className={styles.formItem}>
              <Text className={styles.label}>截止日期</Text>
              <Input
                className={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.detail.value })}
              />
            </View>
            
            <View className={styles.modalActions}>
              <View className={`${styles.btn} ${styles.cancel}`} onClick={handleCloseModal}>
                <Text className={styles.text}>取消</Text>
              </View>
              <View className={`${styles.btn} ${styles.confirm}`} onClick={handleSubmit}>
                <Text className={styles.text}>{editingId ? '保存' : '添加'}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
