import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const bestProduct = products.filter((item) => item.bestseller);
        setBestSeller(bestProduct.slice(0, 15)); 
    }, [products]);

    return (
        <div className='my-10 relative'>
            <div className='text-center text-3xl py-8'>
                <Title text1={"ÇOK"} text2={"SATANLAR"} />
            </div>

            {/* Swiper ile Ürünleri Göster */}
            <Swiper
                key={bestSeller.length} 
                modules={[Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={2}
                pagination={{
                    clickable: true,
                    el: '.custom-swiper-pagination',
                }}
                autoplay={{
                    delay: 3000, 
                    disableOnInteraction: false,
                }}
                loop={true}
                initialSlide={0} 
                breakpoints={{
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1280: { slidesPerView: 6 },
                }}
            >
                {/* Pagination için div ekleyin */}
                <div className="custom-swiper-pagination" />

                {bestSeller.map((item, index) => (
                    <SwiperSlide key={index}>
                        <ProductItem
                            id={item._id}
                            images={item.images}
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

export default BestSeller;