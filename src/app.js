import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRouter from './routes/api.route.js';
import {connectDB} from "./config/database.js";
import chalk from "chalk";

// 加载环境变量
dotenv.config();
connectDB().then(() => {
  console.log(chalk.green('MongoDB连接成功'));
})

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api', apiRouter);


// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API documentation: http://localhost:${PORT}`);
});

export default app;