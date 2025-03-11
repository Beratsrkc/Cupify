import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const References = () => {
  const { backendUrl } = useContext(ShopContext);
  const [referenceImages, setReferenceImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Referans resimlerini çek
  const fetchReferenceImages = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/images/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Sadece type: "reference" olan resimleri filtrele
      const filteredImages = response.data.images.filter(
        (image) => image.type === 'reference'
      );
      setReferenceImages(filteredImages);
    } catch (error) {
      console.error('Referans resimleri yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferenceImages();
  }, []);

  if (isLoading) return <div>Yükleniyor...</div>;

  // Animasyon süresini dinamik olarak hesapla
  const animationDuration = referenceImages.length * 5; // Her resim için 5 saniye

  return (
    <>
      {/* CSS Stilleri */}
      <style>
        {`
          .slider {
            height: 150px; /* Yüksekliği biraz artırdık */
            margin: auto;
            overflow: hidden;
            position: relative;
            width: 100%; /* Slider'ın genişliği tam ekran */
           
          }

          .slider::before,
          .slider::after {
            background: linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
            content: "";
            height: 100%;
            position: absolute;
            width: 100px; /* Gradient genişliğini azalttık */
            z-index: 2;
          }

          .slider::after {
            right: 0;
            top: 0;
            transform: rotateZ(180deg);
          }

          .slider::before {
            left: 0;
            top: 0;
          }

          .slide-track {
            animation: scroll ${animationDuration}s linear infinite; /* Dinamik animasyon süresi */
            display: flex;
            align-items: center; /* Resimleri dikeyde ortala */
            gap: 10px; /* Resimler arası boşluk */
            width: max-content; /* İçeriğe göre genişlik */
          }

          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%); /* Sabit kaydırma mesafesi */
            }
          }

          .slide {
            height: 100px;
            width: 200px; /* Sabit resim genişliği */
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px; /* Köşeleri yuvarlak yap */
          }

          .slide img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain; /* Resimleri orantılı olarak sığdır */
          }

          /* Mobil cihazlar için stil ayarları */
          @media (max-width: 640px) {
            .slider::before,
            .slider::after {
              display: none; /* Gradient efektlerini kaldır */
            }

            .slide-track {
              gap: 5px; /* Resimler arası boşluğu daha da azalt */
            }

            .slide {
              height: 80px; /* Resim yüksekliğini azalt */
              width: 120px; /* Resim genişliğini azalt */
            }
          }
        `}
      </style>

      {/* Slider Yapısı */}
      <div className="text-center mb-5 py-8   ">
        <Title text2={'REFERANSLAR'} />
      </div>
      <div className="slider">
        <div className="slide-track">
          {/* Resimleri üç kez ekleyerek sonsuz döngü efekti oluştur */}
          {[...referenceImages, ...referenceImages, ...referenceImages].map((image, index) => (
            <div className="slide" key={`${image._id}-${index}`}>
              <img
                src={image.imageUrl}
                alt={`Referans ${index + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default References;