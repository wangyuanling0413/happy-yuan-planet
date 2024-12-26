Page({
  data: {
    isOceanPlaying: false
  },

  onLoad() {
    const app = getApp()
    // 自动播放海浪声
    const isPlaying = app.toggleOceanBGM()
    this.setData({
      isOceanPlaying: isPlaying
    })
  },

  onShow() {
    // 页面显示时恢复播放
    const app = getApp()
    if (this.data.isOceanPlaying && app.oceanBGM.paused) {
      app.oceanBGM.play()
    }
  },

  onHide() {
    // 页面隐藏时暂停播放
    const app = getApp()
    if (!app.oceanBGM.paused) {
      app.oceanBGM.pause()
    }
  },

  // 音乐控制按钮点击事件
  toggleBGM() {
    const app = getApp()
    const isPlaying = app.toggleOceanBGM()
    this.setData({
      isOceanPlaying: isPlaying
    })
  }
}) 