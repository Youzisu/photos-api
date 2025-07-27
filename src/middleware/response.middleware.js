// 响应格式化中间件
// 统一API响应格式：{code: 2000, data: data, message: message}

/**
 * 成功响应中间件
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
export const responseMiddleware = (req, res, next) => {
  // 封装成功响应方法
  res.success = (data = null, message = '操作成功', code = 2000) => {
    return res.json({
      code,
      data,
      message
    });
  };

  // 封装失败响应方法
  res.error = (message = '操作失败', code = 4000, data = null) => {
    return res.json({
      code,
      data,
      message
    });
  };

  // 封装分页响应方法
  res.paginate = (data, pagination, message = '获取成功', code = 2000) => {
    return res.json({
      code,
      data: {
        items: data,
        pagination
      },
      message
    });
  };

  next();
};

/**
 * 全局错误处理中间件
 * @param {Error} err - 错误对象
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
export const errorHandler = (err, req, res, next) => {
  console.error('全局错误:', err);

  // 如果响应已经发送，则交给默认错误处理器
  if (res.headersSent) {
    return next(err);
  }

  // 根据错误类型设置不同的响应码和消息
  let code = 5000;
  let message = '服务器内部错误';

  if (err.name === 'ValidationError') {
    code = 4001;
    message = '数据验证失败';
  } else if (err.name === 'CastError') {
    code = 4002;
    message = '无效的数据格式';
  } else if (err.code === 11000) {
    code = 4003;
    message = '数据已存在';
  } else if (err.name === 'JsonWebTokenError') {
    code = 4010;
    message = '无效的token';
  } else if (err.name === 'TokenExpiredError') {
    code = 4011;
    message = 'token已过期';
  } else if (err.message) {
    message = err.message;
  }

  res.status(getHttpStatus(code)).json({
    code,
    data: null,
    message
  });
};

/**
 * 根据业务错误码获取HTTP状态码
 * @param {number} code - 业务错误码
 * @returns {number} HTTP状态码
 */
const getHttpStatus = (code) => {
  if (code >= 2000 && code < 3000) return 200; // 成功
  if (code >= 4000 && code < 4100) return 400; // 客户端错误
  if (code >= 4100 && code < 4200) return 401; // 认证错误
  if (code >= 4200 && code < 4300) return 403; // 权限错误
  if (code >= 4300 && code < 4400) return 404; // 资源不存在
  if (code >= 5000) return 500; // 服务器错误
  return 200; // 默认成功
};

/**
 * 404处理中间件
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    code: 4040,
    data: null,
    message: `路径 ${req.originalUrl} 不存在`
  });
};

export default {
  responseMiddleware,
  errorHandler,
  notFoundHandler
};