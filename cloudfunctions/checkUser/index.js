// 检查用户是否已注册
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'happy-yuan-planet-0ezodl4460e810'
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    console.log('开始检查用户，OPENID:', wxContext.OPENID);
    
    // 查询用户是否存在
    const userResult = await db.collection('users')
      .where({
        openid: wxContext.OPENID
      })
      .get()
    
    console.log('查询结果:', JSON.stringify(userResult));
    console.log('是否找到用户:', userResult.data.length > 0);
    
    const response = {
      success: true,
      isRegistered: userResult.data.length > 0,
      data: userResult.data[0] || null
    };
    
    console.log('返回数据:', JSON.stringify(response));
    return response;
    
  } catch (err) {
    console.error('查询出错:', err);
    return {
      success: false,
      error: err.message || '查询失败'
    }
  }
} 