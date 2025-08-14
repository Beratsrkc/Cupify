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
      coverOptions
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

    // Quantities dizisini işle (indirim alanını ekle)
    const processedQuantities = JSON.parse(quantities || '[]').map(q => ({
      label: q.label,
      multiplier: q.multiplier || 1,
      discount: Math.min(100, Math.max(0, q.discount || 0)) // 0-100 arasında sınırla
    }));

    // Veri modelini oluşturma
    const productData = {
      name,
      description,
      category,
      subCategory,
      bestseller: bestseller === 'true' || bestseller === true,
      images: imagesUrl,
      sizes: JSON.parse(sizes || '[]'),
      quantities: processedQuantities,
      printingOptions: JSON.parse(printingOptions || '[]'),
      coverOptions: JSON.parse(coverOptions || '{"price": 0, "colors": []}')
    };

    // Veritabanına kaydetme
    const product = new ProductModel(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla eklendi',
      productId: product._id,
      product: product
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
      coverOptions: typeof coverOptions === 'string' ? JSON.parse(coverOptions) : coverOptions || { price: 0, colors: [] },
      sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes || [],
      quantities: typeof quantities === 'string' ? JSON.parse(quantities) : quantities || [],
      printingOptions: typeof printingOptions === 'string' ? JSON.parse(printingOptions) : printingOptions || []
    };

    // Quantities dizisindeki indirimleri kontrol et
    if (Array.isArray(updateData.quantities)) {
      updateData.quantities = updateData.quantities.map(q => ({
        label: q.label,
        multiplier: q.multiplier || 1,
        discount: Math.min(100, Math.max(0, q.discount || 0)) // 0-100 arasında sınırla
      }));
    }

    // Veritabanında güncelleme işlemi
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    ).populate('category', 'name');

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
    const products = await ProductModel.find({})
      .populate('category', 'name')
      .sort({ createdAt: -1 }); // Yeniden eskiye sırala

    res.status(200).json({ 
      success: true, 
      count: products.length,
      products 
    });
  } catch (error) {
    console.error('Ürün listeleme hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Ürün IDsi gereklidir'
      });
    }

    // Cloudinary'deki resimleri de silmek için önce ürünü bul
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    // Ürünü sil
    await ProductModel.findByIdAndDelete(id);

    // Cloudinary'deki resimleri sil (opsiyonel)
    // ...

    res.status(200).json({ 
      success: true, 
      message: 'Ürün başarıyla silindi' 
    });
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Ürün IDsi gereklidir'
      });
    }

    const product = await ProductModel.findById(productId)
      .populate('category', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    res.status(200).json({ 
      success: true, 
      product 
    });
  } catch (error) {
    console.error('Ürün detay hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export { 
  addProduct, 
  listProduct, 
  removeProduct, 
  singleProduct,
  updateProduct 
};