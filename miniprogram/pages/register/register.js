Page({
  data: {
    phone: '',
    userInfo: null
  },

  // 获取手机号
  getPhoneNumber(e) {
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      wx.showToast({
        title: '获取手机号失败',
        icon: 'none'
      })
      return
    }

    // 解密手机号
    wx.cloud.callFunction({
      name: 'decryptPhone',
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
    }).then(res => {
      if (res.result.success) {
        this.setData({
          phone: res.result.phone
        })
        // 获取到手机号后自动注册/登录
        this.registerUser()
      }
    })
  },

  // 注册/登录用户
  registerUser() {
    wx.showLoading({
      title: '处理中'
    })

    // 获取用户信息
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (profileRes) => {
        // 调用注册云函数
        wx.cloud.callFunction({
          name: 'register',
          data: {
            phone: this.data.phone,
            userInfo: profileRes.userInfo
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

            // 延迟跳转到首页
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }, 1500)
          }
        }).catch(err => {
          wx.hideLoading()
          wx.showToast({
            title: '操作失败',
            icon: 'none'
          })
        })
      }
    })
  }
}) 