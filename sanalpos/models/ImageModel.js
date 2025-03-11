// models/ImageModel.js
import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['gallery', 'reference'], // Galeri veya Referans
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const ImageModel = mongoose.models.Image || mongoose.model('Image', imageSchema);

export default ImageModel;