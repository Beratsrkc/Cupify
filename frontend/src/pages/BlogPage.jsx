import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import BlogCard from "../components/BlogCard";
import Title from "../components/Title";

const BlogPage = () => {
  const { backendUrl } = useContext(ShopContext);
  const [blogs, setBlogs] = useState([]); // Tüm bloglar
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Mevcut sayfa
  const [blogsPerPage] = useState(12); // Sayfa başına blog sayısı

  // Blogları backend'den çek
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/blogs`);
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error("Bloglar yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [backendUrl]);

  // Mevcut sayfadaki blogları hesapla
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Sayfa numaralarını hesapla
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(blogs.length / blogsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Sayfa değiştirme fonksiyonu
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="text-center mb-12">
          <Title text2={"Blog"} />
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            En son blog yazılarımızı keşfedin ve bilgi dünyasına adım atın.
          </p>
        </div>

        {/* Blog Listesi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>

        {/* Pagination Butonları */}
        <div className="flex justify-center mt-12">
          <nav>
            <ul className="flex space-x-2">
              {pageNumbers.map((number) => (
                <li key={number}>
                  <button
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 border ${
                      currentPage === number
                        ? "bg-orangeBrand text-white border-red-500"
                        : "bg-white text-gray-700 border-gray-300"
                    } rounded-md hover:bg-orangeBrandDark hover:text-white transition-all`}
                  >
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default BlogPage;