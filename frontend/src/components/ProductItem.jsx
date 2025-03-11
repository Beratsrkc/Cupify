import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

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

// Fiyat formatlama fonksiyonu
const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const ProductItem = ({ id, images = [], name, sizes, quantities, coverOptions }) => {
  const { currency } = useContext(ShopContext);
  const imageUrl = images?.[0] || '/assets/default-image.jpg';

  // Fiyat aralığını hesapla
  const calculatePriceRange = () => {
    if (!sizes || !quantities) return { minPrice: 0, maxPrice: 0 };
  
    let minPrice = Infinity;
    let maxPrice = 0;
  
    sizes.forEach(size => {
      quantities.forEach(quantity => {
        const basePrice = size.price * quantity.label;
        const coverPriceValue = coverOptions?.price || 0;
  
        // Minimum fiyat (kapak seçeneği olmadan)
        const priceWithoutCover = basePrice;
        if (priceWithoutCover < minPrice) minPrice = priceWithoutCover;
  
        // Maksimum fiyat (kapak seçeneği ile)
        const priceWithCover = basePrice + (coverPriceValue * quantity.label); // Kapak fiyatını adetle çarp
        if (priceWithCover > maxPrice) maxPrice = priceWithCover;
      });
    });
  
    return {
      minPrice: minPrice === Infinity ? 0 : minPrice,
      maxPrice,
    };
  };

  const { minPrice, maxPrice } = calculatePriceRange();

  // Ebat seçeneklerini formatla
  const formatSizes = () => {
    if (!sizes || sizes.length === 0) return "Ebat Seçeneği Yok";
    return sizes.map(size => size.label).join(", ");
  };

  const productSlug = generateSlug(name);

  return (
    <Link
      className='text-gray-700 cursor-pointer relative'
      to={`/product/${productSlug}`}
    >
      <div className='flex flex-col relative'>
        {/* Çapraz Desenli Arka Plan */}
        <div
          className='w-full h-72 border rounded-md overflow-hidden relative'
          style={{
            position: 'relative', // Konumlandırma için gerekli
          }}
        >
          {/* Arka Plan Resmi ve Opaklık Katmanı */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${assets.cupifybackground})`, // assets'ten resmi al
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.5, // Opaklık: %80
              zIndex: 1, // Arka plan resmi için zIndex: 1
            }}
          />
          {/* Ürün görseli */}
          <img
            className='w-full h-full object-contain  hover:scale-110 transition-transform duration-300 relative z-10' // Ürün resmi için zIndex: 10
            src={imageUrl}
            alt={name}
          />
        </div>
        {/* Ürün İsmi */}
        <p className='pt-3 pb-1 text-base text-gray-800'>{name}</p>
        {/* Ebat seçenekleri */}
        <p className='text-sm text-gray-500 pb-1'>{formatSizes()}</p>
        {/* Fiyat */}
        <div className='flex gap-3'>
          {minPrice === maxPrice ? (
            <p className='text-base font-medium text-black'>{currency}{formatPrice(minPrice)}</p>
          ) : (
            <p className='text-base font-medium text-black'>
              {currency}{formatPrice(minPrice)} - {currency}{formatPrice(maxPrice)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;