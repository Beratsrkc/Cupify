import React from 'react';

const TeslimatVeIade = () => {
  return (
    <div className="teslimat-ve-iade-container container mx-auto px-4 py-8 md:px-16 md:py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        İptal ve İade Şartları
      </h1>

      {/* Genel Hükümler */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">GENEL HÜKÜMLER</h2>
        <p className="text-gray-700">
          Web sitemiz üzerinden elektronik ortamda sipariş vermeniz durumunda, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği (RG:27.11.2014/29188) hükümleri geçerlidir.
        </p>
        
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-800">Teslimat Süresi ve Ücreti</h3>
          <p className="text-gray-700">
            • Ürünler en geç 30 gün içinde teslim edilir. Bu süre aşılırsa sözleşme feshedilebilir.
            <br/>
            • Kargo ücreti alıcıya aittir.
          </p>
        </div>
      </section>

      {/* Cayma Hakkı */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">CAYMA HAKKI</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            Teslimat tarihinden itibaren <strong>14 gün içinde</strong> hiçbir gerekçe göstermeden cayma hakkınızı kullanabilirsiniz.
          </p>

          <h3 className="text-xl font-medium text-gray-800">Cayma Bildirim Şartları</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>İadeli taahhütlü posta, faks veya eposta ile bildirim</li>
            <li>Ürünün orijinal ambalajında ve hasarsız olması</li>
            <li>Fatura ve tüm aksesuarların eksiksiz iadesi</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-800">İletişim Bilgileri</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Şirket Ünvanı:</strong> ŞİRKET ADI<br/>
              <strong>Adres:</strong> <br/>
              <strong>E-posta:</strong> MAİL<br/>
              <strong>Telefon:</strong> TELEFON<br/>
            </p>
          </div>
        </div>
      </section>

      {/* İade Prosedürü */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">İADE PROSEDÜRÜ</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-800">Satıcı Yükümlülükleri</h3>
          <p className="text-gray-700">
            • Cayma bildirimi alındıktan sonra <strong>10 gün içinde</strong> ödeme iadesi<br/>
            • <strong>20 gün içinde</strong> ürünün geri alınması
          </p>

          <h3 className="text-xl font-medium text-gray-800">Alıcı Yükümlülükleri</h3>
          <p className="text-gray-700">
            • Ürünü özenle koruma ve kullanmama<br/>
            • Ambalaj açılmışsa değer kaybından sorumluluk
          </p>
        </div>
      </section>

      {/* İstisnalar */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">CAYMA HAKKI KAPSAM DIŞI ÜRÜNLER</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <h3 className="text-xl font-medium mb-2">Kişiye Özel Ürünler</h3>
            <ul className="list-disc pl-5">
              <li>İç giyim ve mayo</li>
              <li>Kişiye özel üretimler</li>
              <li>Açılmış kozmetikler</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">Tek Kullanımlık Ürünler</h3>
            <ul className="list-disc pl-5">
              <li>Yazılım ve dijital içerik</li>
              <li>Gazete ve dergiler</li>
              <li>Hızlı bozulan ürünler</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Ödeme ve Teslimat */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">ÖDEME VE TESLİMAT</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-800">Kabul Edilen Ödeme Yöntemleri</h3>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Banka Havalesi/EFT (İş Bankası, Akbank, Halkbank, Yapı Kredi)</li>
            <li>Tüm kredi kartları ile online ödeme</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-800">Sevkiyat Bilgisi</h3>
          <p className="text-gray-700">
            Siparişler ödeme sonrası <strong>1-7 iş günü</strong> içinde kargoya verilir.
          </p>
        </div>
      </section>

      {/* Hukuki Hükümler */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">HUKUKİ YÜKÜMLÜLÜKLER</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            • Kredi kartı dolandırıcılığı durumunda 3 gün içinde iade zorunluluğu<br/>
            • Mücbir sebeplerde teslimat erteleme hakkı<br/>
            • Temerrüt halinde yasal faiz uygulaması
          </p>
        </div>
      </section>

      {/* İletişim */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">İLETİŞİM</h2>
        <p className="text-gray-700">
          <strong>E-posta:</strong> MAİL<br/>
          <strong>Telefon:</strong> TELEFON<br/>
          <strong>Çalışma Saatleri:</strong> Hafta içi 09:00 - 18:00
        </p>
      </section>

      {/* İmza Bölümü */}
      <div className="flex justify-between mt-8 border-t pt-4">
        <div>
          <p className="font-semibold">SATICI: ŞİRKET ADI</p>
          <p className="text-sm text-gray-600">İmza/Mühür</p>
        </div>
        <div>
          <p className="font-semibold">ALICI: [ALICI Ad-Soyad]</p>
          <p className="text-sm text-gray-600">İmza</p>
        </div>
      </div>
    </div>
  );
};

export default TeslimatVeIade;