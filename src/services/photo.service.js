import Photo from '../models/photo.model.js';

// 创建照片
export const createPhotoService = async (photoData) => {
  const photo = new Photo(photoData);
  return await photo.save();
};

// 获取所有照片（支持分页）
export const getAllPhotosService = async (page = 1, limit = 10) => {
  // 确保page至少为1
  const currentPage = Math.max(1, parseInt(page));
  const skip = (currentPage - 1) * limit;
  
  // 获取总数量
  const total = await Photo.countDocuments();
  console.log('分页信息:', { page: currentPage, limit, skip, total });

  // 获取分页数据
  const photos = await Photo.find()
    .skip(skip)
    .limit(limit)
    .sort({  _id: 1 });
  
  // 计算分页信息
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  
  return {
    photos,
    pagination: {
      currentPage: currentPage,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage,
      hasPrevPage
    }
  };
};

// 根据ID获取单个照片
export const getPhotoByIdService = async (id) => {
  return Photo.findById(id);
};

// 根据ID更新照片
export const updatePhotoService = async (id, photoData) => {
  return Photo.findByIdAndUpdate(
      id,
      photoData,
      {new: true, runValidators: true}
  );
};

// 根据ID删除照片
export const deletePhotoService = async (id) => {
  return Photo.findByIdAndDelete(id);
};

// 随机获取一张照片
export const getRandomPhotoService = async () => {
  const randomDocument = await Photo.aggregate([
    { $sample: { size: 1 } }
  ]);
  console.log(randomDocument);
  return randomDocument
};

