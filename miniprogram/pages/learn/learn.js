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
            {
              title: '什么是理财',
              questions: 5
            },
            {
              title: '为什么要理财',
              questions: 5
            }
          ]
        },
        {
          name: '储蓄与投资',
          description: '学习不同的储蓄方式和投资概念',
          section: 2,
          units: [
            {
              title: '储蓄的方式',
              questions: 5
            },
            {
              title: '投资的基础',
              questions: 5
            }
          ]
        },
        {
          name: '风险与收益',
          description: '认识投资风险和收益的关系',
          section: 3,
          units: [
            {
              title: '风险类型',
              questions: 5
            },
            {
              title: '如何控制风险',
              questions: 5
            }
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
        console.log('获取用户信息成功，完整数据：', JSON.stringify(res, null, 2));
        console.log('用户数据：', JSON.stringify(res.result.data, null, 2));
        
        if (res.result && res.result.success) {
          const userData = res.result.data;
          
          // 如果缺少 currentSection 字段，调用更新函数
          if (userData && !userData.currentSection) {
            console.log('用户数据缺少 currentSection，准备更新');
            wx.cloud.callFunction({
              name: 'updateUser'
            }).then(updateRes => {
              console.log('更新用户数据结果：', JSON.stringify(updateRes, null, 2));
              if (updateRes.result && updateRes.result.success) {
                // 使用更新后的数据
                const updatedUserData = updateRes.result.data;
                this.setData({
                  coins: updatedUserData.coins || 0,
                  currentSection: updatedUserData.currentSection || 1
                });
                console.log('更新后的页面数据：', {
                  coins: this.data.coins,
                  currentSection: this.data.currentSection
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
          
          console.log('设置后的数据：', {
            coins: this.data.coins,
            currentSection: this.data.currentSection
          });
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