import userModel from "../models/userModel.js";
import validator from 'validator';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// E-posta gönderme fonksiyonu
const sendResetEmail = async (email, resetLink) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Gmail hesabınız
                pass: process.env.EMAIL_PASSWORD, // Gmail şifreniz veya uygulama şifreniz
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Şifre Sıfırlama Bağlantısı',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <h1 style="color: #333333; text-align: center;">Şifre Sıfırlama İsteği</h1>
                        <p style="color: #555555; font-size: 16px; text-align: center;">
                            Şifrenizi sıfırlamak için aşağıdaki butona tıklayın.
                        </p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="${resetLink}" style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                                Şifremi Sıfırla
                            </a>
                        </div>
                        <p style="color: #777777; font-size: 14px; text-align: center;">
                            Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
                        </p>
                        <p style="color: #777777; font-size: 14px; text-align: center;">
                            Teşekkürler,<br>
                            <strong>Cupify.com.tr</strong>
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

 
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Kullanıcı bulunamadı." });
        }

      
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


        const resetLink = `${process.env.FRONTEND_URL}/ResetPassword?token=${resetToken}`;


        await sendResetEmail(user.email, resetLink);


        res.json({ success: true, message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' });
    } catch (error) {
        console.error('Hata Oluştu:', error); 
        res.json({ success: false, message: error.message });
    }
};



const resetPassword = async (req, res) => {
    try {


        const { token, newPassword, confirmPassword } = req.body;

        // Şifreler eşleşmiyorsa hata döndür
        if (newPassword !== confirmPassword) {
  
            return res.json({ success: false, message: 'Şifreler eşleşmiyor.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const user = await userModel.findById(decoded.id);
        if (!user) {

            return res.json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: 'Şifreniz başarıyla güncellendi.' });
    } catch (error) {
        console.error('Hata Oluştu:', error); // Hata logu
        res.json({ success: false, message: 'Geçersiz veya süresi dolmuş token.' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const lowerCaseEmail = email.toLowerCase(); 
        const user = await userModel.findOne({ email: lowerCaseEmail }); 

        if (!user) {
            return res.json({ success: false, message: "Kullanıcı bulunamadı." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Geçersiz şifre." });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const lowerCaseEmail = email.toLowerCase();

        if (!validator.isEmail(lowerCaseEmail)) {
            return res.json({ success: false, message: "Lütfen geçerli bir e-posta adresi girin." });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Lütfen güçlü bir şifre girin." });
        }

        const exists = await userModel.findOne({ email: lowerCaseEmail });
        if (exists) {
            return res.json({ success: false, message: "Bu e-posta adresi zaten kayıtlı." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email: lowerCaseEmail, // Küçük harfle kaydet
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// İletişim formu için mail gönderme fonksiyonu
const sendContactEmail = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Gmail hesabınız
                pass: process.env.EMAIL_PASSWORD, // Gmail şifreniz veya uygulama şifreniz
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'nikeflyinn@gmail.com', 
            subject: 'İletişim Formu Mesajı',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <h1 style="color: #333333; text-align: center;">İletişim Formu Mesajı</h1>
                        <p style="color: #555555; font-size: 16px;">
                            <strong>Ad:</strong> ${name}
                        </p>
                        <p style="color: #555555; font-size: 16px;">
                            <strong>E-posta:</strong> ${email}
                        </p>
                        <p style="color: #555555; font-size: 16px;">
                            <strong>Mesaj:</strong> ${message}
                        </p>
                        <p style="color: #777777; font-size: 14px; text-align: center;">
                            Teşekkürler,<br>
                            <strong>Cupify.com.tr</strong>
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Mesajınız başarıyla gönderildi.' });
    } catch (error) {
        console.error('Hata Oluştu:', error);
        res.json({ success: false, message: 'Mesaj gönderilirken bir hata oluştu.' });
    }
};

// Fonksiyonu export edin
export { loginUser, registerUser, adminLogin, forgotPassword, resetPassword, sendContactEmail };