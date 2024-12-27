Page({
  data: {
    coins: 0,
    currentSection: 1,
    courses: [
      {
        name: '理财基础知识',
        description: '了解理财的基本概念和重要性',
        section: 1,
        units: [
          { title: '储蓄规划' },
          { title: '预算管理' },
          { title: '消费观念' }
        ]
      },
      {
        name: '信用与负债',
        description: '学习信用卡使用和债务管理',
        section: 2,
        units: [
          { title: '信用卡使用' },
          { title: '分期付款' },
          { title: '债务管理' }
        ]
      },
      {
        name: '投资理财',
        description: '认识不同的投资方式',
        section: 3,
        units: [
          { title: '基金投资' },
          { title: '理财产品' },
          { title: '投资组合' }
        ]
      },
      {
        name: '风险防范',
        description: '学习识别和防范金融风险',
        section: 4,
        units: [
          { title: '投资风险' },
          { title: '网络安全' },
          { title: '资金安全' }
        ]
      }
    ]
  },

  onLoad() {
    // 将课程数据同步到全局
    getApp().globalData.courses = this.data.courses;
    this.getUserInfo();
  },

  // 获取用户信息
  getUserInfo() {
    wx.cloud.callFunction({
      name: 'getUserInfo'
    }).then(res => {
      console.log('获取用户信息成功');
      
      if (res.result && res.result.success) {
        const userData = res.result.data;
        
        // 如果缺少 currentSection 字段，调用更新函数
        if (userData && !userData.currentSection) {
          console.log('用户数据缺少 currentSection，准备更新');
          wx.cloud.callFunction({
            name: 'updateUser'
          }).then(updateRes => {
            if (updateRes.result && updateRes.result.success) {
              // 使用更新后的数据
              const updatedUserData = updateRes.result.data;
              this.setData({
                coins: updatedUserData.coins || 0,
                currentSection: updatedUserData.currentSection || 1
              });
            }
          }).catch(err => {
            console.error('更新用户数据失败：', err);
          });
        } else {
          this.setData({
            coins: userData.coins || 0,
            currentSection: userData.currentSection || 1
          });
        }
      } else {
        console.log('用户可能未注册');
        this.setData({
          coins: 0,
          currentSection: 1
        });
      }
    }).catch(err => {
      console.error('调用云函数失败：', err);
      wx.showToast({
        title: '系统错误',
        icon: 'none'
      });
    });
  },

  // 处理课程选择
  handleCourseSelect(e) {
    const index = e.currentTarget.dataset.index;
    if (this.data.currentSection >= index + 1) {
      wx.navigateTo({
        url: `/pages/course/course?section=${index + 1}`
      });
    } else {
      wx.showToast({
        title: '请先完成前面的课程',
        icon: 'none'
      });
    }
  }
}); 