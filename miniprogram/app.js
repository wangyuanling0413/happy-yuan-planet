App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'happy-yuan-planet-0ezodl4460e810',
        traceUser: true,
      })
    }
  },

  // 不再预加载所有题目
  globalData: {
    courses: null,
    questionsCache: {}  // 改用缓存对象存储各单元的题目
  }
})