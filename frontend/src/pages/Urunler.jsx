import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Collection = () => {
    const { products, search, showSearch, backendUrl, token, isLoading } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const topRef = useRef(null);

    // Pagination state'leri
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);

    // Sayfanın en üstüne çık
    const scrollToTop = () => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Sayfa değiştirme fonksiyonu
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        scrollToTop();
    };

    // Kategori veya alt kategori değiştiğinde 1. sayfaya dön
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategories, selectedSubCategories]);

    // Kategorileri çek
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/category/list`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data.success) {
                    setCategories(response.data.categories);
                } else {
                    toast.error("Kategoriler yüklenemedi");
                }
            } catch (error) {
                toast.error("Kategoriler yüklenirken hata oluştu");
            }
        };
        fetchCategories();
    }, [token, backendUrl]);

    // URL'den filtreleri oku
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryParams = queryParams.getAll('category');
        const subCategoryParams = queryParams.getAll('subCategory');

        if (categoryParams.length > 0) {
            setSelectedCategories(categoryParams);
        }
        if (subCategoryParams.length > 0) {
            setSelectedSubCategories(subCategoryParams);
        }
    }, [location.search]);

    // Kategori seçimi
    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev => {
            const newCategories = prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId];
            
            // Alt kategorileri temizle
            if (!newCategories.includes(categoryId)) {
                setSelectedSubCategories(prevSub => 
                    prevSub.filter(sub => !categories
                        .find(cat => cat._id === categoryId)?.subCategories.includes(sub)
                    )
                );
            }
            return newCategories;
        });
    };

    // Alt kategori seçimi
    const toggleSubCategory = (subCategory) => {
        setSelectedSubCategories(prev => 
            prev.includes(subCategory)
                ? prev.filter(item => item !== subCategory)
                : [...prev, subCategory]
        );
    };

    // URL'yi güncelle
    useEffect(() => {
        const queryParams = new URLSearchParams();
        
        // Tüm seçili kategorileri ekle
        selectedCategories.forEach(cat => {
            queryParams.append('category', cat);
        });
        
        // Tüm seçili alt kategorileri ekle
        selectedSubCategories.forEach(subCat => {
            queryParams.append('subCategory', subCat);
        });

        navigate(`?${queryParams.toString()}`, { replace: true });
    }, [selectedCategories, selectedSubCategories, navigate]);

    // Filtreleme işlemi
    const applyFilter = () => {
        let filtered = [...products];

        // Arama filtresi
        if (showSearch && search) {
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Kategori filtresi (en az bir kategori seçiliyse)
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(item =>
                selectedCategories.includes(item.category._id.toString())
            );
        }

        // Alt kategori filtresi (en az bir alt kategori seçiliyse)
        if (selectedSubCategories.length > 0) {
            filtered = filtered.filter(item =>
                selectedSubCategories.includes(item.subCategory)
            );
        }

        setFilterProducts(filtered);
    };

    // Filtreleri sıfırla
    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedSubCategories([]);
        setCurrentPage(1);
    };

    // Filtre değişikliklerinde uygula
    useEffect(() => {
        if (!isLoading) {
            applyFilter();
        }
    }, [selectedCategories, selectedSubCategories, search, showSearch, products, isLoading]);

    // Ürünler değiştiğinde filtre listesini güncelle
    useEffect(() => {
        if (!isLoading) {
            setFilterProducts([...products]);
        }
    }, [products, isLoading]);

    // Pagination için ürünleri dilimle
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filterProducts.slice(indexOfFirstItem, indexOfLastItem);

    // Sayfa numaralarını hesapla
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filterProducts.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    // Mevcut kategorilere ait alt kategorileri bul
    const getAvailableSubCategories = () => {
        return categories
            .filter(cat => selectedCategories.includes(cat._id.toString()))
            .flatMap(cat => cat.subCategories)
            .filter((subCat, index, self) => self.indexOf(subCat) === index); // Tekilleri al
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
    }

    return (
        <div ref={topRef} className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
            {/* Filter Options */}
            <div className='min-w-60'>
                <div className='flex justify-between items-center'>
                    <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
                        FİLTRELE
                        <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} alt="" />
                    </p>
                    {(selectedCategories.length > 0 || selectedSubCategories.length > 0) && (
                        <button 
                            onClick={resetFilters}
                            className="text-xs text-orangeBrand hover:underline"
                        >
                            Filtreleri Temizle
                        </button>
                    )}
                </div>

                {/* Kategori Filtresi */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>KATEGORİLER</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        {categories.map((category) => (
                            <label key={category._id} className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category._id.toString())}
                                    onChange={() => toggleCategory(category._id.toString())}
                                    className="accent-orangeBrand"
                                />
                                <span>{category.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Alt Kategori Filtresi */}
                {selectedCategories.length > 0 && (
                    <div className={`border border-gray-300 pl-5 py-3 mt-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                        <p className='mb-3 text-sm font-medium'>ALT KATEGORİLER</p>
                        {getAvailableSubCategories().length > 0 ? (
                            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                                {getAvailableSubCategories().map((subCategory, index) => (
                                    <label key={index} className='flex items-center gap-2 cursor-pointer'>
                                        <input
                                            type="checkbox"
                                            checked={selectedSubCategories.includes(subCategory)}
                                            onChange={() => toggleSubCategory(subCategory)}
                                            className="accent-orangeBrand"
                                        />
                                        <span>{subCategory}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500">Bu kategoride alt kategori bulunmamaktadır</p>
                        )}
                    </div>
                )}
            </div>

            {/* Right Side */}
            <div className='flex-1'>
                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text1={'TÜM'} text2={'ÜRÜNLER'} />
                    <p className="text-sm text-gray-600 self-end">
                        {filterProducts.length} ürün bulundu
                    </p>
                </div>
                
                {/* Ürün Listesi veya Boş Mesaj */}
                {currentItems.length > 0 ? (
                    <>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6'>
                            {currentItems.map((item, index) => (
                                <ProductItem key={index} {...item} />
                            ))}
                        </div>

                        {/* Pagination Butonları */}
                        {pageNumbers.length > 1 && (
                            <div className="flex justify-center mt-10">
                                <nav>
                                    <ul className="flex gap-2">
                                        {pageNumbers.map((number) => (
                                            <li key={number}>
                                                <button
                                                    onClick={() => paginate(number)}
                                                    className={`px-3 py-1 border rounded-sm ${currentPage === number ? "bg-orangeBrand text-white" : "bg-white text-black"}`}
                                                >
                                                    {number}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <img src={assets.empty_icon} alt="Empty" className="w-32 h-32 opacity-50" />
                        <p className="text-lg text-gray-500 mt-4">Ürün bulunamadı</p>
                        {(selectedCategories.length > 0 || selectedSubCategories.length > 0) && (
                            <button 
                                onClick={resetFilters}
                                className="mt-4 px-4 py-2 bg-orangeBrand text-white rounded hover:bg-orange-600 transition"
                            >
                                Filtreleri Temizle
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collection;