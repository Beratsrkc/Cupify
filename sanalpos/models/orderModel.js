import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    // PayTR için gerekli alanlar
    merchant_oid: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String, // Telefon numaraları string olarak saklanmalı
        required: true
    },
    email: {
        type: String,
        required: true
    },
    items: [
        {
            name: String,
            price: Number,
            quantity: Number,
            kapak: String,
            baski: String,
            selectedQuantity: Number,
            size: String,
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        }
    ],
    amount: {
        type: Number,
        required: true
    },
    paymentAmount: { // Gerçek ödenen tutar (taksitli işlemlerde farklı olabilir)
        type: Number
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: [
            'Sipariş Verildi', // Ödeme bekleniyor
            'Ödeme Bekleniyor', // PayTR'ye yönlendirildi ama sonuç bekleniyor
            'Ödeme Alındı', // PayTR'den başarılı bildirim geldi
            'Hazırlanıyor',
            'Kargoya Verildi',
            'Teslim Edildi',
            'İptal Edildi', // Ödeme başarısız veya diğer nedenlerle iptal
            'İade Edildi'
        ],
        default: 'Sipariş Verildi'
    },
    payment: {
        type: Boolean,
        default: false
    },
    paymentMethod: {
        type: String,
        enum: ['PayTR', 'Havale', 'Kredi Kartı', 'Diğer'],
        default: 'PayTR'
    },
    paymentStatus: {
        type: String,
        enum: ['Bekleniyor', 'Başarılı', 'Başarısız', 'İade Edildi'],
        default: 'Bekleniyor'
    },
    paymentDate: {
        type: Date
    },
    failedReason: { // Ödeme neden başarısız oldu
        type: String
    },
    shippingTrackingNumber: {
        type: String
    },
    shippingCompany: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // createdAt ve updatedAt otomatik yönetimi
});

// Sipariş statüsü güncellendiğinde updatedAt'i güncelle
orderSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const orderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default orderModel;