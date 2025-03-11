import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProduct, setLatestProduct] = useState([]);

    useEffect(() => {
        const reversedProducts = [...products].reverse();
        setLatestProduct(reversedProducts.slice(0, 15));
    }, [products]);

    return (
        <div className='my-10 relative'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'SON'} text2={"EKLENENLER"} />
            </div>

            <Swiper
                key={latestProduct.length}
                modules={[Pagination, Autoplay]}
                spaceBetween={28}
                slidesPerView={1} // Varsayılan olarak 1 slide göster
                initialSlide={0}
                pagination={{
                    clickable: true,
                    el: '.custom-swiper-pagination',
                }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                loop={true}
                breakpoints={{
                    // 0px'den 640px'e kadar 1 slide göster
                    0: { slidesPerView: 1 },
                    // 640px'den 768px'e kadar 2 slide göster
                    455: { slidesPerView: 2 },
                    // 768px'den 1024px'e kadar 3 slide göster
                    690: { slidesPerView: 3 },
                    // 1024px'den 1280px'e kadar 4 slide göster
                    1170: { slidesPerView: 4 },
                }}
            >
                {/* Pagination için div ekleyin */}
                <div className="custom-swiper-pagination" />

                {latestProduct.map((item, index) => (
                    <SwiperSlide key={index}>
                        <ProductItem {...item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default LatestCollection;