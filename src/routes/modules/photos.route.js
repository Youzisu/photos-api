import express from 'express';
import PhotoController from "../../controllers/photo.controller.js";

const photoRouter = express.Router();

// 创建照片
photoRouter.post('/', PhotoController.createPhoto);

// 获取所有照片
photoRouter.get('/', PhotoController.getAllPhotos);

// 根据ID获取单个照片
photoRouter.get('/:id', PhotoController.getPhotoById);

// 根据ID更新照片
photoRouter.put('/:id', PhotoController.updatePhoto);

// 根据ID删除照片
photoRouter.delete('/:id', PhotoController.deletePhoto);

export const apiPath = '/photos';
export default photoRouter;