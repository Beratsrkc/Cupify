import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaYoutube, FaEnvelope } from 'react-icons/fa'; // İkonları import edin

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-32 text-sm'>
                <div>
                    <img src={assets.Cupify_logo} className='mb-5 w-28 lg:w-32' alt="CUPIFY Tarım Logo" />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        2012’den bu yana kafe ve restoranlar için özel baskılı karton bardak üretiminde güvenilir bir iş ortağıyız. Çift katlı karton bardaklarımız sıcak, pet bardaklarımız ise soğuk içecekler için idealdir. Avrupa menşeli kaliteli kağıt ve yüksek baskı teknolojisiyle üretiyor, düşük adetlerde üretim imkanı sunarak depolama sorunlarını azaltıyoruz. Markanızı her yudumda akılda kalıcı hale getiren baskılı bardaklarla kaliteli bir sunum sağlıyoruz.
                    </p>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>CUPIFY</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li><Link to="/hakkimizda">Hakkımızda</Link></li>
                        <li><Link to="/teslimat-ve-iade-sartlari">Teslimat ve İade Şartları</Link></li>
                        <li><Link to="/gizlilik-sozlesmesi">Gizlilik Politikası</Link></li>
                        <li><Link to="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</Link></li>
                    </ul>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>İLETİŞİM</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        {/* Tıklanabilir telefon ve mail */}
                        <li>
                            <a
                                href="tel:+905322924067"
                                className='hover:text-gray-800 transition-colors hover:underline'
                            >
                                +90 532 292 40 67
                            </a>
                        </li>
                        <li>
                            <a
                                href="mailto:info@papercups.com"
                                className='hover:text-gray-800 transition-colors hover:underline'
                            >
                               info@papercups.com
                            </a>
                        </li>
                    </ul>
                    {/* Sosyal medya ikonları */}
                    <div className="flex gap-4 mt-5">
                        <a href="https://www.instagram.com/papercups.com.tr" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="text-2xl text-gray-600 hover:text-gray-800 transition-colors" />
                        </a>
                        <a href="https://www.facebook.com/papercups.com.tr" target="_blank" rel="noopener noreferrer">
                            <FaFacebook className="text-2xl text-gray-600 hover:text-gray-800 transition-colors" />
                        </a>
                        <a href="https://www.youtube.com/@papercupsambalaj" target="_blank" rel="noopener noreferrer">
                            <FaYoutube className="text-2xl text-gray-600 hover:text-gray-800 transition-colors" />
                        </a>
                        <a href="mailto:info@cupify.com.tr" target="_blank" rel="noopener noreferrer">
                            <FaEnvelope className="text-2xl text-gray-600 hover:text-gray-800 transition-colors" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Ödeme logoları */}
            <div>
                <div className="flex justify-center items-center gap-4 my-6">
                    <p className='text-md'>Kabul Edilen Ödeme Yöntemleri</p>
                </div>
                <div className="flex justify-center items-center gap-4 my-6">
                    <img src={assets.tekparca2} alt="Ödeme Yöntemleri" className='w-72' />
                </div>
            </div>

            <div>
                <hr />
                <p className='py-5 text-sm text-center'>© 2025 CUPİFY - Tüm Hakları Saklıdır</p>
            </div>
        </div>
    );
};

export default Footer;