import orderModel from '../models/orderModel.js';
import userModel from "../models/userModel.js";

// Sipariş oluşturma fonksiyonu
const placeOrderIyzico = async (req, res) => {
    try {
        const { userId, items, amount, address,name,phone } = req.body;

        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ success: false, message: "Eksik bilgi gönderildi." });
        }

        const orderData={
            userId,
            items,
            name,
            phone,
            address,
            amount,
            payment: true,
            date: new Date(),
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();
        

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
        console.error("Sipariş oluşturma hatası:", error.message);
        res.status(500).json({ success: false, message: "Sipariş oluşturulamadı." });
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
export { placeOrderIyzico, allOrders, userOrders, updateStatus };