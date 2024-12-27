// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { section, unit, score, isCompleted } = event
  
  try {
    console.log('开始更新进度，用户信息：', wxContext);
    console.log('更新数据：', event);
    
    // 获取用户信息
    const userInfo = await db.collection('users').where({
      openid: wxContext.OPENID
    }).get()
    
    console.log('查询到的用户信息：', userInfo);

    if (!userInfo.data || userInfo.data.length === 0) {
      console.error('未找到用户信息，OPENID:', wxContext.OPENID);
      return {
        success: false,
        error: '用户不存在'
      }
    }

    const user = userInfo.data[0]
    console.log('当前用户数据：', user);
    
    // 初始化或更新学习进度
    let progress = user.progress || {}
    if (!progress[section]) {
      progress[section] = {}
    }
    
    // 更新当前单元的进度
    progress[section][unit] = {
      score,
      isCompleted,
      completedAt: new Date()
    }

    console.log('更新后的进度数据：', progress);

    // 更新用户数据
    await db.collection('users').doc(user._id).update({
      data: {
        progress
      }
    })

    return {
      success: true,
      progress
    }

  } catch (err) {
    console.error('更新进度失败：', err)
    return {
      success: false,
      error: err.message || '未知错误',
      debug: {
        openid: wxContext.OPENID,
        event
      }
    }
  }
} 