Page({
  data: {
    courseData: null,
    progress: null
  },

  onLoad(options) {
    const { section } = options;
    const courses = getApp().globalData.courses;
    
    if (!courses) {
      console.error('未找到课程数据');
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    const courseData = courses[section - 1];
    if (!courseData) {
      console.error('未找到指定课程');
      wx.showToast({
        title: '课程不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    this.setData({ courseData });
    this.loadUserProgress();
  },

  onShow() {
    console.log('课程页面显示，重新加载进度');
    if (this.data.courseData) {
      this.loadUserProgress();
    }
  },

  loadUserProgress() {
    console.log('开始加载用户进度');
    wx.showLoading({ title: '加载中' });
    
    wx.cloud.callFunction({
      name: 'getUserInfo'
    }).then(res => {
      wx.hideLoading();
      console.log('获取用户信息结果：', res.result);
      
      if (res.result && res.result.success) {
        const userInfo = res.result.data;
        const progress = userInfo.progress || {};
        console.log('用户进度数据：', progress);
        
        this.setData({ progress }, () => {
          console.log('进度数据已更新');
          this.setData({ timestamp: Date.now() });
        });
      } else {
        console.error('获取用户信息失败：', res);
        wx.showToast({
          title: '加载进度失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('调用云函数失败：', err);
      wx.showToast({
        title: '加载进度失败',
        icon: 'none'
      });
    });
  },

  handleUnitSelect(e) {
    const index = e.currentTarget.dataset.index;
    const { section } = this.data.courseData;
    const unit = index + 1;
    
    console.log('选择单元：', { section, unit });
    
    wx.navigateTo({
      url: `/pages/unit/unit?section=${section}&unit=${unit}`
    });
  },

  getUnitStatus(unitIndex) {
    const { courseData, progress } = this.data;
    if (!progress || !progress[courseData.section]) {
      return {
        isCompleted: false,
        score: 0
      };
    }
    
    const unitProgress = progress[courseData.section][unitIndex + 1];
    console.log(`单元${unitIndex + 1}进度：`, unitProgress);
    
    return unitProgress || {
      isCompleted: false,
      score: 0
    };
  }
}); 