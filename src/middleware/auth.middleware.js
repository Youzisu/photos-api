// 认证中间件 - 校验token
export const authMiddleware = (req, res, next) => {
  try {
    // 从请求头获取token
    const token = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-access-token'];
    
    // 检查token是否存在
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问被拒绝，缺少认证token'
      });
    }
    
    // 从环境变量获取预期的token
    const expectedToken = process.env.AUTH_TOKEN;
    
    // 检查环境变量是否配置
    if (!expectedToken) {
      console.error('警告: AUTH_TOKEN 环境变量未配置');
      return res.status(500).json({
        success: false,
        message: '服务器配置错误'
      });
    }
    
    // 验证token
    if (token !== expectedToken) {
      return res.status(403).json({
        success: false,
        message: '无效的认证token'
      });
    }
    
    // token验证通过，继续执行下一个中间件
    next();
  } catch (error) {
    console.error('认证中间件错误:', error);
    return res.status(500).json({
      success: false,
      message: '认证过程中发生错误'
    });
  }
};