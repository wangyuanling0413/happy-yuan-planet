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
        } else {
          wx.showToast({
            title: res.result.error || '加载失败',
            icon: 'none'
          })
        }
      }).catch(err => {
        wx.hideLoading()
        console.error('加载题目失败：', err)
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      })
    }
  },

  // 处理答题结果
  handleQuestionResult(e) {
    const { isCorrect } = e.detail;
    const { currentQuestion, questions, answers } = this.data;
    const app = getApp();
    
    console.log('答题结果：', isCorrect ? '正确' : '错误');
    
    // 播放对应音效
    if (isCorrect) {
      console.log('尝试播放正确音效');
      app.playCorrectSound();
    } else {
      console.log('尝试播放错误音效');
      app.playWrongSound();
    }
    
    // 记录答题结果
    answers[currentQuestion] = isCorrect;
    this.setData({ answers });

    // 如果是最后一题，显示完成提示
    if (currentQuestion === questions.length - 1) {
      setTimeout(() => {
        this.showCompleteDialog();
      }, 1500);
    }
  },

  // 显示完成对话框
  showCompleteDialog() {
    const correctCount = this.data.answers.filter(result => result).length;
    const totalCount = this.data.questions.length;
    
    wx.showModal({
      title: '单元完成',
      content: `你答对了 ${correctCount}/${totalCount} 题`,
      showCancel: false,
      success: () => {
        wx.navigateBack();
      }
    });
  }
}) 