App({
  globalData: {
    userProfile: {
      nickname: '学习达人',
      totalStudyDays: 22,
      totalStudyHours: 86,
      longestStreak: 12,
      currentStreak: 5
    },
    checkInRecords: [],
    studyGoals: [
      { id: '1', title: '英语学习', description: '每天背诵20个单词，阅读一篇英文文章', targetDuration: 3000, currentDuration: 1850, deadline: '2026-07-08', completed: false, createdAt: '2026-05-24' },
      { id: '2', title: '编程练习', description: '每天完成一道算法题，学习一个新技术', targetDuration: 2000, currentDuration: 1420, deadline: '2026-06-28', completed: false, createdAt: '2026-05-29' },
      { id: '3', title: '阅读计划', description: '每月阅读一本书，做好读书笔记', targetDuration: 1200, currentDuration: 1200, deadline: '2026-06-03', completed: true, createdAt: '2026-05-08' }
    ],
    achievements: [
      { id: '1', title: '初出茅庐', description: '完成第一次打卡', icon: '🌟', unlocked: true },
      { id: '2', title: '坚持不懈', description: '连续打卡7天', icon: '🔥', unlocked: true },
      { id: '3', title: '学霸养成', description: '连续打卡30天', icon: '👑', unlocked: false },
      { id: '4', title: '时间管理', description: '单日学习超过3小时', icon: '⏰', unlocked: true },
      { id: '5', title: '知识海洋', description: '累计学习超过100小时', icon: '📚', unlocked: false },
      { id: '6', title: '全能选手', description: '完成所有学习目标', icon: '🏆', unlocked: false }
    ]
  },
  onLaunch() {
    this.initCheckInRecords()
  },
  initCheckInRecords() {
    const records = []
    const today = new Date()
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const isChecked = Math.random() > 0.3
      records.push({
        date: dateStr,
        duration: isChecked ? Math.floor(Math.random() * 180) + 30 : 0,
        note: isChecked ? ['今日学习很充实', '完成了计划内容', '继续加油！'][Math.floor(Math.random() * 3)] : '',
        checkedIn: isChecked
      })
    }
    this.globalData.checkInRecords = records
  },
  checkIn(duration, note) {
    const today = new Date().toISOString().split('T')[0]
    const existingIndex = this.globalData.checkInRecords.findIndex(r => r.date === today)
    const isFirstCheckInToday = existingIndex < 0 || !this.globalData.checkInRecords[existingIndex].checkedIn
    
    if (existingIndex >= 0) {
      this.globalData.checkInRecords[existingIndex].duration += duration
      if (note) this.globalData.checkInRecords[existingIndex].note = note
      this.globalData.checkInRecords[existingIndex].checkedIn = true
    } else {
      this.globalData.checkInRecords.push({
        date: today,
        duration,
        note: note || '',
        checkedIn: true
      })
    }
    
    if (isFirstCheckInToday) {
      this.globalData.userProfile.totalStudyDays++
      this.updateCurrentStreak()
    }
    
    this.globalData.userProfile.totalStudyHours += Math.floor(duration / 60)
    this.globalData.userProfile.longestStreak = Math.max(this.globalData.userProfile.longestStreak, this.globalData.userProfile.currentStreak)
    
    this.checkAchievements(duration)
  },
  
  updateCurrentStreak() {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    let streak = 0
    let currentDate = new Date(today)
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const record = this.globalData.checkInRecords.find(r => r.date === dateStr)
      
      if (record && record.checkedIn) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    this.globalData.userProfile.currentStreak = streak
  },
  
  checkAchievements(duration) {
    const { userProfile, achievements } = this.globalData
    
    if (!achievements.find(a => a.id === '1').unlocked && userProfile.totalStudyDays >= 1) {
      achievements.find(a => a.id === '1').unlocked = true
    }
    
    if (!achievements.find(a => a.id === '2').unlocked && userProfile.currentStreak >= 7) {
      achievements.find(a => a.id === '2').unlocked = true
    }
    
    if (!achievements.find(a => a.id === '3').unlocked && userProfile.currentStreak >= 30) {
      achievements.find(a => a.id === '3').unlocked = true
    }
    
    if (!achievements.find(a => a.id === '4').unlocked && duration >= 180) {
      achievements.find(a => a.id === '4').unlocked = true
    }
    
    if (!achievements.find(a => a.id === '5').unlocked && userProfile.totalStudyHours >= 100) {
      achievements.find(a => a.id === '5').unlocked = true
    }
    
    const studyGoals = this.globalData.studyGoals
    const allGoalsCompleted = studyGoals.length > 0 && studyGoals.every(g => g.completed)
    if (!achievements.find(a => a.id === '6').unlocked && allGoalsCompleted) {
      achievements.find(a => a.id === '6').unlocked = true
    }
  }
})
