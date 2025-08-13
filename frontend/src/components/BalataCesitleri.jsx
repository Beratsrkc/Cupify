import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { assets } from "../assets/assets";
import Title from "./Title";

const CategorySlider = () => {
  const navigate = useNavigate();

  // Sabit kategori verisi
  const categories = [
    {
      _id: "689cac707e5bbda5f89ba8a1",
      name: "Karton Bardaklar",
      image: assets.Bardaklar, // Daha büyük resim
      subCategory: "",
    },
    {
      _id: "689cac697e5bbda5f89ba89f",
      name: "Kaseler",
      image: assets.Kaseler,
      subCategory: "",
    },
    {
      _id: "689cac7d7e5bbda5f89ba8a3",
      name: "Karton Kutular",
      image: assets.KartonKutular,
      subCategory: "",
    },
    {
      _id: "689cacb67e5bbda5f89ba8a9",
      name: "Cafe Restaurant",
      image: assets.CafeRestaurant,
      subCategory: "",
    },
    {
      _id: "689cac977e5bbda5f89ba8a7",
      name: "Karton Çantlar",
      image: assets.KartonÇantlar,
      subCategory: "",
    },
  ];

  // Kategoriye tıklandığında ilgili kategori sayfasına yönlendir
  const handleCategoryClick = (categoryId, subCategory) => {
    navigate(`/urunler?category=${categoryId}&subCategory=${subCategory}`);
  };

  return (
    <div className="my-10 ">
      <div className='my-10'>
                {/* Başlık, Gezinme Butonları ve Tümünü Gör Butonu */}
                <div className='flex justify-between items-center text-3xl py-2'>
                    <Title text1={"POPÜLER"} text2={"KATEGORİLER"} />

                    {/* Gezinme Butonları */}
                    </div>
                <hr className="border-t-2 border-gray-300" />
            </div>
      <Swiper
        slidesPerView={1} // Mobilde 1 kart göster
        spaceBetween={20}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 3 }, // Tablette 2 kart göster
          1024: { slidesPerView: 5 }, // Masaüstünde 4 kart göster
        }}
        modules={[Autoplay]}
        className="mySwiper"
      >
        {categories.map((category) => (
          <SwiperSlide key={category._id}>
            <div
              className="relative  shadow-lg overflow-hidden cursor-pointer group bg-gray-200 "
              onClick={() =>
                handleCategoryClick(category._id, category.subCategory)
              }
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full  object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white text-2xl font-bold text-center">
                  {category.name}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategorySlider;
