import express from 'express';
import { loginUser, registerUser, adminLogin, forgotPassword, resetPassword, sendContactEmail } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/forgot-password', forgotPassword); // Şifre sıfırlama isteği
userRouter.post('/reset-password', resetPassword); // Şifre sıfırlama işlemi
userRouter.post('/send-contact-email', sendContactEmail); // İletişim formu mesajı gönderme

export default userRouter;