import express from "express";
import {
    placeOrder,
    allOrders,
    userOrders,
    updateStatus,
    updateOrderStatus
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin Routes
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment Routes (Iyzico yerine PayTR)
orderRouter.post("/", authUser, placeOrder); // Yeni endpoint
orderRouter.post("/callback", updateOrderStatus); // PayTR callback için

// User Routes
orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;