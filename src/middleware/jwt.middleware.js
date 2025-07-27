import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// JWT认证中间件
export const jwtAuthMiddleware = async (req, res, next) => {
  try {
    // 从请求头获取token
    const token = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-access-token'];
    
    // 检查token是否存在
    if (!token) {
      return res.error('访问被拒绝，缺少认证token', 4011);
    }
    
    // 验证token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET || 'default_secret');
    
    // 查找用户
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.error('用户不存在或已被禁用', 4012);
    }
    
    // 将用户信息添加到请求对象
    req.user = user;
    
    // 继续执行下一个中间件
    next();
  } catch (error) {
    console.error('JWT认证错误:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.error('无效的token', 4012);
    }

    if (error.name === 'TokenExpiredError') {
      return res.error('token已过期', 4012);
    }

    return res.error('认证过程中发生错误', 5000);
  }
};

// 管理员权限中间件
export const adminMiddleware = (req, res, next) => {
  try {
    // 检查用户是否已通过JWT认证
    if (!req.user) {
      return res.error('请先登录', 4011);
    }

    // 检查用户是否为管理员
    if (req.user.role !== 'admin') {
      return res.error('权限不足，需要管理员权限', 4030);
    }
    
    // 继续执行下一个中间件
    next();
  } catch (error) {
    console.error('管理员权限检查错误:', error);
    return res.error('权限检查过程中发生错误', 5000);
  }
};
