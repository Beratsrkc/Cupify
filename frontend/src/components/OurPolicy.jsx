import React from 'react';
import { assets } from '../assets/assets';

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
        <div>
            <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="Kolay Değişim Politikası" />
            <p className='font-semibold'>Kolay Değişim Politikası</p>
            <p className='text-gray-400'>Sorunsuz ve hızlı değişim imkanı sunuyoruz</p>
        </div>
        <div>
            <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="7 Gün İade Politikası" />
            <p className='font-semibold'>7 Gün İade Politikası</p>
            <p className='text-gray-400'>7 gün içinde ücretsiz iade garantisi</p>
        </div>
        <div>
            <img src={assets.support_img} className='w-12 m-auto mb-5' alt="7/24 Müşteri Desteği" />
            <p className='font-semibold'>7/24 Müşteri Desteği</p>
            <p className='text-gray-400'>7 gün 24 saat kesintisiz müşteri desteği</p>
        </div>
    </div>
  );
};

export default OurPolicy;