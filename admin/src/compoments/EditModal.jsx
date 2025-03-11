import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const EditModal = ({ product, onClose, onUpdate }) => {
  // Temel bilgiler
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category);
  const [subCategory, setSubCategory] = useState(product.subCategory);
  const [bestseller, setBestseller] = useState(product.bestseller);

  // Kapak seçenekleri
  const [includeCover, setIncludeCover] = useState(product.coverOptions?.price > 0);
  const [coverPrice, setCoverPrice] = useState(product.coverOptions?.price || 0);
  const [coverColors, setCoverColors] = useState(product.coverOptions?.colors || []);
  const [currentCoverColor, setCurrentCoverColor] = useState('');

  // Ebatlar
  const [sizes, setSizes] = useState(product.sizes || []);
  const [newSizeLabel, setNewSizeLabel] = useState('');
  const [newSizePrice, setNewSizePrice] = useState(0);

  // Sipariş adetleri
  const [quantities, setQuantities] = useState(product.quantities || []);
  const [currentQuantity, setCurrentQuantity] = useState('');

  // Baskı seçenekleri
  const [printingOptions, setPrintingOptions] = useState(product.printingOptions || []);
  const [currentPrintingOption, setCurrentPrintingOption] = useState('');

  // Kategoriler ve alt kategoriler
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // Kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/category/list`);
        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('Kategoriler yüklenemedi');
      }
    };
    fetchCategories();
  }, []);

  // Kategori seçildiğinde alt kategorileri çek
  useEffect(() => {
    if (category) {
      const selectedCategory = categories.find((cat) => cat._id === category);
      if (selectedCategory) {
        setSubCategories(selectedCategory.subCategories || []);
      }
    } else {
      setSubCategories([]);
    }
  }, [category, categories]);

  // Kapak rengi ekle
  const addCoverColor = () => {
    if (currentCoverColor) {
      setCoverColors([...coverColors, currentCoverColor]);
      setCurrentCoverColor('');
    }
  };

  // Kapak rengi sil
  const removeCoverColor = (index) => {
    const newColors = coverColors.filter((_, i) => i !== index);
    setCoverColors(newColors);
  };

  // Ebat ekle
  const addSize = () => {
    if (newSizeLabel && newSizePrice >= 0) {
      setSizes([...sizes, { label: newSizeLabel, price: newSizePrice }]);
      setNewSizeLabel('');
      setNewSizePrice(0);
    }
  };

  // Ebat sil
  const removeSize = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  // Sipariş adeti ekle
  const addQuantity = () => {
    if (currentQuantity) {
      setQuantities([...quantities, { label: currentQuantity, multiplier: 1 }]);
      setCurrentQuantity('');
    }
  };

  // Sipariş adeti sil
  const removeQuantity = (index) => {
    const newQuantities = quantities.filter((_, i) => i !== index);
    setQuantities(newQuantities);
  };

  // Baskı seçeneği ekle
  const addPrintingOption = () => {
    if (currentPrintingOption) {
      setPrintingOptions([...printingOptions, currentPrintingOption]);
      setCurrentPrintingOption('');
    }
  };

  // Baskı seçeneği sil
  const removePrintingOption = (index) => {
    const newPrintingOptions = printingOptions.filter((_, i) => i !== index);
    setPrintingOptions(newPrintingOptions);
  };

  // Form gönderimi
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      name,
      description,
      category,
      subCategory,
      bestseller,
      coverOptions: {
        price: includeCover ? coverPrice : 0,
        colors: includeCover ? coverColors : []
      },
      sizes,
      quantities,
      printingOptions
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Ürünü Güncelle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Temel Bilgiler */}
          <div>
            <p className="mb-2">Ürün Adı</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ürün Adı"
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <p className="mb-2">Açıklama</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Açıklama"
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Kategori ve Alt Kategori */}
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="mb-2">Kategori</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded-lg"
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
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Alt Kategori Seçin</option>
                {subCategories.map((sub, index) => (
                  <option key={index} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={bestseller}
              onChange={(e) => setBestseller(e.target.checked)}
            />
            Çok Satan
          </label>

          {/* Kapak Seçenekleri */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={includeCover}
                onChange={(e) => setIncludeCover(e.target.checked)}
              />
              Kapak Ekle
            </label>

            {includeCover && (
              <div className="space-y-2">
                <div>
                  <p className="mb-2">Kapak Fiyatı</p>
                  <input
                    type="number"
                    value={coverPrice}
                    onChange={(e) => setCoverPrice(Number(e.target.value))}
                    placeholder="Kapak Fiyatı"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <p className="mb-2">Kapak Renkleri</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentCoverColor}
                      onChange={(e) => setCurrentCoverColor(e.target.value)}
                      placeholder="Kapak Rengi (örneğin, Beyaz)"
                      className="w-full p-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={addCoverColor}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Ekle
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {coverColors.map((color, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
                        <span>{color}</span>
                        <button
                          type="button"
                          onClick={() => removeCoverColor(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ebatlar */}
          <div>
            <p className="mb-2">Ebatlar</p>
            {sizes.map((size, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={size.label}
                  onChange={(e) => {
                    const newSizes = [...sizes];
                    newSizes[index].label = e.target.value;
                    setSizes(newSizes);
                  }}
                  placeholder="Ebat Adı"
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="number"
                  value={size.price}
                  onChange={(e) => {
                    const newSizes = [...sizes];
                    newSizes[index].price = Number(e.target.value);
                    setSizes(newSizes);
                  }}
                  placeholder="Fiyat"
                  className="w-full p-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Sil
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSizeLabel}
                onChange={(e) => setNewSizeLabel(e.target.value)}
                placeholder="Yeni Ebat Adı"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                value={newSizePrice}
                onChange={(e) => setNewSizePrice(Number(e.target.value))}
                placeholder="Fiyat"
                className="w-full p-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={addSize}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Ekle
              </button>
            </div>
          </div>

          {/* Sipariş Adetleri */}
          <div>
            <p className="mb-2">Sipariş Adetleri</p>
            {quantities.map((qty, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={qty.label}
                  onChange={(e) => {
                    const newQuantities = [...quantities];
                    newQuantities[index].label = e.target.value;
                    setQuantities(newQuantities);
                  }}
                  placeholder="Sipariş Adeti"
                  className="w-full p-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeQuantity(index)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Sil
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
                placeholder="Yeni Sipariş Adeti"
                className="w-full p-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={addQuantity}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Ekle
              </button>
            </div>
          </div>

          {/* Baskı Seçenekleri */}
          <div>
            <p className="mb-2">Baskı Seçenekleri</p>
            {printingOptions.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newPrintingOptions = [...printingOptions];
                    newPrintingOptions[index] = e.target.value;
                    setPrintingOptions(newPrintingOptions);
                  }}
                  placeholder="Baskı Seçeneği"
                  className="w-full p-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePrintingOption(index)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Sil
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={currentPrintingOption}
                onChange={(e) => setCurrentPrintingOption(e.target.value)}
                placeholder="Yeni Baskı Seçeneği"
                className="w-full p-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={addPrintingOption}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Ekle
              </button>
            </div>
          </div>
          {/* Butonlar */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              İptal
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;