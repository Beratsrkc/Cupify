import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FaFacebook, FaTwitter, FaUser, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const BlogDetail = () => {
  const { backendUrl } = useContext(ShopContext);
  const { slug } = useParams(); // URL'den slug'ı al
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Tüm blogları çek
        const response = await axios.get(`${backendUrl}/api/blogs`);
        const blogs = response.data.blogs;

        // Slug'a göre blogu bul
        const foundBlog = blogs.find((blog) => generateSlug(blog.title) === slug);

        if (foundBlog) {
          setBlog(foundBlog);
        } else {
          console.error("Blog bulunamadı.");
        }
      } catch (error) {
        console.error("Bloglar yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [slug, backendUrl]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <div className="text-center py-10">Yükleniyor...</div>;
  }

  if (!blog) {
    return <div className="text-center py-10">Blog bulunamadı.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        {/* Geri Dön Butonu */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Geri Dön
          </button>
        </div>

        {/* Başlık */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
        >
          {blog.title}
        </motion.h1>

        {/* Yazar ve Tarih */}
        <div className="flex items-center mb-8 text-gray-600">
          <FaUser className="mr-2" />
          <span className="mr-4">Cupify</span> {/* Yazar adını dinamik olarak ekleyebilirsiniz */}
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Blog Resmi */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <img
            src={blog.image}
            alt="Blog Resmi"
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </motion.div>

        {/* İçerik */}
        <div className="prose max-w-none text-container">
          {blog.content.map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 * index }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">{item.subtitle}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Paylaşım Butonları */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4">Bu yazıyı paylaş</h3>
          <div className="flex space-x-4">
            {[
              { Icon: FaFacebook, label: "Facebook" },
              { Icon: FaTwitter, label: "Twitter" },
            ].map(({ Icon, label }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.1 }}
                className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <Icon className="mr-2" />
                <span>{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BlogDetail;