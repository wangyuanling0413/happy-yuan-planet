const cloud = require('wx-server-sdk')
cloud.init({
  env: 'happy-yuan-planet-0ezodl4460e810'
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    console.log('开始更新用户数据');
    
    const result = await db.collection('users')
      .where({
        openid: wxContext.OPENID
      })
      .update({
        data: {
          currentSection: 1
        }
      });
    
    console.log('更新结果：', result);
    
    return {
      success: true,
      data: result
    }
  } catch (err) {
    console.error('更新失败：', err);
    return {
      success: false,
      error: err.message || '更新失败'
    }
  }
} 