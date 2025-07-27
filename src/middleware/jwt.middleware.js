import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// JWT认证中间件
export const jwtAuthMiddleware = async (req, res, next) => {
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
    
    // 验证token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET || 'default_secret');
    
    // 查找用户
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: '用户不存在或已被禁用'
      });
    }
    
    // 将用户信息添加到请求对象
    req.user = user;
    
    // 继续执行下一个中间件
    next();
  } catch (error) {
    console.error('JWT认证错误:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'token已过期'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: '认证过程中发生错误'
    });
  }
};

// 管理员权限中间件
export const adminMiddleware = (req, res, next) => {
  try {
    // 检查用户是否已通过JWT认证
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '请先登录'
      });
    }
    
    // 检查用户是否为管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '权限不足，需要管理员权限'
      });
    }
    
    // 继续执行下一个中间件
    next();
  } catch (error) {
    console.error('管理员权限检查错误:', error);
    return res.status(500).json({
      success: false,
      message: '权限检查过程中发生错误'
    });
  }
};

// 可选的JWT认证中间件（不强制要求token）
export const optionalJwtMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-access-token'];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET || 'default_secret');
        const user = await User.findById(decoded.userId).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // 忽略token验证错误，继续执行
        console.log('可选JWT验证失败:', error.message);
      }
    }
    
    next();
  } catch (error) {
    console.error('可选JWT中间件错误:', error);
    next();
  }
};