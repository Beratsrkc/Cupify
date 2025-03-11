import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import { assets } from '../assets/assets';
import Title from './Title';

const CategorySlider = () => {
    const navigate = useNavigate();

    // Sabit kategori verisi
    const categories = [
        {
            _id: '67b12a9e9c5c67ea52545c93',
            name: 'Karton Bardaklar',
            image: assets.bardakresim, // Daha büyük resim
            subCategory: 'kartonbardak',
        },
        {
            _id: '67b12a9e9c5c67ea52545c94',
            name: 'Karton Bardaklar',
            image: assets.bardakresim2,
            subCategory: 'petbardaklar',
        },
        {
            _id: '67b12a9e9c5c67ea52545c95',
            name: 'Döner Box',
            image: assets.bardakresim3,
            subCategory: 'dönerbox',
        },
        {
            _id: '67b12a9e9c5c67ea52545c96',
            name: 'Dondurma Kasesi',
            image: assets.bardakresim4,
            subCategory: 'plastikmalzemeler',
        },
    ];

    // Kategoriye tıklandığında ilgili kategori sayfasına yönlendir
    const handleCategoryClick = (categoryId, subCategory) => {
        navigate(`/urunler?category=${categoryId}&subCategory=${subCategory}`);
    };

    return (
        <div className="my-6 ">
<div className='text-center py-8 text-3xl'>
                <Title text1={'Popüler'} text2={"Kategoriler"} />
            </div>
            <Swiper
                slidesPerView={1} // Mobilde 1 kart göster
                spaceBetween={20}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    640: { slidesPerView: 2 }, // Tablette 2 kart göster
                    1024: { slidesPerView: 4 }, // Masaüstünde 4 kart göster
                }}
                modules={[Autoplay]}
                className="mySwiper"
            >
                {categories.map((category) => (
                    <SwiperSlide key={category._id}>
                        <div
                            className="relative  shadow-lg overflow-hidden cursor-pointer group bg-gray-200 "
                            onClick={() => handleCategoryClick(category._id, category.subCategory)}
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-52 object-contain transform transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-white text-2xl font-bold text-center">
                                    {category.name}
                                </h3>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CategorySlider;