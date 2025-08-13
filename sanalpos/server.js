import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import morgan from 'morgan';
import categoryRouter from './routes/categoryRouter.js';
import imageRoutes from './routes/imageRouter.js';
import blogRouter from './routes/blogRoutes.js';
import { payTRPayment, payTRCallback } from './controllers/paymentController.js';

dotenv.config();

// Express app oluşturma
const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://cupify.com.tr', 
    'https://www.cupify.com.tr', 
    'https://cupify-adminpanel.vercel.app', 
    'https://admin.cupify.com.tr', 
];
  
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy blocked this request'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// PayTR Ödeme Rotası
app.post('/api/payment/paytr', payTRPayment);
app.post('/api/payment/paytr/callback', payTRCallback);

// API test rotası
app.get('/', (req, res) => {
    res.send('API is working');
});

// Router'ları kullanma
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/category', categoryRouter);
app.use('/api/images', imageRoutes);
app.use("/api/blogs", blogRouter);

// Veritabanı ve Cloudinary bağlantıları
connectDB();
connectCloudinary();

// Sunucuyu başlat
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});