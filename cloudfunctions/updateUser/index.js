const cloud = require('wx-server-sdk')
cloud.init({
  env: 'happy-yuan-planet-0ezodl4460e810'
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    console.log('开始更新用户数据，OPENID:', wxContext.OPENID);
    
    // 先更新数据
    const updateResult = await db.collection('users')
      .where({
        openid: wxContext.OPENID
      })
      .update({
        data: {
          currentSection: 1
        }
      });
    
    console.log('更新操作结果:', updateResult);
    
    if (updateResult.stats.updated === 0) {
      console.error('未找到要更新的用户');
      return {
        success: false,
        error: '未找到用户'
      };
    }
    
    // 获取更新后的用户数据
    const userResult = await db.collection('users')
      .where({
        openid: wxContext.OPENID
      })
      .get();
    
    if (userResult.data.length === 0) {
      console.error('无法获取更新后的用户数据');
      return {
        success: false,
        error: '无法获取用户数据'
      };
    }
    
    const userData = userResult.data[0];
    console.log('更新后的用户数据:', userData);
    
    return {
      success: true,
      data: userData
    };
  } catch (err) {
    console.error('更新失败：', err);
    return {
      success: false,
      error: err.message || '更新失败'
    }
  }
} 