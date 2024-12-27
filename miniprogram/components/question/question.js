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
        
        this.setData({
          selectedIndex: index,
          isCorrect,
          showExplanation: true
        });
  
        this.triggerEvent('result', { isCorrect });
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