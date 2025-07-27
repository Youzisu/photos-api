import express from 'express';
import UserController from '../../controllers/user.controller.js';
import { jwtAuthMiddleware, adminMiddleware } from '../../middleware/jwt.middleware.js';

const userRouter = express.Router();

// 公开路由（不需要认证）
// 用户注册
userRouter.post('/register', UserController.register);

// 用户登录
userRouter.post('/login', UserController.login);

// 验证token
userRouter.post('/verify', UserController.verifyToken);

// 需要认证的路由
// 获取当前用户信息
userRouter.get('/profile', jwtAuthMiddleware, UserController.getProfile);

// 更新当前用户信息
userRouter.put('/profile', jwtAuthMiddleware, UserController.updateUser);

// 管理员路由（需要管理员权限）
// 获取所有用户
userRouter.get('/', jwtAuthMiddleware, adminMiddleware, UserController.getAllUsers);

// 根据ID获取用户
userRouter.get('/:id', jwtAuthMiddleware, adminMiddleware, UserController.getUserById);

// 更新用户信息（管理员）
userRouter.put('/:id', jwtAuthMiddleware, adminMiddleware, UserController.updateUser);

// 删除用户（管理员）
userRouter.delete('/:id', jwtAuthMiddleware, adminMiddleware, UserController.deleteUser);

export const apiPath = '/users';
export default userRouter;