import React from 'react'
import { TbArrowBackUp, TbTruckDelivery } from 'react-icons/tb'
import { RiSecurePaymentLine, RiSpectrumLine } from 'react-icons/ri'

const ProductFeatures = () => {
    return (
        <div className="mt-12 p-4 bg-gray-100 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 rounded-xl">

                <div className="flexCenter gap-x-4 p-2 rounded-3xl">
                    <div className="text-3xl">
                        <TbArrowBackUp className='mb-3 text-yellow-500'/>
                    </div>
                    <div>
                        <h4 className="h4 capitalize">Kolay İade</h4>
                        <p>Ambalaj ürünleriniz beklentilerinizi karşılamadığında, kolay iade imkanı sunuyoruz. 14 gün içinde ücretsiz iade.</p>
                    </div>
                </div>

                <div className="flexCenter gap-x-4 p-2 rounded-3xl">
                    <div className="text-3xl">
                        <TbTruckDelivery className='mb-3 text-red-500'/>
                    </div>
                    <div>
                        <h4 className="h4 capitalize">Hızlı Teslimat</h4>
                        <p>Özel ambalaj siparişleriniz en hızlı şekilde üretilir ve aynı gün kargoya verilir. 1-3 iş günü içinde teslimat.</p>
                    </div>
                </div>

                <div className="flexCenter gap-x-4 p-2 rounded-3xl">
                    <div className="text-3xl">
                        <RiSecurePaymentLine className='mb-3 text-blue-500' />
                    </div>
                    <div>
                        <h4 className="h4 capitalize">Güvenli Ödeme</h4>
                        <p>256-bit SSL şifreleme ile güvenli alışveriş. Kredi kartı, banka havalesi ve kapıda ödeme seçenekleri.</p>
                    </div>
                </div>

                {/* Ekstra özellikler (isteğe bağlı) */}
                <div className="flexCenter gap-x-4 p-2 rounded-3xl">
                    <div className="text-3xl">
                        <RiSpectrumLine className='mb-3 text-green-500' />
                    </div>
                    <div>
                        <h4 className="h4 capitalize">Özel Tasarım</h4>
                        <p>Kurumsal kimliğinize uygun özel ambalaj tasarımları. Profesyonel tasarım ekibimizle çözüm ortaklığı.</p>
                    </div>
                </div>

                <div className="flexCenter gap-x-4 p-2 rounded-3xl">
                    <div className="text-3xl">
                        <RiSpectrumLine className='mb-3 text-purple-500' />
                    </div>
                    <div>
                        <h4 className="h4 capitalize">Uygun Fiyat</h4>
                        <p>Yüksek kaliteli ambalajları uygun fiyatlarla sunuyoruz. Toplu alımlarda özel indirimler.</p>
                    </div>
                </div>

                <div className="flexCenter gap-x-4 p-2 rounded-3xl">
                    <div className="text-3xl">
                        <RiSpectrumLine className='mb-3 text-orange-500' />
                    </div>
                    <div>
                        <h4 className="h4 capitalize">Eko Çözümler</h4>
                        <p>Çevre dostu, geri dönüştürülebilir ambalaj seçenekleriyle sürdürülebilir çözümler sunuyoruz.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductFeatures