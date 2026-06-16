var app = getApp()

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
    showSuccessModal: false,
    checkInTypes: [],
    selectedType: '',
    showTypeSelector: false,
    todayRecords: [],
    currentPage: 'home'
  },

  onLoad: function() {
    console.log('[Home page] onLoad')
    this.initPage()
  },

  onShow: function() {
    console.log('[Home page] onShow')
    this.refreshData()
  },

  initPage: function() {
    this.setGreeting()
    this.refreshData()
  },

  setGreeting: function() {
    var hour = new Date().getHours()
    var greeting = '鏅氫笂濂?
    if (hour < 6) {
      greeting = '鏅氫笂濂?
    } else if (hour < 12) {
      greeting = '鏃╀笂濂?
    } else if (hour < 14) {
      greeting = '涓崍濂?
    } else if (hour < 18) {
      greeting = '涓嬪崍濂?
    }
    
    var today = new Date()
    var weekDays = ['鍛ㄦ棩', '鍛ㄤ竴', '鍛ㄤ簩', '鍛ㄤ笁', '鍛ㄥ洓', '鍛ㄤ簲', '鍛ㄥ叚']
    
    this.setData({
      greeting: greeting,
      month: today.getMonth() + 1,
      day: today.getDate(),
      weekDay: weekDays[today.getDay()]
    })
  },

  refreshData: function() {
    var today = new Date().toISOString().split('T')[0]
    var todayRecord = null
    var records = app.globalData.checkInRecords
    for (var i = 0; i < records.length; i++) {
      if (records[i].date === today) {
        todayRecord = records[i]
        break
      }
    }
    
    var activeGoals = []
    var goals = app.globalData.studyGoals
    for (var j = 0; j < goals.length; j++) {
      if (!goals[j].completed && activeGoals.length < 3) {
        activeGoals.push(goals[j])
      }
    }
    
    var todayRecords = []
    for (var k = 0; k < records.length; k++) {
      if (records[k].date === today && records[k].checkedIn) {
        todayRecords.push(records[k])
      }
    }
    
    var checkInTypes = app.globalData.checkInTypes
    var selectedType = '瀛︿範'
    if (checkInTypes.length > 0) {
      selectedType = checkInTypes[0].name || '瀛︿範'
    }
    
    this.setData({
      userProfile: app.globalData.userProfile,
      todayRecord: todayRecord,
      isCheckedIn: todayRecord ? todayRecord.checkedIn : false,
      activeGoals: activeGoals,
      checkInTypes: checkInTypes,
      selectedType: selectedType,
      todayRecords: todayRecords
    })
  },

  formatDuration: function(minutes) {
    if (!minutes) return '0鍒嗛挓'
    var hours = Math.floor(minutes / 60)
    var mins = minutes % 60
    if (hours > 0) {
      return hours + '灏忔椂' + (mins > 0 ? mins + '鍒嗛挓' : '')
    }
    return mins + '鍒嗛挓'
  },

  calculateProgress: function(current, target) {
    if (!target) return 0
    return Math.min(Math.round((current / target) * 100), 100)
  },

  selectDuration: function(e) {
    var duration = e.currentTarget.dataset.duration
    this.setData({ selectedDuration: duration })
  },

  selectType: function(e) {
    var type = e.currentTarget.dataset.type
    this.setData({ 
      selectedType: type,
      showTypeSelector: false
    })
  },

  onNoteInput: function(e) {
    this.setData({ note: e.detail.value })
  },

  toggleTypeSelector: function() {
    this.setData({ showTypeSelector: !this.data.showTypeSelector })
  },

  doCheckIn: function() {
    app.checkIn(this.data.selectedDuration, this.data.note, this.data.selectedType)
    
    if (this.data.selectedGoalId) {
      var goalIndex = -1
      var goals = app.globalData.studyGoals
      for (var i = 0; i < goals.length; i++) {
        if (goals[i].id === this.data.selectedGoalId) {
          goalIndex = i
          break
        }
      }
      if (goalIndex >= 0) {
        var goal = goals[goalIndex]
        goal.currentDuration += this.data.selectedDuration
        if (goal.currentDuration >= goal.targetDuration) {
          goal.completed = true
        }
        app.saveToStorage()
      }
    }
    
    this.setData({ 
      showSuccessModal: true,
      note: '',
      selectedGoalId: null
    })
    this.refreshData()
  },
  
  selectGoal: function(e) {
    var goalId = e.currentTarget.dataset.id
    this.setData({
      selectedGoalId: this.data.selectedGoalId === goalId ? null : goalId
    })
  },

  closeModal: function() {
    this.setData({ showSuccessModal: false })
  },

  goToSettings: function() {
    wx.navigateTo({ url: '/pages/settings/settings' })
  },

  noop: function() {
    // 绌烘柟娉曪紝鐢ㄤ簬catchtap缁戝畾
  },

  onPullDownRefresh: function() {
    this.refreshData()
    wx.stopPullDownRefresh()
  }
})