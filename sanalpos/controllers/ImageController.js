// controllers/imageController.js
import { v2 as cloudinary } from 'cloudinary';
import ImageModel from '../models/ImageModel.js';

// Resim Ekleme
const addImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resim dosyası yüklenmelidir.',
      });
    }

    const { type } = req.body; // Galeri veya Referans bilgisi

    // Cloudinary'e resim yükleme
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'images', // Cloudinary'de resimlerin kaydedileceği klasör
      resource_type: 'image',
    });

    // Veritabanına kaydetme
    const image = new ImageModel({ imageUrl: result.secure_url, type });
    await image.save();

    res.status(201).json({
      success: true,
      message: 'Resim başarıyla eklendi.',
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error('Resim ekleme hatası:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Sunucu hatası',
    });
  }
};

// Tüm Resimleri Listeleme
const listImages = async (req, res) => {
  try {
    const { type } = req.query; // Galeri veya Referans bilgisi
    const filter = type ? { type } : {}; // Filtreleme
    const images = await ImageModel.find(filter);
    res.json({ success: true, images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Resim Silme
const removeImage = async (req, res) => {
  try {
    const { imageId } = req.body;
    await ImageModel.findByIdAndDelete(imageId);
    res.json({ success: true, message: 'Resim başarıyla silindi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addImage, listImages, removeImage };