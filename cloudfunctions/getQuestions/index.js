const cloud = require('wx-server-sdk')
cloud.init({
  env: 'happy-yuan-planet-0ezodl4460e810'
})
const db = cloud.database()

// 缓存对象
const questionsCache = {}

exports.main = async (event, context) => {
  const { section, unit } = event
  const cacheKey = `${section}-${unit}`
  
  try {
    // 检查缓存
    if (questionsCache[cacheKey]) {
      console.log('使用缓存数据');
      return {
        success: true,
        data: questionsCache[cacheKey],
        fromCache: true
      }
    }

    // 只获取需要的字段
    const questions = await db.collection('questions')
      .where({
        section: parseInt(section),
        unit: parseInt(unit)
      })
      .field({
        title: true,
        options: true,
        answer: true,
        explanation: true,
        points: true,
        type: true
      })
      .get()
    
    if (questions.data.length === 0) {
      return {
        success: false,
        error: '未找到题目'
      }
    }

    // 存入缓存
    questionsCache[cacheKey] = questions.data
    
    return {
      success: true,
      data: questions.data
    }
  } catch (err) {
    console.error('获取题目失败：', err);
    return {
      success: false,
      error: err.message
    }
  }
} 