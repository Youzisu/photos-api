import express from 'express';

const authRouter = express.Router();

// 认证相关路由
authRouter.post('/login', (req, res) => {
  res.json({ message: 'User login', token: 'sample-jwt-token' });
});

authRouter.post('/register', (req, res) => {
  res.json({ message: 'User registration', user: req.body });
});

authRouter.post('/logout', (req, res) => {
  res.json({ message: 'User logout' });
});

authRouter.get('/profile', (req, res) => {
  res.json({ message: 'Get user profile' });
});

// 导出API路径和路由器
export const apiPath = '/auth';
export default authRouter;