import React from 'react';
import Slider from 'react-slick';
import { assets } from '../assets/assets';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const handleSeeAllClick = (category) => {
        navigate(`/urunler?category=${category}`);
    };

    const slides = [
        {
            id: 1,
            image: assets.Kartonbardak,
            title: 'Özel Baskılı Karton Bardaklar',
            subtitle: 'Markanızı özel tasarımlarla öne çıkarın!',
            buttonText: 'Ürünleri İncele',
            category: '',
        },
        {
            id: 2,
            image: assets.Kartonbardak2,
            title: 'Çevre Dostu Ambalajlar',
            subtitle: 'Geri dönüştürülebilir ve şık ambalaj çözümleri.',
            buttonText: 'Hemen Sipariş Ver',
            category: '',
        },
        {
            id: 3,
            image: assets.Kartonbardak3,
            title: 'Şık ve Fonksiyonel Tasarımlar',
            subtitle: 'İhtiyaçlarınıza özel çözümler sunuyoruz.',
            buttonText: 'Detayları Gör',
            category: '',
        },
        {
            id: 4,
            image: assets.Kartonbardak,
            title: 'Hızlı Teslimat ve Uygun Fiyatlar',
            subtitle: 'Siparişleriniz hızlı ve güvenilir bir şekilde teslim edilir.',
            buttonText: 'Teklif Al',
            category: '',
        },
    ];

    return (
        <div className="w-full rounded-lg overflow-hidden">
            <Slider {...settings}>
                {slides.map((slide) => (
                    <div key={slide.id} className="relative rounded-lg w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
                        <img
                            src={slide.image}
                            alt={`${slide.title} - ${slide.subtitle}`}
                            className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 sm:p-10 md:p-16 lg:p-20 bg-black bg-opacity-10" style={{ zIndex: 1 }}>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-center font-poppins">
                                {slide.title}
                            </h1>
                            <p className="text-lg sm:text-xl md:text-2xl mt-2 sm:mt-4 text-center font-open-sans">
                                {slide.subtitle}
                            </p>
                            {slide.buttonText && (
                                <button
                                    onClick={() => handleSeeAllClick(slide.category)}
                                    className="mt-4 sm:mt-6 px-6 py-2 sm:px-8 sm:py-3 bg-red-500     text-white font-semibold rounded-full hover:bg-gray-200 transition duration-300 shadow-lg"
                                >
                                    {slide.buttonText}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Hero;