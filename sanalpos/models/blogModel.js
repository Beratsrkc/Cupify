// models/blogModel.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // Resim URL'si veya dosya yolu
    required: true,
  },
  content: [
    {
      subtitle: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const blogModel = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default blogModel;