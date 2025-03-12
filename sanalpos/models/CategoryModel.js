import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subCategories: [{ type: String }]
});
    
const CategoryModel = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default CategoryModel;
