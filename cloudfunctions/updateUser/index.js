const cloud = require('wx-server-sdk')
cloud.init({
  env: 'happy-yuan-planet-0ezodl4460e810'
})
const db = cloud.database()

const totalSections = 4;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    console.log('开始更新用户数据，OPENID:', wxContext.OPENID);
    
    // 验证请求的章节号
    const nextSection = event.nextSection;
    if (typeof nextSection !== 'number' || nextSection < 1 || nextSection > totalSections) {
      return {
        success: false,
        error: '无效的章节号'
      };
    }
    
    // 先更新数据
    const updateResult = await db.collection('users')
      .where({
        openid: wxContext.OPENID
      })
      .update({
        data: {
          currentSection: nextSection,
          // 如果是完成最后一章，更新完成状态
          isCompleted: nextSection === totalSections
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
    
    // 添加额外的返回信息
    const response = {
      success: true,
      data: userData,
      isLastSection: nextSection === totalSections
    };
    
    return response;

  } catch (err) {
    console.error('更新失败：', err);
    return {
      success: false,
      error: err.message || '更新失败'
    }
  }
} 