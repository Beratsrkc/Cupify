import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import adminAuth from "../middleware/adminAuth.js"; // Admin yetkilendirme middleware'i
import upload from "../middleware/multer.js"; // Multer middleware'i

const blogRouter = express.Router();

// Admin Routes
blogRouter.post("/create", adminAuth, upload.single('image'), createBlog); // Yeni blog oluştur
blogRouter.put("/update/:id", adminAuth, upload.single('image'), updateBlog); // Blog güncelle
blogRouter.delete("/delete/:id", adminAuth, deleteBlog); // Blog sil

// Public Routes
blogRouter.get("/", getAllBlogs); // Tüm blogları getir
blogRouter.get("/:id", getBlogById); // Tek bir blog getir

export default blogRouter;