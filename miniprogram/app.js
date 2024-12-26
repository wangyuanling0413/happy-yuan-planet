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
    
    // 初始化答题音效
    this.correctSound = wx.createInnerAudioContext()
    this.correctSound.src = '/audio/correct.mp3'
    this.correctSound.onError((res) => {
      console.error('正确音效加载失败：', res)
    })
    this.correctSound.onPlay(() => {
      console.log('正确音效开始播放')
    })
    this.correctSound.onEnded(() => {
      console.log('正确音效播放结束')
    })
    
    this.wrongSound = wx.createInnerAudioContext()
    this.wrongSound.src = '/audio/wrong.mp3'
    this.wrongSound.onError((res) => {
      console.error('错误音效加载失���：', res)
    })
    this.wrongSound.onPlay(() => {
      console.log('错误音效开始播放')
    })
    this.wrongSound.onEnded(() => {
      console.log('错误音效播放结束')
    })
    
    // 初始化海浪背景音乐
    this.oceanBGM = wx.createInnerAudioContext()
    this.oceanBGM.src = '/audio/ocean.mp3'
    this.oceanBGM.loop = true  // 循环播放
    this.oceanBGM.volume = 0.3  // 设置音量为30%，让背景音不会太突出
    this.oceanBGM.onError((res) => {
      console.error('海浪背景音乐加载失败：', res)
    })
    this.oceanBGM.onPlay(() => {
      console.log('海浪背景音乐开始播放')
    })
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

  // 播放答对音效
  playCorrectSound() {
    try {
      this.correctSound.stop()
      this.correctSound.play()
    } catch (err) {
      console.error('播放正确音效失败：', err)
    }
  },

  // 播放答错音效
  playWrongSound() {
    try {
      this.wrongSound.stop()
      this.wrongSound.play()
    } catch (err) {
      console.error('播放错误音效失败：', err)
    }
  },

  // 播放/暂停海浪背景音乐
  toggleOceanBGM() {
    if (this.oceanBGM.paused) {
      this.oceanBGM.play()
      return true
    } else {
      this.oceanBGM.pause()
      return false
    }
  },

  // 调整海浪音量
  setOceanVolume(volume) {
    if (volume >= 0 && volume <= 1) {
      this.oceanBGM.volume = volume
    }
  },

  // 不再预加载所有题目
  globalData: {
    courses: null,
    questionsCache: {}  // 改用缓存对象存储各单元的题目
  }
})