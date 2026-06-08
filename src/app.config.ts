export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/goal/index',
    'pages/stats/index',
    'pages/mine/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '学习打卡',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F8FAFC'
  },
  tabBar: {
    color: '#94A3B8',
    selectedColor: '#6366F1',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/goal/index',
        text: '目标'
      },
      {
        pagePath: 'pages/stats/index',
        text: '统计'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
