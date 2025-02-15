import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

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

const ProductItem = ({ id, images = [], name, newprice, price }) => {
  const { currency, addToCart } = useContext(ShopContext);
  const imageUrl = images?.[0] || '/assets/default-image.jpg';
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // İndirim yüzdesini hesapla
  const discountPercentage = newprice > 0
    ? Math.round(((price - newprice) / price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(id, 1);
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 1000);
  };

  const productSlug = generateSlug(name);

  return (
    <Link
      className='text-gray-700 cursor-pointer relative'
      to={`/product/${productSlug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className='flex flex-col items-center relative'>
        <div className='w-full h-56 border rounded-sm overflow-hidden relative'>
          {/* İndirim yüzdesi */}
          {newprice > 0 && (
            <div className='absolute top-0 right-0 bg-black text-white text-xs font-semibold px-2.5 py-2.5 '>
              %{discountPercentage}
            </div>
          )}
          <img
            className='w-full h-full object-contain hover:scale-110 transition-transform duration-300'
            src={imageUrl}
            alt={name}
          />
          <button
            onClick={handleAddToCart}
            className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-8 py-3 rounded-sm text-sm transition-all duration-500 
              ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} 
              ${isAdded ? "bg-green-600 text-white" : "bg-black text-white hover:bg-gray-800"}`}
          >
            {isAdded ? <IoMdCheckmarkCircleOutline className="w-5 h-5 rounded-sm" /> : "Ekle"}
          </button>
        </div>
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <div className='flex gap-3'>
          {newprice > 0 ? (
            <>
              <p className='text-sm font-medium text-gray-400 line-through'>{currency}{price}</p>
              <p className='text-sm font-medium text-black'>{currency}{newprice}</p>
            </>
          ) : (
            <p className='text-sm font-medium text-gray-800'>{currency}{price}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;