Page({
  data: {
    questions: [],
    currentQuestion: 0,
    section: 1,
    unit: 1,
    score: 0,
    answers: []
  },

  onLoad(options) {
    const { section, unit } = options
    const app = getApp()
    
    // 检查缓存
    const cacheKey = `${section}-${unit}`
    if (app.globalData.questionsCache[cacheKey]) {
      this.setData({
        questions: app.globalData.questionsCache[cacheKey],
        answers: new Array(app.globalData.questionsCache[cacheKey].length).fill(null),
        section,
        unit
      })
    } else {
      // 没有缓存就请求云函数
      wx.showLoading({ title: '加载中' })
      wx.cloud.callFunction({
        name: 'getQuestions',
        data: { section, unit }
      }).then(res => {
        wx.hideLoading()
        if (res.result && res.result.success) {
          // 存入缓存
          app.globalData.questionsCache[cacheKey] = res.result.data
          this.setData({
            questions: res.result.data,
            answers: new Array(res.result.data.length).fill(null),
            section,
            unit
          })
        }
      }).catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      })
    }
  },

  // 过滤当前单元的题目
  filterQuestions(allQuestions, section, unit) {
    const unitQuestions = allQuestions.filter(q => 
      q.section === parseInt(section) && 
      q.unit === parseInt(unit)
    )
    
    this.setData({ questions: unitQuestions })
  }
}) 