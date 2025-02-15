import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const fetchAllOrders = async () => {
    if (!token) {
      console.error("Token is missing");
      return;
    }

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        const reversedOrders = response.data.orders.reverse()
        setOrders(reversedOrders)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { Authorization: `Bearer ${token}` } })
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      toast.error(response.data.message);
    }
  }


  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div>
      <h3>Siparişler</h3>
      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="Parcel Icon" />
              <div>
                <div>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => {
                      // Eğer item bir dizi içeriyorsa, onu işleyelim
                      const itemArray = Array.isArray(item) ? item : [item];
                      return itemArray.map((nestedItem, nestedIndex) => (
                        <p className='py-0.5' key={nestedIndex}>{nestedItem.name} : {nestedItem.quantity} Adet</p>
                      ));
                    })
                  ) : (
                    <p>No items found in this order</p>
                  )}
                </div>
                <p className='mt-3 mb-2 font-medium'>{order.name}</p>
                <div>
                  <p>{order.address}</p>
                </div>
                <div>
                  <p>{order.phone}</p>
                </div>
              </div>
              <div>
                <p>Tarih: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{order.amount}{currency}</p>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className='p-2 font-semibold'>
                <option value="Order Placed">Sipariş Verildi</option>
                <option value="Paketleniyor">Paketleniyor</option>
                <option value="Kargoya Verildi">Kargoya Verildi</option>
                <option value="Teslimata Çıktı">Teslimata Çıktı</option>
                <option value="Teslim Edildi">Teslim Edildi</option>

              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders