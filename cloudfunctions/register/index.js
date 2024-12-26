const cloud = require('wx-server-sdk')
cloud.init({
  env: 'happy-yuan-planet-0ezodl4460e810'
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 检查用户是否已注册
    const user = await db.collection('users')
      .where({
        openid: wxContext.OPENID
      })
      .get()
    
    if (user.data.length > 0) {
      return {
        success: false,
        error: '用户已注册'
      }
    }
    
    // 创建新用户
    const result = await db.collection('users').add({
      data: {
        openid: wxContext.OPENID,
        phone: event.phone,
        realName: event.realName,
        age: parseInt(event.age),
        username: event.username,
        learningGoal: event.learningGoal,
        currentSection: 1,
        isCompleted: false,
        createTime: db.serverDate()
      }
    })
    
    return {
      success: true,
      data: result
    }
    
  } catch (err) {
    return {
      success: false,
      error: err.message || '注册失败'
    }
  }
} 