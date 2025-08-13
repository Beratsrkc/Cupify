import express from 'express';
import { payTRPayment, payTRCallback } from '../controllers/paymentController.js';

const router = express.Router();

// PayTR payment endpoint
router.post('/paytr', payTRPayment);

// PayTR callback endpoint
router.post('/paytr/callback', payTRCallback);

export default router;