import express from 'express';
import { addCategory, listCategories } from '../controllers/categoryController.js';
import adminAuth from '../middleware/adminAuth.js';
import CategoryModel from '../models/CategoryModel.js'; // Eksik olan import
const categoryRouter = express.Router();

categoryRouter.post('/add', adminAuth, addCategory);
categoryRouter.get('/list', listCategories);
categoryRouter.patch('/:categoryId/add-subcategory', adminAuth, async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { subCategory } = req.body;

        console.log(`Alt kategori ekleme isteği alındı. Kategori ID: ${categoryId}, Alt Kategori: ${subCategory}`); // Log ekleyin

        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Kategori bulunamadı' });
        }

        category.subCategories.push(subCategory);
        await category.save();

        res.json({ success: true, message: 'Alt kategori eklendi', category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});
export default categoryRouter;