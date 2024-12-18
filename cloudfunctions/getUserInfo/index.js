const cloud = require('wx-server-sdk')
cloud.init({
  env: 'happy-yuan-planet-0ezodl4460e810'
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const userResult = await db.collection('users')
      .where({
        openid: wxContext.OPENID
      })
      .get()
    
    if (userResult.data.length > 0) {
      return {
        success: true,
        data: userResult.data[0]
      }
    } else {
      return {
        success: false,
        error: '用户不存在'
      }
    }
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
} 