Component({
    properties: {
      questionData: {
        type: Object,
        value: {},
        observer(newVal, oldVal) {
          // 当题目数据改变时，自动重置状态
          if (newVal._id !== oldVal._id) {
            this.reset();
          }
        }
      }
    },
  
    data: {
      selectedIndex: -1,
      isCorrect: false,
      showExplanation: false
    },
  
    methods: {
      handleSelect(e) {
        const index = e.currentTarget.dataset.index;
        const isCorrect = index === this.properties.questionData.answer;
        
        // 先只更新选择状态和正确性
        this.setData({
          selectedIndex: index,
          isCorrect
        });

        // 1.5秒后再显示解析
        setTimeout(() => {
          this.setData({
            showExplanation: true
          });
          // 触发结果事件
          this.triggerEvent('result', { isCorrect });
        }, 1500);
      },
  
      reset() {
        console.log('重置题目状态');
        this.setData({
          selectedIndex: -1,
          isCorrect: false,
          showExplanation: false
        });
      }
    }
  }); 