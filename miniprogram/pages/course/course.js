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
    if (this.data.courseData) {
      this.loadUserProgress();
    }
  },

  loadUserProgress() {
    wx.showLoading({ title: '加载中' });
    wx.cloud.callFunction({
      name: 'getUserInfo'
    }).then(res => {
      wx.hideLoading();
      if (res.result && res.result.success) {
        const userInfo = res.result.data;
        const progress = userInfo.progress || {};
        this.setData({ progress });
      } else {
        console.error('获取用户信息失败：', res);
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('调用云函数失败：', err);
    });
  },

  handleUnitSelect(e) {
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/unit/unit?section=${this.data.courseData.section}&unit=${index + 1}`
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
    return unitProgress || {
      isCompleted: false,
      score: 0
    };
  }
}); 