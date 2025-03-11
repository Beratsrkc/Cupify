import blogModel from '../models/blogModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Yeni blog oluştur
// Yeni blog oluştur
const createBlog = async (req, res) => {
    try {
      const { title, content } = req.body;
      const image = req.file; // Multer ile yüklenen resim
  
      if (!title || !content || !image) {
        return res.status(400).json({ success: false, message: "Lütfen tüm alanları doldurun." });
      }
  
      // Cloudinary'e resim yükleme
      const result = await cloudinary.uploader.upload(image.path, {
        folder: 'blogs', // Cloudinary'de resimlerin kaydedileceği klasör
      });
  
      // Yeni blog oluştur
      const newBlog = new blogModel({
        title,
        content: JSON.parse(content), // JSON string'ini diziye çevir
        image: result.secure_url, // Cloudinary'den gelen resim URL'si
      });
  
      await newBlog.save();
  
      // Geçici dosyayı sil
      fs.unlinkSync(image.path);
  
      res.status(201).json({ success: true, blog: newBlog });
    } catch (error) {
      console.error("Blog oluşturma hatası:", error.message);
      res.status(500).json({ success: false, message: "Blog oluşturulamadı." });
    }
  };
// Tüm blogları getir
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find({});
    res.json({ success: true, blogs });
  } catch (error) {
    console.error("Blogları getirme hatası:", error);
    res.status(500).json({ success: false, message: "Bloglar getirilemedi." });
  }
};

// Tek bir blog getir
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog bulunamadı." });
    }

    res.json({ success: true, blog });
  } catch (error) {
    console.error("Blog getirme hatası:", error);
    res.status(500).json({ success: false, message: "Blog getirilemedi." });
  }
};

// Blog güncelle
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const image = req.file; // Multer ile yüklenen resim

    // Mevcut blogu bul
    const existingBlog = await blogModel.findById(id);

    if (!existingBlog) {
      return res.status(404).json({ success: false, message: "Blog bulunamadı." });
    }

    // Yeni resim yüklenmişse Cloudinary'e yükle
    let imageUrl = existingBlog.image;
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: 'blogs', // Cloudinary'de resimlerin kaydedileceği klasör
      });
      imageUrl = result.secure_url;

      // Geçici dosyayı sil
      fs.unlinkSync(image.path);
    }

    // Blogu güncelle
    const updatedBlog = await blogModel.findByIdAndUpdate(
      id,
      { title, content, image: imageUrl, updatedAt: Date.now() },
      { new: true }
    );

    res.json({ success: true, blog: updatedBlog });
  } catch (error) {
    console.error("Blog güncelleme hatası:", error);
    res.status(500).json({ success: false, message: "Blog güncellenemedi." });
  }
};

// Blog sil
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBlog = await blogModel.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: "Blog bulunamadı." });
    }

    res.json({ success: true, message: "Blog başarıyla silindi." });
  } catch (error) {
    console.error("Blog silme hatası:", error);
    res.status(500).json({ success: false, message: "Blog silinemedi." });
  }
};

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };