# 写真馆 API

一个基于nodejs的写真馆API和前端页面的一体化项目；

# 示例
- 随机图片[https://photos.茶馆.club//random](https://photos.茶馆.club/random)
- 随机图片api[https://photos.茶馆.club/api/photos/random](https://photos.茶馆.club/api/photos/random)

# 图例
![wechat_2025-07-28_122923_783.png](doc/wechat_2025-07-28_122923_783.png)![实力](./doc/122745_164.png![wechat_2025-07-28_122923_783.png](doc/wechat_2025-07-28_122923_783.png))

## 功能特性

- 🔐 用户注册和登录认证
- 📸 照片上传和管理
- 🏷️ 照片标签系统
- 📄 分页查询支持
- 🔑 注册密钥验证
- 👑 管理员权限管理
- 📱 响应式前端界面

## 技术栈

- **后端**: Node.js, Express.js
- **数据库**: MongoDB, Mongoose
- **认证**: JWT (JSON Web Tokens)
- **前端**: HTML, CSS, JavaScript, Vue.js
- **模板引擎**: EJS

## 快速开始

### 环境要求

- Node.js >= 20.0.0
- MongoDB >= 4.0
- npm 或 pnpm

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd photos-api
```

2. 安装依赖
```bash
npm install
# 或
pnpm install
```

3. 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下参数：
- `MONGODB_URI`: MongoDB 连接字符串
- `TOKEN_SECRET`: JWT 密钥
- `REGISTER_KEY`: 用户注册密钥
- `PORT`: 服务器端口（默认 3000）

4. 启动服务
```bash
npm start
```

5. 访问应用
- API 文档: http://localhost:3000
- 管理后台: http://localhost:3000/admin/dashboard.html
- 用户注册: http://localhost:3000/admin/register.html
- 用户登录: http://localhost:3000/admin/login.html

## API 接口

### 用户管理

#### 用户注册
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "用户名",
  "password": "密码",
  "role": "user",
  "registerKey": "注册密钥"
}
```

#### 用户登录
```http
POST /api/users/login
Content-Type: application/json

{
  "username": "用户名",
  "password": "密码"
}
```

#### 获取用户信息
```http
GET /api/users/profile
Authorization: Bearer <token>
```

### 照片管理

#### 获取照片列表
```http
GET /api/photos?page=1&limit=10&tags=风景,旅行
```

#### 添加照片
```http
POST /api/photos
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "图片URL",
  "title": "照片标题",
  "description": "照片描述",
  "tags": ["标签1", "标签2"]
}
```

#### 更新照片
```http
PUT /api/photos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "新标题",
  "description": "新描述",
  "tags": ["新标签"]
}
```

#### 删除照片
```http
DELETE /api/photos/:id
Authorization: Bearer <token>
```

## 数据模型

### 用户模型 (User)

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| username | String | ✓ | 用户名，唯一 |
| password | String | ✓ | 密码（加密存储） |
| role | String | ✓ | 用户角色（user/admin） |
| isActive | Boolean | - | 账户状态，默认 true |
| lastLogin | Date | - | 最后登录时间 |

### 照片模型 (Photo)

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| url | String | ✓ | 图片URL |
| title | String | ✓ | 照片标题 |
| description | String | - | 照片描述 |
| tags | Array | - | 标签数组 |
| createdAt | Date | - | 创建时间 |
| updatedAt | Date | - | 更新时间 |

## 响应格式

### 成功响应
```json
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 分页响应
```json
{
  "success": true,
  "message": "获取成功",
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误描述",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 安全特性

- JWT 令牌认证
- 密码加密存储
- 注册密钥验证
- 角色权限控制
- 输入数据验证

## 项目结构

```
photos-api/
├── src/
│   ├── app.js              # 应用入口
│   ├── config/
│   │   └── database.js     # 数据库配置
│   ├── controllers/        # 控制器
│   │   ├── photo.controller.js
│   │   └── user.controller.js
│   ├── middleware/         # 中间件
│   │   ├── jwt.middleware.js
│   │   └── response.middleware.js
│   ├── models/             # 数据模型
│   │   ├── photo.model.js
│   │   └── user.model.js
│   ├── routes/             # 路由
│   │   ├── api.route.js
│   │   └── modules/
│   ├── services/           # 服务层
│   │   ├── photo.service.js
│   │   └── user.service.js
│   ├── public/             # 静态文件
│   │   └── admin/          # 管理界面
│   └── views/              # 视图模板
│       ├── index.ejs
│       ├── list.ejs
│       └── random.ejs
├── .env                    # 环境变量
├── .env.example           # 环境变量模板
├── package.json           # 项目配置
└── README.md              # 项目说明
```

## 开发指南

### 添加新的 API 接口

1. 在 `models/` 中定义数据模型
2. 在 `services/` 中实现业务逻辑
3. 在 `controllers/` 中添加控制器方法
4. 在 `routes/modules/` 中定义路由
5. 在 `routes/api.route.js` 中注册路由

### 环境变量说明

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| PORT | 服务器端口 | 3000 |
| MONGODB_URI | MongoDB 连接字符串 | mongodb://localhost:27017/photos |
| NODE_ENV | 运行环境 | development/production |
| TOKEN_SECRET | JWT 密钥 | your_secret_key |
| REGISTER_KEY | 注册验证密钥 | your_register_key |

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！