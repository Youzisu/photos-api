import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// 创建JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.TOKEN_SECRET || 'default_secret',
    { expiresIn: '24h' }
  );
};

// 用户注册
export const registerUserService = async (userData) => {
  const { username, password, role = 'user' } = userData;
  
  // 检查用户是否已存在
  const existingUser = await User.findOne({ username });
  
  if (existingUser) {
    throw new Error('用户名已存在');
  }
  
  // 创建新用户
  const user = new User({
    username,
    password,
    role
  });
  
  await user.save();
  
  // 生成token
  const token = generateToken(user._id);
  
  return {
    user,
    token
  };
};

// 用户登录
export const loginUserService = async (loginData) => {
  const { username, password } = loginData;
  
  // 查找用户
  const user = await User.findOne({
    username,
    isActive: true
  });
  
  if (!user) {
    throw new Error('用户不存在或已被禁用');
  }
  
  // 验证密码
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('密码错误');
  }
  
  // 更新最后登录时间
  await user.updateLastLogin();
  
  // 生成token
  const token = generateToken(user._id);
  
  return {
    user,
    token
  };
};

// 获取用户信息
export const getUserByIdService = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('用户不存在');
  }
  return user;
};

// 获取所有用户（管理员功能）
export const getAllUsersService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const total = await User.countDocuments();
  const users = await User.find()
    .select('-password')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  
  const totalPages = Math.ceil(total / limit);
  
  return {
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

// 更新用户信息
export const updateUserService = async (userId, updateData) => {
  const { password, ...otherData } = updateData;
  
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('用户不存在');
  }
  
  // 如果要更新密码，需要重新加密
  if (password) {
    user.password = password;
  }
  
  // 更新其他字段
  Object.assign(user, otherData);
  
  await user.save();
  return user;
};

// 删除用户
export const deleteUserService = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error('用户不存在');
  }
  return user;
};

// 验证JWT token
export const verifyTokenService = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET || 'default_secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      throw new Error('用户不存在或已被禁用');
    }
    
    return user;
  } catch (error) {
    throw new Error('无效的token');
  }
};