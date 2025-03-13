import React, { useContext, useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { GrSearch } from "react-icons/gr";
import ProfileDropdown from './ProfileDropdown';


const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [expandedMenu, setExpandedMenu] = useState(null);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const { getCartCount, token, setToken, setCartItems, products, categories, getCartAmount, currency } = useContext(ShopContext);

    // Sepet toplamını al
    const cartTotal = getCartAmount().total;

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setCartItems({});
        navigate('/giris');
    };

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            setShowSearchResults(false);
        } else {
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filteredProducts);
            setShowSearchResults(true);
        }
    }, [searchQuery, products]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleProductClick = (slug) => {
        navigate(`/product/${slug}`);
        setSearchQuery('');
        setShowSearchResults(false);
        setIsCategoriesOpen(false);
        setExpandedCategory(null);
        setExpandedMenu(null);
    };

    const truncateDescription = (description, maxLength = 50) => {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + '...';
        }
        return description;
    };

    const toggleCategory = (categoryId) => {
        if (expandedCategory === categoryId) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(categoryId);
        }
    };

    const toggleMenu = (menuName) => {
        if (expandedMenu === menuName) {
            setExpandedMenu(null);
        } else {
            setExpandedMenu(menuName);
        }
    };

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    const handleCategoryClick = (categoryId, subCategory) => {
        navigate(`/urunler?category=${categoryId}&subCategory=${subCategory}`);
        setIsCategoriesOpen(false);
        setExpandedCategory(null);
        setExpandedMenu(null);
    };

    return (
        <>
            {/* Navbar */}
            <div className='flex items-center justify-between py-5 font-semibold z-20'>
                <Link to="/"><img src={assets.Cupify_logo} className='lg:w-32 w-24' alt="logo" /></Link>

                <ul className='hidden lg:flex gap-5 text-sm text-gray-700'>
                    <NavLink to={"/"} className="flex flex-col items-center gap-1">
                        <p>ANASAYFA</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-red-500 hidden' />
                    </NavLink>
                    <NavLink to={"urunler"} className="flex flex-col items-center gap-1">
                        <p>ÜRÜNLER</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-red-500 hidden' />
                    </NavLink>
                    <NavLink to={"hakkimizda"} className="flex flex-col items-center gap-1">
                        <p>HAKKIMIZDA</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-red-500 hidden' />
                    </NavLink>
                    <NavLink to={"blog"} className="flex flex-col items-center gap-1">
                        <p>BLOG</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-red-500 hidden' />
                    </NavLink>
                    <NavLink to={"iletisim"} className="flex flex-col items-center gap-1">
                        <p>İLETİŞİM</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-red-500 hidden' />
                    </NavLink>
                </ul>

                <div className='flex items-center gap-6'>
                    {/* ProfileDropdown Bileşeni */}
                    <ProfileDropdown token={token} logout={logout} />

                    <img onClick={() => setVisible(true)} src={assets.Menu_icon} className='w-5 cursor-pointer lg:hidden' alt="" />
                </div>

                {/* Sidebar menu for small screens */}
                <div className={`absolute top-0 right-0 bottom-0 overflow-y-auto bg-white transition-all ${visible ? 'w-full' : 'w-0'} z-20 lg:hidden`}>
                    <div className='flex flex-col text-gray-600'>
                        <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                            <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="" />
                            <p>Geri</p>
                        </div>
                        <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to="/">ANASAYFA</NavLink>
                        <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to="urunler">ÜRÜNLER</NavLink>
                        <div>
                            <div
                                onClick={() => toggleMenu('kategoriler')}
                                className='flex items-center justify-between py-2 pl-6 border cursor-pointer'
                            >
                                <span>KATEGORİLER</span>
                                <img
                                    src={assets.dropdown_icon}
                                    className={`h-3 transition-transform ${expandedMenu === 'kategoriler' ? 'rotate-180' : ''}`}
                                    alt="dropdown"
                                />
                            </div>
                            {expandedMenu === 'kategoriler' && (
                                <div className=''>
                                    {categories.map((category) => (
                                        <div key={category._id} className='border'>
                                            <div
                                                onClick={() => toggleCategory(category._id)}
                                                className='flex items-center justify-between py-2 pl-6 cursor-pointer'
                                            >
                                                <span className='font-medium'>{category.name}</span>
                                                <img
                                                    src={assets.dropdown_icon}
                                                    className={`h-3 transition-transform ${expandedCategory === category._id ? 'rotate-180' : ''}`}
                                                    alt="dropdown"
                                                />
                                            </div>
                                            {expandedCategory === category._id && (
                                                <div className='pl-8'>
                                                    {category.subCategories?.map((subCategory, index) => (
                                                        <div
                                                            key={index}
                                                            className='block py-2 text-gray-400 font-medium cursor-pointer'
                                                            onClick={() => {
                                                                setVisible(false);
                                                                handleCategoryClick(category._id, subCategory);
                                                            }}
                                                        >
                                                            {subCategory}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to="blog">BLOG</NavLink>
                        <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to="hakkimizda">HAKKIMIZDA</NavLink>
                        <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to="iletisim">İLETİŞİM</NavLink>
                    </div>
                </div>
            </div>

            {/* Kategoriler, Arama Çubuğu ve Sepet Bölümü */}
            <div className='flex w-full bg-white py-3 items-center'>
                <div className='hidden lg:block w-1/4'>
                    <div className='relative group'>
                        <button
                            onClick={() => {
                                setIsCategoriesOpen(!isCategoriesOpen);
                                setExpandedMenu(expandedMenu === 'kategoriler' ? null : 'kategoriler');
                            }}
                            className='flex items-center gap-2 text-white rounded-md px-10 p-2 bg-red-500'
                        >
                            <span>Kategoriler</span>
                            {expandedMenu === 'kategoriler' ? (
                                <IoIosArrowForward className="text-[16px] transition-transform" />
                            ) : (
                                <IoIosArrowDown className="text-[16px] transition-transform" />
                            )}
                        </button>
                        {isCategoriesOpen && (
                            <div className='absolute top-full left-0 w-[370%] bg-white border shadow-lg py-2 z-50'>
                                <div className='flex flex-col sm:flex-row'>
                                    <div className='w-full sm:w-1/6 border-r border-gray-200'>
                                        {categories.map((category) => (
                                            <div
                                                key={category._id}
                                                className='px-4 py-2 cursor-pointer hover:bg-gray-100'
                                                onClick={() => toggleCategory(category._id)}
                                            >
                                                <div className='flex items-center justify-between'>
                                                    <span className='font-medium text-gray-700 hover:text-primary'>
                                                        {category.name}
                                                    </span>
                                                    <img
                                                        src={assets.dropdown_icon}
                                                        className={`h-3 transition-transform ${expandedCategory === category._id ? 'rotate-180' : ''}`}
                                                        alt="dropdown"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='w-full sm:w-5/6 p-4 flex flex-wrap'>
                                        {expandedCategory !== null && categories
                                            .find(cat => cat._id === expandedCategory)
                                            ?.subCategories?.map((subCategory, index) => (
                                                <div key={index} className='w-full sm:w-[48%] lg:w-[17%] mb-4'>
                                                    <div
                                                        className='block text-gray-700 font-medium cursor-pointer'
                                                        onClick={() => handleCategoryClick(expandedCategory, subCategory)}
                                                    >
                                                        {subCategory}
                                                    </div>
                                                    {products
                                                        .filter(product => product.subCategory === subCategory)
                                                        .slice(0, 5)
                                                        .map((product, index) => (
                                                            <div
                                                                key={index}
                                                                className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'
                                                                onClick={() => handleProductClick(generateSlug(product.name))}
                                                            >
                                                                <div>
                                                                    <p className='text-sm text-gray-500'>{product.name}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='w-full lg:w-2/4 flex items-center justify-center'>
                    <div className='w-full relative' ref={searchRef}>
                        <div className='relative'>
                            <input
                                type="text"
                                placeholder="Ürün ara..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black pr-10'
                            />
                            <GrSearch className='absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-red-400' />
                        </div>
                        {showSearchResults && searchResults.length > 0 && (
                            <div className='absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg py-2 z-50'>
                                {searchResults.map((product, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleProductClick(generateSlug(product.name))}
                                        className='flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer'
                                    >
                                        <img
                                            src={product.images?.[0] || '/assets/default-image.jpg'}
                                            className='w-10 h-10 object-cover rounded-sm'
                                            alt={product.name}
                                        />
                                        <div>
                                            <p className='text-sm font-medium text-black'>{product.name}</p>
                                            <p className='text-xs text-gray-600'>
                                                {truncateDescription(product.description, 50)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className='w-1/4 flex items-center justify-end gap-4'>
                    <div className="items-center gap-2 hidden sm:block rounded-lg">
                        <p className="text-sm font-medium text-gray-700">
                            {cartTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{currency}
                        </p>
                    </div>
                    <Link to="/sepet" className='relative flex items-center gap-2 hover:opacity-80 transition-all'>
                        <img src={assets.cart_icon} className='w-5 min-w-5' alt="sepet" />
                        <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-red-500 text-white aspect-square rounded-full text-[8px]'>
                            {getCartCount()}
                        </p>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;