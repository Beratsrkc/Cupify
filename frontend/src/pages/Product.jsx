import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaSearchPlus } from "react-icons/fa";
import RelatedProducts from '../components/RelatedProducts';

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
  const [quantity, setQuantity] = useState(1000);
  const [isAdded, setIsAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPrintingOption, setSelectedPrintingOption] = useState(null);
  const [selectedCoverOption, setSelectedCoverOption] = useState(null);
  const [coverPrice, setCoverPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(1);

  useEffect(() => {
    const product = products.find(item => generateSlug(item.name) === slug);
    if (product) {
      setProductData(product);
      setImage(product.images?.[0] || '/assets/default-image.jpg');
      setSelectedSize(product.sizes?.[0] || { price: 0 }); // Varsayılan değer
      setSelectedPrintingOption(product.printingOptions?.[0] || "");
      setSelectedCoverOption(product.coverOptions?.colors?.[0] || null);
      setCoverPrice(product.coverOptions?.price || 0);
      setQuantity(product.quantities?.[0]?.label || 1000);
      setTotalPrice((product.sizes?.[0]?.price || 0) * (product.quantities?.[0]?.multiplier || 1));
    } else {
      setProductData(null);
    }
  }, [slug, products]);

  useEffect(() => {
    if (selectedSize) {
      let price = selectedSize.price * quantity;
      if (selectedCoverOption && selectedCoverOption !== "Yok") {
        // Kapak fiyatını seçilen adetle çarp ve toplam fiyata ekle
        price += coverPrice * quantity;
      }
      console.log("Calculated Total Price:", price); // Konsola yazdır
      setTotalPrice(price);
    }
  }, [selectedSize, quantity, selectedCoverOption, coverPrice]);

  if (!productData) {
    return <div className="min-h-screen flex items-center justify-center">Ürün yükleniyor...</div>;
  }

  const handleAddToCart = () => {
    if (quantity > 0 && selectedSize && selectedPrintingOption) {
      const cartItem = {
        id: productData._id,
        name: productData.name,
        selectedQuantity: quantity,
        quantity: cartQuantity,
        selectedSize,
        selectedPrintingOption,
        selectedCoverOption,
        totalPrice: totalPrice * cartQuantity,
        image: productData.images?.[0],
      };
      console.log(cartItem);

      addToCart(cartItem);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1000);
    } else {
      alert("Lütfen geçerli bir miktar, ebat ve baskı seçeneği girin!");
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

  // Fiyat formatlama fonksiyonu
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      {/* Product Images and Details */}
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-8 bg-white py-6 rounded-sm">
          {/* Product Images */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 w-full lg:w-1/2">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-scroll gap-3 lg:w-1/5">
              {productData.images?.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  className="w-24 h-24 lg:w-full lg:h-[103.5px] object-cover cursor-pointer border rounded-sm transition-all"
                  alt=""
                />
              )) || <p>No images available</p>}
            </div>
            <div className="w-full lg:w-4/5 relative">
              <button
                onClick={() => openModal(currentImageIndex)}
                className="absolute top-2 right-2 bg-transparent bg-opacity-80 p-2 rounded-sm hover:bg-opacity-100 transition-all"
              >
                <FaSearchPlus className="text-gray-700 text-xl " />
              </button>
              <img
                onClick={() => openModal(currentImageIndex)}
                className="w-full h-auto sm:max-h-[450px] max-h-80 object-contain cursor-pointer rounded-sm bg-slate-200"
                src={image || '/assets/default-image.jpg'}
                alt=""
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-1/2">
            <h1 className="font-semibold text-3xl text-black ">{productData.name}</h1>

            {/* Price Section */}
            <div className="flex items-center gap-4 mt-5">
              <p className="text-[27px] font-bold text-black">
                {currency}
                {formatPrice(totalPrice)} {/* Fiyatı formatla */}
              </p>
            </div>

            <div className=" mt-6 space-y-6">
              {/* Size Selection */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <p className="font-medium text-black w-32">Ebat Seçimi:</p>
                <div className="flex flex-wrap gap-2">
                  {productData.sizes?.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border text-black text-sm rounded-sm hover:bg-gray-100 hover:border-red-600 transition-all${selectedSize?._id === size._id ? " button-color" : ""
                        }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <p className="font-medium text-black w-32">Sipariş Miktarı:</p>
                <div className="flex flex-wrap gap-2">
                  {productData.quantities?.map((qty, index) => (
                    <button
                      key={index}
                      onClick={() => setQuantity(qty.label)}
                      className={`px-4 py-2 border text-black text-sm rounded-sm hover:bg-gray-100 hover:border-red-600 transition-all ${quantity === qty.label ? "button-color" : ""
                        }`}
                    >
                      {qty.label} Adet
                    </button>
                  ))}
                </div>
              </div>

              {/* Printing Options Selection */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <p className="font-medium text-black w-32">Baskı Seçeneği:</p>
                <div className="flex flex-wrap gap-2">
                  {productData.printingOptions?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPrintingOption(option)}
                      className={`px-4 py-2 border  text-black text-sm rounded-sm hover:bg-gray-100 hover:border-red-600 transition-all ${selectedPrintingOption === option ? "button-color" : ""
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Options Selection */}
              {productData.coverOptions?.colors?.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <p className="font-medium text-black w-32">Kapak Seçeneği:</p>
                  <div className="flex flex-wrap gap-2">
                    {productData.coverOptions.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedCoverOption(color);
                          setCoverPrice(productData.coverOptions.price);
                        }}
                        className={`px-4 py-2 border  text-black text-sm rounded-sm hover:bg-gray-100 hover:border-red-600 transition-all ${selectedCoverOption === color ? "button-color" : ""
                          }`}
                      >
                        {color}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setSelectedCoverOption("Yok");
                        setCoverPrice(0);
                      }}
                      className={`px-4 py-2 border  text-black text-sm rounded-sm hover:bg-gray-200 hover:border-red-600 transition-all ${selectedCoverOption === "Yok" ? "bg-gray-100 border-red-600 text-black" : ""
                        }`}
                    >
                      Yok
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart Button (Desktop) */}
            <div className="hidden lg:flex gap-4 items-center mt-8">
              <input
                type="number"
                min="1"
                value={cartQuantity}
                onChange={(e) => setCartQuantity(Number(e.target.value))}
                className="border border-gray-500 px-3 py-2 w-24 text-center outline-none rounded-sm"
              />
              <button
                onClick={handleAddToCart}
                className={`px-8 py-3 text-sm transition-all duration-500 ${isAdded
                    ? "bg-green-600 text-white animate-slideUp"
                    : "bg-red-600 text-white hover:bg-red-700"
                  } rounded-sm`}
              >
                {isAdded ? <IoMdCheckmarkCircleOutline className='w-[77px] h-5' /> : "SEPETE EKLE"}
              </button>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Bar for Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                value={cartQuantity}
                onChange={(e) => setCartQuantity(Number(e.target.value))}
                className="border border-gray-500 px-3 py-2 w-24 text-center outline-none rounded-sm"
              />
            </div>
            <button
              onClick={handleAddToCart}
              className={`px-8 py-3 text-sm transition-all duration-500 ${isAdded
                ? "bg-green-600 text-white animate-slideUp"
                : "bg-red-600 text-white hover:bg-red-700"
                } rounded-sm`}
            >
              {isAdded ? <IoMdCheckmarkCircleOutline className='w-[77px] h-5' /> : "SEPETE EKLE"}
            </button>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-10 bg-white rounded-sm">
          <div className="flex">
            <b className="border px-5 py-4 text-sm bg-gray-100 text-black rounded-t-xs">Açıklama</b>
          </div>
          <div className="flex flex-col gap-4 border px-4 py-6 text-sm text-black rounded-b-xs">
            <p>{productData.description}</p>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

        {/* Full-Screen Image Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative bg-white max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-sm">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-700 text-3xl z-50"
              >
                <IoClose />
              </button>
              <div className="relative w-full h-full flex items-center justify-center">
                {productData.images.length > 1 && (
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-0 sm:left-4 text-gray-700 text-2xl bg-transparent p-2 hover:bg-opacity-100 transition-all z-50"
                  >
                    <FaChevronLeft />
                  </button>
                )}
                <img
                  src={productData.images[currentImageIndex]}
                  className="max-w-full max-h-[80vh] object-contain"
                  alt=""
                />
                {productData.images.length > 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-0 sm:right-4 text-gray-700 text-2xl bg-transparent p-2 hover:bg-opacity-100 transition-all z-50"
                  >
                    <FaChevronRight />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;