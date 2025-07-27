import express from 'express';
import PhotoController from "../../controllers/photo.controller.js";
import { jwtAuthMiddleware } from "../../middleware/jwt.middleware.js";

const photoRouter = express.Router();

// 创建照片 (需要认证)
photoRouter.post('/', jwtAuthMiddleware, PhotoController.createPhoto);

// 获取所有照片
photoRouter.get('/', PhotoController.getAllPhotos);

// 随机获取一张照片
photoRouter.get('/random', PhotoController.getRandomPhoto);

// 根据ID获取单个照片
photoRouter.get('/:id', PhotoController.getPhotoById);

// 根据ID更新照片 (需要认证)
photoRouter.put('/:id', jwtAuthMiddleware, PhotoController.updatePhoto);

// 根据ID删除照片 (需要认证)
photoRouter.delete('/:id', jwtAuthMiddleware, PhotoController.deletePhoto);

export const apiPath = '/photos';
export default photoRouter;