Page({
    data: {
      courseData: null
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
    },
  
    handleUnitSelect(e) {
      const index = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: `/pages/unit/unit?section=${this.data.courseData.section}&unit=${index + 1}`
      });
    }
  }); 