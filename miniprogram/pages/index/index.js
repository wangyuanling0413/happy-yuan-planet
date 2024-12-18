Page({
    data: {},
  
    onLoad() {
      // 检查是否已注册
      this.checkRegistration();
    },
  
    // 检查用户是否已注册
    checkRegistration() {
      const db = wx.cloud.database();
      wx.cloud.callFunction({
        name: 'checkUser',
      }).then(res => {
        this.setData({
          isRegistered: res.result.isRegistered
        });
      }).catch(err => {
        console.error('检查用户注册状态失败：', err);
      });
    },
  
    // 开始学习按钮点击事件
    startLearning() {
      wx.showLoading({
        title: '加载中...'
      });

      wx.cloud.callFunction({
        name: 'checkUser'
      }).then(res => {
        wx.hideLoading();
        console.log('检查用户状态，完整数据：', JSON.stringify(res, null, 2));
        console.log('是否已注册：', res.result.isRegistered);

        if (res.result && res.result.success) {
          if (res.result.isRegistered) {
            console.log('用户已注册，跳转到学习页面');
            wx.redirectTo({
              url: '/pages/learn/learn'
            });
          } else {
            console.log('用户未注册，跳转到注册页面');
            wx.redirectTo({
              url: '/pages/register/register'
            });
          }
        } else {
          console.error('检查失败：', res.result.error);
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
    }
  }); 