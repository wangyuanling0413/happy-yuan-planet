Page({
  data: {
    questions: [],
    currentQuestion: 0,
    section: 1,
    unit: 1,
    score: 0,
    answers: []  // 存储用户答题结果
  },

  onLoad(options) {
    const { section, unit } = options;
    this.setData({ section, unit });
    this.loadQuestions();
  },

  loadQuestions() {
    wx.cloud.callFunction({
      name: 'getQuestions',
      data: {
        section: this.data.section,
        unit: this.data.unit
      }
    }).then(res => {
      if (res.result && res.result.success) {
        this.setData({
          questions: res.result.data,
          // 初始化答题结果数组
          answers: new Array(res.result.data.length).fill(null)
        });
      }
    }).catch(err => {
      console.error('获取题目失败：', err);
      wx.showToast({
        title: '加载题目失败',
        icon: 'none'
      });
    });
  },

  // 处理答题结果
  handleQuestionResult(e) {
    const { isCorrect } = e.detail;
    const { currentQuestion, questions, answers } = this.data;
    
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

  // 上一题
  prevQuestion() {
    if (this.data.currentQuestion > 0) {
      this.setData({
        currentQuestion: this.data.currentQuestion - 1
      });
    }
  },

  // 下一题
  nextQuestion() {
    if (this.data.currentQuestion < this.data.questions.length - 1) {
      this.setData({
        currentQuestion: this.data.currentQuestion + 1
      });
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
}); 