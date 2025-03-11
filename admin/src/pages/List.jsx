import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl, currency } from '../App';
import EditModal from '../compoments/EditModal';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // Seçilen ürün
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal açık/kapalı

  // Ürün listesini çek
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

  // Ürün silme işlemi
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

  // Ürün düzenleme modalını aç
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Ürün güncelleme işlemi
  const updateProduct = async (updatedData) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/update',
        { ...updatedData, productId: selectedProduct._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        setIsEditModalOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Component yüklendiğinde ürün listesini çek
  useEffect(() => {
    fetchList();
  }, []);

  // Arama işlemi
  const filteredList = list.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tüm Ürünler</h1>

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
        {/* Masaüstü Görünümü - Tablo Başlığı */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 bg-blue-50 rounded-lg text-sm font-semibold text-gray-700">
          <b>Resim</b>
          <b>İsim</b>
          <b>Kategori</b>
          <b>Alt Kategori</b>
          <b>Çok Satan</b>
          <b>Kapak Fiyatı</b>
          <b>Ebatlar</b>
          <b>Sipariş Adetleri</b>
          <b>Aksiyon</b>
        </div>

        {/* Ürün Listesi */}
        {filteredList.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:grid md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Resim */}
            <div className="flex items-center">
              <img
                className="w-12 h-12 object-cover rounded-lg"
                src={item.images[0]}
                alt={item.name}
              />
            </div>

            {/* İsim */}
            <div className="flex items-center">
              <p className="font-medium">{item.name}</p>
            </div>

            {/* Kategori */}
            <div className="flex items-center">
              <p className="text-gray-600">{item.category?.name || 'Belirtilmemiş'}</p>
            </div>

            {/* Alt Kategori */}
            <div className="flex items-center">
              <p className="text-gray-600">{item.subCategory || 'Belirtilmemiş'}</p>
            </div>

     

            {/* Çok Satan */}
            <div className="flex items-center">
              <p className="text-gray-800">
                {item.bestseller ? 'Evet' : 'Hayır'}
              </p>
            </div>

            {/* Kapak Fiyatı */}
            <div className="flex items-center">
              <p className="text-gray-800">
                {currency}
                {item.coverOptions?.price || 0}
              </p>
            </div>

            {/* Ebatlar */}
            <div className="flex flex-col gap-1">
              {item.sizes.map((size, i) => (
                <p key={i} className="text-gray-600">
                  {size.label}: {currency}
                  {size.price}
                </p>
              ))}
            </div>

            {/* Sipariş Adetleri */}
            <div className="flex flex-col gap-1">
              {item.quantities.map((qty, i) => (
                <p key={i} className="text-gray-600">
                  {qty.label} Adet
                </p>
              ))}
            </div>

            {/* Aksiyon Butonları */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(item)}
                className="text-blue-500 hover:text-blue-700 cursor-pointer text-lg font-bold"
              >
                ✏️
              </button>
              <button
                onClick={() => removeProduct(item._id)}
                className="text-red-500 hover:text-red-700 cursor-pointer text-lg font-bold"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Düzenleme Modalı */}
      {isEditModalOpen && (
        <EditModal
          product={selectedProduct}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={updateProduct}
        />
      )}
    </div>
  );
};

export default List;