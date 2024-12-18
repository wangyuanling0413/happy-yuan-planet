// 用户注册
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'happy-yuan-planet-0ezodl4460e810'
})
const db = cloud.database()

exports.main = async (event, context) => {
  const { phone, realName, age, username, learningGoal } = event
  const wxContext = cloud.getWXContext()
  
  try {
    console.log('开始注册，用户数据：', event);
    console.log('OPENID:', wxContext.OPENID);

    // 检查用户是否已存在（通过openid）
    const openidCheck = await db.collection('users')
      .where({
        openid: wxContext.OPENID
      })
      .get()
    
    if (openidCheck.data.length > 0) {
      console.log('用户已注册（openid已存在）');
      return {
        success: false,
        error: '该微信账号已注册'
      }
    }

    // 检查用户名是否已存在
    const usernameCheck = await db.collection('users')
      .where({
        username: username
      })
      .get()
    
    if (usernameCheck.data.length > 0) {
      console.log('用户名已被使用');
      return {
        success: false,
        error: '用户名已被使用'
      }
    }

    // ��建新用户
    const userData = {
      openid: wxContext.OPENID,
      phone,
      realName,
      age: parseInt(age),
      username,
      learningGoal,
      coins: 0,
      currentSection: 1,
      createdAt: db.serverDate()
    };

    console.log('准备创建用户，数据：', userData);

    const result = await db.collection('users').add({
      data: userData
    });

    console.log('创建用户成功，结果：', result);

    return {
      success: true,
      data: result
    }
  } catch (err) {
    console.error('注册失败：', err);
    return {
      success: false,
      error: err.message || '注册失败'
    }
  }
} 