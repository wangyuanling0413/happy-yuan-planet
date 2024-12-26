Page({
  data: {
    canSendCode: true,
    verifyCodeText: '获取验证码',
    countdown: 60,
    learningGoals: [
      '学习理财基础知识',
      '制定个人理财计划',
      '了解投资理财产品',
      '提升个人理财能力',
      '实现财务自由'
    ],
    selectedGoal: ''
  },

  // 处理手机号输入
  handlePhoneInput(e) {
    const phone = e.detail.value;
    this.setData({
      canSendCode: /^1[3-9]\d{9}$/.test(phone)
    });
  },

  // 发送验证码
  sendVerifyCode() {
    if (!this.data.canSendCode) return;
    
    // 开始倒计时
    this.setData({
      canSendCode: false,
      verifyCodeText: `${this.data.countdown}s后重试`
    });

    const timer = setInterval(() => {
      if (this.data.countdown > 0) {
        this.setData({
          countdown: this.data.countdown - 1,
          verifyCodeText: `${this.data.countdown - 1}s后重试`
        });
      } else {
        clearInterval(timer);
        this.setData({
          canSendCode: true,
          verifyCodeText: '获取验证码',
          countdown: 60
        });
      }
    }, 1000);

    // TODO: 调用发送验证码API
  },

  // 处理学习目标选择
  handleGoalChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedGoal: this.data.learningGoals[index]
    });
  },

  // 提交表单
  handleSubmit(e) {
    const formData = e.detail.value;
    
    console.log('提交的表单数据：', formData);  // 添加日志
    
    if (!this.validateForm(formData)) return;

    console.log('表单验证通过，准备调用云函数');  // 添加日志

    wx.showLoading({  // 添加加载提示
      title: '注册中...'
    });

    wx.cloud.callFunction({
      name: 'register',
      data: {
        phone: formData.phone,
        realName: formData.realName,
        age: formData.age,
        username: formData.username,
        learningGoal: this.data.selectedGoal
      }
    }).then(res => {
      console.log('注册云函数返回结果：', res);  // 添加日志
      wx.hideLoading();  // 隐藏加载提示
      
      if (res.result && res.result.success) {
        wx.showToast({
          title: '注册成功',
          icon: 'success'
        });
        setTimeout(() => {  // 延迟跳转
          wx.redirectTo({
            url: '/pages/learn/learn'
          });
        }, 1500);
      } else {
        wx.showToast({
          title: res.result.error || '注册失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('注册失败：', err);  // 添加错误日志
      wx.hideLoading();
      wx.showToast({
        title: '注册失败，请重试',
        icon: 'none'
      });
    });
  },

  // 表单验证
  validateForm(formData) {
    if (!formData.phone || !/^1[3-9]\d{9}$/.test(formData.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return false;
    }
    
    if (!formData.verifyCode) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
      return false;
    }

    if (!formData.realName) {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      });
      return false;
    }

    if (!formData.age || formData.age < 18 || formData.age > 45) {
      wx.showToast({
        title: '年龄范围应在18-45岁之间',
        icon: 'none'
      });
      return false;
    }

    if (!formData.username) {
      wx.showToast({
        title: '请设置用户名',
        icon: 'none'
      });
      return false;
    }

    if (!this.data.selectedGoal) {
      wx.showToast({
        title: '请选择学习目标',
        icon: 'none'
      });
      return false;
    }

    return true;
  }
}); 