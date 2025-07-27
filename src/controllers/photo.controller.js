import {createPhotoService, getAllPhotosService, getPhotoByIdService, updatePhotoService, deletePhotoService, getRandomPhotoService} from "../services/photo.service.js";


class PhotoController {
  // 创建照片
  static async createPhoto(req, res) {
    try {
      const { url, title, description, tags } = req.body;
      
      if (!url) {
        return res.error('图片URL不能为空', 4001);
      }
      
      const photoData = {
        url,
        title: title || '',
        description: description || '',
        tags: Array.isArray(tags) ? tags : []
      };
      
      const photo = await createPhotoService(photoData);
      res.success(photo, '照片创建成功', 2000);
    } catch (error) {
      if (error.code === 11000) {
        res.error('该图片URL已存在', 4009);
      } else {
        res.error(error.message, 4000);
      }
    }
  }

  // 获取所有照片（支持分页）
  static async getAllPhotos(req, res) {
    console.log(req.query);
    try {
      // 从查询参数中获取分页信息，设置默认值
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      // 验证分页参数
      if (page < 1) {
        return res.error('页码必须大于0', 4001);
      }
      if (limit < 1 || limit > 100) {
        return res.error('每页数量必须在1-100之间', 4001);
      }
      
      const result = await getAllPhotosService(page, limit);
      res.success(result, '获取照片列表成功', 2000);
    } catch (error) {
      res.error(error.message, 5000);
    }
  }

  // 根据ID获取单个照片
  static async getPhotoById(req, res) {
    try {
      const photo = await getPhotoByIdService(req.params.id);
      if (!photo) {
        return res.error('照片不存在', 4040);
      }
      res.success(photo, '获取照片成功', 2000);
    } catch (error) {
      res.error(error.message, 5000);
    }
  }

  // 根据ID更新照片
  static async updatePhoto(req, res) {
    try {
      const { url, title, description, tags } = req.body;
      
      if (!url) {
        return res.error('图片URL不能为空', 4001);
      }
      
      const photoData = {
        url,
        title: title || '',
        description: description || '',
        tags: Array.isArray(tags) ? tags : []
      };
      
      const photo = await updatePhotoService(req.params.id, photoData);
      
      if (!photo) {
        return res.error('照片不存在', 4040);
      }
      
      res.success(photo, '照片更新成功', 2000);
    } catch (error) {
      if (error.code === 11000) {
        res.error('该图片URL已存在', 4009);
      } else {
        res.error(error.message, 4000);
      }
    }
  }

  // 根据ID删除照片
  static async deletePhoto(req, res) {
    try {
      const photo = await deletePhotoService(req.params.id);
      
      if (!photo) {
        return res.error('照片不存在', 4040);
      }
      
      res.success(null, '照片删除成功', 2000);
    } catch (error) {
      res.error(error.message, 5000);
    }
  }

  // 随机获取一张照片
  static async getRandomPhoto(req, res) {
    try {
      const photo = await getRandomPhotoService();
      if (!photo || photo.length === 0) {
        return res.error('没有找到照片', 4040);
      }
      res.success(photo, '获取随机照片成功', 2000);
    } catch (error) {
      res.error(error.message, 5000);
    }
  }
}

export default PhotoController;