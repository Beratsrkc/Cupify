import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({ token }) => {

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [newprice, setNewPrice] = useState("");
  const [category, setCategory] = useState("Tel-Grubu");
  const [subCategory, setSubCategory] = useState("Yagmur");
  const [bestseller, setBestseller] = useState(false);

  // Buton durumu
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);  // Butonu devre dışı bırak

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("newprice", newprice);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(backendUrl + "/api/product/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) { 
        toast.success("Ürün başarıyla eklendi");
        setName('');
        setDescription('');
        setImage1('');
        setImage2('');
        setImage3('');
        setImage4('');
        setPrice('');
        setNewPrice('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      // 5 saniye sonra butonu aktif et
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
  };


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      {/* Image upload area */}
      <div>
        <p className='mb-2'>Resim Yükle</p>
        <div className='flex gap-4'>
          <label htmlFor="image1">
            <img className='w-28' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="resimyukle" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id='image1' hidden />
          </label>
          <label htmlFor="image2">
            <img className='w-28' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="resimyukle" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id='image2' hidden />
          </label>
          <label htmlFor="image3">
            <img className='w-28' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="resimyukle" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id='image3' hidden />
          </label>
          <label htmlFor="image4">
            <img className='w-28' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="resimyukle" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id='image4' hidden />
          </label>
        </div>
      </div>

      {/* Product Name */}
      <div className='w-full'>
        <p className='mb-2'>Ürün Adı</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Ürünün adı' required />
      </div>

      {/* Product Description */}
      <div className='w-full'>
        <p className='mb-2'>Ürün Detayları</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Ürünün açıklaması' required />
      </div>

      {/* Category and Subcategory */}
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-12'>
        <div>
          <p className='mb-2'>Kategori</p>
          <select onChange={(e) => setCategory(e.target.value)} className='w-full px-5 py-2'>
            <option value="Tel-Grubu">Tel Grubu</option>
            <option value="Manet-ve-Gaz-Kolu">Manet ve Gaz Kolu</option>
            <option value="Balata-Cesitleri">Balata Çeşitleri</option>
            <option value="Klemens-Takoz-Cesitleri">Klemens Takoz Çeşitleri</option>
            <option value="Diger">Diğer</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Markalar </p>
          <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-5 py-2'>
            <option value="Yagmur">Yağmur</option>
            <option value="Taral">Taral</option>
            <option value="Flash">Flash</option>
            <option value="Antrac">Antrac</option>
            <option value="Beybolat">Beybolat</option>
            <option value="Bertolini">Bertolini</option>
            <option value="Kaan">Kaan</option>
            <option value="Oleo-Mac">Oleo-Mac</option>
            <option value="Stihl">Stihl</option>
            <option value="Diger">Diğer</option>
          </select>
        </div>
      </div>

      {/* Price */}
      <div className='w-full'>
        <p className='mb-2'>Ürün Fiyatı</p>
        <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full sm:w-[120px] px-5 py-2' type="number" placeholder='Fiyat' />
      </div>
      <div className='w-full'>
        <p className='mb-2'>Ürün Kampanyalı fiayatı Fiyatı</p>
        <input onChange={(e) => setNewPrice(e.target.value)} value={newprice} className='w-full sm:w-[120px] px-5 py-2' type="number" placeholder='Fiyat' />
      </div>

      {/* Bestseller Checkbox */}
      <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
        <label className='cursor-pointer ' htmlFor="bestseller">Çok Satanlara ekle</label>
      </div>

      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white' disabled={isLoading} >
        {isLoading ? 'Yükleniyor...' : 'EKLE'}
      </button>
    </form>
  );
}

export default Add;
