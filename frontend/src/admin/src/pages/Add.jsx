import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { backendUrl, } from "../config";
const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [bestseller, setBestseller] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');

  const [sizes, setSizes] = useState([]); // Ebatlar için
  const [quantities, setQuantities] = useState([]); // Sipariş miktarları için
  const [currentQuantity, setCurrentQuantity] = useState(''); // Geçerli sipariş miktarı
  const [printingOptions, setPrintingOptions] = useState([]); // Baskı seçenekleri için
  const [currentPrintingOption, setCurrentPrintingOption] = useState(''); // Geçerli baskı seçeneği

  // Kapak seçeneği için state'ler
  const [includeCover, setIncludeCover] = useState(false); // Kapak eklemek istiyor mu?
  const [coverPrice, setCoverPrice] = useState(0); // Kapak fiyatı
  const [coverColors, setCoverColors] = useState([]); // Kapak renkleri
  const [currentCoverColor, setCurrentCoverColor] = useState(''); // Geçerli kapak rengi

  // Kategori ekleme formunun görünürlüğü için state
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Kapak rengi ekle
  const addCoverColor = () => {
    if (currentCoverColor) {
      setCoverColors([...coverColors, currentCoverColor]);
      setCurrentCoverColor(''); // Inputu temizle
    } else {
      toast.error('Lütfen geçerli bir renk girin!');
    }
  };

  // Kapak rengi sil
  const removeCoverColor = (index) => {
    const newCoverColors = coverColors.filter((_, i) => i !== index);
    setCoverColors(newCoverColors);
  };

  // Kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/category/list`);
        setCategories(response.data.categories);
      } catch (error) {
        toast.error('Kategoriler yüklenemedi');
      }
    };
    fetchCategories();
  }, []);

  // Yeni kategori ekle
  const addNewCategory = async () => {
    if (!newCategory) {
      toast.error('Kategori adı gerekli');
      return;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/category/add`,
        { name: newCategory, subCategories: [] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories([...categories, response.data.category]);
      setNewCategory('');
      toast.success('Kategori eklendi');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Hata oluştu');
    }
  };

  // Yeni alt kategori ekle
  const addNewSubCategory = async () => {
    if (!category || !newSubCategory) {
      toast.error('Kategori seçin ve alt kategori adı girin');
      return;
    }
    try {
      const response = await axios.patch(
        `${backendUrl}/api/category/${category}/add-subcategory`,
        { subCategory: newSubCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(categories.map(cat =>
        cat._id === category ? response.data.category : cat
      ));
      setNewSubCategory('');
      toast.success('Alt kategori eklendi');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Hata oluştu');
    }
  };

  // Ebat ekle
  const addSize = () => {
    setSizes([...sizes, { label: '', price: 0 }]);
  };

  // Ebat değişikliği
  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  // Sipariş miktarı ekle
  const addQuantity = () => {
    if (currentQuantity) {
      setQuantities([...quantities, { label: currentQuantity, multiplier: 1 }]);
      setCurrentQuantity(''); // Inputu temizle
    } else {
      toast.error('Lütfen geçerli bir miktar girin!');
    }
  };

  // Sipariş miktarı sil
  const removeQuantity = (index) => {
    const newQuantities = quantities.filter((_, i) => i !== index);
    setQuantities(newQuantities);
  };

  // Baskı seçeneği ekle
  const addPrintingOption = () => {
    if (currentPrintingOption) {
      setPrintingOptions([...printingOptions, currentPrintingOption]);
      setCurrentPrintingOption(''); // Inputu temizle
    } else {
      toast.error('Lütfen geçerli bir baskı seçeneği girin!');
    }
  };

  // Baskı seçeneği sil
  const removePrintingOption = (index) => {
    const newPrintingOptions = printingOptions.filter((_, i) => i !== index);
    setPrintingOptions(newPrintingOptions);
  };

  // Form gönderimi
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller); 
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('quantities', JSON.stringify(quantities));
      formData.append('printingOptions', JSON.stringify(printingOptions));
  

      // Kapak seçeneği ekle
      if (includeCover) {
        formData.append('coverOptions', JSON.stringify({
          price: coverPrice,
          colors: coverColors
        }));
      } else {
        formData.append('coverOptions', JSON.stringify({
          price: 0,
          colors: []
        }));
      }

      // Resimleri ekle
      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);
      if (image3) formData.append('image3', image3);
      if (image4) formData.append('image4', image4);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success('Ürün başarıyla eklendi');
        // Formu sıfırla
        setName('');
        setDescription('');
        setCategory('');
        setSubCategory('');
        setBestseller(false);
        setSizes([]);
        setQuantities([]);
        setCurrentQuantity('');
        setPrintingOptions([]);
        setCurrentPrintingOption('');
        setIncludeCover(false);
        setCoverPrice(0);
        setCoverColors([]);
        setCurrentCoverColor('');
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ürün Ekle</h1>
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
        {/* Resim Yükleme Alanı */}
        <div>
          <p className="mb-2">Resim Yükle</p>
          <div className="flex gap-4">
            {[image1, image2, image3, image4].map((image, index) => (
              <label key={index} htmlFor={`image${index + 1}`}>
                <img
                  className="w-28 cursor-pointer"
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt="resimyukle"
                />
                <input
                  onChange={(e) => {
                    const setImage = [setImage1, setImage2, setImage3, setImage4][index];
                    setImage(e.target.files[0]);
                  }}
                  type="file"
                  id={`image${index + 1}`}
                  hidden
                />
              </label>
            ))}
          </div>
        </div>

        {/* Ürün Adı */}
        <div>
          <p className="mb-2">Ürün Adı</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ürünün adı"
            className="w-full max-w-[500px] px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Ürün Açıklaması */}
        <div>
          <p className="mb-2">Ürün Detayları</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ürünün açıklaması"
            className="w-full max-w-[500px] px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Kategori Yönetimi */}
        <div className="rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
          >
            {showCategoryForm ? 'Kategori Ekleme Alanını Kapat' : 'Kategori Ekle'}
          </button>

          {showCategoryForm && (
            <div className="space-y-4">
              {/* Yeni Kategori Ekleme */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Yeni kategori adı"
                  className="w-full max-w-[500px] px-3 py-2 border rounded"
                />
                <button
                  type="button"
                  onClick={addNewCategory}
                  className="bg-orangeBrand text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Kategori Ekle
                </button>
              </div>

              {/* Yeni Alt Kategori Ekleme */}
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-2 border rounded"
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  placeholder="Yeni alt kategori adı"
                  className="w-full max-w-[345px] px-3 py-2 border rounded"
                />
                <button
                  type="button"
                  onClick={addNewSubCategory}
                  className="bg-orangeBrand text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Alt Kategori Ekle
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Kategori ve Alt Kategori Seçimi */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="">
            <p className="mb-2">Kategori</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-[250px] px-3 py-2 border rounded"
              required
            >
              <option value="">Kategori Seçin</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <p className="mb-2">Alt Kategori</p>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full max-w-[250px] px-3 py-2 border rounded"
              required
            >
              <option value="">Alt Kategori Seçin</option>
              {categories.find(c => c._id === category)?.subCategories?.map((sub, i) => (
                <option key={i} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ebatlar */}
        <div>
          <p className="mb-2">Ebatlar</p>
          {sizes.map((size, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                value={size.label}
                onChange={(e) => handleSizeChange(index, 'label', e.target.value)}
                placeholder="Ebat Adı (örneğin, 7oz)"
                className="w-full max-w-[200px] px-3 py-2 border rounded"
              />
              <input
                type="number"
                value={size.price}
                onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                placeholder="Birim Fiyat"
                className="w-full max-w-[100px] px-3 py-2 border rounded"
              />₺
            </div>
          ))}
          <button
            type="button"
            onClick={addSize}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
          >
            Ebat Ekle
          </button>
        </div>

        {/* Sipariş Miktarları */}
        <div>
          <p className="mb-2">Sipariş Miktarları</p>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              value={currentQuantity}
              onChange={(e) => setCurrentQuantity(e.target.value)}
              placeholder="Sipariş Miktarı"
              className="w-full max-w-[200px] px-3 py-2 border rounded"
            />
            <span>Adet</span>
            <button
              type="button"
              onClick={addQuantity}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Ekle
            </button>
          </div>
          {quantities.map((qty, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <span>{qty.label} Adet</span>
              <button
                type="button"
                onClick={() => removeQuantity(index)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Sil
              </button>
            </div>
          ))}
        </div>

        {/* Baskı Seçenekleri */}
        <div>
          <p className="mb-2">Baskı Seçenekleri</p>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={currentPrintingOption}
              onChange={(e) => setCurrentPrintingOption(e.target.value)}
              placeholder="Baskı Seçeneği (örneğin, Tek Renk)"
              className="w-full max-w-[200px] px-3 py-2 border rounded"
            />
            <button
              type="button"
              onClick={addPrintingOption}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Ekle
            </button>
          </div>
          {printingOptions.map((option, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <span>{option}</span>
              <button
                type="button"
                onClick={() => removePrintingOption(index)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Sil
              </button>
            </div>
          ))}
        </div>

        {/* Kapak Seçeneği */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="includeCover"
              checked={includeCover}
              onChange={() => setIncludeCover((prev) => !prev)}
            />
            <label htmlFor="includeCover" className="cursor-pointer">
              Kapak Ekle
            </label>
          </div>
          {includeCover && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={coverPrice}
                  onChange={(e) => setCoverPrice(Number(e.target.value))}
                  placeholder="Kapak Fiyatı"
                  className="w-full max-w-[100px] px-3 py-2 border rounded"
                />₺
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentCoverColor}
                  onChange={(e) => setCurrentCoverColor(e.target.value)}
                  placeholder="Kapak Rengi (örneğin, Beyaz)"
                  className="w-full max-w-[200px] px-3 py-2 border rounded"
                />
                <button
                  type="button"
                  onClick={addCoverColor}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Ekle
                </button>
              </div>
              {coverColors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span>{color}</span>
                  <button
                    type="button"
                    onClick={() => removeCoverColor(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Çok Satanlar Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="bestseller"
            checked={bestseller}
            onChange={() => setBestseller((prev) => !prev)}
          />
          <label htmlFor="bestseller" className="cursor-pointer">
            Çok Satanlara ekle
          </label>
        </div>

        {/* Gönder Butonu */}
        <button
          type="submit"
          className="w-28 py-2 bg-black text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Yükleniyor...' : 'EKLE'}
        </button>
      </form>
    </div>
  );
};

export default Add;