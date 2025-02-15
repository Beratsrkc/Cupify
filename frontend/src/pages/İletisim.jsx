import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const Contact = () => {
  return (
    <div>
      {/* İletişim Başlığı */}
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text2={"İLETİŞİM"} />
      </div>

      {/* İletişim Bilgileri ve Görsel */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        {/* İletişim Görseli */}
        <img 
          className='w-full md:max-w-[480px]' 
          src={assets.contact_img} 
          alt="SBF Tarım İletişim Görseli" 
        />

        {/* İletişim Bilgileri */}
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>SBF TARIM</p>
          <p className='text-gray-500'>
            Adres:  <br />
            İstanbul, Türkiye
          </p>
          <p className='text-gray-500'>
            Telefon: <a href="tel:+905342015367" className='hover:text-gray-800 hover:underline'>0534 201 5367</a> <br />
            E-posta: <a href="mailto:sbftarim34@gmail.com" className='hover:text-gray-800 hover:underline'>sbftarim34@gmail.com</a>
          </p>
          <button 
            className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'
            onClick={() => window.location.href = "mailto:sbftarim34@gmail.com"}
          >
            İletişime Geç
          </button>
        </div>
      </div>

      {/* Bülten Kutusu */}
      <NewsletterBox />
    </div>
  );
};

export default Contact;