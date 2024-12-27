App({
  onLaunch: function () {
    //1. 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'happy-yuan-planet-0ezodl4460e810',
        traceUser: true,//跟踪用户访问记录
      })
    }
    
    // 2. 初始化音频系统
    //2.1 背景音乐
    
    this.bgm = wx.createInnerAudioContext()
    this.bgm.src = '/audio/bgm.mp3'
    this.bgm.loop = true  // 循环播放
    
    // 2.2 初始化点击音效
    this.clickSound = wx.createInnerAudioContext()
    this.clickSound.src = '/audio/click.mp3'
    
    // 2.3 初始化答题音效
    //正确音效
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
    
    //错误音效
    this.wrongSound = wx.createInnerAudioContext()
    this.wrongSound.src = '/audio/wrong.mp3'
    this.wrongSound.onError((res) => {
      console.error('错误音效加载失败：', res)
    })
    this.wrongSound.onPlay(() => {
      console.log('错误音效开始播放')
    })
    this.wrongSound.onEnded(() => {
      console.log('错误音效播放结束')
    })
    
    /* 暂时注释掉音频代码
    // 初始化海浪背景音乐
    this.oceanBGM = wx.createInnerAudioContext()
    this.oceanBGM.src = '/audio/ocean.mp3'
    this.oceanBGM.loop = true
    this.oceanBGM.volume = 0.3
    this.oceanBGM.onError((res) => {
      console.error('海浪背景音乐加载失败：', res)
    })
    */
  },

  //3. 音频控制方法
  // 3.1 播放/暂停背景音乐
  toggleBGM() {
    if (this.bgm.paused) {
      this.bgm.play()
    } else {
      this.bgm.pause()
    }
  },

  // 3.2 播放点击音效
  playClickSound() {
    this.clickSound.stop()  // 停止之前的播放
    this.clickSound.play()
  },

  // 3.3 播放答对音效
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
    /* 暂时返回 false
    if (this.oceanBGM.paused) {
      this.oceanBGM.play()
      return true
    } else {
      this.oceanBGM.pause()
      return false
    }
    */
    return false
  },

  // 调整海浪音量
  setOceanVolume(volume) {
    if (volume >= 0 && volume <= 1) {
      this.oceanBGM.volume = volume
    }
  },

//4. 全局数据
  // 不再预加载所有题目
  globalData: {
    courses: null,
    questionsCache: {}  // 改用缓存对象存储各单元的题目
  }
})