Page({
  data: {
    phone: '',
    verifyCode: '',
    canSendCode: true,
    countdown: 60,
    btnText: '获取验证码'
  },

  handlePhoneInput(e) {
    const phone = e.detail.value
    this.setData({
      phone,
      canSendCode: /^1[3-9]\d{9}$/.test(phone)
    })
  },

  // 发送验证码
  sendVerifyCode() {
    if (!this.data.canSendCode) return
    
    wx.cloud.callFunction({
      name: 'sendSmsCode',
      data: {
        phone: this.data.phone
      }
    }).then(res => {
      if (res.result.success) {
        this.startCountdown()
        wx.showToast({
          title: '验证码已发送',
          icon: 'success'
        })
      }
    })
  },

  // 倒计时
  startCountdown() {
    this.setData({
      canSendCode: false,
      btnText: '60s后重试'
    })
    
    let count = 60
    const timer = setInterval(() => {
      count--
      if (count > 0) {
        this.setData({
          btnText: `${count}s后重试`
        })
      } else {
        clearInterval(timer)
        this.setData({
          canSendCode: true,
          btnText: '获取验证码'
        })
      }
    }, 1000)
  },

  // 提交注册
  handleSubmit(e) {
    const { phone, verifyCode } = e.detail.value
    
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    if (!verifyCode) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '处理中'
    })

    // 验证手机号和验证码
    wx.cloud.callFunction({
      name: 'register',
      data: {
        phone,
        verifyCode
      }
    }).then(res => {
      wx.hideLoading()
      
      if (res.result.success) {
        // 保存用户信息到本地
        wx.setStorageSync('userInfo', res.result.userInfo)
        
        wx.showToast({
          title: res.result.isNewUser ? '注册成功' : '登录成功',
          icon: 'success'
        })

        // 延迟跳转到学习页面
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/learn/learn'
          })
        }, 1500)
      } else {
        wx.showToast({
          title: res.result.error || '操作失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '系统错误',
        icon: 'none'
      })
    })
  }
})
