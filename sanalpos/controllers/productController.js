import { v2 as cloudinary } from 'cloudinary';
import ProductModel from '../models/productModel.js';

// Cloudinary config (opsiyonel olarak burada da yapılabilir)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Yardımcı fonksiyonlar
const parseJSONSafely = (str, defaultValue = []) => {
  try {
    return typeof str === 'string' ? JSON.parse(str) : (str || defaultValue);
  } catch (error) {
    console.error('JSON parse hatası:', error);
    return defaultValue;
  }
};

const validateDiscount = (discount) => {
  const num = Number(discount);
  return Math.min(100, Math.max(0, isNaN(num) ? 0 : num));
};

const uploadImagesToCloudinary = async (files) => {
  try {
    return await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
          resource_type: 'image',
          quality: 'auto:good'
        });
        return result.secure_url;
      })
    );
  } catch (error) {
    console.error('Resim yükleme hatası:', error);
    throw new Error('Resim yükleme işlemi başarısız oldu');
  }
};

const deleteCloudinaryImages = async (imageUrls) => {
  try {
    await Promise.all(
      imageUrls.map(async (imageUrl) => {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      })
    );
  } catch (error) {
    console.error('Resim silme hatası:', error);
    throw new Error('Resim silme işlemi başarısız oldu');
  }
};

// Controller Fonksiyonları
const addProduct = async (req, res) => {
  try {
    const requiredFields = ['name', 'description', 'category', 'subCategory'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Eksik alanlar: ${missingFields.join(', ')}`
      });
    }

    const imageFiles = ['image1', 'image2', 'image3', 'image4']
      .map(key => req.files[key]?.[0])
      .filter(Boolean);

    if (imageFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'En az bir resim yüklemelisiniz'
      });
    }

    const imagesUrl = await uploadImagesToCloudinary(imageFiles);

    const productData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      subCategory: req.body.subCategory,
      bestseller: req.body.bestseller === 'true' || req.body.bestseller === true,
      images: imagesUrl,
      sizes: parseJSONSafely(req.body.sizes),
      quantities: parseJSONSafely(req.body.quantities).map(q => ({
        label: q.label,
        multiplier: Number(q.multiplier) || 1,
        discount: validateDiscount(q.discount)
      })),
      printingOptions: parseJSONSafely(req.body.printingOptions),
      coverOptions: parseJSONSafely(req.body.coverOptions, { price: 0, colors: [] }),
      inStock: typeof req.body.inStock === 'undefined' ? true : req.body.inStock
    };

    const product = new ProductModel(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla eklendi',
      productId: product._id,
      product
    });

  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Ürün eklenirken bir hata oluştu'
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId, name, description, category, subCategory, bestseller, sizes, quantities, printingOptions, coverOptions, inStock } = req.body;

    // Gerekli alan kontrolü
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Ürün ID gereklidir' });
    }

    // Mevcut ürünü bul
    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    }

    // Güncelleme verilerini hazırla
    const updateData = {
      name,
      description,
      category,
      subCategory,
      bestseller: bestseller === 'true' || bestseller === true,
      sizes: parseJSONSafely(sizes, existingProduct.sizes),
      quantities: parseJSONSafely(quantities, existingProduct.quantities).map(q => ({
        label: q.label,
        multiplier: Number(q.multiplier) || 1,
        discount: validateDiscount(q.discount)
      })),
      printingOptions: parseJSONSafely(printingOptions, existingProduct.printingOptions),
      coverOptions: parseJSONSafely(coverOptions, existingProduct.coverOptions || { price: 0, colors: [] }),
      inStock: typeof inStock === 'undefined' ? existingProduct.inStock : inStock,
      images: existingProduct.images // Varsayılan olarak mevcut resimleri koru
    };

    // Yeni resimler yüklendiyse işle
    if (req.files) {
      const imageFiles = ['image1', 'image2', 'image3', 'image4']
        .map(key => req.files[key]?.[0])
        .filter(Boolean);

      if (imageFiles.length > 0) {
        const newImages = await uploadImagesToCloudinary(imageFiles);
        await deleteCloudinaryImages(existingProduct.images);
        updateData.images = newImages;
      }
    }

    // Veritabanında güncelleme
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name');

    res.status(200).json({
      success: true,
      message: 'Ürün başarıyla güncellendi',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Ürün güncellenirken bir hata oluştu'
    });
  }
};

const listProduct = async (req, res) => {
  try {
    const { inStock, category, bestseller } = req.query;
    const filter = {};
    
    if (inStock !== undefined) filter.inStock = inStock === 'true';
    if (category) filter.category = category;
    if (bestseller !== undefined) filter.bestseller = bestseller === 'true';

    const products = await ProductModel.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      count: products.length,
      products 
    });
  } catch (error) {
    console.error('Ürün listeleme hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ürünler listelenirken bir hata oluştu'
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

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    // Cloudinary'deki resimleri sil
    await deleteCloudinaryImages(product.images);

    // Veritabanından ürünü sil
    await ProductModel.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true, 
      message: 'Ürün başarıyla silindi' 
    });
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Ürün silinirken bir hata oluştu'
    });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.params; // params'dan alıyoruz artık
    
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
      message: 'Ürün detayları getirilirken bir hata oluştu'
    });
  }
};

// Stok durumunu hızlı güncelleme için özel endpoint
const updateStockStatus = async (req, res) => {
  try {
    const { productId, inStock } = req.body;

    if (typeof inStock === 'undefined' || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Ürün IDsi ve stok durumu gereklidir'
      });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { inStock },
      { new: true }
    ).select('inStock');

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stok durumu güncellendi',
      inStock: updatedProduct.inStock
    });
  } catch (error) {
    console.error('Stok durumu güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Stok durumu güncellenirken bir hata oluştu'
    });
  }
};

export { 
  addProduct, 
  listProduct, 
  removeProduct, 
  singleProduct,
  updateProduct,
  updateStockStatus
};