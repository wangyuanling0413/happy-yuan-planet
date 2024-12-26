App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'happy-yuan-planet-0ezodl4460e810',
        traceUser: true,
      })
    }
    
    // 初始化背景音乐
    this.bgm = wx.createInnerAudioContext()
    this.bgm.src = '/audio/bgm.mp3'
    this.bgm.loop = true  // 循环播放
    
    // 初始化音效
    this.clickSound = wx.createInnerAudioContext()
    this.clickSound.src = '/audio/click.mp3'
  },

  // 播放/暂停背景音乐
  toggleBGM() {
    if (this.bgm.paused) {
      this.bgm.play()
    } else {
      this.bgm.pause()
    }
  },

  // 播放点击音效
  playClickSound() {
    this.clickSound.stop()  // 停止之前的播放
    this.clickSound.play()
  },

  // 不再预加载所有题目
  globalData: {
    courses: null,
    questionsCache: {}  // 改用缓存对象存储各单元的题目
  }
})