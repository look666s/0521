var app = getApp()

Page({
  data: {
    nickname: '',
    editingNickname: false,
    tempNickname: '',
    achievements: [],
    unlockedCount: 0,
    userProfile: {},
    menuItems: [
      { icon: '馃搳', text: '瀛︿範鎶ュ憡', action: 'showReport' },
      { icon: '馃弳', text: '鎴愬氨涓績', action: 'showAchievements' },
      { icon: '馃挰', text: '瀛︿範绀惧尯', action: 'showCommunity' },
      { icon: '鈿欙笍', text: '璁剧疆', action: 'showSettings' },
      { icon: '鉂?, text: '甯姪涓庡弽棣?, action: 'showHelp' }
    ]
  },

  onLoad: function() {
    this.initData()
  },

  onShow: function() {
    this.initData()
  },

  initData: function() {
    var achievements = app.globalData.achievements
    var unlockedCount = 0
    for (var i = 0; i < achievements.length; i++) {
      if (achievements[i].unlocked) {
        unlockedCount++
      }
    }
    this.setData({
      nickname: app.globalData.userProfile.nickname,
      achievements: achievements,
      unlockedCount: unlockedCount,
      userProfile: app.globalData.userProfile
    })
  },

  startEditNickname: function() {
    this.setData({
      editingNickname: true,
      tempNickname: this.data.nickname
    })
  },

  onNicknameInput: function(e) {
    this.setData({ tempNickname: e.detail.value })
  },

  saveNickname: function() {
    if (this.data.tempNickname.trim()) {
      app.globalData.userProfile.nickname = this.data.tempNickname
      app.saveToStorage()
      this.setData({
        nickname: this.data.tempNickname,
        editingNickname: false
      })
      wx.showToast({
        title: '淇濆瓨鎴愬姛',
        icon: 'success'
      })
    }
  },

  cancelEdit: function() {
    this.setData({ editingNickname: false })
  },

  handleMenuClick: function(e) {
    var action = e.currentTarget.dataset.action
    if (action === 'showSettings') {
      wx.navigateTo({ url: '/pages/settings/settings' })
    } else if (action === 'showCommunity') {
      wx.switchTab({ url: '/pages/social/social' })
    } else {
      wx.showToast({
        title: '鍔熻兘寮€鍙戜腑',
        icon: 'none'
      })
    }
  },

  noop: function() {
    // 绌烘柟娉曪紝鐢ㄤ簬catchtap缁戝畾
  }
})