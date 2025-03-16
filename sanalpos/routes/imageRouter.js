// routes/imageRoutes.js
import express from 'express';
import { addImage, listImages, removeImage } from '../controllers/ImageController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const imageRouter = express.Router();

// Resim ekleme (Admin yetkisi gerektirir)
imageRouter.post('/add', adminAuth, upload.single('image'), addImage);
    
// Tüm resimleri listeleme
imageRouter.get('/list', listImages);

// Resim silme (Admin yetkisi gerektirir)
imageRouter.post('/remove', adminAuth, removeImage);

export default imageRouter;