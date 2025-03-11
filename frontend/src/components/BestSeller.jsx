import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);
    const [swiperInstance, setSwiperInstance] = useState(null);

    useEffect(() => {
        const bestProduct = products.filter((item) => item.bestseller);
        setBestSeller(bestProduct.slice(0, 15)); 
    }, [products]);

    return (
        <div className='my-10 relative'>
            <div className='my-10'>
                {/* Başlık, Gezinme Butonları ve Tümünü Gör Butonu */}
                <div className='flex justify-between items-center text-3xl py-2'>
                    <Title text1={"ÖNE"} text2={"ÇIKANLAR"} />

                    {/* Gezinme Butonları */}
                    <div className="flex justify-end gap-1 mt-4">
                        <button
                            onClick={() => swiperInstance?.slidePrev()}
                            className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border border-gray-200 hover:bg-gray-100 transition-all"
                        >
                            <FaChevronLeft className="text-red-700 text-sm" />
                        </button>
                        <button
                            onClick={() => swiperInstance?.slideNext()}
                            className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border border-gray-200 hover:bg-gray-100 transition-all"
                        >
                            <FaChevronRight className="text-red-700 text-sm" />
                        </button>
                    </div>
                </div>

                <hr className="border-t-2 border-gray-300" />
            </div>

            {/* Swiper ile Ürünleri Göster */}
            <Swiper
                key={bestSeller.length}
                onSwiper={setSwiperInstance}
                modules={[Pagination, Autoplay]}
                spaceBetween={28} // Slide'lar arası boşluk
                slidesPerView={1} // Varsayılan olarak 1 slide göster
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
                    // 0px'den 455px'e kadar 1 slide göster
                    0: { slidesPerView: 1 },
                    // 455px'den 690px'e kadar 2 slide göster
                    455: { slidesPerView: 2 },
                    // 690px'den 1170px'e kadar 3 slide göster
                    690: { slidesPerView: 3 },
                    // 1170px ve üzeri 4 slide göster
                    1170: { slidesPerView: 4 },
                }}
            >
                {/* Pagination için div ekleyin */}
                <div className="custom-swiper-pagination" />

                {bestSeller.map((item, index) => (
                    <SwiperSlide key={index}>
                        {/* Tüm prop'ları ProductItem'e aktar */}
                        <ProductItem {...item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default BestSeller;