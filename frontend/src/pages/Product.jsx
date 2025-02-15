import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaSearchPlus } from "react-icons/fa"; // Büyüteç simgesi

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const Product = () => {
  const { slug } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal açık/kapalı durumu
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Aktif resmin indeksi

  useEffect(() => {
    const product = products.find(item => generateSlug(item.name) === slug);
    if (product) {
      setProductData(product);
      setImage(product.images?.[0] || '/assets/default-image.jpg');
    } else {
      setProductData(null);
    }
  }, [slug, products]);

  if (!productData) {
    return <div className="opacity-0"></div>;
  }

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(productData._id, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1000);
    } else {
      alert("Lütfen geçerli bir miktar girin!");
    }
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % productData.images.length
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? productData.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Images and Details */}
      <div className="flex flex-col lg:flex-row gap-8 p-4">
        {/* Product Images */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 w-full lg:w-1/2">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-scroll gap-2 lg:w-1/5">
            {productData.images?.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-24 h-24 lg:w-full lg:h-24 object-contain cursor-pointer border"
                alt=""
              />
            )) || <p>No images available</p>}
          </div>
          <div className="w-full lg:w-4/5 relative">
            {/* Büyüteç Butonu */}
            <button
              onClick={() => openModal(currentImageIndex)}
              className="absolute top-2 right-2 bg-white bg-opacity-80 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
            >
              <FaSearchPlus className="text-gray-700 text-xl" />
            </button>
            <img
              onClick={() => openModal(currentImageIndex)}
              className="w-full h-auto sm:max-h-96 max-h-80 object-contain cursor-pointer"
              src={image || '/assets/default-image.jpg'}
              alt=""
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>


          {/* Price Section */}
          <div className="flex items-center gap-4 mt-5">
            {productData.newprice > 0 ? (
              <>
                <p className="text-xl text-gray-500 line-through">
                  {currency}
                  {productData.price}
                </p>
                <p className="text-[27px] font-medium text-black">
                  {currency}
                  {productData.newprice}
                </p>
              </>
            ) : (
              <p className="text-[27px] font-medium">
                {currency}
                {productData.price}
              </p>
            )}
          </div>

          <p className="mt-5 text-gray-500">{productData.description}</p>

          {/* Quantity and Add to Cart Button (Desktop) */}
          <div className="hidden lg:flex gap-4 items-center mt-8">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border px-3 py-2 w-16 text-center outline-none"
              style={{ outline: 'none' }} // Odaklanma çerçevesini kaldır
            />
            <button
              onClick={handleAddToCart}
              className={`px-8 py-3 text-sm transition-all duration-500 ${isAdded ? "bg-green-600 text-white animate-slideUp" : "bg-black text-white active:bg-gray-700"
                }`}
            >
              {isAdded ? <IoMdCheckmarkCircleOutline className='w-5 h-5' /> : "SEPETE EKLE"}
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border px-3 py-2 w-16 text-center outline-none"
            />
            <div className="flex flex-col">
              {productData.newprice > 0 ? (
                <>
                  <p className="text-sm text-gray-500 line-through">
                    {currency}
                    {productData.price}
                  </p>
                  <p className="text-lg font-medium text-black">
                    {currency}
                    {productData.newprice}
                  </p>
                </>
              ) : (
                <p className="text-lg font-medium">
                  {currency}
                  {productData.price}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className={`px-8 py-3 text-sm transition-all duration-500 ${isAdded ? "bg-green-600 text-white animate-slideUp" : "bg-black text-white active:bg-gray-700"
              }`}
          >
            {isAdded ? <IoMdCheckmarkCircleOutline className='w-[77px] h-5' /> : "SEPETE EKLE"}
          </button>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-10 p-4">
        <div className="flex">
          <b className="border px-5 py-4 text-sm rounded-t-lg">Açıklama</b>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 rounded-b-lg">
          <p>
            <strong>Çapa Makinesi Yedek Parçaları – Dayanıklı ve Uyumlu Seçenekler</strong>
          </p>
          <p>
            Çapa makineleri için yüksek kaliteli yedek parçalar ile tarımsal veriminizi artırın! Güçlü, dayanıklı ve uzun ömürlü çapa makinesi yedek parçalarımız,
            farklı marka ve modellere tam uyum sağlar. Motor aksamından bıçaklara, kayışlardan dişlilere kadar ihtiyacınız olan tüm parçaları en uygun fiyatlarla sunuyoruz.
          </p>
          <p>
            Çapa makinenizin performansını korumak ve kesintisiz çalışmasını sağlamak için orijinal ve uyumlu yedek parçalar tercih edin.
          </p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

      {/* Full-Screen Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-700 text-3xl z-50"
            >
              <IoClose />
            </button>

            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Previous Button (Sadece birden fazla resim varsa göster) */}
              {productData.images.length > 1 && (
                <button
                  onClick={handlePrevImage}
                  className="absolute left-0 sm:left-4 text-gray-700 text-2xl bg-transparent   p-2  hover:bg-opacity-100 transition-all z-50"
                >
                  <FaChevronLeft />
                </button>
              )}

              {/* Image */}
              <img
                src={productData.images[currentImageIndex]}
                className="max-w-full max-h-[80vh] object-contain"
                alt=""
              />

              {/* Next Button (Sadece birden fazla resim varsa göster) */}
              {productData.images.length > 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-0 sm:right-4 text-gray-700 text-2xl bg-transparent   p-2  hover:bg-opacity-100 transition-all z-50"
                >
                  <FaChevronRight />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;