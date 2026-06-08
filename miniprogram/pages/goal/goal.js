const app = getApp()

Page({
  data: {
    activeGoals: [],
    completedGoals: [],
    showAddModal: false,
    editingGoal: null,
    goalForm: {
      title: '',
      description: '',
      targetDuration: 1200,
      deadline: ''
    },
    durationOptions: [600, 1200, 1800, 3000]
  },

  onLoad() {
    this.refreshData()
  },

  onShow() {
    this.refreshData()
  },

  refreshData() {
    const goals = app.globalData.studyGoals
    this.setData({
      activeGoals: goals.filter(g => !g.completed),
      completedGoals: goals.filter(g => g.completed)
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

  openAddModal() {
    const today = new Date()
    const deadline = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const deadlineStr = deadline.toISOString().split('T')[0]
    
    this.setData({
      showAddModal: true,
      editingGoal: null,
      goalForm: {
        title: '',
        description: '',
        targetDuration: 1200,
        deadline: deadlineStr
      }
    })
  },

  openEditModal(e) {
    const goal = e.currentTarget.dataset.goal
    this.setData({
      showAddModal: true,
      editingGoal: goal,
      goalForm: {
        title: goal.title,
        description: goal.description,
        targetDuration: goal.targetDuration,
        deadline: goal.deadline
      }
    })
  },

  closeModal() {
    this.setData({ showAddModal: false })
  },

  onTitleInput(e) {
    this.setData({
      'goalForm.title': e.detail.value
    })
  },

  onDescInput(e) {
    this.setData({
      'goalForm.description': e.detail.value
    })
  },

  onDeadlineInput(e) {
    this.setData({
      'goalForm.deadline': e.detail.value
    })
  },

  selectDuration(e) {
    const duration = e.currentTarget.dataset.duration
    this.setData({
      'goalForm.targetDuration': duration
    })
  },

  saveGoal() {
    if (!this.data.goalForm.title.trim()) {
      wx.showToast({
        title: '请输入目标名称',
        icon: 'none'
      })
      return
    }

    if (this.data.editingGoal) {
      const index = app.globalData.studyGoals.findIndex(g => g.id === this.data.editingGoal.id)
      if (index >= 0) {
        app.globalData.studyGoals[index] = {
          ...app.globalData.studyGoals[index],
          ...this.data.goalForm
        }
      }
    } else {
      const newGoal = {
        id: Date.now().toString(),
        title: this.data.goalForm.title,
        description: this.data.goalForm.description,
        targetDuration: this.data.goalForm.targetDuration,
        currentDuration: 0,
        deadline: this.data.goalForm.deadline,
        completed: false,
        createdAt: new Date().toISOString().split('T')[0]
      }
      app.globalData.studyGoals.push(newGoal)
    }

    this.closeModal()
    this.refreshData()
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })
  },

  deleteGoal(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个目标吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.studyGoals = app.globalData.studyGoals.filter(g => g.id !== id)
          this.refreshData()
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  }
})
