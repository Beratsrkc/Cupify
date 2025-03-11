import CategoryModel from '../models/CategoryModel.js';

const addCategory = async (req, res) => {
    try {
        const { name, subCategories } = req.body;

        const category = new CategoryModel({ name, subCategories });
        await category.save();

        res.json({ success: true, message: 'Category Added', category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find({});
        res.json({ success: true, categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addCategory, listCategories };