const cloud = require('wx-server-sdk')
cloud.init({
  env: 'happy-yuan-planet-0ezodl4460e810'
})
const db = cloud.database()

exports.main = async (event, context) => {
  const { phone, verifyCode } = event
  const wxContext = cloud.getWXContext()
  
  try {
    // 验证验证码
    const codeResult = await db.collection('verify_codes')
      .where({
        phone: phone,
        code: verifyCode,
        expireTime: db.command.gte(new Date())
      })
      .get()
    
    if (codeResult.data.length === 0) {
      return {
        success: false,
        error: '验证码错误或已过期'
      }
    }
    
    // 验证通过后删除验证码
    await db.collection('verify_codes')
      .where({ phone: phone })
      .remove()
    
    // 先用手机号查询用户
    const userResult = await db.collection('users')
      .where({ phone: phone })
      .get()
    
    if (userResult.data.length > 0) {
      // 用户存在，更新 openid
      const user = userResult.data[0]
      await db.collection('users').doc(user._id).update({
        data: {
          openid: wxContext.OPENID,
          updateTime: db.serverDate()
        }
      })
      
      return {
        success: true,
        isNewUser: false,
        userInfo: user
      }
    }
    
    // 创建新用户
    const result = await db.collection('users').add({
      data: {
        phone: phone,
        openid: wxContext.OPENID,
        coins: 0,
        currentSection: 1,
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
        coins: 0,
        currentSection: 1
      }
    }
    
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
} 