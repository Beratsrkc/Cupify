import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight, FaSearchPlus } from "react-icons/fa";
import RelatedProducts from "../components/RelatedProducts";
import ProductFeatures from "../components/ProductFeatures";

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
  const { products, currency, addToCart, categories } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPrintingOption, setSelectedPrintingOption] = useState(null);
  const [selectedCoverOption, setSelectedCoverOption] = useState(null);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryPath, setCategoryPath] = useState([]);

  useEffect(() => {
    if (products && products.length > 0 && categories) {
      const product = products.find((item) => {
        const itemSlug = generateSlug(item.name);
        return itemSlug === slug;
      });

      if (product) {
        setProductData(product);
        setSelectedSize(product.sizes?.[0] || null);
        setSelectedPrintingOption(product.printingOptions?.[0] || null);
        setSelectedCoverOption(product.coverOptions?.colors?.[0] || null);
        setSelectedQuantity(product.quantities?.[0] || null);
        
        // Find category path
        const findCategoryPath = (categoryId, path = []) => {
          const category = categories.find(cat => cat._id === categoryId);
          if (!category) return path;
          
          const newPath = [{name: category.name, slug: generateSlug(category.name), _id: category._id}, ...path];
          
          if (category.parentId) {
            return findCategoryPath(category.parentId, newPath);
          }
          return newPath;
        };
        
        if (product.categoryId) {
          setCategoryPath(findCategoryPath(product.categoryId));
        }
      }
      setLoading(false);
    }
  }, [slug, products, categories]);

  const calculatePrice = useMemo(() => {
    if (!selectedSize || !selectedQuantity) return 0;

    let price = selectedSize.price * selectedQuantity.label;
    price = price * (1 - (selectedQuantity.discount || 0) / 100);

    if (selectedPrintingOption?.price) {
      price += selectedPrintingOption.price * selectedQuantity.label;
    }

    if (
      selectedCoverOption &&
      selectedCoverOption !== "Yok" &&
      productData?.coverOptions?.price
    ) {
      price += productData.coverOptions.price * selectedQuantity.label;
    }

    return price;
  }, [
    selectedSize,
    selectedQuantity,
    selectedPrintingOption,
    selectedCoverOption,
    productData,
  ]);

  const totalPrice = useMemo(() => {
    return calculatePrice * cartQuantity;
  }, [calculatePrice, cartQuantity]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedQuantity) {
      alert("Lütfen geçerli bir miktar ve ebat seçin!");
      return;
    }

    const cartItem = {
      id: productData._id,
      name: productData.name,
      selectedQuantity: selectedQuantity,
      quantity: cartQuantity,
      selectedSize,
      selectedPrintingOption,
      selectedCoverOption,
      coverPrice: productData?.coverOptions?.price || 0,
      discount: selectedQuantity.discount || 0,
      basePrice: selectedSize.price,
      image: productData.images?.[0],
    };

    addToCart(cartItem);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % productData.images.length
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? productData.images.length - 1 : prevIndex - 1
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orangeBrand"></div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Ürün bulunamadı</h2>
          <p className="text-gray-600 mt-2">Lütfen geçerli bir ürün seçiniz</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 pb-20 lg:pb-4">
        {/* Category Breadcrumb */}
        {categoryPath.length > 0 && (
          <div className="text-sm breadcrumbs mb-4">
            <ul>
              <li>
                <Link to="/">Anasayfa</Link>
              </li>
              {categoryPath.map((category, index) => (
                <li key={category._id}>
                  {index === categoryPath.length - 1 ? (
                    <span className="text-orangeBrand">{category.name}</span>
                  ) : (
                    <Link to={`/kategori/${category.slug}`}>{category.name}</Link>
                  )}
                </li>
              ))}
              <li>
                <span className="text-gray-600">{productData.name}</span>
              </li>
            </ul>
          </div>
        )}

        {!productData.inStock && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p className="font-bold">Ürün Stokta Yok</p>
            <p>Bu ürün şu anda stokta bulunmamaktadır.</p>
          </div>
        )}

        <div className={`flex flex-col lg:flex-row gap-8 bg-white py-6 rounded-sm ${
          !productData.inStock ? 'opacity-70 pointer-events-none' : ''
        }`}>
          {/* Product Images */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 w-full lg:w-1/2">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-scroll gap-3 lg:w-1/5">
              {productData.images?.map((item, index) => (
                <img
                  onClick={() => setCurrentImageIndex(index)}
                  src={item}
                  key={index}
                  className={`w-24 h-24 lg:w-full lg:h-[103.5px] object-cover cursor-pointer border rounded-sm transition-all ${
                    currentImageIndex === index ? "ring-2 ring-orangeBrand" : ""
                  }`}
                  alt=""
                />
              ))}
            </div>
            <div className="w-full lg:w-4/5 relative">
              <button
                onClick={() => openModal(currentImageIndex)}
                className="absolute top-2 right-2 bg-white bg-opacity-80 p-2 rounded-sm hover:bg-opacity-100 transition-all shadow-md"
              >
                <FaSearchPlus className="text-gray-700 text-xl" />
              </button>
              <img
                onClick={() => openModal(currentImageIndex)}
                className="w-full h-auto sm:max-h-[450px] max-h-80 object-contain cursor-pointer rounded-sm bg-slate-100"
                src={
                  productData.images?.[currentImageIndex] ||
                  "/assets/default-image.jpg"
                }
                alt={productData.name}
              />
            </div>
          </div>

          {/* Product Details kısmı */}
<div className="w-full lg:w-1/2">
  <h1 className="font-semibold text-3xl text-black">
    {productData.name}
  </h1>

  {productData.inStock ? (
    <>
      {/* Price Section - Sadece stokta varsa göster */}
      <div className="mt-5 space-y-1">
        {selectedQuantity?.discount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 line-through">
              {currency}
              {formatPrice(selectedSize?.price * selectedQuantity.label)}
            </span>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
              %{selectedQuantity.discount} İNDİRİM
            </span>
          </div>
        )}
        <p className="text-[27px] font-bold text-black">
          {currency}
          {formatPrice(calculatePrice)}
        </p>
        {selectedCoverOption && selectedCoverOption !== "Yok" && (
          <p className="text-sm text-gray-600">
            Kapaklı Fiyat: {currency}
            {formatPrice(calculatePrice)}
          </p>
        )}
      </div>

      {/* Tüm seçenekler sadece stokta varsa gösteriliyor */}
      <div className="mt-6 space-y-6">
        {productData.sizes?.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <p className="font-medium text-black w-32">Ebat Seçimi:</p>
            <div className="flex flex-wrap gap-2">
              {productData.sizes.map((size) => (
                <button
                  key={size._id}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border text-sm rounded-sm transition-all ${
                    selectedSize?._id === size._id
                      ? "bg-orangeBrand text-white border-orangeBrand"
                      : "text-black hover:bg-gray-100 hover:border-orangeBrand"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {productData.quantities?.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <p className="font-medium text-black w-32">Sipariş Miktarı:</p>
            <div className="flex flex-wrap gap-2">
              {productData.quantities.map((qty) => (
                <button
                  key={qty._id}
                  onClick={() => setSelectedQuantity(qty)}
                  className={`px-4 py-2 border text-sm rounded-sm transition-all ${
                    selectedQuantity?._id === qty._id
                      ? "bg-orangeBrand text-white border-orangeBrand"
                      : "text-black hover:bg-gray-100 hover:border-orangeBrand"
                  }`}
                  title={qty.discount > 0 ? `%${qty.discount} indirim` : ""}
                >
                  {qty.label} Adet
                  {qty.discount > 0 && ` (%${qty.discount})`}
                </button>
              ))}
            </div>
          </div>
        )}

        {productData.printingOptions?.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <p className="font-medium text-black w-32">Baskı Seçeneği:</p>
            <div className="flex flex-wrap gap-2">
              {productData.printingOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPrintingOption(option)}
                  className={`px-4 py-2 border text-sm rounded-sm transition-all ${
                    selectedPrintingOption?.label === option.label
                      ? "bg-orangeBrand text-white border-orangeBrand"
                      : "text-black hover:bg-gray-100 hover:border-orangeBrand"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {productData.coverOptions?.colors?.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <p className="font-medium text-black w-32">Kapak Seçeneği:</p>
            <div className="flex flex-wrap gap-2">
              {productData.coverOptions.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedCoverOption(color)}
                  className={`px-4 py-2 border text-sm rounded-sm transition-all ${
                    selectedCoverOption === color
                      ? "bg-orangeBrand text-white border-orangeBrand"
                      : "text-black hover:bg-gray-100 hover:border-orangeBrand"
                  }`}
                >
                  {color}
                </button>
              ))}
              <button
                onClick={() => setSelectedCoverOption("Yok")}
                className={`px-4 py-2 border text-sm rounded-sm transition-all ${
                  selectedCoverOption === "Yok"
                    ? "bg-orangeBrand text-white border-orangeBrand"
                    : "text-black hover:bg-gray-100 hover:border-orangeBrand"
                }`}
              >
                Yok
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sepete ekle butonu (sadece stokta varsa) */}
      <div className="hidden lg:flex gap-4 items-center mt-8">
        <input
          type="number"
          min="1"
          value={cartQuantity}
          onChange={(e) => {
            const value = Math.max(1, Number(e.target.value));
            setCartQuantity(value);
          }}
          className="border border-gray-300 px-3 py-2 w-24 text-center outline-none rounded-sm focus:border-orangeBrand"
        />
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`px-8 py-3 text-sm transition-all duration-300 ${
            isAdded
              ? "bg-green-600 text-white"
              : "bg-orangeBrand text-white hover:bg-orangeBrandDark"
          } rounded-sm flex items-center justify-center min-w-[150px]`}
        >
          {isAdded ? (
            <>
              <IoMdCheckmarkCircleOutline className="mr-2" />
              EKLENDİ
            </>
          ) : (
            "SEPETE EKLE"
          )}
        </button>
      </div>
    </>
  ) : (
    <div className="mt-6">
      <p className="text-red-600 font-medium">Bu ürün şu anda stokta bulunmamaktadır</p>
      <p className="text-gray-600 mt-2">Stok durumu hakkında bilgi almak için bizimle iletişime geçebilirsiniz.</p>
    </div>
  )}
</div>

{/* Mobile sepete ekle butonu (sadece stokta varsa) */}
{productData.inStock && (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 shadow-lg">
    <div className="flex items-center justify-between gap-4">
      <input
        type="number"
        min="1"
        value={cartQuantity}
        onChange={(e) => {
          const value = Math.max(1, Number(e.target.value));
          setCartQuantity(value);
        }}
        className="border border-gray-300 px-3 py-2 w-20 text-center outline-none rounded-sm focus:border-orangeBrand"
      />
      <button
        onClick={handleAddToCart}
        disabled={isAdded}
        className={`px-4 py-3 text-sm flex-1 transition-all ${
          isAdded
            ? "bg-green-600 text-white"
            : "bg-orangeBrand text-white hover:bg-orangeBrandDark"
        } rounded-sm`}
      >
        {isAdded
          ? "EKLENDİ"
          : `SEPETE EKLE (${currency}${formatPrice(totalPrice)})`}
      </button>
    </div>
  </div>
)}
        </div>

        {/* Fixed Bottom Bar for Mobile */}
        {productData.inStock && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <input
              type="number"
              min="1"
              value={cartQuantity}
              onChange={(e) => {
                const value = Math.max(1, Number(e.target.value));
                setCartQuantity(value);
              }}
              className="border border-gray-300 px-3 py-2 w-20 text-center outline-none rounded-sm focus:border-orangeBrand"
            />
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`px-4 py-3 text-sm flex-1 transition-all ${
                isAdded
                  ? "bg-green-600 text-white"
                  : "bg-orangeBrand text-white hover:bg-orangeBrandDark"
              } rounded-sm`}
            >
              {isAdded
                ? "EKLENDİ"
                : `SEPETE EKLE (${currency}${formatPrice(totalPrice)})`}
            </button>
          </div>
        </div>
        )}
        {/* Product Description */}
        <div className="mt-10 bg-white rounded-sm border">
          <div className="border-b px-5 py-4 bg-gray-50">
            <h2 className="font-semibold text-black">Açıklama</h2>
          </div>
          <div className="px-5 py-6 text-gray-700">
            <p>{productData.description}</p>
          </div>
        </div>

        {/* Full-Screen Image Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-6xl max-h-[90vh]">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white text-3xl z-50 hover:text-orangeBrand transition-colors"
              >
                <IoClose />
              </button>
              <div className="relative w-full h-full flex items-center justify-center">
                {productData.images.length > 1 && (
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 text-white text-2xl z-50 hover:text-orangeBrand transition-colors"
                  >
                    <FaChevronLeft size={28} />
                  </button>
                )}
                <img
                  src={productData.images[currentImageIndex]}
                  className="max-w-full max-h-[80vh] object-contain"
                  alt={productData.name}
                />
                {productData.images.length > 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 text-white text-2xl z-50 hover:text-orangeBrand transition-colors"
                  >
                    <FaChevronRight size={28} />
                  </button>
                )}
              </div>
              <div className="text-center mt-4 text-white">
                {currentImageIndex + 1} / {productData.images.length}
              </div>
            </div>
          </div>
        )}
      </div>

      <ProductFeatures />
      <RelatedProducts currentProduct={productData} products={products} />
    </div>
  );
};

export default Product;