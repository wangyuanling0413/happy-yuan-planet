const cloud = require('wx-server-sdk')
cloud.init({
  env: 'happy-yuan-planet-0ezodl4460e810'
})
const db = cloud.database()

exports.main = async (event, context) => {
  const { phone } = event
  const code = "123456"  // 固定验证码
  
  try {
    // 先删除该手机号的旧验证码
    await db.collection('verify_codes')
      .where({ phone: phone })
      .remove()
    
    // 存储新验证码
    await db.collection('verify_codes').add({
      data: {
        phone,
        code,
        createTime: db.serverDate(),
        expireTime: new Date(Date.now() + 5 * 60 * 1000) // 5分钟有效期
      }
    })
    
    return {
      success: true,
      message: '验证码发送成功'
    }
    
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
} 