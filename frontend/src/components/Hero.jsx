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
            image: assets.Slider1,
            title: 'Çapa Makinesi Yedek Parçaları',
            subtitle: 'En kaliteli çapa makinesi yedek parçaları burada!',
            buttonText: 'Hemen İncele',
            category: '',
        },
        {
            id: 2,
            image: assets.Slider2,
            title: 'Tel Grubu Yedek Parçaları',
            subtitle: 'Tel grubu yedek parçalarında özel indirimler!',
            buttonText: 'Şimdi Al',
            category: 'Tel-Grubu',
        },
        {
            id: 3,
            image: assets.Slider3,
            title: 'Manet ve Gaz Kolları',
            subtitle: 'Manet ve Gaz Kollarında sınırlı süreli indirimler!',
            buttonText: 'Detayları Gör',
            category: 'Manet-ve-Gaz-Kolu',
        },
        {
            id: 4,
            image: assets.Slider4, // Bu resmi siz ekleyeceksiniz
            title: '2025’e Özel İndirimler!',
            subtitle: '2025’e kadar geçerli özel fırsatları kaçırma!',
            buttonText: '', // Buton yok
            category: '', // Buton yok
        },
        {
            id: 5,
            image: assets.Slider5, // Bu resmi siz ekleyeceksiniz
            title: 'Sınırlı Stok!',
            subtitle: 'Stoklar tükenmeden avantajlı fırsatları yakala!',
            buttonText: '', // Buton yok
            category: '', // Buton yok
        },
        {
            id: 6,
            image: assets.Slider6, // Bu resmi siz ekleyeceksiniz
            title: 'Yeni Yıl Fırsatları',
            subtitle: 'Yeni yıla özel indirimlerle tanışın!',
            buttonText: '', // Buton yok
            category: '', // Buton yok
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
                        <div className="absolute inset-0 flex flex-col justify-center items-start text-white p-6 sm:p-10 md:p-16 lg:p-20 bg-black bg-opacity-40" style={{ zIndex: 1 }}>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase">
                                {slide.title}
                            </h1>
                            <p className="text-lg sm:text-xl md:text-2xl mt-2 sm:mt-4">
                                {slide.subtitle}
                            </p>
                            {slide.buttonText && (
                                <button
                                    onClick={() => handleSeeAllClick(slide.category)}
                                    className="mt-4 sm:mt-6 px-6 py-2 sm:px-8 sm:py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition duration-300"
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