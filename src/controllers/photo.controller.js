import {createPhotoService, getAllPhotosService, getPhotoByIdService, updatePhotoService, deletePhotoService} from "../services/photo.service.js";


class PhotoController {
  // 创建照片
  static async createPhoto(req, res) {
    try {
      const { url } = req.body;
      const photo = await createPhotoService(url);
      res.status(201).json(photo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // 获取所有照片
  static async getAllPhotos(req, res) {
    try {
      const photos = await getAllPhotosService();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 根据ID获取单个照片
  static async getPhotoById(req, res) {
    try {
      const photo = await getPhotoByIdService(req.params.id);
      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }
      res.json(photo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 根据ID更新照片
  static async updatePhoto(req, res) {
    try {
      const { url } = req.body;
      const photo = await updatePhotoService(req.params.id, url);
      
      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }
      
      res.json(photo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // 根据ID删除照片
  static async deletePhoto(req, res) {
    try {
      const photo = await deletePhotoService(req.params.id);
      
      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }
      
      res.json({ message: 'Photo deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default PhotoController;