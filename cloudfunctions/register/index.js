const cloud = require('wx-server-sdk')
cloud.init({
  env: 'happy-yuan-planet-0ezodl4460e810'  // 使用具体的云环境ID
})
const db = cloud.database()

exports.main = async (event, context) => {
  const { phone, userInfo } = event
  
  try {
    // 先查询是否存在该手机号用户
    const userResult = await db.collection('users').where({
      phone: phone
    }).get()
    
    if (userResult.data.length > 0) {
      // 用户已存在,返回现有用户信息
      return {
        success: true,
        isNewUser: false,
        userInfo: userResult.data[0]
      }
    }
    
    // 用户不存在,创建新用户
    const result = await db.collection('users').add({
      data: {
        phone: phone,
        nickName: userInfo.nickName || '',
        avatarUrl: userInfo.avatarUrl || '',
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
    
    return {
      success: true,
      isNewUser: true,
      userInfo: {
        _id: result._id,
        phone: phone,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      }
    }
    
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
} 