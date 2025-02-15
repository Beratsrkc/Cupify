import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Authorization başlığını kontrol et
        if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith("Bearer ")) {
            console.error("Invalid or missing Authorization header:", authHeader);
            return res.status(401).json({ success: false, message: "Authorization header missing or invalid" });
        }

        const token = authHeader.split(" ")[1]; // "Bearer <token>" formatından token kısmını al
        if (!token || typeof token !== 'string') {
            console.error("Token not provided or invalid type:", token);
            return res.status(401).json({ success: false, message: "Token is missing or invalid" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in environment variables");
            return res.status(500).json({ success: false, message: "Server configuration error" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.admin = decoded; // decoded bilgileri isteğe ekle
        next();
    } catch (error) {
        console.error("Admin auth error:", error.message);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default adminAuth;
