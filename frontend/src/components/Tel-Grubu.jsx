import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'swiper/css/autoplay';
import 'swiper/css';
import 'swiper/css/pagination';

const TelGrubu = () => {
    const { products } = useContext(ShopContext);
    const [telGrubuProducts, setTelGrubuProducts] = useState([]);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredProducts = products.filter(item => item.category === 'Tel-Grubu');
        setTelGrubuProducts(filteredProducts.slice(0, 15));
    }, [products]);

    const handleSeeAllClick = () => {
        navigate('/urunler?category=Tel-Grubu');
    };

    return (
        <div className='my-10 relative'>
            <div className='my-10'>
                <div className='flex justify-between items-center text-3xl py-2'>
                    <Title text1={"TEL"} text2={"GRUBU"} />

                    {/* TÜMÜNÜ GÖR ve Gezinme Butonları */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSeeAllClick}
                            className="text-xs sm:text-sm md:text-base text-black cursor-pointer px-3 py-1 sm:px-4 sm:py-2 text-center rounded-md hover:bg-gray-100 transition"
                        >
                            TÜMÜNÜ GÖR
                        </button>

                        {/* Özel Gezinme Butonları */}
                        <div className="flex gap-1">
                            <button
                                onClick={() => swiperInstance?.slidePrev()}
                                className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border border-gray-200 hover:bg-gray-100 transition-all"
                            >
                                <FaChevronLeft className="text-gray-700 text-sm" />
                            </button>
                            <button
                                onClick={() => swiperInstance?.slideNext()}
                                className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border border-gray-200 hover:bg-gray-100 transition-all"
                            >
                                <FaChevronRight className="text-gray-700 text-sm" />
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="border-t-2 border-gray-300" />
            </div>

            {/* Swiper */}
            <Swiper
                key={telGrubuProducts.length}
                onSwiper={setSwiperInstance}
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
                breakpoints={{
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1280: { slidesPerView: 6 },
                }}
            >
                <div className="custom-swiper-pagination" />

                {telGrubuProducts.map((item, index) => (
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

export default TelGrubu;