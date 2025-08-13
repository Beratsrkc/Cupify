import crypto from "crypto";
import axios from "axios";
import Order from "../models/orderModel.js";

export const payTRPayment = async (req, res) => {
  try {
    const {
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      price,
      userDetails,
      basketItems,
      installmentCount = 1
    } = req.body;

    // PayTR credentials
    const merchant_id = process.env.PAYTR_MERCHANT_ID;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

    // Generate unique order ID
    const merchant_oid = "ORD" + Date.now();

    // Get user IP (use req.ip in production)
    const user_ip = req.ip || "85.34.78.112";

    // Prepare payment data
    const payment_amount = Math.round(price * 100); // Convert to kuruş
    const email = userDetails.email;
    const payment_type = "card";

    // Create hash for security
    const hash_str = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${payment_type}${installmentCount}TL`;
    const paytr_token = crypto
      .createHmac("sha256", merchant_key)
      .update(hash_str + merchant_salt)
      .digest("base64");

    // Prepare basket items
    const user_basket = basketItems.map(item => [
      item.name,
      item.price.toFixed(2),
      item.quantity
    ]);

    // Payment data to send to PayTR
    const paymentData = {
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount,
      payment_type,
      installment_count: installmentCount,
      currency: "TL",
      user_name: `${userDetails.firstName} ${userDetails.lastName}`,
      user_address: userDetails.addressInput,
      user_phone: userDetails.phone,
      merchant_ok_url: `${process.env.FRONTEND_URL}/payment-success`,
      merchant_fail_url: `${process.env.FRONTEND_URL}/payment-fail`,
      user_basket: JSON.stringify(user_basket),
      paytr_token,
      debug_on: process.env.NODE_ENV === 'development' ? 1 : 0,
      cc_owner: cardHolderName,
      card_number: cardNumber,
      expiry_month: expireMonth,
      expiry_year: expireYear,
      cvv: cvc
    };

    // First create the order in database with "pending" status
    const newOrder = new Order({
      merchant_oid,
      userId: userDetails._id,
      name: `${userDetails.firstName} ${userDetails.lastName}`,
      phone: userDetails.phone,
      email: userDetails.email,
      items: basketItems,
      amount: price,
      paymentAmount: payment_amount / 100,
      address: userDetails.addressInput,
      city: userDetails.city,
      district: userDetails.district,
      status: "Ödeme Bekleniyor",
      payment: false,
      paymentMethod: "PayTR"
    });

    await newOrder.save();

    // Send payment request to PayTR
    const response = await axios.post(
      "https://www.paytr.com/odeme",
      paymentData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json({
      status: "success",
      paymentResult: response.data,
      merchant_oid // Return order ID for reference
    });

  } catch (error) {
    console.error("PayTR payment error:", error);
    res.status(500).json({
      status: "error",
      message: "Payment failed",
      error: error.response?.data || error.message,
    });
  }
};

export const payTRCallback = async (req, res) => {
  try {
    const callback = req.body;
    
    // PayTR credentials
    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

    // Verify hash
    const paytr_token = callback.merchant_oid + merchant_salt + callback.status + callback.total_amount;
    const calculated_hash = crypto
      .createHmac("sha256", merchant_key)
      .update(paytr_token)
      .digest("base64");

    if (calculated_hash !== callback.hash) {
      console.error('Hash verification failed:', {
        received_hash: callback.hash,
        calculated_hash
      });
      return res.status(400).send('Invalid hash');
    }

    // Find the order
    const order = await Order.findOne({ merchant_oid: callback.merchant_oid });
    
    if (!order) {
      console.error('Order not found:', callback.merchant_oid);
      return res.send('OK');
    }

    // Check if already processed
    if (order.status === 'Ödeme Alındı' || order.status === 'İptal Edildi') {
      return res.send('OK');
    }

    // Update order based on payment status
    if (callback.status === 'success') {
      // Payment successful
      order.status = 'Ödeme Alındı';
      order.payment = true;
      order.paymentAmount = callback.total_amount / 100;
      order.paymentDate = new Date();
      
      // Here you can add additional logic like:
      // - Send confirmation email
      // - Update product stocks
      // - Trigger shipping process
      
      console.log(`Payment successful for order: ${callback.merchant_oid}`);
    } else {
      // Payment failed
      order.status = 'İptal Edildi';
      order.payment = false;
      order.failedReason = callback.failed_reason_msg || 'Payment failed';
      
      console.log(`Payment failed for order: ${callback.merchant_oid}`, {
        reason: callback.failed_reason_msg,
        code: callback.failed_reason_code
      });
    }

    await order.save();
    res.send('OK');

  } catch (error) {
    console.error('Callback processing error:', error);
    res.status(500).send('Error processing callback');
  }
};