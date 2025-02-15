import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = list.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <p className="text-2xl font-bold mb-4">Tüm Ürünler</p>

      {/* Arama Çubuğu */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* List Table */}
      <div className="flex flex-col gap-4">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 bg-blue-50 rounded-lg text-sm font-semibold text-gray-700">
          <b>Resim</b>
          <b>İsim</b>
          <b>Kategori</b>
          <b>Fiyat</b>
          <b>Kampanyalı Fiyat</b>
          <b>Aksiyon</b>
        </div>

        {/* Product List */}
        {filteredList.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-4 py-3 px-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm"
            key={index}
          >
            <img className="w-12 h-12 object-cover rounded-lg" src={item.images[0]} alt={item.name} />
            <p className="font-medium">{item.name}</p>
            <p className="text-gray-600">{item.category}</p>
            <p className="text-gray-800">
              {currency}
              {item.price}
            </p>
            <p className="text-gray-800">
              {currency}
              {item.newprice || '-'}
            </p>
            <button
              onClick={() => removeProduct(item._id)}
              className="text-red-500 hover:text-red-700 cursor-pointer text-lg font-bold"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;