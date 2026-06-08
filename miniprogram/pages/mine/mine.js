const app = getApp()

Page({
  data: {
    nickname: '',
    editingNickname: false,
    tempNickname: '',
    achievements: [],
    unlockedCount: 0,
    userProfile: {},
    menuItems: [
      { icon: '📊', text: '学习报告', action: 'showReport' },
      { icon: '🏆', text: '成就中心', action: 'showAchievements' },
      { icon: '💬', text: '学习社区', action: 'showCommunity' },
      { icon: '⚙️', text: '设置', action: 'showSettings' },
      { icon: '❓', text: '帮助与反馈', action: 'showHelp' }
    ]
  },

  onLoad() {
    this.initData()
  },

  onShow() {
    this.initData()
  },

  initData() {
    const achievements = app.globalData.achievements
    const unlockedCount = achievements.filter(a => a.unlocked).length
    this.setData({
      nickname: app.globalData.userProfile.nickname,
      achievements,
      unlockedCount,
      userProfile: app.globalData.userProfile
    })
  },

  startEditNickname() {
    this.setData({
      editingNickname: true,
      tempNickname: this.data.nickname
    })
  },

  onNicknameInput(e) {
    this.setData({ tempNickname: e.detail.value })
  },

  saveNickname() {
    if (this.data.tempNickname.trim()) {
      app.globalData.userProfile.nickname = this.data.tempNickname
      this.setData({
        nickname: this.data.tempNickname,
        editingNickname: false
      })
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
    }
  },

  cancelEdit() {
    this.setData({ editingNickname: false })
  },

  handleMenuClick(e) {
    const action = e.currentTarget.dataset.action
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }
})
