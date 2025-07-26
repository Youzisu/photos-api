import Photo from '../models/photo.model.js';

// 创建照片
export const createPhotoService = async (url) => {
  const photo = new Photo({ url });
  return await photo.save();
};

// 获取所有照片（支持分页）
export const getAllPhotosService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  // 获取总数量
  const total = await Photo.countDocuments();
  
  // 获取分页数据
  const photos = await Photo.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); // 按创建时间倒序排列
  
  // 计算分页信息
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    photos,
    pagination: {
      currentPage: page,
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

// 随机获取一张照片
export const getRandomPhotoService = async () => {
  const randomDocument = await Photo.aggregate([
    { $sample: { size: 1 } }
  ]);
  console.log(randomDocument);
  return randomDocument
};

