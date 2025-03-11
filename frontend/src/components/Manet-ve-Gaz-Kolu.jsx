import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const CategoryProductPage = () => {
  const { products, isLoading } = useContext(ShopContext); // ShopContext'ten ürünleri ve yükleme durumunu al
  const [categoryProducts, setCategoryProducts] = useState([]);
  const categoryId = '67b12a9e9c5c67ea52545c93'; // Sabit kategori ID'si

  // Kategoriye göre ürünleri filtrele
  useEffect(() => {
    if (!isLoading && products.length > 0) {
      const filtered = products.filter((product) => {
        // Eğer category bir obje ise:
        if (typeof product.category === 'object' && product.category !== null) {
          return product.category._id === categoryId;
        }
        // Eğer category bir string ise:
        return product.category === categoryId;
      });
      setCategoryProducts(filtered);
      console.log("Filtrelenmiş Ürünler:", filtered); // Hata ayıklama için
    }
  }, [products, isLoading]);

  // Kategori resmi ve adı
  const categoryImage = assets.bardakresim3; // Kategori resmi
  const categoryName = 'Ambalaj Ürünleri'; // Kategori adı

  // Eğer veriler henüz yüklenmemişse yükleme durumu göster
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="my-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">{categoryName}</h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Taraf: Kategori Resmi */}
        <div className="md:w-1/3">
          <img
            src={categoryImage}
            alt={categoryName}
            className="w-full h-auto"
          />
        </div>

        {/* Sağ Taraf: Ürün Listesi */}
        <div className="md:w-2/3">
          <h3 className="text-xl font-semibold mb-4">Ürünler</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white"
              >
                <img
                  src={product.images[0]} // Ürün resmi
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2">
                  <h4 className="text-lg font-medium">{product.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductPage;