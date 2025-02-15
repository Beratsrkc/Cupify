import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img src={assets.SBF_Logo} className='mb-5 w-28 lg:w-32' alt="SBF Tarım Logo" />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        2025 yılında kurulan SBF Tarım, tarım makineleri ve çapa makinesi yedek parçaları konusunda uzmanlaşmış bir firmadır. Geniş ürün yelpazemizle çiftçilerimizin ihtiyaçlarını karşılıyor, kaliteli ve uygun fiyatlı ürünler sunuyoruz.
                    </p>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>SBF TARIM</p>
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
                                href="tel:+905342015367" 
                                className='hover:text-gray-800 transition-colors hover:underline'
                            >
                                +90 534 201 5367
                            </a>
                        </li>
                        <li>
                            <a 
                                href="mailto:sbftarim34@gmail.com" 
                                className='hover:text-gray-800 transition-colors hover:underline'
                            >
                                sbftarim34@gmail.com
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Ödeme logoları */}
            <div>
                <div className="flex justify-center items-center gap-4 my-6">
                    <p className='text-md'>Kabul Edilen Ödeme Yöntemleri</p>
                </div>
                <div className="flex justify-center items-center gap-4 my-6">
                    <img src={assets.logo_band} alt="Ödeme Yöntemleri" className='w-72' />
                </div>
            </div>

            <div>
                <hr />
                <p className='py-5 text-sm text-center'>© 2025 SBF Tarım - Tüm Hakları Saklıdır</p>
            </div>
        </div>
    );
};

export default Footer;