import express from 'express';

const userRouter = express.Router();

// 用户相关路由
userRouter.get('/', (req, res) => {
  res.json({ message: 'Get all users' });
});

userRouter.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id}` });
});

userRouter.post('/', (req, res) => {
  res.json({ message: 'Create user', data: req.body });
});

userRouter.put('/:id', (req, res) => {
  res.json({ message: `Update user ${req.params.id}`, data: req.body });
});

userRouter.delete('/:id', (req, res) => {
  res.json({ message: `Delete user ${req.params.id}` });
});

// 导出API路径和路由器
export const apiPath = '/users';
export default userRouter;