import React from 'react';
import Slider from 'react-slick';
import { assets } from '../assets/assets';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        arrows: false,
        fade: true,
        cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    dots: false
                }
            }
        ]
    };

    const handleSeeAllClick = (category) => {
        navigate(`/urunler?category=${category}`);
    };

    const slides = [
        {
            id: 1,
            image: assets.bg4,
            title: 'Çevre Dostu Ambalajlar',
            subtitle: 'Geri dönüştürülebilir ve şık ambalaj çözümleri',
            buttonText: 'Hemen Sipariş Ver',
            category: '',
            overlay: 'rgba(0,0,0,0.3)'
        },
        {
            id: 2,
            image: assets.bg7,
            title: 'Özel Baskılı Karton Bardaklar',
            subtitle: 'Markanızı özel tasarımlarla öne çıkarın',
            buttonText: 'Detayları Gör',
            category: '',
            overlay: 'rgba(0,0,0,0.4)'
        },
        {
            id: 3,
            image: assets.bg6,
            title: 'Hızlı Teslimat ve Uygun Fiyatlar',
            subtitle: 'Siparişleriniz hızlı ve güvenilir bir şekilde teslim edilir',
            buttonText: 'Teklif Al',
            category: '',
            overlay: 'rgba(0,0,0,0.2)'
        }
    ];

    return (
        <div className="w-full rounded-xl overflow-hidden  relative">
            <Slider {...settings}>
                {slides.map((slide) => (
                    <div key={slide.id} className="relative w-full h-[60vh] md:h-[65vh] lg:h-[70vh] xl:h-[75vh]">
                        {/* Overlay */}
                        <div 
                            className="absolute inset-0 z-10" 
                            style={{ 
                                background: `linear-gradient(to right, ${slide.overlay}, ${slide.overlay})`
                            }}
                        />
                        
                        {/* Background Image */}
                        <img
                            src={slide.image}
                            alt={`${slide.title} - ${slide.subtitle}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        
                        {/* Content */}
                        <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-6 sm:px-10 md:px-16 lg:px-24 text-white">
                            <div className="max-w-2xl space-y-4 md:space-y-6">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                                    {slide.title}
                                </h1>
                                <p className="text-lg sm:text-xl md:text-2xl opacity-90">
                                    {slide.subtitle}
                                </p>
                                {slide.buttonText && (
                                    <button
                                        onClick={() => handleSeeAllClick(slide.category)}
                                        className="mt-4 px-8 py-3 bg-white text-orange-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        {slide.buttonText}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
            
            {/* Custom dots position */}
            <style jsx="true" global="true">{`
                .slick-dots {
                    bottom: 30px !important;
                }
                .slick-dots li button:before {
                    color: white !important;
                    opacity: 0.5 !important;
                    font-size: 10px !important;
                }
                .slick-dots li.slick-active button:before {
                    color: white !important;
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
};

export default Hero;