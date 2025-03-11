// cartController.js
import userModel from "../models/userModel.js";

// Sepete ürün ekleme
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, quantity, name, selectedSize, selectedPrintingOption, selectedQuantity,selectedCoverOption, totalPrice, image } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      // Eğer ürün zaten sepette varsa, miktarını artır
      cartData[itemId].quantity += quantity;
    } else {
      // Eğer ürün sepette yoksa, yeni bir giriş oluştur
      cartData[itemId] = {
        quantity,
        name,
        selectedSize,
        selectedQuantity, // DÜZELTİLDİ
        selectedPrintingOption,
        selectedCoverOption,
        totalPrice,
        image,
      };
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: 'Added to cart' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Sepeti güncelleme
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, quantity, name, selectedSize, selectedPrintingOption,selectedQuantity, selectedCoverOption, totalPrice, image } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    // Sepetteki ürünü güncelle
    cartData[itemId] = {
      quantity,
      name,
      selectedQuantity, 
      selectedSize,
      selectedPrintingOption,
      selectedCoverOption,
      totalPrice,
      image,
    };

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Kullanıcının sepetini getirme
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    res.json({ success: true, cartData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Sepeti temizleme
const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    userData.cartData = {}; // Sepeti sıfırla

    await userModel.findByIdAndUpdate(userId, { cartData: userData.cartData });

    res.json({ success: true, message: 'Sepet başarıyla temizlendi!' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart, clearCart };