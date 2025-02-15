import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const About = () => {
  return (
    <div>
      {/* Hakkımızda Başlığı */}
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text2={'HAKKIMIZDA'} />
      </div>

      {/* Şirket Bilgileri ve Açıklama */}
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        {/* Şirket Logosu */}
        <img className='w-full md:max-w-[450px]' src={assets.SBF_Logo_bordo} alt="SBF Tarım Logo" />
        
        {/* Şirket Açıklaması */}
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>
            2025 yılında kurulan SBF Tarım, tarım sektöründe kaliteli ve uygun fiyatlı çapa makinesi yedek parçaları ile hizmet vermektedir. Müşteri memnuniyetini ön planda tutarak, geniş ürün yelpazemizle çiftçilerimizin ihtiyaçlarını karşılıyoruz.
          </p>
          <p>
            SBF Tarım olarak, sadece kendi markamızın değil, sektördeki diğer önde gelen markaların da yedek parçalarını sizlerle buluşturuyoruz. Amacımız, tarım makinelerinizin ömrünü uzatmak ve verimliliğinizi artırmaktır.
          </p>
          <b className='text-gray-800'>Misyonumuz</b>
          <p>
            Misyonumuz, tarım sektöründe ihtiyaç duyulan yüksek kaliteli yedek parçaları uygun fiyatlarla sunarak, çiftçilerimizin işlerini kolaylaştırmak ve üretim süreçlerine katkıda bulunmaktır. Sürdürülebilir tarım için kaliteli ürünler sunmayı hedefliyoruz.
          </p>
        </div>
      </div>

      {/* Ürün ve Hizmetlerimiz */}
      <div className='text-4xl py-4'>
        <Title text1={"ÜRÜN"} text2={'VE HİZMETLERİMİZ'} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        {/* Kalite Güvencesi */}
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Kalite Güvencesi:</b>
          <p className='text-gray-600'>
            SBF Tarım olarak, tüm ürünlerimizde yüksek kalite standartlarını benimsiyoruz. Yedek parçalarımız, dayanıklılık ve performans açısından test edilmiştir. Müşterilerimize güvenilir ve uzun ömürlü ürünler sunmayı taahhüt ediyoruz.
          </p>
        </div>

        {/* Kolaylık ve Uygunluk */}
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Kolaylık ve Uygunluk:</b>
          <p className='text-gray-600'>
            Geniş ürün yelpazemiz ve hızlı teslimat seçeneklerimizle, ihtiyaç duyduğunuz yedek parçalara kolayca ulaşabilirsiniz. Online alışveriş imkanı ve müşteri destek ekibimizle her zaman yanınızdayız.
          </p>
        </div>

        {/* Müşteri Hizmetleri */}
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Müşteri Hizmetleri:</b>
          <p className='text-gray-600'>
            Müşteri memnuniyeti bizim için her zaman ön plandadır. Uzman ekibimiz, ürünlerimiz ve hizmetlerimiz hakkında her türlü sorunuzu yanıtlamak için hazırdır. SBF Tarım olarak, sizlere en iyi hizmeti sunmak için çalışıyoruz.
          </p>
        </div>
      </div>

      {/* Bülten Kutusu */}
      <div>
        <NewsletterBox />
      </div>
    </div>
  );
};

export default About;