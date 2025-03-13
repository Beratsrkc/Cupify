import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {
  const { backendUrl, token, currency, products, navigate } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fiyat formatlama fonksiyonu
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // KDV dahil fiyat hesaplama fonksiyonu
  const calculateTotalWithVAT = (price) => {
    const vatRate = 0.20; // KDV oranı (%20)
    const totalWithVAT = price * (1 + vatRate);
    return totalWithVAT;
  };

  const loadOrderData = async () => {
    if (!token) return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const groupedOrders = response.data.orders.map((order) => {
          return {
            _id: order._id,
            status: order.status,
            payment: order.payment,
            date: order.date,
            address: order.address,
            items: order.items.map((item) => {
              const productData = products.find((product) =>
                String(product.name) === String(item.name) ||
                product.price === item.price
              );

              return {
                ...item,
                image: productData?.images?.[0] || '/default-image.png',
              };
            }),
          };
        });

        setOrderData(groupedOrders.reverse());
      } else {
        setError('Sipariş verileri alınırken bir hata oluştu.');
      }
    } catch (err) {
      setError('Veri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      loadOrderData();
    }
  }, [token, products]);

  return (
    <div className="border-t pt-16">
      {/* Başlık */}
      <div className="text-2xl mb-3">
        <Title text1="SİPARİŞLERİM" />
      </div>

      {/* Yükleme ve Hata Durumları */}
      {loading && <p className="text-center text-gray-600">Yükleniyor...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Sipariş Listesi */}
      <div>
        {orderData.length > 0 ? (
          <>
            {orderData.map((order, index) => (
              <div
                key={order._id}
                className="py-4 border-t border-b text-gray-700 grid gap-4"
              >
                {/* Sipariş Bilgileri */}
                <div className="text-sm text-gray-700 sm:flex justify-between gap-3">
                  <div>
                    <span className="font-medium">Tarih:</span>{' '}
                    <span className="text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Teslimat Adresi:</span>{' '}
                    {order.address}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-sm md:text-base">{order.status}</p>
                  </div>
                </div>

                {/* Sipariş İçindeki Ürünler */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.items.map((item, idx) => {
                    const productData = products.find((product) =>
                      String(product.name) === String(item.name) ||
                      product.price === item.price
                    );
                    const productImage = productData?.images?.[0] || '/default-image.png';
                    const finalPrice = item.price;
                    const totalWithVAT = calculateTotalWithVAT(finalPrice);

                    return (
                      <div key={idx} className="flex flex-col gap-4 p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={productImage}
                            className="w-16 h-16 object-cover"
                            alt={item.name || 'Ürün görseli'}
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-700">
                              Fiyat: {currency}{formatPrice(finalPrice)}
                            </p>
                            <p className="text-gray-700">
                              KDV Dahil Fiyat: {currency}{formatPrice(totalWithVAT)}
                            </p>
                            <p className="text-gray-700">Adet: {item.quantity}</p>
                          </div>
                        </div>

                        {/* Ek Detaylar */}
                        <div className="text-sm text-gray-700">
                          {item.kapak && (
                            <p>
                              <span className="font-medium">Kapak:</span> {item.kapak}
                            </p>
                          )}
                          {item.size && (
                            <p>
                              <span className="font-medium">Ebat:</span> {item.size}
                            </p>
                          )}
                          {item.selectedQuantity && (
                            <p>
                              <span className="font-medium">Sipariş Adeti:</span> {item.selectedQuantity}
                            </p>
                          )}
                          {item.baski && (
                            <p>
                              <span className="font-medium">Baskı:</span> {item.baski}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        ) : (
          !loading && <p className="text-center text-gray-600">Henüz sipariş bulunmamaktadır.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;