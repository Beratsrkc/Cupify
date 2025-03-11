import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css"; // Swiper CSS'ini içe aktar
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import BlogCard from "./BlogCard"; // BlogCard bileşenini içe aktar

const BlogList = () => {
  const { backendUrl } = useContext(ShopContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="text-center mb-12">
          <Title text2={"Blog"} />
          <p className="mt-4 text-[16px] sm:text-lg text-gray-600 max-w-2xl mx-auto">
            En son blog yazılarımızı keşfedin.
          </p>
        </div>

        {/* Swiper Slider (Tüm Ekran Boyutları İçin) */}
        <Swiper
          spaceBetween={25} // Kartlar arası boşluk
          slidesPerView={1} // Varsayılan olarak mobilde 1 kart göster
          autoplay={{ delay: 3000 }} // Otomatik kaydırma
          pagination={{ clickable: true }} // Sayfalama noktaları
          modules={[Autoplay, Pagination]} // Modüller
          loop={false} // Loop modunu kapat
          breakpoints={{
            // Responsive breakpoints
            320: {
              slidesPerView: 1, // Mobilde 1 kart göster
            },
            640: {
              slidesPerView: 2, // Küçük tablette 2 kart göster
            },
            900: {
              slidesPerView: 2, // Tablette 3 kart göster
            },
            1200: {
              slidesPerView: 3, // Masaüstünde 4 kart göster
            },
            1536: {
              slidesPerView: 4, // Geniş ekranlarda 5 kart göster
            },
          }}
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog._id}>
              <BlogCard blog={blog} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Swiper Pagination Stilleri */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: #cccc; /* red-500 */
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background-color: #ef4444; /* red-500 */
        }
        .swiper-pagination {
          position: relative;
          bottom: 0;
          margin-top: 20px; /* Pagination ile kartlar arasına boşluk ekleyin */
        }
      `}</style>
    </section>
  );
};

export default BlogList;