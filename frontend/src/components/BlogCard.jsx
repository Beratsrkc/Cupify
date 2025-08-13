import React from "react";
import { Link } from "react-router-dom";

// Slug oluşturma fonksiyonu
const createSlug = (title) => {
  return title
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

const BlogCard = ({ blog }) => {
  // Tüm içeriği birleştir
  const fullContent = blog.content.map((item) => item.text).join(" ");

  // Slug oluştur
  const slug = createSlug(blog.title);

  return (
    <div className="bg-white rounded-lg border shadow-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-[400px] flex flex-col">
      {/* Resim Alanı (Sabit Boyut) */}
      <Link to={`/blog/${slug}`} className="block relative h-48 overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* İçerik Alanı */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Tarih */}
        <span className="text-sm text-gray-500">
          {new Date(blog.createdAt).toLocaleDateString()}
        </span>

        {/* Başlık (Üç Nokta ile Kısaltma) */}
        <h2 className="mt-2 text-xl font-bold text-gray-800 line-clamp-1">
          <Link to={`/blog/${slug}`}>{blog.title}</Link>
        </h2>

        {/* Metin (Üç Nokta ile Kısaltma) */}
        <p className="mt-4 text-gray-600 line-clamp-2 flex-1">
          {fullContent}
        </p>

        {/* Devamını Oku Butonu */}
        <div className="mt-6">
          <Link
            to={`/blog/${slug}`}
            className="inline-block px-6 py-2 bg-orangeBrand text-white rounded-lg hover:bg-orangeBrandDark transition-colors duration-200"
          >
            Devamını Oku
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;