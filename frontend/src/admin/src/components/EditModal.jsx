import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config";

const EditModal = ({ product, onClose, onUpdate }) => {
  // Temel bilgiler
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category?._id || "");
  const [subCategory, setSubCategory] = useState(product.subCategory || "");
  const [bestseller, setBestseller] = useState(product.bestseller);
  const [inStock, setInStock] = useState(product.inStock);
  // Kapak seçenekleri
  const [includeCover, setIncludeCover] = useState(
    product.coverOptions?.price > 0
  );
  const [coverPrice, setCoverPrice] = useState(
    product.coverOptions?.price || 0
  );
  const [coverColors, setCoverColors] = useState(
    product.coverOptions?.colors || []
  );
  const [currentCoverColor, setCurrentCoverColor] = useState("");

  // Ebatlar
  const [sizes, setSizes] = useState(product.sizes || []);
  const [newSizeLabel, setNewSizeLabel] = useState("");
  const [newSizePrice, setNewSizePrice] = useState(0);

  // Sipariş adetleri ve indirimler
  const [quantities, setQuantities] = useState(product.quantities || []);
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [currentDiscount, setCurrentDiscount] = useState(0);

  // Baskı seçenekleri
  const [printingOptions, setPrintingOptions] = useState(
    product.printingOptions || []
  );
  const [newPrintingLabel, setNewPrintingLabel] = useState("");
  const [newPrintingOptions, setNewPrintingOptions] = useState(0);
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
        toast.error("Kategoriler yüklenemedi");
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
      setCurrentCoverColor("");
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
      setNewSizeLabel("");
      setNewSizePrice(0);
    }
  };

  // Ebat sil
  const removeSize = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  // Sipariş adeti ve indirim ekle
  const addQuantity = () => {
    if (currentQuantity) {
      setQuantities([
        ...quantities,
        {
          label: currentQuantity,
          multiplier: 1,
          discount: Number(currentDiscount) || 0,
        },
      ]);
      setCurrentQuantity("");
      setCurrentDiscount(0);
    }
  };

  // Sipariş adeti sil
  const removeQuantity = (index) => {
    const newQuantities = quantities.filter((_, i) => i !== index);
    setQuantities(newQuantities);
  };

  // Miktar değişikliği
  const handleQuantityChange = (index, field, value) => {
    const newQuantities = [...quantities];
    newQuantities[index][field] = field === "discount" ? Number(value) : value;
    setQuantities(newQuantities);
  };

  // Baskı seçeneği ekle
  const addPrintingOption = () => {
    if (newPrintingLabel && newPrintingOptions >= 0) {
      setPrintingOptions([
        ...printingOptions,
        { label: newPrintingLabel, price: newPrintingOptions },
      ]);
      setNewPrintingLabel("");
      setNewPrintingOptions(0);
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

    // Verileri stringify etmeden önce işle
    const updateData = {
      name,
      description,
      category,
      subCategory,
      bestseller,
      coverOptions: {
        price: includeCover ? coverPrice : 0,
        colors: includeCover ? coverColors : [],
      },
      sizes,
      inStock,
      quantities: quantities.map((q) => ({
        label: q.label,
        multiplier: q.multiplier,
        discount: q.discount,
      })),
      printingOptions,
    };

    // Verileri stringify et (eğer API bekliyorsa)
    const stringifiedData = {
      ...updateData,
      coverOptions: JSON.stringify(updateData.coverOptions),
      sizes: JSON.stringify(updateData.sizes),
      quantities: JSON.stringify(updateData.quantities),
      printingOptions: JSON.stringify(updateData.printingOptions),
    };

    onUpdate(stringifiedData);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Ürün Düzenle</h2>

        <form onSubmit={handleSubmit}>
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
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />
            Stokta Var
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
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg"
                      >
                        <span>{color}</span>
                        <button
                          type="button"
                          onClick={() => removeCoverColor(index)}
                          className="text-orangeBrand hover:text-orangeBrandDark"
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
                  className="bg-orangeBrand text-white px-4 py-2 rounded-lg"
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

          {/* Sipariş Adetleri ve İndirimler */}
          <div className="mb-4">
            <p className="mb-2">Sipariş Miktarları ve İndirimler</p>
            {quantities.map((qty, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  value={qty.label}
                  onChange={(e) =>
                    handleQuantityChange(index, "label", e.target.value)
                  }
                  placeholder="Miktar (örn: 1000)"
                  className="flex-1 p-2 border rounded-lg"
                />
                <input
                  type="number"
                  value={qty.multiplier}
                  onChange={(e) =>
                    handleQuantityChange(index, "multiplier", e.target.value)
                  }
                  placeholder="Çarpan"
                  className="w-20 p-2 border rounded-lg"
                  min="1"
                />
                <input
                  type="number"
                  value={qty.discount}
                  onChange={(e) =>
                    handleQuantityChange(index, "discount", e.target.value)
                  }
                  placeholder="İndirim %"
                  className="w-20 p-2 border rounded-lg"
                  min="0"
                  max="100"
                />
                <button
                  type="button"
                  onClick={() => removeQuantity(index)}
                  className="p-2 bg-orangeBrand text-white rounded-lg"
                >
                  Sil
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
                placeholder="Yeni Miktar"
                className="flex-1 p-2 border rounded-lg"
              />
              <input
                type="number"
                value={currentDiscount}
                onChange={(e) => setCurrentDiscount(e.target.value)}
                placeholder="İndirim %"
                className="w-20 p-2 border rounded-lg"
                min="0"
                max="100"
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

          <div>
            <p className="mb-2">Baskı Seçenekleri</p>
            {printingOptions.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => {
                    const updatedOptions = [...printingOptions];
                    updatedOptions[index].label = e.target.value;
                    setPrintingOptions(updatedOptions);
                  }}
                  placeholder="Baskı Seçeneği"
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="number"
                  value={option.price}
                  onChange={(e) => {
                    const updatedOptions = [...printingOptions];
                    updatedOptions[index].price = Number(e.target.value);
                    setPrintingOptions(updatedOptions);
                  }}
                  placeholder="Fiyat"
                  className="w-full p-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePrintingOption(index)}
                  className="bg-orangeBrand text-white px-4 py-2 rounded-lg"
                >
                  Sil
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newPrintingLabel}
                onChange={(e) => setNewPrintingLabel(e.target.value)}
                placeholder="Yeni Baskı Seçeneği"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                value={newPrintingOptions}
                onChange={(e) => setNewPrintingOptions(Number(e.target.value))}
                placeholder="Fiyat"
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
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
