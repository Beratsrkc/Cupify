import React from 'react';

const MesafeliSatisSozlesmesi = () => {
  return (
    <div className="sozlesme-container container mx-auto px-4 py-8 md:px-16 md:py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Mesafeli Satış Sözleşmesi
      </h1>

      {/* 1. Taraflar */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">1. Taraflar</h2>
        <p className="text-gray-700">
          İşbu Sözleşme aşağıdaki taraflar arasında aşağıda belirtilen hüküm ve şartlar çerçevesinde imzalanmıştır.
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium text-gray-800">ALICI</h3>
            <p className="text-gray-700">
              <strong>Ad-Soyad:</strong> [ALICI Ad-Soyad]
              <br />
              <strong>Adres:</strong> [ALICI Adresi]
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-800">SATICI</h3>
            <p className="text-gray-700">
              <strong>Ad-Soyad:</strong> ŞİRKET ADI
              <br />
              <strong>Adres:</strong> [Şirket Adresi]
              <br />
              <strong>Telefon:</strong> TELEFON
              <br />
              <strong>E-posta:</strong> MAİL
            </p>
          </div>
        </div>
      </section>

      {/* 2. Tanımlar */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">2. Tanımlar</h2>
        <p className="text-gray-700">
          İşbu sözleşmenin uygulanmasında ve yorumlanmasında aşağıda yazılı terimler karşılarındaki yazılı açıklamaları ifade edeceklerdir.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Bakan:</strong> Gümrük ve Ticaret Bakanı’nı,</li>
          <li><strong>Bakanlık:</strong> Gümrük ve Ticaret Bakanlığı’nı,</li>
          <li><strong>Kanun:</strong> 6502 sayılı Tüketicinin Korunması Hakkında Kanun’u,</li>
          <li><strong>Yönetmelik:</strong> Mesafeli Sözleşmeler Yönetmeliği’ni (RG:27.11.2014/29188),</li>
          <li><strong>Hizmet:</strong> Bir ücret veya menfaat karşılığında yapılan ya da yapılması taahhüt edilen mal sağlama dışındaki her türlü tüketici işleminin konusunu,</li>
          <li><strong>SATICI:</strong> Ticari veya mesleki faaliyetleri kapsamında tüketiciye mal sunan veya mal sunan adına veya hesabına hareket eden şirketi,</li>
          <li><strong>ALICI:</strong> Bir mal veya hizmeti ticari veya mesleki olmayan amaçlarla edinen, kullanan veya yararlanan gerçek ya da tüzel kişiyi,</li>
          <li><strong>SİTE:</strong> SATICI’ya ait internet sitesini,</li>
          <li><strong>SİPARİŞ VEREN:</strong> Bir mal veya hizmeti SATICI’ya ait internet sitesi üzerinden talep eden gerçek ya da tüzel kişiyi,</li>
          <li><strong>TARAFLAR:</strong> SATICI ve ALICI’yı,</li>
          <li><strong>SÖZLEŞME:</strong> SATICI ve ALICI arasında akdedilen işbu sözleşmeyi,</li>
          <li><strong>MAL:</strong> Alışverişe konu olan taşınır eşyayı ve elektronik ortamda kullanılmak üzere hazırlanan yazılım, ses, görüntü ve benzeri gayri maddi malları ifade eder.</li>
        </ul>
      </section>

      {/* 3. Konu */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">3. Konu</h2>
        <p className="text-gray-700">
          İşbu Sözleşme, ALICI’nın, SATICI’ya ait internet sitesi üzerinden elektronik ortamda siparişini verdiği aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.
        </p>
      </section>

      {/* 4. Satıcı Bilgileri */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">4. Satıcı Bilgileri</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Ünvanı:</strong> ŞİRKET ADI</li>
          <li><strong>Adres:</strong> [Şirket Adresi]</li>
          <li><strong>Telefon:</strong> TELEFON</li>
          <li><strong>E-posta:</strong> MAİL</li>
        </ul>
      </section>

      {/* 5. Alıcı Bilgileri */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">5. Alıcı Bilgileri</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Teslim Edilecek Kişi:</strong> [ALICI Ad-Soyad]</li>
          <li><strong>Teslimat Adresi:</strong> [ALICI Adresi]</li>
          <li><strong>Telefon:</strong> [ALICI Telefon]</li>
          <li><strong>E-posta:</strong> [ALICI E-posta]</li>
        </ul>
      </section>

      {/* 6. Sözleşme Konusu Ürün/Ürünler Bilgileri */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">6. Sözleşme Konusu Ürün/Ürünler Bilgileri</h2>
        <p className="text-gray-700">
          Malın / Ürün/Ürünlerin / Hizmetin temel özellikleri (türü, miktarı, marka/modeli, rengi, adedi) SATICI’ya ait internet sitesinde yayınlanmaktadır. Satıcı tarafından kampanya düzenlenmiş ise ilgili ürünün temel özelliklerini kampanya süresince inceleyebilirsiniz. Kampanya tarihine kadar geçerlidir.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Ürün Açıklaması</th>
                <th className="border p-2">Adet</th>
                <th className="border p-2">Birim Fiyatı</th>
                <th className="border p-2">Ara Toplam (KDV Dahil)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border">
                <td className="border p-2">[Ürün Adı]</td>
                <td className="border p-2 text-center">[Adet]</td>
                <td className="border p-2 text-right">[Birim Fiyatı] TL</td>
                <td className="border p-2 text-right">[Ara Toplam] TL</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <p><strong>Kargo Tutarı:</strong> 0,00 TL</p>
          <p><strong>Toplam:</strong> [Toplam Tutar] TL</p>
          <p><strong>Ödeme Şekli ve Planı:</strong> Kredi Kartı</p>
          <p><strong>Teslimat Adresi:</strong> [ALICI Adresi]</p>
          <p><strong>Teslim Edilecek Kişi:</strong> [ALICI Ad-Soyad]</p>
          <p><strong>Fatura Adresi:</strong> [Fatura Adresi]</p>
          <p><strong>Sipariş Tarihi:</strong> [Sipariş Tarihi]</p>
        </div>
      </section>

      {/* 7. Genel Hükümler */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">7. Genel Hükümler</h2>
        <ol className="list-decimal pl-5 space-y-4 text-gray-700">
          <li>ALICI, SATICI’ya ait internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup, bilgi sahibi olduğunu, elektronik ortamda gerekli teyidi verdiğini kabul, beyan ve taahhüt eder.</li>
          <li>Sözleşme konusu her bir ürün, 30 günlük yasal süreyi aşmamak kaydı ile ALICI' nın yerleşim yeri uzaklığına bağlı olarak internet sitesindeki ön bilgiler kısmında belirtilen süre zarfında ALICI veya ALICI’nın gösterdiği adresteki kişi ve/veya kuruluşa teslim edilir.</li>
          <li>SATICI, sözleşme konusu ürünü eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgeleri, kullanım kılavuzları ile teslim etmeyi, her türlü ayıptan arî olarak yasal mevzuat gereklerine göre sağlam, standartlara uygun bir şekilde işi doğruluk ve dürüstlük esasları dâhilinde ifa etmeyi, hizmet kalitesini koruyup yükseltmeyi, işin ifası sırasında gerekli dikkat ve özeni göstermeyi, ihtiyat ve öngörü ile hareket etmeyi kabul, beyan ve taahhüt eder.</li>
        </ol>
      </section>

      {/* 8. Cayma Hakkı */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">8. Cayma Hakkı</h2>
        <p className="text-gray-700">
          ALICI; mesafeli sözleşmenin mal satışına ilişkin olması durumunda, ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren 14 (on dört) gün içerisinde, SATICI’ya bildirmek şartıyla hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkını kullanabilir.
        </p>
      </section>

      {/* 9. Cayma Hakkı Kullanılamayacak Ürünler */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">9. Cayma Hakkı Kullanılamayacak Ürünler</h2>
        <p className="text-gray-700">
          ALICI’nın isteği veya açıkça kişisel ihtiyaçları doğrultusunda hazırlanan ve geri gönderilmeye müsait olmayan, iç giyim alt parçaları, mayo ve bikini altları, makyaj malzemeleri, tek kullanımlık ürünler, çabuk bozulma tehlikesi olan veya son kullanma tarihi geçme ihtimali olan mallar, ALICI’ya teslim edilmesinin ardından ALICI tarafından ambalajı açıldığı takdirde iade edilmesi sağlık ve hijyen açısından uygun olmayan ürünler, teslim edildikten sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan ürünler, Abonelik sözleşmesi kapsamında sağlananlar dışında, gazete ve dergi gibi süreli yayınlara ilişkin mallar, Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallar, ile ses veya görüntü kayıtlarının, kitap, dijital içerik, yazılım programlarının, veri kaydedebilme ve veri depolama cihazlarının, bilgisayar sarf malzemelerinin, ambalajının ALICI tarafından açılmış olması halinde iadesi Yönetmelik gereği mümkün değildir.
        </p>
      </section>

      {/* 10. Yetkili Mahkeme */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">10. Yetkili Mahkeme</h2>
        <p className="text-gray-700">
          İşbu sözleşmeden doğan uyuşmazlıklarda şikayet ve itirazlar, aşağıdaki kanunda belirtilen parasal sınırlar dâhilinde tüketicinin yerleşim yerinin bulunduğu veya tüketici işleminin yapıldığı yerdeki tüketici sorunları hakem heyetine veya tüketici mahkemesine yapılacaktır.
        </p>
      </section>

      {/* 11. Yürürlük */}
      <section className="space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">11. Yürürlük</h2>
        <p className="text-gray-700">
          ALICI, Site üzerinden verdiği siparişe ait ödemeyi gerçekleştirdiğinde işbu sözleşmenin tüm şartlarını kabul etmiş sayılır. SATICI, siparişin gerçekleşmesi öncesinde işbu sözleşmenin sitede ALICI tarafından okunup kabul edildiğine dair onay alacak şekilde gerekli yazılımsal düzenlemeleri yapmakla yükümlüdür.
        </p>
      </section>

      {/* İmza Bölümü */}
      <div className="flex justify-between mt-8 border-t pt-4">
        <div>
          <p className="font-semibold">SATICI: ŞİRKET ADI</p>
        </div>
        <div>
          <p className="font-semibold">ALICI: [ALICI Ad-Soyad]</p>
        </div>
      </div>
    </div>
  );
};

export default MesafeliSatisSozlesmesi;