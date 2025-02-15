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

            {/* Swiper ile Ürünleri Göster */}
            <Swiper
                key={latestProduct.length}
                modules={[Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={2}
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
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1280: { slidesPerView: 6 },
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