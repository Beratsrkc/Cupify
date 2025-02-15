import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);
      setRelated(productsCopy.slice(0, 12)); 
    }
  }, [products]);

  return (
    <div className='my-24 relative'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'BENZER'} text2={'ÜRÜNLER'} />
      </div>

      {/* Swiper ile Ürünleri Göster */}
      <Swiper
        key={related.length}
        modules={[Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={2}
        autoplay={{
          delay: 3000, 
          disableOnInteraction: false,
        }}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
      >
        {/* Pagination için div ekleyin */}
        <div className="custom-swiper-pagination" />

        {related.map((item, index) => (
          <SwiperSlide key={index}>
            <ProductItem
              key={index}
              id={item._id}
              images={item.images || [item.image]}
              name={item.name}
              price={item.price}
              newprice={item.newprice}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RelatedProducts;