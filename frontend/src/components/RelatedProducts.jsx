import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import ProductItem from './ProductItem';

const RelatedProducts = ({ currentProduct, products }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        if (currentProduct && products.length > 0) {
            // Aynı kategorideki ve stokta olan ürünleri filtrele
            const filtered = products.filter(item => 
                item.category?._id === currentProduct.category?._id && 
                item._id !== currentProduct._id &&
                item.inStock !== false
            );
            
            // Rastgele 6 ürün seç (veya daha az eğer 6'dan az varsa)
            const shuffled = [...filtered].sort(() => 0.5 - Math.random());
            setRelatedProducts(shuffled.slice(0, 6));
        }
    }, [products, currentProduct]);

    // Eğer ilgili ürün yoksa bileşeni gösterme
    if (!relatedProducts || relatedProducts.length === 0) {
        return null;
    }

    return (
        <section className='py-12 container mx-auto'>
            <div className='my-8'>
                {/* Başlık, Gezinme Butonları ve Tümünü Gör Butonu */}
                <div className='flex justify-between items-center text-3xl py-2'>
                    <Title text1={"İLGİLİ"} text2={"ÜRÜNLER"} />

                    {/* Gezinme Butonları */}
                    </div>
                <hr className="border-t-1 border-gray-300" />
            </div>
            
            <Swiper
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    355: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    600: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    900: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    },
                    1200: {
                        slidesPerView: 5,
                        spaceBetween: 30,
                    }
                }}
                modules={[Autoplay]}
                className='min-h-[333px]'
            >
                {relatedProducts.map((product) => (
                    <SwiperSlide key={product._id}>
                        <ProductItem {...product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default RelatedProducts;