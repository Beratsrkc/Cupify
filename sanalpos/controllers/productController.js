import { v2 as cloudinary } from 'cloudinary';
import ProductModel from '../models/productModel.js';

const addProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      subCategory, 
      bestseller, 
      sizes, 
      quantities,
      printingOptions,
      coverOptions // Kapak seçeneği
    } = req.body;

    // Gerekli alan kontrolleri
    const requiredFields = ['name', 'description', 'category', 'subCategory'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Eksik alanlar: ${missingFields.join(', ')}`
      });
    }

    // Resim yükleme işlemi
    const imageFiles = ['image1', 'image2', 'image3', 'image4']
      .map(key => req.files[key]?.[0])
      .filter(Boolean);

    if (imageFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'En az bir resim yüklemelisiniz'
      });
    }

    // Cloudinary'e resim yükleme
    const imagesUrl = await Promise.all(
      imageFiles.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
          resource_type: 'image'
        });
        return result.secure_url;
      })
    );

    // Veri modelini oluşturma
    const productData = {
      name,
      description,
      category,
      subCategory,
      bestseller: bestseller === 'true' || bestseller === true, // Doğru şekilde kontrol et
      images: imagesUrl,
      date: Date.now(),
      sizes: JSON.parse(sizes || '[]'),
      quantities: JSON.parse(quantities || '[]'),
      printingOptions: JSON.parse(printingOptions || '[]'),
      coverOptions: JSON.parse(coverOptions || { price: 0, colors: [] }) // Kapak seçeneği
    };

    // Veritabanına kaydetme
    const product = new ProductModel(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla eklendi',
      productId: product._id
    });

  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Sunucu hatası'
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      category,
      subCategory,
      bestseller,
      coverOptions,
      sizes,
      quantities,
      printingOptions
    } = req.body;

    // Gerekli alan kontrolleri
    const requiredFields = ['name', 'description', 'category', 'subCategory'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Eksik alanlar: ${missingFields.join(', ')}`
      });
    }

    // Güncellenecek veriyi hazırla
    const updateData = {
      name,
      description,
      category,
      subCategory,
      bestseller: bestseller === 'true' || bestseller === true,
      coverOptions: {
        price: coverOptions?.price || 0,
        colors: coverOptions?.colors || []
      },
      sizes: sizes || [],
      quantities: quantities || [],
      printingOptions: printingOptions || []
    };

    // Veritabanında güncelleme işlemi
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true } // Güncellenmiş veriyi döndür
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ürün başarıyla güncellendi',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Sunucu hatası'
    });
  }
};
const listProduct = async (req, res) => {
  try {
    // Tüm ürünleri getir ve kategori bilgilerini populate et
    const products = await ProductModel.find({}).populate('category', 'name');

    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: 'Product Removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await ProductModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct,updateProduct };