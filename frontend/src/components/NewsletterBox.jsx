import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const NewsletterBox = () => {
    const navigate = useNavigate();

    const onContactHandler = () => {
        // İletişim sayfasına yönlendirme
        navigate('/iletisim');

        // WhatsApp yönlendirme işlemi
        const phoneNumber = '+905318364465'; // WhatsApp'a yönlendirilecek telefon numarası
        const message = 'Merhaba, Cupify.com.tr sitesinden ulaşıyorum.'; // Otomatik gönderilecek mesaj
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="relative w-full py-28 overflow-hidden">
            <div className="mx-auto w-full px-4 lg:px-8">
                <div className="flex flex-col items-center lg:flex-row lg:justify-center lg:items-start">
                    {/* Resim Bölümü (Sağ Taraf) */}
                    <div className="lg:ml-6 lg:order-last mt-6 lg:mt-0">
                        <img
                            className="h-[15rem] lg:h-[18rem] w-full rounded-lg object-cover lg:w-[400px] shadow-2xl"
                            src={assets.Kartonbardak3}
                            alt="Özel Baskılı Ambalaj Örneği"
                        />
                    </div>

                    {/* Yazı ve Buton Bölümü (Sol Taraf) */}
                    <div className="flex flex-col justify-center py-4 lg:py-8 lg:pr-8 lg:text-left text-center">
                        {/* Başlık */}
                        <p className="text-2xl lg:text-3xl font-bold text-gray-600 mb-4">
                            Özel Baskılı Ambalaj Çözümleri
                        </p>

                        {/* Açıklama Metni */}
                        <p className="mb-6 text-base lg:text-lg text-gray-500">
                            Karton bardaklarınız ve diğer ambalaj ürünleriniz için özel tasarımlar oluşturuyoruz. Markanızı öne çıkarın!
                        </p>

                        {/* İletişim Butonu */}
                        <button
                            onClick={onContactHandler}
                            className="w-full rounded-lg bg-orangeBrand px-4 py-2 text-white font-semibold hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 lg:w-2/5"
                        >
                            İletişime Geç
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsletterBox;