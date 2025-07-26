import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.route.js';
import {connectDB} from "./config/database.js";
import chalk from "chalk";

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量
dotenv.config();
connectDB().then(() => {
  console.log(chalk.green('MongoDB连接成功'));
})

const app = express();
const PORT = process.env.PORT || 3000;

// 配置EJS模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 首页路由
app.get('/', (req, res) => {
  try {
    // 使用EJS渲染模板
    res.render('index', {
      PORT: PORT,
      title: 'Photos API - 首页'
    });
  } catch (error) {
    console.error('Error rendering template:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 随机图片页面路由
app.get('/random', (req, res) => {
  try {
    res.render('random', {
      title: '随机图片 - Photos API'
    });
  } catch (error) {
    console.error('Error rendering random template:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 列表页面路由
app.get('/list', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    
    // 导入PhotoService
    const { getAllPhotosService } = await import('./services/photo.service.js');
    
    const result = await getAllPhotosService(page, limit);
    
    res.render('list', {
      title: '照片列表 - Photos API',
      photos: result.photos,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('渲染列表页面时出错:', error);
    res.status(500).send('服务器内部错误');
  }
});

app.use('/api', apiRouter);


// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API documentation: http://localhost:${PORT}`);
});

export default app;