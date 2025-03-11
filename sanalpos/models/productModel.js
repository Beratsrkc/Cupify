import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 120
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 2000
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true
  },
  subCategory: { 
    type: String, 
    required: true,
    trim: true
  },
  bestseller: { 
    type: Boolean, 
    default: false
  },
  images: { 
    type: [String], 
    required: true,
    validate: {
      validator: v => Array.isArray(v) && v.length > 0,
      message: 'En az bir resim gereklidir'
    }
  },
  date: { 
    type: Date, 
    default: Date.now
  },
  sizes: [{
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  quantities: [{
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30
    },
    multiplier: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  printingOptions: { // Baskı seçenekleri
    type: [String],
    default: []
  },
  coverOptions: {
    price: {
      type: Number,
      default: 0
    },
    colors: {
      type: [String],
      default: []
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Kategori ilişkisi için virtual populate
productSchema.virtual('categoryDetails', {
  ref: 'Category',
  localField: 'category',
  foreignField: '_id',
  justOne: true
});

const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;