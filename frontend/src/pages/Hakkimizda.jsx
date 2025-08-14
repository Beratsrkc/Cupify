import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div className=" py-12">
      {/* Hakkımızda Başlığı */}
      <div className="text-center mb-12">
        <Title text2={'HAKKIMIZDA'} />
      </div>

      {/* Şirket Bilgileri ve Açıklama */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Şirket Logosu */}
          <div className="w-full md:w-2/6">
            <img
              className="w-[420px] "
              src={assets.Cupify_logo_yuvarlak}
              alt="Özel Baskılı Bardak Logo"
            />
          </div>

          {/* Şirket Açıklaması */}
          <div className="w-full md:w-4/6 text-gray-600">
            <p className="mb-4">
              2012 yılından bu yana, kafe ve restoranlar için özel baskılı karton bardak üretimi yaparak sektörde güvenilir bir iş ortağı olarak hizmet veriyoruz. Çift katlı karton bardaklarımız, sıcak içecekler için ideal koruma sağlarken, pet bardaklarımız ise soğuk kahve çeşitleri için özel olarak tasarlanmıştır.
            </p>
            <p className="mb-4">
              Yüksek kaliteli baskı teknolojimiz ile her detayı özenle hazırlıyoruz ve karton bardaklarımızın üretiminde Avrupa menşeli kaliteli kağıt kullanıyoruz. Müşterilerimize düşük adetlerde üretim imkanı sunarak depolama problemlerini ortadan kaldırmayı hedefliyoruz.
            </p>
            <b className="text-gray-800">Misyonumuz</b>
            <p>
              Misyonumuz, kafe ve restoranların marka kimliğini özel baskılı bardaklarla birleştirerek, her yudumda markanızın akılda kalmasını sağlamaktır. Yüksek kalite ve dayanıklılık sunarak, müşterilerinize kaliteli bir sunum seçeneği oluşturuyoruz.
            </p>
          </div>
        </div>
      </div>

      {/* Ürün ve Hizmetlerimiz */}
      <div className="container mx-auto px-4 mt-16">
        <div className="text-center mb-12">
          <Title text1={"ÜRÜN"} text2={'VE HİZMETLERİMİZ'} />
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kalite Güvencesi */}
          <div className="bg-white rounded-lg border p-8">
            <b className="text-lg">Kalite Güvencesi</b>
            <p className="text-gray-600 mt-4">
              Tüm ürünlerimizde yüksek kalite standartlarını benimsiyoruz. Çift katlı karton bardaklarımız ve pet bardaklarımız, dayanıklılık ve performans açısından test edilmiştir. Müşterilerimize güvenilir ve uzun ömürlü ürünler sunmayı taahhüt ediyoruz.
            </p>
          </div>

          {/* Kolaylık ve Uygunluk */}
          <div className="bg-white rounded-lg border p-8">
            <b className="text-lg">Kolaylık ve Uygunluk</b>
            <p className="text-gray-600 mt-4">
              Düşük adetlerde üretim imkanı sunarak, depolama problemlerini ortadan kaldırıyoruz. Hızlı teslimat seçeneklerimizle, ihtiyaç duyduğunuz özel baskılı bardaklara kolayca ulaşabilirsiniz.
            </p>
          </div>

          {/* Müşteri Hizmetleri */}
          <div className="bg-white rounded-lg border p-8">
            <b className="text-lg">Müşteri Hizmetleri</b>
            <p className="text-gray-600 mt-4">
              Müşteri memnuniyeti bizim için her zaman ön plandadır. Uzman ekibimiz, ürünlerimiz ve hizmetlerimiz hakkında her türlü sorunuzu yanıtlamak için hazırdır. Sizlere en iyi hizmeti sunmak için çalışıyoruz.
            </p>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default About;