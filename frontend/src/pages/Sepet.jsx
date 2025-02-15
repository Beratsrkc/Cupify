import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { IoIosCloseCircleOutline, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token, getCartAmount } = useContext(ShopContext);

  // Use getCartAmount to calculate totals
  const { subtotal, total } = getCartAmount();
  const vatAmount = subtotal * 0.2; // KDV tutarı (%20)
  const subtotalExcludingVAT = subtotal - vatAmount; // KDV hariç fiyat

  const [cartData, setCartData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false); // Bilgilerin görünürlüğü

  useEffect(() => {
    const tempData = Object.keys(cartItems)
      .filter(itemId => cartItems[itemId] > 0)
      .map(itemId => ({
        _id: itemId,
        quantity: cartItems[itemId]
      }));
    setCartData(tempData);
  }, [cartItems, products]);

  if (cartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <p className="text-lg sm:text-2xl font-semibold mb-4">Sepetinizde ürün bulunmamaktadır.</p>
        <button
          onClick={() => navigate('/urunler')}
          className="bg-black text-white text-sm px-8 py-3"
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
          const productData = products.find(p => p._id === item._id);
          if (!productData) return null;

          const productImage = productData.images?.[0] || productData.image?.[0] || assets.default_image;
          const hasNewPrice = productData.newprice > 0;

          return (
            <div key={index} className="py-4 border-t border-b text-gray-700 items-center gap-4">
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productImage}
                  alt="product"
                />
                <div className="w-full">
                  <p className="text-base sm:text-lg font-medium">{productData.name}</p>
                  <div className="flex items-center gap-5 mt-2 justify-between">
                    <div className="flex items-center gap-5 mt-2 w-full">
                      {/* Fiyatlar için sabit genişlik */}
                      <div className="flex items-center gap-2 w-1/2">
                        {hasNewPrice ? (
                          <>
                          
                            <p className="text-base sm:text-lg font-medium text-black">
                              {currency}{productData.newprice}
                            </p>
                            <p className="text-base sm:text-lg font-medium text-gray-400 line-through">
                              {currency}{productData.price}
                            </p>
                          </>
                        ) : (
                          <p className="text-base sm:text-lg font-medium text-black">
                            {currency}{productData.price}
                          </p>
                        )}
                      </div>
                      {/* Input alanı için sabit genişlik */}
                      <div className=" w-2/6 sm:w-1/6">
                        <input
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value > 0) updateQuantity(item._id, value)
                          }}
                          className="border w-full px-2 py-1 text-center outline-none"
                          type="number"
                          min="1"
                          value={item.quantity}
                        />
                      </div>
                    </div>
                    <img
                      onClick={() => updateQuantity(item._id, 0)}
                      className="w-4 mr-4 sm:w-5 cursor-pointer"
                      src={assets.bin_icon}
                      alt="Sil"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CartTotal ve Ödeme Butonu (Mobilde Sabit) */}
      <div className="fixed lg:static bottom-0 left-0 w-full bg-white lg:bg-transparent lg:w-1/3 border-t lg:border-t-0 shadow-lg lg:shadow-none">
        <div className="p-4 lg:p-0">
          {/* CartTotal Bilgileri (Detaylar Açıkken veya Büyük Ekranda Gösterilir) */}
          <div className={`${isDetailsVisible ? 'block' : 'hidden'} lg:block`}>
            <CartTotal
              total={total} // Toplam KDV dahil fiyat
              subtotalExcludingVAT={subtotalExcludingVAT} // KDV hariç fiyat
              vatAmount={vatAmount} // KDV tutarı
              kdvDahil={subtotal} // KDV dahil fiyat (toplam ile aynı)
            />
          </div>

          {/* Ödeme Butonu */}
          <div className="w-full flex justify-between pt-2">
            {/* Toplam Fiyat (Sadece Mobilde ve Detaylar Kapalıyken Gösterilir) */}
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
                <b className="text-sm font-semibold">{currency}{total.toFixed(2)}</b>
              </div>
            )}
            <button
              onClick={() => token ? navigate("/siparis") : setIsDialogOpen(true)}
              className="bg-black text-white text-sm w-1/3 lg:px-2 lg:w-full my-2 lg:my-8 px-8 py-3"
            >
              ÖDEME
            </button>
          </div>
        </div>
      </div>

      {/* Diyalog Kısmı */}
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
                className="bg-black text-white text-sm px-8 py-3"
              >
                Üye Olmadan Devam
              </button>
              <button
                onClick={() => navigate("/giris")}
                className="bg-black text-white text-sm px-8 py-3"
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