import orderModel from '../models/orderModel.js';
import userModel from "../models/userModel.js";

// Yeni PayTR sipariş oluşturma fonksiyonu
const placeOrderPayTR = async (req, res) => {
    try {
        const { userId, items, amount, address, name, phone, email, merchant_oid } = req.body;

        if (!userId || !items || !amount || !address || !merchant_oid) {
            return res.status(400).json({ 
                success: false, 
                message: "Eksik bilgi gönderildi." 
            });
        }

        const orderData = {
            merchant_oid, // PayTR'den gelen benzersiz sipariş numarası
            userId,
            items,
            name,
            phone,
            email, // PayTR için email gerekli
            address,
            amount,
            payment: false, // Başlangıçta false, callback'de true yapılacak
            paymentMethod: 'PayTR',
            status: 'Ödeme Bekleniyor', // Yeni durum yönetimi
            date: new Date(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();
        
        // Sepeti temizle (ödeme başarılı olursa callback'de yapılabilir)
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.status(201).json({ 
            success: true, 
            order: newOrder,
            message: "Sipariş oluşturuldu, ödeme bekleniyor."
        });
    } catch (error) {
        console.error("Sipariş oluşturma hatası:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Sipariş oluşturulamadı.",
            error: error.message
        });
    }
};

// Sipariş durumunu güncelle (callback için)
const updateOrderStatus = async (req, res) => {
    try {
        const { merchant_oid, status, payment_amount, failed_reason } = req.body;

        const updateData = {
            status: status === 'success' ? 'Ödeme Alındı' : 'İptal Edildi',
            payment: status === 'success',
            paymentAmount: payment_amount ? payment_amount / 100 : null,
            ...(status !== 'success' && { failedReason: failed_reason })
        };

        const updatedOrder = await orderModel.findOneAndUpdate(
            { merchant_oid },
            updateData,
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ 
                success: false, 
                message: "Sipariş bulunamadı." 
            });
        }

        res.json({ 
            success: true, 
            order: updatedOrder,
            message: `Sipariş durumu güncellendi: ${updateData.status}`
        });
    } catch (error) {
        console.error("Sipariş durumu güncelleme hatası:", error);
        res.status(500).json({ 
            success: false, 
            message: "Sipariş durumu güncellenemedi.",
            error: error.message
        });
    }
};
// Tüm siparişleri getir
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Could not fetch orders" });
        }
    }
};
// Kullanıcıya ait siparişleri getir
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        const orders = await orderModel.find({ userId });

        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Could not fetch orders" });
        }
    }
};

// Sipariş durumunu güncelle
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

  
     await orderModel.findByIdAndUpdate(orderId, { status });

        res.json({ success: true,message:'Durum Güncellendi' });
    } catch (error) {
        console.error("Error updating order status:", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Could not update order status" });
        }
    }
};

// Diğer fonksiyonlar aynı kalabilir (allOrders, userOrders, updateStatus)
export { 
    placeOrderPayTR as placeOrder, 
    allOrders, 
    userOrders, 
    updateStatus,
    updateOrderStatus 
};