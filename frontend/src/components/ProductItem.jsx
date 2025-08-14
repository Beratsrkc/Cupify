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

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const ProductItem = ({ id, images = [], name, sizes, quantities, coverOptions }) => {
  const { currency } = useContext(ShopContext);
  const imageUrl = images?.[0] || '/assets/default-image.jpg';

  // En iyi indirimi bul
  const findBestDiscount = () => {
    if (!quantities) return 0;
    return Math.max(...quantities.map(q => q.discount || 0));
  };

  // Fiyat aralığını hesapla (indirimleri de dikkate alarak)
  const calculatePriceRange = () => {
    if (!sizes || !quantities) return { minPrice: 0, maxPrice: 0 };
  
    let minPrice = Infinity;
    let maxPrice = 0;
  
    sizes.forEach(size => {
      quantities.forEach(quantity => {
        // İndirimli fiyatı hesapla
        const discountedPrice = size.price * quantity.label * (1 - (quantity.discount || 0) / 100);
        const coverPriceValue = coverOptions?.price || 0;
  
        // Minimum fiyat (kapak seçeneği olmadan)
        if (discountedPrice < minPrice) minPrice = discountedPrice;
  
        // Maksimum fiyat (kapak seçeneği ile)
        const priceWithCover = discountedPrice + (coverPriceValue * quantity.label);
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
    if (!sizes || sizes.length === 0) return "Ebat Seçeneği Yok";
    return sizes.map(size => size.label).join(", ");
  };

  const productSlug = generateSlug(name);

  return (
    <Link
      className='text-gray-700 cursor-pointer relative group'
      to={`/product/${productSlug}`}
    >
      <div className='flex flex-col relative'>
        {/* İndirim etiketi */}
        {bestDiscount > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-20">
            %{bestDiscount} İNDİRİM
          </div>
        )}

        <div className='w-full h-72 border rounded-md overflow-hidden relative'>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${assets.cupifybackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.5,
              zIndex: 1,
            }}
          />
          <img
            className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 relative z-10'
            src={imageUrl}
            alt={name}
            loading="lazy"
          />
        </div>
        
        <p className='pt-3 pb-1 text-base text-gray-800'>{name}</p>
        <p className='text-sm text-gray-500 pb-1'>{formatSizes()}</p>
        
        <div className='flex gap-3 items-center'>
          {minPrice === maxPrice ? (
            <p className='text-base font-medium text-black'>
              {currency}{formatPrice(minPrice)}
            </p>
          ) : (
            <div>
              <p className='text-base font-medium text-black'>
                {currency}{formatPrice(minPrice)} - {currency}{formatPrice(maxPrice)}
              </p>
              {bestDiscount > 0 && (
                <p className="text-xs text-gray-500">%{bestDiscount}'e varan indirimler</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;