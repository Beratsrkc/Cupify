import express from "express";
import {
  placeOrderIyzico,
  allOrders,
  userOrders,
  updateStatus,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin Routes
orderRouter.post("/list", adminAuth, allOrders); // Tüm siparişleri listele
orderRouter.post("/status", adminAuth, updateStatus); // Sipariş durumunu güncelle

// Payment Routes
orderRouter.post("/iyzico", authUser, placeOrderIyzico); // Ödeme ve sipariş oluşturma

// User Routes
orderRouter.post("/userorders", authUser, userOrders); // Kullanıcı siparişlerini getir

export default orderRouter;
