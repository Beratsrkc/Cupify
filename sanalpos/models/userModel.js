import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, // Şifreyi String olarak değiştirin
    cartData: { type: Object, default: {} }
}, { minimize: false });

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
