var app = getApp()

Page({
  data: {
    nickname: '',
    tempNickname: '',
    editingNickname: false,
    checkInTypes: [],
    showAddTypeModal: false,
    newTypeName: '',
    selectedIcon: '馃摑',
    iconOptions: [
      '馃摎', '馃捈', '馃弮', '馃摉', '鉁嶏笍', '馃崝', '馃挧', '馃槾',
      '馃帹', '馃幍', '馃Ч', '馃泴', '馃', '馃挭', '馃幆', '馃摫'
    ]
  },

  onLoad: function() {
    this.initData()
  },

  initData: function() {
    this.setData({
      nickname: app.globalData.userProfile.nickname,
      checkInTypes: app.globalData.checkInTypes
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

  openAddTypeModal: function() {
    this.setData({
      showAddTypeModal: true,
      newTypeName: '',
      selectedIcon: '馃摑'
    })
  },

  closeAddTypeModal: function() {
    this.setData({ showAddTypeModal: false })
  },

  onTypeNameInput: function(e) {
    this.setData({ newTypeName: e.detail.value })
  },

  selectIcon: function(e) {
    var icon = e.currentTarget.dataset.icon
    this.setData({ selectedIcon: icon })
  },

  addType: function() {
    if (!this.data.newTypeName.trim()) {
      wx.showToast({ title: '璇疯緭鍏ョ被鍨嬪悕绉?, icon: 'none' })
      return
    }

    var exists = false
    var types = app.globalData.checkInTypes
    for (var i = 0; i < types.length; i++) {
      if (types[i].name === this.data.newTypeName) {
        exists = true
        break
      }
    }
    if (exists) {
      wx.showToast({ title: '绫诲瀷宸插瓨鍦?, icon: 'none' })
      return
    }

    app.addCheckInType(this.data.newTypeName, this.data.selectedIcon)
    this.setData({
      checkInTypes: app.globalData.checkInTypes,
      showAddTypeModal: false,
      newTypeName: ''
    })
    wx.showToast({ title: '娣诲姞鎴愬姛', icon: 'success' })
  },

  deleteType: function(e) {
    var name = e.currentTarget.dataset.name
    if (app.globalData.checkInTypes.length <= 1) {
      wx.showToast({ title: '鑷冲皯淇濈暀涓€绉嶇被鍨?, icon: 'none' })
      return
    }

    var that = this
    wx.showModal({
      title: '纭鍒犻櫎',
      content: '纭畾瑕佸垹闄ゃ€? + name + '銆嶇被鍨嬪悧锛?,
      success: function(res) {
        if (res.confirm) {
          app.deleteCheckInType(name)
          that.setData({ checkInTypes: app.globalData.checkInTypes })
          wx.showToast({ title: '鍒犻櫎鎴愬姛', icon: 'success' })
        }
      }
    })
  },

  clearAllData: function() {
    wx.showModal({
      title: '娓呴櫎鏁版嵁',
      content: '纭畾瑕佹竻闄ゆ墍鏈夋暟鎹悧锛熻繖灏嗗垹闄ゆ墍鏈夋墦鍗¤褰曘€佺洰鏍囧拰璁剧疆銆?,
      success: function(res) {
        if (res.confirm) {
          wx.clearStorageSync()
          wx.reLaunch({ url: '/pages/home/home' })
        }
      }
    })
  },

  goBack: function() {
    wx.navigateBack()
  },

  noop: function() {
    // 绌烘柟娉曪紝鐢ㄤ簬catchtap缁戝畾
  }
})