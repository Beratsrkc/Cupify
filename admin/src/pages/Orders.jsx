import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      console.error("Token is missing");
      return;
    }

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        const reversedOrders = response.data.orders.reverse();
        setOrders(reversedOrders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h3 className="text-2xl font-bold mb-6">Siparişler</h3>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4 mb-4">
              <img className="w-12 h-12" src={assets.parcel_icon} alt="Parcel Icon" />
              <div>
                <p className="font-semibold">{order.name}</p>
                <p className="text-sm text-gray-500">{order.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-700 font-medium">Adres:</p>
                <p className="text-gray-600">{order.address || "Adres bilgisi yok"}</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Tarih:</p>
                <p className="text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Toplam Tutar:</p>
                <p className="text-gray-600">{order.amount}{currency}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-700 font-medium">Ürünler:</p>
              {order.items && order.items.length > 0 ? (
                order.items.map((item, itemIndex) => {
                  const itemArray = Array.isArray(item) ? item : [item];
                  return itemArray.map((nestedItem, nestedIndex) => (
                    <div key={`${itemIndex}-${nestedIndex}`} className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{nestedItem.name} - {nestedItem.quantity} Adet</p>
                      {nestedItem.price && <p className="text-gray-600">Fiyat: {nestedItem.price}{currency}</p>}
                      {nestedItem.kapak && <p className="text-gray-600">Kapak: {nestedItem.kapak}</p>}
                      {nestedItem.baski && <p className="text-gray-600">Baskı: {nestedItem.baski}</p>}
                      {nestedItem.selectedQuantity && <p className="text-gray-600">Seçilen Miktar: {nestedItem.selectedQuantity}</p>}
                      {nestedItem.size && <p className="text-gray-600">Boyut: {nestedItem.size}</p>}
                    </div>
                  ));
                })
              ) : (
                <p className="text-gray-600">Bu siparişte ürün bulunamadı.</p>
              )}
            </div>

            <div className="mt-4">
              <p className="text-gray-700 font-medium">Durum:</p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Order Placed">Sipariş Verildi</option>
                <option value="Paketleniyor">Paketleniyor</option>
                <option value="Kargoya Verildi">Kargoya Verildi</option>
                <option value="Teslimata Çıktı">Teslimata Çıktı</option>
                <option value="Teslim Edildi">Teslim Edildi</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;