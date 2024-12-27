Page({
  data: {
    questions: [],
    currentQuestion: 0,
    section: 1,
    unit: 1,
    score: 0,
    answers: [],
    showNavigation: false  // 控制导航面板的显示
  },

  onLoad(options) {
    const { section, unit } = options
    const app = getApp()
    
    console.log('加载单元页面，参数：', options);
    
    // 检查缓存
    const cacheKey = `${section}-${unit}`
    if (app.globalData.questionsCache[cacheKey]) {
      console.log('使用本地缓存的题目');
      console.log('缓存题目数量：', app.globalData.questionsCache[cacheKey].length);
      this.setData({
        questions: app.globalData.questionsCache[cacheKey],
        answers: new Array(app.globalData.questionsCache[cacheKey].length).fill(null),
        section,
        unit
      })
    } else {
      // 没有缓存就请求云函数
      console.log('请求云函数获取题目');
      wx.showLoading({ title: '加载中' })
      wx.cloud.callFunction({
        name: 'getQuestions',
        data: { section, unit }
      }).then(res => {
        wx.hideLoading()
        console.log('云函数返回结果：', res.result);
        
        // 输出调试信息
        if (res.result && res.result.debug) {
          console.log('数据库信息：', res.result.debug.dbInfo);
          console.log('查询条件：', res.result.debug.query);
          console.log('匹配题目数：', res.result.debug.matchedQuestions);
        }
        
        if (res.result && res.result.success) {
          console.log('获取题目成功，数量：', res.result.data.length);
          // 存入缓存
          app.globalData.questionsCache[cacheKey] = res.result.data
          this.setData({
            questions: res.result.data,
            answers: new Array(res.result.data.length).fill(null),
            section,
            unit
          })
        } else {
          console.error('获取题目失败：', res.result.error);
          wx.showToast({
            title: res.result.error || '加载失败',
            icon: 'none'
          })
        }
      }).catch(err => {
        wx.hideLoading()
        console.error('调用云函数失败：', err)
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
    console.log('当前题目：', currentQuestion + 1, '总题数：', questions.length);
    console.log('当前题目详情：', questions[currentQuestion]);
    
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

    // 先显示答题结果
    wx.showToast({
      title: isCorrect ? '回答正确' : '回答错误',
      icon: isCorrect ? 'success' : 'error',
      duration: 1500
    });

    // 显示解析
    setTimeout(() => {
      wx.showModal({
        title: isCorrect ? '答对了！' : '解析',
        content: questions[currentQuestion].explanation,
        showCancel: false,
        success: () => {
          // 用户点击确定后，根据是否是最后一题决定下一步操作
          if (currentQuestion === questions.length - 1) {
            console.log('这是最后一题，即将显示完成提示');
            setTimeout(() => {
              this.showCompleteDialog();
            }, 500);
          } else {
            // 自动进入下一题
            console.log('准备进入下一题');
            console.log('当前题号：', currentQuestion, '下一题号：', currentQuestion + 1);
            setTimeout(() => {
              this.setData({
                currentQuestion: currentQuestion + 1
              });
            }, 1000);
          }
        }
      });
    }, 1500);
  },

  // 显示完成对话框
  showCompleteDialog() {
    try {
      console.log('显示完成对话框');
      const correctCount = this.data.answers.filter(result => result).length;
      const totalCount = this.data.questions.length;
      const score = Math.round((correctCount / totalCount) * 100);
      
      // 先更新学习进度
      wx.showLoading({ title: '保存进度' });
      
      // 准备要发送的数据
      const progressData = {
        section: parseInt(this.data.section),
        unit: parseInt(this.data.unit),
        score: score,
        isCompleted: true
      };
      
      console.log('准备更新进度，数据：', progressData);
      
      // 检查数据是否有效
      if (!progressData.section || !progressData.unit) {
        throw new Error('section或unit无效');
      }
      
      wx.cloud.callFunction({
        name: 'updateProgress',
        data: progressData
      }).then(res => {
        console.log('云函数调用结果：', res);
        wx.hideLoading();
        
        if (res.result && res.result.success) {
          console.log('更新进度成功，返回数据：', res.result);
          // 显示完成对话框
          wx.showModal({
            title: '单元完成',
            content: `答题结果：\n正确：${correctCount}题\n总计：${totalCount}题\n得分：${score}分`,
            confirmText: '下一单元',
            cancelText: '返回目录',
            success: (res) => {
              console.log('用户确认完成对话框，选择：', res.confirm ? '下一单元' : '返回目录');
              if (res.confirm) {
                // 进入下一单元
                const nextUnit = parseInt(this.data.unit) + 1;
                console.log('准备跳转到下一单元：', nextUnit);
                wx.redirectTo({
                  url: `/pages/unit/unit?section=${this.data.section}&unit=${nextUnit}`
                });
              } else {
                // 返回课程页面
                wx.navigateBack();
              }
            }
          });
        } else {
          console.error('更新进度失败，返回数据：', res);
          wx.showModal({
            title: '保存进度失败',
            content: res.result?.error || '未知错误',
            showCancel: false
          });
        }
      }).catch(err => {
        wx.hideLoading();
        console.error('调用云函数失败：', err);
        console.error('错误详情：', err.errMsg || err.message);
        // 显示更详细的错误信息
        wx.showModal({
          title: '保存进度失败',
          content: '请重新进入该单元。\n错误信息：' + (err.errMsg || err.message || '未知错误'),
          showCancel: false,
          success: () => {
            wx.navigateBack();
          }
        });
      });
    } catch (err) {
      wx.hideLoading();
      console.error('显示完成对话框时出错：', err);
      wx.showModal({
        title: '系统错误',
        content: err.message || '未知错误',
        showCancel: false
      });
    }
  },

  // 切换到上一题
  prevQuestion() {
    if (this.data.currentQuestion > 0) {
      this.setData({
        currentQuestion: this.data.currentQuestion - 1
      });
    }
  },

  // 切换到下一题
  nextQuestion() {
    console.log('执行nextQuestion，当前题号：', this.data.currentQuestion);
    if (this.data.currentQuestion < this.data.questions.length - 1) {
      const nextQuestionIndex = this.data.currentQuestion + 1;
      console.log('将要切换到题号：', nextQuestionIndex);
      console.log('下一题详情：', this.data.questions[nextQuestionIndex]);
      this.setData({
        currentQuestion: nextQuestionIndex
      });
    }
  },

  // 切换导航面板
  toggleNavigation() {
    this.setData({
      showNavigation: !this.data.showNavigation
    });
  },

  // 跳转到指定题目
  jumpToQuestion(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentQuestion: index,
      showNavigation: false
    });
  }
}) 