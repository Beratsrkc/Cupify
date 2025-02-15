import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useLocation } from 'react-router-dom';

const Collection = () => {
    const { products, search, showSearch } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('varsayilan');
    const location = useLocation();

    // URL parametresini kontrol etme
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryParam = queryParams.get('category');
        if (categoryParam) {
            setCategory([categoryParam]); // URL'den gelen kategoriyi seç
        }
    }, [location.search]);

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value))
        } else {
            setCategory(prev => [...prev, e.target.value])
        }
    }

    const toggleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(item => item !== e.target.value))
        } else {
            setSubCategory(prev => [...prev, e.target.value])
        }
    }

    const applyFilter = () => {
        let productsCopy = [...products];  // Başlangıçta tüm ürünleri al

        if (showSearch && search) {
            productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (category.length > 0) {
            productsCopy = productsCopy.filter(item => category.includes(item.category));
        }

        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
        }

        setFilterProducts(productsCopy);
    }

    const sortProduct = () => {
        let fpCopy = [...filterProducts];
    
        switch (sortType) {
            case 'dusuk-buyuk':
                setFilterProducts(fpCopy.sort((a, b) => {
                    const priceA = a.newprice > 0 ? a.newprice : a.price; 
                    const priceB = b.newprice > 0 ? b.newprice : b.price; 
                    return priceA - priceB; 
                }));
                break;
            case 'buyuk-dusuk':
                setFilterProducts(fpCopy.sort((a, b) => {
                    const priceA = a.newprice > 0 ? a.newprice : a.price; 
                    const priceB = b.newprice > 0 ? b.newprice : b.price; 
                    return priceB - priceA; 
                }));
                break;
            default:
                applyFilter(); 
                break;
        }
    };

    useEffect(() => {
        applyFilter();
    }, [category, subCategory, search, showSearch, products])

    useEffect(() => {
        sortProduct();
    }, [sortType])

    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

            {/* Filter Options*/}
            <div className='min-w-60'>
                <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
                    FİLTRELE
                    <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} alt="" />
                </p>

                {/*Category Filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>KATEGORİLER</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Tel-Grubu'} onChange={toggleCategory} checked={category.includes('Tel-Grubu')} /> Tel Grubu
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Manet-ve-Gaz-Kolu'} onChange={toggleCategory} checked={category.includes('Manet-ve-Gaz-Kolu')} /> Manet ve Gaz Kolu
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Balata-Cesitleri'} onChange={toggleCategory} checked={category.includes('Balata-Cesitleri')} /> Balata Çeşitleri
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Klemens-Takoz-Cesitleri'} onChange={toggleCategory} checked={category.includes('Klemens-Takoz-Cesitleri')} /> Klemens Takoz Çeşitleri
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Diger'} onChange={toggleCategory} /> Diğer
                        </p>

                    </div>
                </div>

                {/*SubCategory Filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>MARKALAR</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Yagmur'} onChange={toggleSubCategory} /> Yağmur
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Taral'} onChange={toggleSubCategory} /> Taral
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Flash'} onChange={toggleSubCategory} /> Flash
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Antrac'} onChange={toggleSubCategory} /> Antrac
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Beybolat'} onChange={toggleSubCategory} /> Beybolat
                        </p>

                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Bertolini'} onChange={toggleSubCategory} /> Bertolini
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Kaan'} onChange={toggleSubCategory} /> Kaan
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Oleo-Mac'} onChange={toggleSubCategory} /> Oleo-Mac
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Stihl'} onChange={toggleSubCategory} /> Stihl
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type="checkbox" value={'Diger'} onChange={toggleSubCategory} /> Diğer
                        </p>
                    </div>
                </div>
            </div>

            {/*Right Side */}
            <div className='flex-1'>
                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text1={'TÜM'} text2={'ÜRÜNLER'} />
                    {/*Product Sort */}
                    <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2 outline-none'>
                        <option value="varsayilan">Sırala: Varsayılan</option>
                        <option value="dusuk-buyuk">Sırala: Düşükten Büyüğe</option>
                        <option value="buyuk-dusuk">Sırala: Büyükten Küçüğe</option>
                    </select>
                </div>

                {/*Map Product */}
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6'>
                    {
                        filterProducts.map((item, index) => (
                            <ProductItem
                                key={index}
                                id={item._id}
                                images={item.images || [item.image]} 
                                name={item.name}
                                price={item.price}
                                newprice={item.newprice}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Collection;