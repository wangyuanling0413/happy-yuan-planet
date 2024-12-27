const cloud = require('wx-server-sdk')
cloud.init({
  env: 'happy-yuan-planet-0ezodl4460e810'
})
const db = cloud.database()

exports.main = async (event, context) => {
  const { section, unit } = event
  
  try {
    // 1. 参数验证
    if (!section || !unit) {
      return {
        success: false,
        error: '缺少必要参数：section 或 unit',
        debug: { receivedParams: { section, unit } }
      }
    }

    // 2. 转换参数类型
    const sectionNum = parseInt(section)
    const unitNum = parseInt(unit)

    if (isNaN(sectionNum) || isNaN(unitNum)) {
      return {
        success: false,
        error: '参数类型错误：section 和 unit 必须是数字',
        debug: { 
          section: { value: section, converted: sectionNum },
          unit: { value: unit, converted: unitNum }
        }
      }
    }

    // 3. 构建查询
    const query = {
      section: sectionNum,
      unit: unitNum
    }

    // 4. 获取题目详情
    const questions = await db.collection('questions')
      .where(query)
      .field({
        _id: true,
        title: true,
        options: true,
        answer: true,
        explanation: true,
        points: true,
        type: true,
        section: true,
        unit: true
      })
      .get()

    // 5. 检查是否获取到题目
    if (!questions || !questions.data || questions.data.length === 0) {
      return {
        success: false,
        error: `未找到第${sectionNum}章第${unitNum}单元的题目`,
        debug: { query }
      }
    }

    // 6. 对结果进行排序
    const sortedQuestions = questions.data.sort((a, b) => {
      // 先按章节排序
      if (a.section !== b.section) {
        return a.section - b.section;
      }
      // 章节相同则按单元排序
      if (a.unit !== b.unit) {
        return a.unit - b.unit;
      }
      // 最后按_id排序
      return a._id < b._id ? -1 : 1;
    });

    // 7. 返回结果
    return {
      success: true,
      data: sortedQuestions,
      debug: {
        query,
        totalMatched: sortedQuestions.length,
        matchedQuestions: sortedQuestions.map(q => ({
          _id: q._id,
          section: q.section,
          unit: q.unit,
          title: q.title ? q.title.slice(0, 20) + '...' : 'No title'
        }))
      }
    }

  } catch (err) {
    console.error('获取题目失败：', err)
    return {
      success: false,
      error: err.message,
      debug: {
        requestedSection: section,
        requestedUnit: unit,
        errorStack: err.stack
      }
    }
  }
}