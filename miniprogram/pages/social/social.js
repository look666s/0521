var app = getApp()

Page({
  data: {
    posts: [],
    newPostContent: '',
    selectedType: '',
    checkInTypes: [],
    showTypeSelector: false,
    showCommentModal: false,
    currentPostId: null,
    commentContent: '',
    todayRecords: []
  },

  onLoad: function() {
    this.initData()
  },

  onShow: function() {
    this.loadPosts()
    this.loadTodayRecords()
  },

  initData: function() {
    var types = this.getDefaultTypes()
    var savedTypes = this.getSavedTypes()
    var mergedTypes = savedTypes.length > 0 ? savedTypes : types
    
    var selectedType = '瀛︿範'
    if (mergedTypes.length > 0) {
      selectedType = mergedTypes[0].name || '瀛︿範'
    }
    
    this.setData({
      checkInTypes: mergedTypes,
      selectedType: selectedType
    })
    
    this.loadPosts()
    this.loadTodayRecords()
  },

  getDefaultTypes: function() {
    return [
      { name: '瀛︿範', icon: '馃摎', color: '#6366F1' },
      { name: '宸ヤ綔', icon: '馃捈', color: '#10B981' },
      { name: '杩愬姩', icon: '馃弮', color: '#F59E0B' },
      { name: '闃呰', icon: '馃摉', color: '#8B5CF6' },
      { name: '鍐欎綔', icon: '鉁嶏笍', color: '#EC4899' },
      { name: '鍚冮キ', icon: '馃崝', color: '#F97316' },
      { name: '鍠濇按', icon: '馃挧', color: '#06B6D4' },
      { name: '鐫¤', icon: '馃槾', color: '#84CC16' }
    ]
  },

  getSavedTypes: function() {
    try {
      var saved = wx.getStorageSync('checkInTypes')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  },

  loadPosts: function() {
    try {
      var savedPosts = wx.getStorageSync('socialPosts')
      var posts = savedPosts ? JSON.parse(savedPosts) : this.getMockPosts()
      this.setData({ posts: posts })
    } catch (e) {
      this.setData({ posts: this.getMockPosts() })
    }
  },

  savePosts: function() {
    try {
      wx.setStorageSync('socialPosts', JSON.stringify(this.data.posts))
    } catch (e) {
      console.error('淇濆瓨甯栧瓙澶辫触', e)
    }
  },

  getMockPosts: function() {
    return [
      {
        id: 'post_1',
        nickname: '瀛﹂湼灏忔槑',
        avatar: '馃懆鈥嶐煄?,
        content: '浠婂ぉ瀹屾垚浜?灏忔椂鐨勮嫳璇涔狅紝鑳岃浜?0涓崟璇嶏紝闃呰浜嗕竴绡囪嫳鏂囨枃绔犮€傜户缁姞娌癸紒馃挭',
        type: '瀛︿範',
        typeIcon: '馃摎',
        duration: 180,
        likes: 23,
        comments: 5,
        date: '2026-06-16 14:30',
        liked: false,
        commentList: [
          { id: 'c1', nickname: '灏忕孩', content: '澶帀瀹充簡锛?, date: '14:35' },
          { id: 'c2', nickname: '灏忔潕', content: '鍧氭寔灏辨槸鑳滃埄锛?, date: '14:40' }
        ]
      },
      {
        id: 'post_2',
        nickname: '杩愬姩杈句汉',
        avatar: '馃弮',
        content: '鏅ㄨ窇5鍏噷锛屾墦鍗″畬鎴愶紒杩愬姩璁╂垜绮惧姏鍏呮矝~',
        type: '杩愬姩',
        typeIcon: '馃弮',
        duration: 30,
        likes: 45,
        comments: 8,
        date: '2026-06-16 08:15',
        liked: true,
        commentList: [
          { id: 'c3', nickname: '鍋ヨ韩鐖卞ソ鑰?, content: '鐪熸锛佹垜涔熻寮€濮嬭窇姝?, date: '08:30' }
        ]
      },
      {
        id: 'post_3',
        nickname: '璇讳功鍗氫富',
        avatar: '馃摎',
        content: '浠婂ぉ璇诲畬浜嗐€婃繁鍏ョ悊瑙ｈ绠楁満绯荤粺銆嬬5绔狅紝鏀惰幏婊℃弧銆傛帹鑽愮粰澶у锛?,
        type: '闃呰',
        typeIcon: '馃摉',
        duration: 120,
        likes: 67,
        comments: 12,
        date: '2026-06-16 10:00',
        liked: false,
        commentList: []
      }
    ]
  },

  loadTodayRecords: function() {
    var today = new Date().toISOString().split('T')[0]
    var records = app.globalData.checkInRecords
    var todayRecords = []
    for (var i = 0; i < records.length; i++) {
      if (records[i].date === today && records[i].checkedIn) {
        todayRecords.push(records[i])
      }
    }
    this.setData({ todayRecords: todayRecords.slice(0, 5) })
  },

  selectType: function(e) {
    var type = e.currentTarget.dataset.type
    this.setData({ 
      selectedType: type,
      showTypeSelector: false
    })
  },

  onPostInput: function(e) {
    this.setData({ newPostContent: e.detail.value })
  },

  toggleTypeSelector: function() {
    this.setData({ showTypeSelector: !this.data.showTypeSelector })
  },

  publishPost: function() {
    if (!this.data.newPostContent.trim()) {
      wx.showToast({ title: '璇疯緭鍏ュ唴瀹?, icon: 'none' })
      return
    }

    var typeInfo = null
    var types = this.data.checkInTypes
    for (var i = 0; i < types.length; i++) {
      if (types[i].name === this.data.selectedType) {
        typeInfo = types[i]
        break
      }
    }
    
    var newPost = {
      id: 'post_' + Date.now(),
      nickname: app.globalData.userProfile.nickname || '鎴?,
      avatar: '馃懁',
      content: this.data.newPostContent,
      type: this.data.selectedType,
      typeIcon: typeInfo ? typeInfo.icon : '馃摑',
      duration: 0,
      likes: 0,
      comments: 0,
      date: new Date().toLocaleString('zh-CN'),
      liked: false,
      commentList: []
    }

    var posts = [newPost].concat(this.data.posts)
    this.setData({ 
      posts: posts,
      newPostContent: ''
    })
    this.savePosts()
    
    wx.showToast({ title: '鍙戝竷鎴愬姛', icon: 'success' })
  },

  toggleLike: function(e) {
    var postId = e.currentTarget.dataset.id
    var posts = this.data.posts
    var newPosts = []
    for (var i = 0; i < posts.length; i++) {
      var post = posts[i]
      if (post.id === postId) {
        var newPost = {}
        for (var key in post) {
          newPost[key] = post[key]
        }
        newPost.liked = !newPost.liked
        newPost.likes = newPost.liked ? newPost.likes + 1 : newPost.likes - 1
        newPosts.push(newPost)
      } else {
        newPosts.push(post)
      }
    }
    this.setData({ posts: newPosts })
    this.savePosts()
  },

  openComments: function(e) {
    var postId = e.currentTarget.dataset.id
    var post = null
    var posts = this.data.posts
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].id === postId) {
        post = posts[i]
        break
      }
    }
    if (post) {
      this.setData({ 
        showCommentModal: true,
        currentPostId: postId,
        commentContent: ''
      })
    }
  },

  closeCommentModal: function() {
    this.setData({ showCommentModal: false })
  },

  onCommentInput: function(e) {
    this.setData({ commentContent: e.detail.value })
  },

  sendComment: function() {
    if (!this.data.commentContent.trim()) {
      wx.showToast({ title: '璇疯緭鍏ヨ瘎璁哄唴瀹?, icon: 'none' })
      return
    }

    var posts = this.data.posts
    var newPosts = []
    for (var i = 0; i < posts.length; i++) {
      var post = posts[i]
      if (post.id === this.data.currentPostId) {
        var newPost = {}
        for (var key in post) {
          newPost[key] = post[key]
        }
        var newComment = {
          id: 'c_' + Date.now(),
          nickname: app.globalData.userProfile.nickname || '鎴?,
          content: this.data.commentContent,
          date: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        }
        newPost.comments = newPost.comments + 1
        newPost.commentList = newPost.commentList ? newPost.commentList.concat([newComment]) : [newComment]
        newPosts.push(newPost)
      } else {
        newPosts.push(post)
      }
    }

    this.setData({ 
      posts: newPosts,
      commentContent: '',
      showCommentModal: false
    })
    this.savePosts()
    
    wx.showToast({ title: '璇勮鎴愬姛', icon: 'success' })
  },

  noop: function() {
    // 绌烘柟娉曪紝鐢ㄤ簬catchtap缁戝畾
  }
})