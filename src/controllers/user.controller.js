import * as UserService from '../services/user.service.js';

// 用户注册
export const register = async (req, res) => {
  try {
    const { username, password, role, registerKey } = req.body;
    
    // 验证必填字段
    if (!username || !password) {
      return res.error('用户名和密码都是必填的', 4001);
    }
    
    // 验证注册密钥
    const requiredRegisterKey = process.env.REGISTER_KEY;
    if (!requiredRegisterKey) {
      return res.error('系统未配置注册密钥，请联系管理员', 5002);
    }
    
    if (!registerKey) {
      return res.error('注册密钥是必填的', 4001);
    }
    
    if (registerKey !== requiredRegisterKey) {
      return res.error('注册密钥不正确', 4003);
    }
    
    const result = await UserService.registerUserService({
      username,
      password,
      role
    });
    
    res.success(result, '用户注册成功', 2001);
  } catch (error) {
    res.error(error.message, 4002);
  }
};

// 用户登录
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证必填字段
    if (!username || !password) {
      return res.error('用户名和密码都是必填的', 4001);
    }
    
    const result = await UserService.loginUserService({
      username,
      password
    });
    
    res.success(result, '登录成功', 2002);
  } catch (error) {
    res.error(error.message, 4010);
  }
};

// 获取当前用户信息
export const getProfile = async (req, res) => {
  try {
    const user = await UserService.getUserByIdService(req.user.id);
    
    res.success(user, '获取用户信息成功', 2003);
  } catch (error) {
    res.error(error.message, 4040);
  }
};

// 获取所有用户（管理员功能）
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await UserService.getAllUsersService(page, limit);
    
    res.paginate(result.users, result.pagination, '获取用户列表成功', 2004);
  } catch (error) {
    res.error(error.message, 5001);
  }
};

// 根据ID获取用户
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserByIdService(id);
    
    res.success(user, '获取用户信息成功', 2005);
  } catch (error) {
    res.error(error.message, 4041);
  }
};

// 更新用户信息
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const user = await UserService.updateUserService(id, updateData);
    
    res.success(user, '用户信息更新成功', 2006);
  } catch (error) {
    res.error(error.message, 4003);
  }
};

// 删除用户
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    await UserService.deleteUserService(id);
    
    res.success(null, '用户删除成功', 2007);
  } catch (error) {
    res.error(error.message, 4042);
  }
};

// 验证token
export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-access-token'];
    
    if (!token) {
      return res.error('缺少认证token', 4011);
    }
    
    const user = await UserService.verifyTokenService(token);
    
    res.success(user, 'token验证成功', 2008);
  } catch (error) {
    res.error(error.message, 4012);
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