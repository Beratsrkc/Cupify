import React, { useContext, useEffect, useState } from 'react';
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
    const [selectedCategories, setSelectedCategories] = useState([]); // Seçilen kategoriler
    const [selectedSubCategories, setSelectedSubCategories] = useState([]); // Seçilen alt kategoriler
    const location = useLocation();
    const navigate = useNavigate();

    // Pagination state'leri
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // Her sayfada 12 ürün

    // Fetch categories and subcategories
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

    // URL parametresini kontrol etme
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryParam = queryParams.get('category');
        const subCategoryParam = queryParams.get('subCategory');

        if (categoryParam) {
            setSelectedCategories([categoryParam]); // URL'den gelen kategoriyi seç
        }
        if (subCategoryParam) {
            setSelectedSubCategories([subCategoryParam]); // URL'den gelen alt kategoriyi seç
        }
    }, [location.search]);

    // Kategori seçimi
    const toggleCategory = (e) => {
        const categoryId = e.target.value;
        let updatedCategories;

        if (selectedCategories.includes(categoryId)) {
            updatedCategories = selectedCategories.filter(item => item !== categoryId);
        } else {
            updatedCategories = [...selectedCategories, categoryId];
        }

        setSelectedCategories(updatedCategories);
        updateURL(updatedCategories, selectedSubCategories);
    };

    // Alt kategori seçimi
    const toggleSubCategory = (e) => {
        const subCategory = e.target.value;
        let updatedSubCategories;

        if (selectedSubCategories.includes(subCategory)) {
            updatedSubCategories = selectedSubCategories.filter(item => item !== subCategory);
        } else {
            updatedSubCategories = [...selectedSubCategories, subCategory];
        }

        setSelectedSubCategories(updatedSubCategories);
        updateURL(selectedCategories, updatedSubCategories);
    };

    // URL'yi güncelle
    const updateURL = (categories, subCategories) => {
        const queryParams = new URLSearchParams();
        if (categories.length > 0) {
            queryParams.set('category', categories[0]); // İlk kategori parametresi
        }
        if (subCategories.length > 0) {
            queryParams.set('subCategory', subCategories[0]); // İlk alt kategori parametresi
        }
        navigate(`?${queryParams.toString()}`, { replace: true });
    };

    // Filtreleme işlemi
    const applyFilter = () => {
        let productsCopy = [...products];  // Başlangıçta tüm ürünleri al

        // Arama filtresi
        if (showSearch && search) {
            productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        // Kategori filtresi
        if (selectedCategories.length > 0) {
            productsCopy = productsCopy.filter(item =>
                selectedCategories.includes(item.category._id.toString())  // item.category._id ile karşılaştır
            );
        }

        // Alt kategori filtresi
        if (selectedSubCategories.length > 0) {
            productsCopy = productsCopy.filter(item =>
                selectedSubCategories.includes(item.subCategory)
            );
        }

        setFilterProducts(productsCopy);  // Filtrelenmiş ürünleri state'e kaydet
    };

    // Sıralama işlemi
    

    // Pagination için ürünleri dilimle
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filterProducts.slice(indexOfFirstItem, indexOfLastItem);

    // Sayfa numaralarını hesapla
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filterProducts.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    // Sayfa değiştirme fonksiyonu
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        if (!isLoading) {
            applyFilter();
        }
    }, [selectedCategories, selectedSubCategories, search, showSearch, products, isLoading]);



    useEffect(() => {
        if (!isLoading) {
            setFilterProducts([...products]);
        }
    }, [products, isLoading]);

    if (isLoading) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
            {/* Filter Options */}
            <div className='min-w-60'>
                <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
                    FİLTRELE
                    <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} alt="" />
                </p>

                {/* Kategori Filtresi */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>KATEGORİLER</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        {categories.map((category) => (
                            <p key={category._id} className='flex gap-2'>
                                <input
                                    type="checkbox"
                                    value={category._id}
                                    onChange={toggleCategory}
                                    checked={selectedCategories.includes(category._id.toString())}
                                />
                                {category.name}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Alt Kategori Filtresi */}
                {selectedCategories.length > 0 && (
                    <div className={`border border-gray-300 pl-5 py-3 mt-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                        <p className='mb-3 text-sm font-medium'>ALT KATEGORİLER</p>
                        <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                            {categories
                                .filter(cat => selectedCategories.includes(cat._id.toString()))
                                .map(cat => (
                                    cat.subCategories.map((subCategory, index) => (
                                        <p key={index} className='flex gap-2'>
                                            <input
                                                type="checkbox"
                                                value={subCategory}
                                                onChange={toggleSubCategory}
                                                checked={selectedSubCategories.includes(subCategory)}
                                            />
                                            {subCategory}
                                        </p>
                                    ))
                                ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Side */}
            <div className='flex-1'>
              
            <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text1={'TÜM'} text2={'ÜRÜNLER'} />
                   
                </div>
                {/* Ürünleri Listele */}
                <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6'>
                    {currentItems.map((item, index) => (
                        <ProductItem key={index} {...item} />
                    ))}
                </div>

                {/* Pagination Butonları */}
                <div className="flex justify-center mt-10">
                    <nav>
                        <ul className="flex gap-2">
                            {pageNumbers.map((number) => (
                                <li key={number}>
                                    <button
                                        onClick={() => paginate(number)}
                                        className={`px-3 py-1 border rounded-sm ${currentPage === number ? "bg-orangeBrand text-white" : "bg-white text-black"
                                            }`}
                                    >
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Collection;