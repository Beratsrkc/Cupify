// components/BlogManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const BlogManagement = ({ token }) => {
  const [title, setTitle] = useState(''); // Blog başlığı
  const [image, setImage] = useState(null); // Blog resmi
  const [content, setContent] = useState([{ subtitle: '', text: '' }]); // Blog içeriği (alt başlık ve metin)
  const [isLoading, setIsLoading] = useState(false); // Yükleme durumu
  const [blogsList, setBlogsList] = useState([]); // Blog listesi

  // Blogları çekme işlemi
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogsList(response.data.blogs);
    } catch (error) {
      console.error('Bloglar yüklenirken hata oluştu:', error);
      toast.error('Bloglar yüklenirken bir hata oluştu.');
    }
  };

  // İçerik alanını güncelleme
  const handleContentChange = (index, field, value) => {
    const updatedContent = [...content];
    updatedContent[index][field] = value;
    setContent(updatedContent);
  };

  // Yeni içerik alanı ekleme
  const addContentField = () => {
    setContent([...content, { subtitle: '', text: '' }]);
  };

  // İçerik alanını silme
  const removeContentField = (index) => {
    const updatedContent = content.filter((_, i) => i !== index);
    setContent(updatedContent);
  };

  // Blog ekleme işlemi
  const handleAddBlog = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Alt başlık ve metin alanlarını kontrol et
    if (!title || !image || content.some((item) => !item.subtitle || !item.text)) {
      toast.error('Lütfen tüm alanları doldurun!');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title); // Başlık
      formData.append('image', image); // Resim
      formData.append('content', JSON.stringify(content)); // İçerik (JSON string olarak)

      // Backend'e blogu gönder
      const response = await axios.post(`${backendUrl}/api/blogs/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Blog başarıyla eklendi!');
        setTitle(''); // Başlık alanını sıfırla
        setImage(null); // Resmi sıfırla
        setContent([{ subtitle: '', text: '' }]); // İçerik alanını sıfırla
        fetchBlogs(); // Blog listesini güncelle
      } else {
        toast.error('Blog eklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Blog ekleme hatası:', error);
      toast.error(error.response?.data?.message || 'Sunucu hatası');
    } finally {
      setIsLoading(false);
    }
  };

  // Blog silme işlemi
  const handleDeleteBlog = async (blogId) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/blogs/delete/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success('Blog başarıyla silindi!');
        fetchBlogs(); // Blog listesini güncelle
      } else {
        toast.error('Blog silinirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Blog silme hatası:', error);
      toast.error(error.response?.data?.message || 'Sunucu hatası');
    }
  };

  // Bileşen yüklendiğinde blogları çek
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Blog Yönetimi</h1>

      {/* Blog Ekleme Formu */}
      <form onSubmit={handleAddBlog} className="bg-white p-4 sm:p-6 rounded-md shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Yeni Blog Ekle</h2>

        {/* Başlık Alanı */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Blog Başlığı</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Blog başlığı girin"
            required
          />
        </div>

       
        {/* Resim Alanı */}
        <div>
          <p className="mb-2">Blog Resmi</p>
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
              required
            />
          </label>
        </div>

        {/* İçerik Alanları */}
        {content.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Alt Başlık</label>
              <input
                type="text"
                value={item.subtitle}
                onChange={(e) => handleContentChange(index, 'subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Alt başlık girin"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Metin</label>
              <textarea
                value={item.text}
                onChange={(e) => handleContentChange(index, 'text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Metin girin"
                required
              />
            </div>
            {/* İçerik Sil ve Yeni İçerik Ekle Butonları */}
            <div className="flex gap-4">
              {content.length > 1 && ( // Sadece birden fazla içerik varsa sil butonunu göster
                <button
                  type="button"
                  onClick={() => removeContentField(index)}
                  className="w-1/2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Bu İçeriği Sil
                </button>
              )}
              <button
                type="button"
                onClick={addContentField}
                className="w-1/2 py-2 bg-sky-800 text-white rounded-md hover:bg-sky-950 transition-colors"
              >
                Yeni İçerik Ekle
              </button>
            </div>
          </div>
        ))}

        {/* Blogu Ekle Butonu */}
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors mt-4"
          disabled={isLoading}
        >
          {isLoading ? 'Yükleniyor...' : 'Blogu Ekle'}
        </button>
      </form>

      {/* Blog Listesi */}
      <div className="bg-white p-4 sm:p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Eklenen Bloglar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {blogsList.map((blog) => (
            <div key={blog._id} className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
              <img
                src={blog.image}
                alt="Blog Resmi"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{blog.title}</h3>
                <button
                  onClick={() => handleDeleteBlog(blog._id)}
                  className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Blogu Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;