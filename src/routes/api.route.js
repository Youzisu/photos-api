import express from "express";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const apiRouter = express.Router();

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modulesDir = path.join(__dirname, 'modules');

// 自动导入modules目录下的所有路由文件
async function loadModuleRoutes() {
  try {
    // 检查modules目录是否存在
    if (!fs.existsSync(modulesDir)) {
      console.log('Modules directory does not exist');
      return;
    }

    // 读取modules目录下的所有文件
    const files = fs.readdirSync(modulesDir);
    
    for (const file of files) {
      // 只处理.js文件
      if (file.endsWith('.js')) {
        try {
          // 动态导入路由模块
          const modulePath = path.join(modulesDir, file);
          const routeModule = await import(`file://${modulePath}`);

          
          // 检查模块是否导出了默认路由和API路径
          if (routeModule.default && routeModule.apiPath) {
            apiRouter.use(routeModule.apiPath, routeModule.default);
            console.log(`加载的路由: ${routeModule.apiPath} from ${file}`);
          } else if (routeModule.default) {
            // 如果没有指定apiPath，使用文件名作为路径
            const routePath = `/${file.replace('.js', '').replace('.route', '')}`;
            apiRouter.use(routePath, routeModule.default);
            console.log(`Loaded route: ${routePath} from ${file}`);
          }
        } catch (error) {
          console.error(`Error loading route from ${file}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error loading module routes:', error);
  }
}

// 加载所有模块路由
await loadModuleRoutes();

export default apiRouter;