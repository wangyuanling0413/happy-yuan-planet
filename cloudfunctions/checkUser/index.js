// 检查用户是否已注册
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'happy-yuan-planet-0ezodl4460e810'
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 先通过 openid 查询
    const userResult = await db.collection('users')
      .where({ openid: wxContext.OPENID })
      .get()
    
    return {
      success: true,
      isRegistered: userResult.data.length > 0,
      userInfo: userResult.data[0] || null
    }
    
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
} 