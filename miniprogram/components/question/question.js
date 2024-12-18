Component({
    properties: {
      questionData: {
        type: Object,
        value: {}
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
        this.setData({
          selectedIndex: -1,
          isCorrect: false,
          showExplanation: false
        });
      }
    }
  }); 