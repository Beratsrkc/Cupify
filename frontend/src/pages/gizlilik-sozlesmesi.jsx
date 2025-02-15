import React from 'react';

const GizlilikSozlesmesi = () => {
  return (
    <div className="gizlilik-sozlesmesi-container container mx-auto px-4 py-8 md:px-16 md:py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Gizlilik Sözleşmesi
      </h1>

      {/* 1. Giriş */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">1. Giriş</h2>
        <p className="text-gray-700">
          SBF Tarım olarak, kullanıcılarımızın kişisel bilgilerini korumaya büyük önem veriyoruz. Bu gizlilik politikası, kullanıcılarımızın bilgilerini nasıl topladığımız, kullandığımız ve koruduğumuz konusunda sizi bilgilendirecektir.
        </p>
      </section>

      {/* 2. Toplanan Bilgiler */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">2. Toplanan Bilgiler</h2>
        <p className="text-gray-700">
          Web sitemiz üzerinden, kullanıcılarımızdan çeşitli kişisel bilgiler toplayabiliriz. Bunlar arasında ad, soyad, e-posta adresi, telefon numarası ve ödeme bilgileri yer alabilir.
        </p>
      </section>

      {/* 3. Bilgilerin Kullanımı */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">3. Bilgilerin Kullanımı</h2>
        <p className="text-gray-700">
          Topladığımız bilgileri, kullanıcı deneyimini iyileştirmek, ürünler ve hizmetler hakkında bilgi vermek ve müşteri destek taleplerine yanıt vermek amacıyla kullanıyoruz. Ayrıca, kullanıcıların güvenliğini sağlamak ve işlemleri doğrulamak için de kullanılabilir.
        </p>
      </section>

      {/* 4. Çerezler (Cookies) */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">4. Çerezler (Cookies)</h2>
        <p className="text-gray-700">
          Web sitemiz, kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanmaktadır. Çerezler, kullanıcıların sitemizi nasıl kullandığını analiz etmek ve gelecekteki ziyaretlerde kişiselleştirilmiş içerik sunmak için kullanılabilir.
        </p>
      </section>

      {/* 5. Bilgilerin Paylaşılması */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">5. Bilgilerin Paylaşılması</h2>
        <p className="text-gray-700">
          SBF Tarım, kullanıcı bilgilerini üçüncü şahıslarla paylaşmaz, satmaz veya kiralamaz. Ancak, yasal yükümlülükler nedeniyle, yetkili mercilere bilgilerinizi sağlama hakkımız saklıdır.
        </p>
      </section>

      {/* 6. Bilgilerin Güvenliği */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">6. Bilgilerin Güvenliği</h2>
        <p className="text-gray-700">
          Kullanıcı bilgilerinin güvenliği için çeşitli teknik ve idari önlemler alıyoruz. Ancak, internet ortamında veri iletiminin tamamen güvenli olduğunu garanti edemeyiz.
        </p>
      </section>

      {/* 7. Kullanıcı Hakları */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">7. Kullanıcı Hakları</h2>
        <p className="text-gray-700">
          Kullanıcılar, kişisel bilgilerinin doğruluğunu kontrol etme, değiştirme ve silme hakkına sahiptir. Bu hakları kullanmak için bizimle iletişime geçebilirsiniz.
        </p>
      </section>

      {/* 8. Politika Değişiklikleri */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">8. Politika Değişiklikleri</h2>
        <p className="text-gray-700">
          Gizlilik politikamızda zaman zaman değişiklik yapabiliriz. Bu tür değişiklikler, web sitemizde yayınlandığı andan itibaren geçerli olacaktır.
        </p>
      </section>

      {/* 9. İletişim */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">9. İletişim</h2>
        <p className="text-gray-700">
          Gizlilik politikası hakkında sorularınız varsa, bizimle aşağıdaki iletişim kanallarından iletişime geçebilirsiniz:
          <br />
          <strong>E-posta:</strong> sbftarim34@gmail.com
          <br />
          <strong>Telefon:</strong> 0534 201 53 67
        </p>
      </section>

      {/* İmza Bölümü */}
      <div className="flex justify-between mt-8 border-t pt-4">
        <div>
          <p className="font-semibold">SATICI: SBF TARIM LTD.ŞTİ</p>
        </div>
        <div>
          <p className="font-semibold">ALICI: [ALICI Ad-Soyad]</p>
        </div>
      </div>
    </div>
  );
};

export default GizlilikSozlesmesi;