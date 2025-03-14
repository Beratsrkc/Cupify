import express from 'express';
import Iyzipay from 'iyzipay';
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

dotenv.config();

// İyzico API ayarları
if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY || !process.env.IYZICO_BASE_URL) {
    throw new Error('İyzico environment değişkenleri eksik');
}

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL,
});

// Express app oluşturma
const app = express();
    
// Middleware
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://cupify.com.tr', 
    'https://www.cupify.com.tr', 
    'https://admin.cupify.com.tr', 
    'https://cupify.com.tr/admin', 
    'https://www.cupify.com.tr/admin',
    'https://api.cupify.com.tr',  
];

app.use(cors({
    origin: function (origin, callback) {
        // Eğer origin tanımlı değilse veya izin verilenler listesindeyse kabul et
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy blocked this request'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Ödeme rotası
// Ödeme Endpoint
app.post('/api/payment', async (req, res) => {
    try {
        const { price, paidPrice, currency, basketId, paymentCard, buyer, shippingAddress, billingAddress, basketItems, installment} = req.body;

    
        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: '123456789',
            price: price,
            paidPrice: paidPrice,
            currency,
            installment: installment.toString(),
            basketId,
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            paymentCard,
            buyer,
            shippingAddress,
            billingAddress,
            basketItems,
        };

        iyzipay.payment.create(request, async (err, result) => {
            if (err) {
                console.error('Iyzipay API Hatası:', err);
                return res.status(400).json({ status: 'failure', errorMessage: err.message });
            }
            if (result.status !== 'success') {
                console.error('Iyzipay Ödeme Hatası:', {
                    errorMessage: result.errorMessage,
                    errorCode: result.errorCode,
                    errorGroup: result.errorGroup,
                    request: request // İstek detaylarını da loglayabilirsiniz
                });
                return res.status(400).json({ status: 'failure', errorMessage: result.errorMessage });
            }
            // Ödeme başarılı, sipariş kaydetme işlemi frontend'den yapılacak
            return res.status(200).json({ status: 'success', message: 'Ödeme başarılı', paymentResult: result });
        });
    } catch (error) {
        res.status(500).json({ message: 'Beklenmedik bir hata oluştu', error: error.message });
    }
});


// BIN Sorgulama Endpoint'i
app.post('/api/payment/bin/check', async (req, res) => {
    try {
        const { binNumber } = req.body;
        
        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: '123456789',
            binNumber
        };

        iyzipay.binNumber.retrieve(request, (err, result) => {
            if (err) {
                return res.status(400).json({
                    status: 'error',
                    message: 'BIN sorgulama başarısız'
                });
            }
           
            if (result.status === 'success') {
                // Iyzico formatına uygun yanıt
                const formattedResponse = {
                    binNumber,
                    cardType: result.cardType,
                    cardAssociation: result.cardAssociation,
                    cardFamily: result.cardFamily,
                    bankName: result.bankName,
                    bankCode: result.bankCode,
                    commercial: result.commercial,
                    status: result.status,
                    locale: result.locale,
                    systemTime: result.systemTime,
                    conversationId: result.conversationId
                };
                
                res.json(formattedResponse);
            } else {
                res.status(400).json({
                    status: 'error',
                    message: result.errorMessage
                });
            }
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: 'Sunucu hatası' 
        });
    }
});
// Örnek: Taksit Sorgulama Endpoint'i
app.post('/api/payment/installments', async (req, res) => {
    try {
        const { binNumber, price } = req.body;

        if (!binNumber || !price) {
            return res.status(400).json({
                status: 'error',
                message: 'binNumber ve price zorunlu alanlardır'
            });
        }

        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: '123456789',
            binNumber,
            price
        };

        iyzipay.installmentInfo.retrieve(request, (err, result) => {
            if (err) {
                console.error('Iyzipay API hatası:', err);
                return res.status(500).json({
                    status: 'error',
                    message: 'Iyzipay API hatası'
                });
            }

            if (result.status !== 'success') {
                return res.status(400).json({
                    status: 'error',
                    message: result.errorMessage || 'Taksit bilgisi alınamadı'
                });
            }

            res.json({
                status: 'success',
                installments: result.installmentDetails
            });
        });
    } catch (error) {
        console.error('Sunucu hatası:', error);
        res.status(500).json({
            status: 'error',
            message: 'Sunucu hatası'
        });
    }
});

// API test rotası
app.get('/', (req, res) => {
    res.send('API is working');
});

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
