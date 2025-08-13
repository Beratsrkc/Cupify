const crypto = require('crypto');
const Order = require('../models/orderModel'); // Sipariş modeliniz

const handlePayTRCallback = async (req, res) => {
    try {
        const callback = req.body;
        
        // PayTR bilgileri
        const merchant_key = process.env.PAYTR_MERCHANT_KEY;
        const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

        // Hash doğrulama
        const paytr_token = callback.merchant_oid + merchant_salt + callback.status + callback.total_amount;
        const calculated_hash = crypto.createHmac('sha256', merchant_key)
                                    .update(paytr_token)
                                    .digest('base64');

        if (calculated_hash !== callback.hash) {
            console.error('Hash doğrulama başarısız:', {
                received_hash: callback.hash,
                calculated_hash
            });
            return res.status(400).send('Invalid hash');
        }

        // Siparişi veritabanında bul
        const order = await Order.findOne({ orderId: callback.merchant_oid });
        
        if (!order) {
            console.error('Sipariş bulunamadı:', callback.merchant_oid);
            return res.send('OK'); // Yine de OK dönüyoruz
        }

        // Eğer sipariş zaten işlenmişse
        if (order.status === 'completed' || order.status === 'cancelled') {
            return res.send('OK');
        }

        // Ödeme durumuna göre işlem yap
        if (callback.status === 'success') {
            // Ödeme başarılı
            order.status = 'completed';
            order.paymentStatus = 'paid';
            order.paymentAmount = callback.total_amount / 100; // Kuruştan TL'ye çevir
            order.paymentMethod = 'paytr';
            order.paymentDate = new Date();
            
            // Siparişi güncelle
            await order.save();
            
            // Burada ek işlemler yapabilirsiniz (email gönderme, stok güncelleme vb.)
            console.log(`Sipariş tamamlandı: ${callback.merchant_oid}`);
        } else {
            // Ödeme başarısız
            order.status = 'cancelled';
            order.paymentStatus = 'failed';
            order.failedReason = callback.failed_reason_msg || 'Bilinmeyen hata';
            
            await order.save();
            console.log(`Sipariş iptal edildi: ${callback.merchant_oid}`);
        }
        if (callback.status === 'failed') {
    // Hata koduna göre özel işlemler
    switch(callback.failed_reason_code) {
        case '1':
            console.log('3D Secure doğrulaması yapılmadı');
            break;
        case '2':
            console.log('3D Secure doğrulaması başarısız');
            break;
        case '3':
            console.log('Güvenlik kontrolü başarısız');
            break;
        case '6':
            console.log('Müşteri ödemeyi iptal etti');
            break;
        case '11':
            console.log('Fraud (dolandırıcılık) şüphesi');
            // Burada ek güvenlik önlemleri alabilirsiniz
            break;
        default:
            console.log('Diğer ödeme hatası:', callback.failed_reason_msg);
    }
}

        // PayTR'ye cevap
        res.send('OK');
    } catch (error) {
        console.error('Callback işleme hatası:', error);
        res.status(500).send('Error processing callback');
    }
};

module.exports = { handlePayTRCallback };