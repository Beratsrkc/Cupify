// components/AddImage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../config';

const AddImage = ({ token }) => {
  const [image, setImage] = useState(null); // Yüklenen resim
  const [type, setType] = useState('reference'); // Galeri veya Referans
  const [isLoading, setIsLoading] = useState(false); // Yükleme durumu
  const [imagesList, setImagesList] = useState([]); // Resim listesi

// Resimleri çekme işlemi
const fetchImages = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/images/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // Kimlik bilgilerini gönder
    });
    setImagesList(response.data.images);
  } catch (error) {
    console.error('Resimler yüklenirken hata oluştu:', error);
    toast.error('Resimler yüklenirken bir hata oluştu.');
  }
};

// Resim yükleme işlemi
const handleImageUpload = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  if (!image) {
    toast.error('Lütfen bir resim seçin!');
    setIsLoading(false);
    return;
  }

  try {
    const formData = new FormData();
    formData.append('image', image); // Resmi FormData'ya ekle
    formData.append('type', type); // Galeri veya Referans bilgisi

    // Backend'e resmi gönder
    const response = await axios.post(`${backendUrl}/api/images/add`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // Kimlik bilgilerini gönder
    });

    if (response.data.success) {
      toast.success('Resim başarıyla yüklendi!');
      setImage(null); // Resmi sıfırla
      fetchImages(); // Resim listesini güncelle
    } else {
      toast.error('Resim yüklenirken bir hata oluştu.');
    }
  } catch (error) {
    console.error('Resim yükleme hatası:', error);
    toast.error(error.response?.data?.message || 'Sunucu hatası');
  } finally {
    setIsLoading(false);
  }
};

// Resim silme işlemi
const handleDeleteImage = async (imageId) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/images/remove`,
      { imageId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Kimlik bilgilerini gönder
      }
    );

    if (response.data.success) {
      toast.success('Resim başarıyla silindi!');
      fetchImages(); // Resim listesini güncelle
    } else {
      toast.error('Resim silinirken bir hata oluştu.');
    }
  } catch (error) {
    console.error('Resim silme hatası:', error);
    toast.error(error.response?.data?.message || 'Sunucu hatası');
  }
};

  // Bileşen yüklendiğinde resimleri çek
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Resim Yönetimi</h1>

      {/* Resim Yükleme Formu */}
      <form onSubmit={handleImageUpload} className="flex flex-col gap-4 mb-8">
        <div>
          <p className="mb-2">Resim Yükle</p>
          <label htmlFor="image" className="cursor-pointer">
            <div className="w-48 h-48 border-2 border-dashed border-gray-400 flex items-center justify-center">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Yüklenen Resim"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Resim Seçin</span>
              )}
            </div>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files[0])}
              hidden
              accept="image/*"
            />
          </label>
        </div>

        {/* Galeri veya Referans Seçeneği */}
        <div>
          <p className="mb-2">Resim Türü</p>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full max-w-[200px] px-3 py-2 border rounded"
          >
      
            <option value="reference">Referans</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-28 py-2 bg-black text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Yükleniyor...' : 'YÜKLE'}
        </button>
      </form>

      {/* Resim Listesi */}
      <div>
        <h2 className="text-xl font-bold mb-4">Yüklenen Resimler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagesList.map((img) => (
            <div key={img._id} className="border p-4 rounded-lg shadow-sm">
              <img
                src={img.imageUrl}
                alt="Yüklenen Resim"
                className="w-full h-48 object-cover rounded"
              />
              <p className="mt-2 text-sm text-gray-600">{img.type === 'gallery' ? 'Galeri' : 'Referans'}</p>
              <button
                onClick={() => handleDeleteImage(img._id)}
                className="w-full mt-2 py-1 bg-red-500 text-white rounded hover:bg-orangeBrand"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddImage;