import Photo from '../models/photo.model.js';

// 创建照片
export const createPhotoService = async (url) => {
  const photo = new Photo({ url });
  return await photo.save();
};

// 获取所有照片
export const getAllPhotosService = async () => {
  return Photo.find();
};

// 根据ID获取单个照片
export const getPhotoByIdService = async (id) => {
  return Photo.findById(id);
};

// 根据ID更新照片
export const updatePhotoService = async (id, url) => {
  return Photo.findByIdAndUpdate(
      id,
      {url},
      {new: true, runValidators: true}
  );
};

// 根据ID删除照片
export const deletePhotoService = async (id) => {
  return Photo.findByIdAndDelete(id);
};

