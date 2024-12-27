Page({
  data: {
    isOceanPlaying: false
  },

  onLoad() {
    /* 暂时注释掉音频代码
    const app = getApp()
    const isPlaying = app.toggleOceanBGM()
    this.setData({
      isOceanPlaying: isPlaying
    })
    */
  },

  onShow() {
    /* 暂时注释掉音频代码
    const app = getApp()
    if (this.data.isOceanPlaying && app.oceanBGM.paused) {
      app.oceanBGM.play()
    }
    */
  },

  onHide() {
    /* 暂时注释掉音频代码
    const app = getApp()
    if (!app.oceanBGM.paused) {
      app.oceanBGM.pause()
    }
    */
  },

  // 开始学习按钮点击事件
  startLearning() {
    const app = getApp()
    app.playClickSound()  // 播放点击音效
    
    wx.showLoading({
      title: '加载中...'
    });

    wx.cloud.callFunction({
      name: 'checkUser'
    }).then(res => {
      wx.hideLoading();
      console.log('检查用户状态：', res.result);

      if (res.result && res.result.success) {
        if (res.result.isRegistered) {
          wx.redirectTo({
            url: '/pages/learn/learn'
          });
        } else {
          wx.redirectTo({
            url: '/pages/register/register'
          });
        }
      } else {
        wx.showToast({
          title: '系统错误',
          icon: 'none'
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('调用云函数失败：', err);
      wx.showToast({
        title: '系统错误',
        icon: 'none'
      });
    });
  },

  // ... 其他现有方法 ...
}) 