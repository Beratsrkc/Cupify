import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { AiOutlineReload } from "react-icons/ai";

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

const formatPrice = (price) => {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const ProductItem = React.memo(({
  id,
  images = [],
  name,
  sizes = [],
  quantities = [],
  coverOptions,
}) => {
  const { currency } = useContext(ShopContext);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const imageUrl = images?.[0] || "/assets/placeholder.png";
  const placeholderBackground = {
    backgroundImage: `url(${assets.cupifybackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  // En iyi indirimi bul
  const findBestDiscount = () => {
    if (!quantities.length) return 0;
    return Math.max(...quantities.map((q) => q.discount || 0));
  };

  // Fiyat aralığını hesapla
  const calculatePriceRange = () => {
    if (!sizes.length || !quantities.length) return { minPrice: 0, maxPrice: 0 };

    let minPrice = Infinity;
    let maxPrice = 0;

    sizes.forEach((size) => {
      quantities.forEach((quantity) => {
        const discountedPrice = size.price * quantity.label * (1 - (quantity.discount || 0) / 100);
        const coverPriceValue = coverOptions?.price || 0;

        if (discountedPrice < minPrice) minPrice = discountedPrice;
        
        const priceWithCover = discountedPrice + coverPriceValue * quantity.label;
        if (priceWithCover > maxPrice) maxPrice = priceWithCover;
      });
    });

    return {
      minPrice: minPrice === Infinity ? 0 : minPrice,
      maxPrice,
    };
  };

  const { minPrice, maxPrice } = calculatePriceRange();
  const bestDiscount = findBestDiscount();

  const formatSizes = () => {
    if (!sizes.length) return "Ebat Seçeneği Yok";
    return sizes.map((size) => size.label).join(", ");
  };

  const productSlug = `${generateSlug(name)}-${id}`; // ID ekleyerek benzersiz slug oluştur

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <Link
      className="text-gray-700 cursor-pointer relative group block"
      to={`/product/${productSlug}`}
      aria-label={`${name} ürün detayları`}
    >
      <div className="flex flex-col relative h-full">
        {/* İndirim etiketi */}
        {bestDiscount > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-20">
            %{bestDiscount} İNDİRİM
          </div>
        )}

        {/* Resim Container */}
        <div className="w-full h-72 border rounded-md overflow-hidden relative bg-gray-100">
          {/* Arkaplan ve yükleme efekti */}
          <div 
            className="absolute inset-0 z-0 opacity-50"
            style={placeholderBackground}
          />
          
          {/* Yükleme animasyonu */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <AiOutlineReload className="animate-spin text-gray-400" />
            </div>
          )}

          {/* Resim */}
          <img
            className={`w-full h-full object-contain transition-transform duration-300 relative z-20 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-105`}
            src={imageError ? "/assets/placeholder.png" : imageUrl}
            alt={name}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>

        {/* Ürün Bilgileri */}
        <div className="pt-3 flex-1">
          <h3 className="text-base font-medium text-gray-800 line-clamp-2">{name}</h3>
          <p className="text-sm text-gray-500 mt-1">{formatSizes()}</p>
          
          <div className="mt-2">
            {minPrice === maxPrice ? (
              <p className="text-base font-medium text-black">
                {currency}
                {formatPrice(minPrice)}
              </p>
            ) : (
              <div>
                <p className="text-base font-medium text-black">
                  {currency}
                  {formatPrice(minPrice)} - {currency}
                  {formatPrice(maxPrice)}
                </p>
                {bestDiscount > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    %{bestDiscount}'e varan indirimler
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

export default ProductItem;