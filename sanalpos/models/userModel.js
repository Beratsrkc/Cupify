// userModel.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  name: { type: String, required: true },
  selectedQuantity: { type: Number, required: true }, // DÜZELTİLDİ
  selectedSize: { type: String, required: true },
  selectedPrintingOption: { type: String, required: true },
  selectedCoverOption: { type: String, default: null },
  totalPrice: { type: Number, required: true },
  image: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cartData: { type: Map, of: cartItemSchema, default: {} },
}, { minimize: false });

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;