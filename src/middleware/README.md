# 响应中间件使用说明

## 概述

响应中间件提供了统一的API响应格式，确保所有接口返回一致的数据结构：

```json
{
  "code": 2000,
  "data": {},
  "message": "操作成功"
}
```

## 响应码规范

### 成功响应 (2xxx)
- `2000`: 通用成功
- `2001`: 用户注册成功
- `2002`: 登录成功
- `2003`: 获取用户信息成功
- `2004`: 获取用户列表成功
- `2005`: 获取单个用户成功
- `2006`: 用户信息更新成功
- `2007`: 用户删除成功
- `2008`: token验证成功

### 客户端错误 (4xxx)
- `4000`: 通用客户端错误
- `4001`: 参数验证失败
- `4002`: 数据处理失败
- `4003`: 数据更新失败
- `4010`: 认证失败
- `4011`: 缺少token
- `4012`: token无效
- `4040`: 资源不存在
- `4041`: 用户不存在
- `4042`: 用户删除失败

### 服务器错误 (5xxx)
- `5000`: 通用服务器错误
- `5001`: 数据库操作失败

## 使用方法

### 1. 成功响应

```javascript
// 基本成功响应
res.success(data, message, code);

// 示例
res.success(user, '用户创建成功', 2001);
res.success(null, '操作成功'); // 使用默认code 2000
```

### 2. 错误响应

```javascript
// 基本错误响应
res.error(message, code, data);

// 示例
res.error('用户名不能为空', 4001);
res.error('服务器内部错误', 5000);
```

### 3. 分页响应

```javascript
// 分页响应
res.paginate(items, pagination, message, code);

// 示例
res.paginate(users, {
  currentPage: 1,
  totalPages: 10,
  totalItems: 100,
  itemsPerPage: 10
}, '获取用户列表成功', 2004);
```

## 中间件配置

在 `app.js` 中已经配置了以下中间件：

1. **响应格式化中间件** (`responseMiddleware`): 为 `res` 对象添加 `success`、`error`、`paginate` 方法
2. **404处理中间件** (`notFoundHandler`): 处理未找到的路由
3. **全局错误处理中间件** (`errorHandler`): 捕获并格式化所有未处理的错误

## 错误处理

中间件会自动处理以下类型的错误：

- **ValidationError**: 数据验证错误 → code: 4001
- **CastError**: 数据格式错误 → code: 4002
- **MongoError (code: 11000)**: 数据重复错误 → code: 4003
- **JsonWebTokenError**: JWT错误 → code: 4010
- **TokenExpiredError**: Token过期 → code: 4011
- **其他错误**: 通用服务器错误 → code: 5000

## 最佳实践

1. **统一使用响应方法**: 在所有控制器中使用 `res.success()` 和 `res.error()` 方法
2. **合理设置响应码**: 根据业务场景选择合适的响应码
3. **提供清晰的错误信息**: 错误消息应该对用户友好且具有指导性
4. **避免直接使用 res.json()**: 使用中间件提供的方法确保格式一致

## 示例控制器

```javascript
export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 参数验证
    if (!username || !password) {
      return res.error('用户名和密码都是必填的', 4001);
    }
    
    // 业务逻辑
    const user = await UserService.createUser({ username, password });
    
    // 成功响应
    res.success(user, '用户创建成功', 2001);
  } catch (error) {
    // 错误会被全局错误处理中间件捕获
    throw error;
  }
};
```

## HTTP状态码映射

中间件会根据业务响应码自动设置HTTP状态码：

- `2xxx` → HTTP 200
- `4000-4099` → HTTP 400
- `4100-4199` → HTTP 401
- `4200-4299` → HTTP 403
- `4300-4399` → HTTP 404
- `5xxx` → HTTP 500