import * as UserService from '../services/user.service.js';

// 用户注册
export const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码都是必填的'
      });
    }
    
    const result = await UserService.registerUserService({
      username,
      password,
      role
    });
    
    res.status(201).json({
      success: true,
      message: '用户注册成功',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// 用户登录
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码都是必填的'
      });
    }
    
    const result = await UserService.loginUserService({
      username,
      password
    });
    
    res.json({
      success: true,
      message: '登录成功',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

// 获取当前用户信息
export const getProfile = async (req, res) => {
  try {
    const user = await UserService.getUserByIdService(req.user.id);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// 获取所有用户（管理员功能）
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await UserService.getAllUsersService(page, limit);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 根据ID获取用户
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserByIdService(id);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// 更新用户信息
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const user = await UserService.updateUserService(id, updateData);
    
    res.json({
      success: true,
      message: '用户信息更新成功',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// 删除用户
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    await UserService.deleteUserService(id);
    
    res.json({
      success: true,
      message: '用户删除成功'
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// 验证token
export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-access-token'];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '缺少认证token'
      });
    }
    
    const user = await UserService.verifyTokenService(token);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

const UserController = {
  register,
  login,
  getProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  verifyToken
};

export default UserController;