const app = getApp()

Page({
  data: {
    greeting: '',
    month: '',
    day: '',
    weekDay: '',
    userProfile: {},
    todayRecord: null,
    isCheckedIn: false,
    selectedDuration: 60,
    durationOptions: [30, 60, 90, 120],
    note: '',
    activeGoals: [],
    selectedGoalId: null,
    showSuccessModal: false
  },

  onLoad() {
    this.initPage()
  },

  onShow() {
    this.refreshData()
  },

  initPage() {
    this.setGreeting()
    this.refreshData()
  },

  setGreeting() {
    const hour = new Date().getHours()
    let greeting = '晚上好'
    if (hour < 6) greeting = '晚上好'
    else if (hour < 12) greeting = '早上好'
    else if (hour < 14) greeting = '中午好'
    else if (hour < 18) greeting = '下午好'
    
    const today = new Date()
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    
    this.setData({
      greeting,
      month: today.getMonth() + 1,
      day: today.getDate(),
      weekDay: weekDays[today.getDay()]
    })
  },

  refreshData() {
    const today = new Date().toISOString().split('T')[0]
    const todayRecord = app.globalData.checkInRecords.find(r => r.date === today)
    const activeGoals = app.globalData.studyGoals.filter(g => !g.completed).slice(0, 3)
    
    this.setData({
      userProfile: app.globalData.userProfile,
      todayRecord,
      isCheckedIn: !!todayRecord?.checkedIn,
      activeGoals
    })
  },

  formatDuration(minutes) {
    if (!minutes) return '0分钟'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`
    }
    return `${mins}分钟`
  },

  calculateProgress(current, target) {
    if (!target) return 0
    return Math.min(Math.round((current / target) * 100), 100)
  },

  selectDuration(e) {
    const duration = e.currentTarget.dataset.duration
    this.setData({ selectedDuration: duration })
  },

  onNoteInput(e) {
    this.setData({ note: e.detail.value })
  },

  doCheckIn() {
    app.checkIn(this.data.selectedDuration, this.data.note)
    
    if (this.data.selectedGoalId) {
      const goalIndex = app.globalData.studyGoals.findIndex(g => g.id === this.data.selectedGoalId)
      if (goalIndex >= 0) {
        const goal = app.globalData.studyGoals[goalIndex]
        goal.currentDuration += this.data.selectedDuration
        if (goal.currentDuration >= goal.targetDuration) {
          goal.completed = true
        }
      }
    }
    
    this.setData({ 
      showSuccessModal: true,
      note: '',
      selectedGoalId: null
    })
    this.refreshData()
  },
  
  selectGoal(e) {
    const goalId = e.currentTarget.dataset.id
    this.setData({
      selectedGoalId: this.data.selectedGoalId === goalId ? null : goalId
    })
  },

  closeModal() {
    this.setData({ showSuccessModal: false })
  }
})
