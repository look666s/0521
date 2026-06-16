const app = getApp()

Page({
  data: {
    currentYear: 2024,
    currentMonth: 6,
    monthDays: [],
    weekDays: ['鏃?, '涓€', '浜?, '涓?, '鍥?, '浜?, '鍏?],
    today: '',
    weekData: [],
    maxWeekDuration: 1,
    completedGoalsPercent: 0,
    monthStats: {
      totalDays: 0,
      checkedDays: 0,
      totalDuration: 0,
      avgDuration: 0
    },
    currentStreak: 0,
    longestStreak: 0,
    unlockedAchievements: 0,
    checkInRecords: [],
    userProfile: {},
    achievements: []
  },

  onLoad() {
    const today = new Date()
    this.refreshData()
    this.setData({
      currentYear: today.getFullYear(),
      currentMonth: today.getMonth(),
      today: today.toISOString().split('T')[0]
    })
    this.generateCalendar()
    this.generateWeekData()
    this.calculateMonthStats()
    this.calculateGoalsPercent()
  },

  onShow() {
    this.refreshData()
    this.generateCalendar()
    this.generateWeekData()
    this.calculateMonthStats()
    this.calculateGoalsPercent()
  },

  refreshData() {
    this.setData({
      currentStreak: app.globalData.userProfile.currentStreak,
      longestStreak: app.globalData.userProfile.longestStreak,
      unlockedAchievements: app.globalData.achievements.filter(a => a.unlocked).length,
      checkInRecords: app.globalData.checkInRecords,
      userProfile: app.globalData.userProfile,
      achievements: app.globalData.achievements
    })
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  generateCalendar() {
    const { currentYear, currentMonth, checkInRecords } = this.data
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const monthDays = []

    for (let i = 0; i < firstDay.getDay(); i++) {
      monthDays.push({ date: 0, day: '', fullDate: '', checkedIn: false })
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day)
      const fullDate = this.formatDate(date)
      const record = checkInRecords.find(r => r.date === fullDate)
      monthDays.push({
        date: day,
        day: this.data.weekDays[date.getDay()],
        fullDate: fullDate,
        checkedIn: record?.checkedIn || false
      })
    }

    this.setData({ monthDays })
  },

  generateWeekData() {
    const weekData = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = this.formatDate(date)
      const record = app.globalData.checkInRecords.find(r => r.date === dateStr)
      
      weekData.push({
        day: this.data.weekDays[date.getDay()],
        duration: record?.duration || 0,
        date: date.getDate()
      })
    }

    const maxWeekDuration = Math.max(...weekData.map(d => d.duration), 1)
    this.setData({ weekData, maxWeekDuration })
  },

  calculateMonthStats() {
    const { currentYear, currentMonth, monthDays } = this.data
    const monthRecords = app.globalData.checkInRecords.filter(r => {
      const recordDate = new Date(r.date)
      return recordDate.getFullYear() === currentYear && recordDate.getMonth() === currentMonth
    })

    const checkedDays = monthRecords.filter(r => r.checkedIn).length
    const totalDuration = monthRecords.reduce((sum, r) => sum + r.duration, 0)
    const avgDuration = checkedDays > 0 ? Math.round(totalDuration / checkedDays) : 0

    this.setData({
      monthStats: {
        totalDays: monthDays.filter(d => d.date > 0).length,
        checkedDays,
        totalDuration,
        avgDuration
      }
    })
  },

  calculateGoalsPercent() {
    const goals = app.globalData.studyGoals
    const completedGoals = goals.filter(g => g.completed).length
    const percent = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0
    this.setData({ completedGoalsPercent: percent })
  },

  formatDuration(minutes) {
    if (!minutes) return '0鍒嗛挓'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}灏忔椂${mins > 0 ? mins + '鍒嗛挓' : ''}`
    }
    return `${mins}鍒嗛挓`
  },

  prevMonth() {
    let { currentYear, currentMonth } = this.data
    currentMonth--
    if (currentMonth < 0) {
      currentMonth = 11
      currentYear--
    }
    this.setData({ currentYear, currentMonth })
    this.generateCalendar()
    this.calculateMonthStats()
  },

  nextMonth() {
    let { currentYear, currentMonth } = this.data
    currentMonth++
    if (currentMonth > 11) {
      currentMonth = 0
      currentYear++
    }
    this.setData({ currentYear, currentMonth })
    this.generateCalendar()
    this.calculateMonthStats()
  }
})
