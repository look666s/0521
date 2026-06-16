App({
  globalData: {
    userProfile: {
      nickname: '瀛︿範杈句汉',
      totalStudyDays: 22,
      totalStudyHours: 86,
      longestStreak: 12,
      currentStreak: 5
    },
    checkInRecords: [],
    checkInTypes: [
      { name: '瀛︿範', icon: '馃摎', color: '#6366F1' },
      { name: '宸ヤ綔', icon: '馃捈', color: '#10B981' },
      { name: '杩愬姩', icon: '馃弮', color: '#F59E0B' },
      { name: '闃呰', icon: '馃摉', color: '#8B5CF6' },
      { name: '鍐欎綔', icon: '鉁嶏笍', color: '#EC4899' },
      { name: '鍚冮キ', icon: '馃崝', color: '#F97316' },
      { name: '鍠濇按', icon: '馃挧', color: '#06B6D4' },
      { name: '鐫¤', icon: '馃槾', color: '#84CC16' }
    ],
    studyGoals: [
      { id: '1', title: '鑻辫瀛︿範', description: '姣忓ぉ鑳岃20涓崟璇嶏紝闃呰涓€绡囪嫳鏂囨枃绔?, targetDuration: 3000, currentDuration: 1850, deadline: '2026-07-08', completed: false, createdAt: '2026-05-24' },
      { id: '2', title: '缂栫▼缁冧範', description: '姣忓ぉ瀹屾垚涓€閬撶畻娉曢锛屽涔犱竴涓柊鎶€鏈?, targetDuration: 2000, currentDuration: 1420, deadline: '2026-06-28', completed: false, createdAt: '2026-05-29' },
      { id: '3', title: '闃呰璁″垝', description: '姣忔湀闃呰涓€鏈功锛屽仛濂借涔︾瑪璁?, targetDuration: 1200, currentDuration: 1200, deadline: '2026-06-03', completed: true, createdAt: '2026-05-08' }
    ],
    achievements: [
      { id: '1', title: '鍒濆嚭鑼呭簮', description: '瀹屾垚绗竴娆℃墦鍗?, icon: '馃専', unlocked: true },
      { id: '2', title: '鍧氭寔涓嶆噲', description: '杩炵画鎵撳崱7澶?, icon: '馃敟', unlocked: true },
      { id: '3', title: '瀛﹂湼鍏绘垚', description: '杩炵画鎵撳崱30澶?, icon: '馃憫', unlocked: false },
      { id: '4', title: '鏃堕棿绠＄悊', description: '鍗曟棩瀛︿範瓒呰繃3灏忔椂', icon: '鈴?, unlocked: true },
      { id: '5', title: '鐭ヨ瘑娴锋磱', description: '绱瀛︿範瓒呰繃100灏忔椂', icon: '馃摎', unlocked: false },
      { id: '6', title: '鍏ㄨ兘閫夋墜', description: '瀹屾垚鎵€鏈夊涔犵洰鏍?, icon: '馃弳', unlocked: false }
    ]
  },

  onLaunch() {
    this.loadFromStorage()
    if (this.globalData.checkInRecords.length === 0) {
      this.initCheckInRecords()
    }
    this.saveToStorage()
  },

  loadFromStorage() {
    try {
      const savedProfile = wx.getStorageSync('userProfile')
      if (savedProfile) {
        this.globalData.userProfile = JSON.parse(savedProfile)
      }
      
      const savedRecords = wx.getStorageSync('checkInRecords')
      if (savedRecords) {
        this.globalData.checkInRecords = JSON.parse(savedRecords)
      }
      
      const savedTypes = wx.getStorageSync('checkInTypes')
      if (savedTypes) {
        this.globalData.checkInTypes = JSON.parse(savedTypes)
      }
      
      const savedGoals = wx.getStorageSync('studyGoals')
      if (savedGoals) {
        this.globalData.studyGoals = JSON.parse(savedGoals)
      }
      
      const savedAchievements = wx.getStorageSync('achievements')
      if (savedAchievements) {
        this.globalData.achievements = JSON.parse(savedAchievements)
      }
    } catch (e) {
      console.error('鍔犺浇瀛樺偍鏁版嵁澶辫触', e)
    }
  },

  saveToStorage() {
    try {
      wx.setStorageSync('userProfile', JSON.stringify(this.globalData.userProfile))
      wx.setStorageSync('checkInRecords', JSON.stringify(this.globalData.checkInRecords))
      wx.setStorageSync('checkInTypes', JSON.stringify(this.globalData.checkInTypes))
      wx.setStorageSync('studyGoals', JSON.stringify(this.globalData.studyGoals))
      wx.setStorageSync('achievements', JSON.stringify(this.globalData.achievements))
    } catch (e) {
      console.error('淇濆瓨鏁版嵁澶辫触', e)
    }
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
        note: isChecked ? ['浠婃棩瀛︿範寰堝厖瀹?, '瀹屾垚浜嗚鍒掑唴瀹?, '缁х画鍔犳补锛?][Math.floor(Math.random() * 3)] : '',
        checkedIn: isChecked,
        type: isChecked ? ['瀛︿範', '宸ヤ綔', '杩愬姩', '闃呰'][Math.floor(Math.random() * 4)] : ''
      })
    }
    this.globalData.checkInRecords = records
  },

  checkIn(duration, note, type = '瀛︿範') {
    const today = new Date().toISOString().split('T')[0]
    const existingIndex = this.globalData.checkInRecords.findIndex(r => r.date === today)
    const isFirstCheckInToday = existingIndex < 0 || !this.globalData.checkInRecords[existingIndex].checkedIn
    
    if (existingIndex >= 0) {
      this.globalData.checkInRecords[existingIndex].duration += duration
      if (note) this.globalData.checkInRecords[existingIndex].note = note
      this.globalData.checkInRecords[existingIndex].checkedIn = true
      this.globalData.checkInRecords[existingIndex].type = type
    } else {
      this.globalData.checkInRecords.push({
        date: today,
        duration,
        note: note || '',
        checkedIn: true,
        type
      })
    }
    
    if (isFirstCheckInToday) {
      this.globalData.userProfile.totalStudyDays++
      this.updateCurrentStreak()
    }
    
    this.globalData.userProfile.totalStudyHours += Math.floor(duration / 60)
    this.globalData.userProfile.longestStreak = Math.max(this.globalData.userProfile.longestStreak, this.globalData.userProfile.currentStreak)
    
    this.checkAchievements(duration)
    this.saveToStorage()
  },

  addCheckInType(name, icon) {
    const colors = ['#6366F1', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#F97316', '#06B6D4', '#84CC16']
    const color = colors[this.globalData.checkInTypes.length % colors.length]
    
    const newType = { name, icon, color }
    this.globalData.checkInTypes.push(newType)
    this.saveToStorage()
    return newType
  },

  deleteCheckInType(name) {
    this.globalData.checkInTypes = this.globalData.checkInTypes.filter(t => t.name !== name)
    this.saveToStorage()
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
    const { userProfile, achievements, studyGoals } = this.globalData
    
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
    
    const allGoalsCompleted = studyGoals.length > 0 && studyGoals.every(g => g.completed)
    if (!achievements.find(a => a.id === '6').unlocked && allGoalsCompleted) {
      achievements.find(a => a.id === '6').unlocked = true
    }
    
    this.saveToStorage()
  }
})