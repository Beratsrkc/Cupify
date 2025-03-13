import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { IoIosCloseCircleOutline, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token, getCartAmount } = useContext(ShopContext);

  const { subtotal, total } = getCartAmount();
  const vatAmount = subtotal * 0.2; // KDV, subtotal üzerine eklenecek
  const totalWithVAT = subtotal + vatAmount; // KDV dahil toplam

  const [cartData, setCartData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  // Benzersiz cartItem key'i oluştur
  const generateCartItemKey = (item) => {
    return `${item.id}-${item.selectedSize?.label}-${item.selectedPrintingOption}-${item.selectedCoverOption}`;
  };

  useEffect(() => {
    const tempData = Object.keys(cartItems)
      .filter(itemKey => cartItems[itemKey].quantity > 0)
      .map(itemKey => ({
        ...cartItems[itemKey],
        _id: itemKey, // Benzersiz key'i _id olarak kullan
      }));
    setCartData(tempData);
  }, [cartItems, products]);

  if (cartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <p className="text-lg sm:text-2xl font-semibold mb-4">Sepetinizde ürün bulunmamaktadır.</p>
        <button
          onClick={() => navigate('/urunler')}
          className="bg-red-600 text-white text-sm px-8 py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Alışverişe Başla
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* Ürün Listesi */}
      <div className="flex flex-col gap-4 w-full lg:w-3/5 pb-24 sm:pb-0">
        <div className="text-2xl mb-3">
          <Title text1={'ALIŞVERİŞ'} text2={'SEPETİ'} />
        </div>
        {cartData.map((item, index) => {
          const productData = products.find(p => p._id === item._id.split('-')[0]); // _id'den ürün id'sini al
          if (!productData) return null;

          const productImage = item.image || productData.images?.[0] || assets.default_image;
          const formattedPrice = item.totalPrice.toLocaleString('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          return (
            <div key={index} className="py-4 border-t border-b text-gray-700">
              {/* Masaüstü Görünümü */}
              <div className="hidden sm:flex items-start gap-6">
                <img
                  className="w-32 h-32 object-cover rounded-lg"
                  src={productImage}
                  alt="product"
                />
                <div className="w-full flex flex-col gap-2">
                  <p className="text-lg font-medium">{productData.name}</p>
                  <div className="flex flex-col gap-1">
                    {item.selectedSize && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Ebat:</span> {item.selectedSize.label}
                      </p>
                    )}
                    {item.selectedCoverOption && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Kapak:</span> {item.selectedCoverOption}
                      </p>
                    )}
                    {item.selectedPrintingOption && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Baskı:</span> {item.selectedPrintingOption}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Sipariş Miktarı:</span> {item.selectedQuantity} Adet
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-medium text-black">
                      {currency}{formattedPrice} {/* Currency ve fiyat yan yana */}
                    </p>
                  </div>
                  <div className="w-20">
                    <input
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0) updateQuantity(item._id, value);
                      }}
                      className="border w-full px-2 py-1 text-center outline-none rounded-lg"
                      type="number"
                      min="1"
                      value={item.quantity}
                    />
                  </div>
                  <img
                    onClick={() => updateQuantity(item._id, 0)}
                    className="w-5 h-5 cursor-pointer hover:opacity-75 transition-opacity"
                    src={assets.bin_icon}
                    alt="Sil"
                  />
                </div>
              </div>

              {/* Mobil Görünümü */}
              <div className="sm:hidden flex flex-col gap-4">
                <p className="text-lg font-medium">{productData.name}</p>
                <div className="flex gap-4">
                  <img
                    className="w-32 h-32 object-cover rounded-lg"
                    src={productImage}
                    alt="product"
                  />
                  <div className="flex flex-col gap-1">
                    {item.selectedSize && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Ebat:</span> {item.selectedSize.label}
                      </p>
                    )}
                    {item.selectedCoverOption && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Kapak:</span> {item.selectedCoverOption}
                      </p>
                    )}
                    {item.selectedPrintingOption && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Baskı:</span> {item.selectedPrintingOption}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Sipariş Miktarı:</span> {item.selectedQuantity} Adet
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-medium text-black">
                      {currency}{formattedPrice} {/* Currency ve fiyat yan yana */}
                    </p>
                  </div>
                  <div className="w-20">
                    <input
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0) updateQuantity(item._id, value);
                      }}
                      className="border w-full px-2 py-1 text-center outline-none rounded-lg"
                      type="number"
                      min="1"
                      value={item.quantity}
                    />
                  </div>
                  <img
                    onClick={() => updateQuantity(item._id, 0)}
                    className="w-5 h-5 cursor-pointer hover:opacity-75 transition-opacity"
                    src={assets.bin_icon}
                    alt="Sil"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CartTotal ve Ödeme Butonu (Mobilde Sabit) */}
      <div className="fixed lg:static bottom-0 left-0 w-full bg-white lg:bg-transparent lg:w-1/3 border-t lg:border-t-0 shadow-lg lg:shadow-none">
        <div className="p-4 lg:p-0">
          <div className={`${isDetailsVisible ? 'block' : 'hidden'} lg:block`}>
            <CartTotal
              total={totalWithVAT.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              subtotal={subtotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              vatAmount={vatAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            />
          </div>

          <div className="w-full flex justify-between pt-2">
            {(
              <div className="lg:hidden items-center mb-2 w-1/5">
                <div className='flex'>
                  <b className="text-sm font-semibold">Toplam </b>
                  <button
                    onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                    className="text-black"
                  >
                    {isDetailsVisible ? <IoIosArrowDown /> : <IoIosArrowUp />}
                  </button>
                </div>
                <b className="text-sm font-semibold">
                  {currency}{totalWithVAT.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </b>
              </div>
            )}
            <button
              onClick={() => token ? navigate("/siparis") : setIsDialogOpen(true)}
              className="bg-black text-white text-sm w-1/3 lg:px-2 lg:w-full my-2 lg:my-8 px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              ÖDEME
            </button>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <div className='flex justify-between mb-4'>
              <h2 className="text-xl font-bold">Hesabınız Yok Mu?</h2>
              <IoIosCloseCircleOutline
                className='cursor-pointer text-2xl'
                onClick={() => setIsDialogOpen(false)}
              />
            </div>
            <p className="text-gray-600 mb-6">
              Kampanyalardan faydalanmak için hemen giriş yapın veya üye olun!
            </p>
            <div className="flex justify-between gap-2">
              <button
                onClick={() => navigate("/siparis")}
                className="bg-black text-white text-sm px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Üye Olmadan Devam
              </button>
              <button
                onClick={() => navigate("/giris")}
                className="bg-black text-white text-sm px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Giriş Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;