import React, { useContext, useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown açık/kapalı durumu
    const dropdownRef = useRef(null); // Dropdown menüyü referanslamak için

    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    const logout = () => {
        navigate('/giris');
        localStorage.removeItem('token');
        setToken('');
        setCartItems({});
    };

    // Dropdown dışına tıklandığında kapat
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='flex items-center justify-between py-5 font-semibold z-20'>
            <Link to="/"><img src={assets.SBF_Logo} className='lg:w-32 w-24' alt="logo" /></Link>

            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to={"/"} className="flex flex-col items-center gap-1">
                    <p>ANASAYFA</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to={"urunler"} className="flex flex-col items-center gap-1">
                    <p>ÜRÜNLER</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to={"hakkimizda"} className="flex flex-col items-center gap-1">
                    <p>HAKKIMIZDA</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to={"iletisim"} className="flex flex-col items-center gap-1">
                    <p>İLETİŞİM</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                <img
                    onClick={() => {
                        setShowSearch(true);
                        navigate('/urunler');
                    }}
                    src={assets.search_icon}
                    className='w-5 cursor-pointer'
                    alt="search"
                />
                <div className='relative' ref={dropdownRef}>
                    <img
                        onClick={() => {
                            if (!token) {
                                navigate('/giris');
                            } else {
                                setIsDropdownOpen(!isDropdownOpen); // Dropdown'ı aç/kapa
                            }
                        }}
                        src={assets.profile_icon}
                        className='w-5 cursor-pointer'
                        alt="profil"
                    />
                    {/* Dropdown Menu */}
                    {token && isDropdownOpen && (
                        <div className='absolute right-0 pt-4 z-30'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                                <p className='text-black'>Profil</p>
                                <p
                                    onClick={() => {
                                        navigate('/orders');
                                        setIsDropdownOpen(false); // Dropdown'ı kapat
                                    }}
                                    className='cursor-pointer hover:text-black'
                                >
                                    Siparişler
                                </p>
                                <p
                                    onClick={() => {
                                        logout();
                                        setIsDropdownOpen(false); // Dropdown'ı kapat
                                    }}
                                    className='cursor-pointer hover:text-black'
                                >
                                    Çıkış
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <Link to="/sepet" className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="sepet" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>
                <img onClick={() => setVisible(true)} src={assets.Menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>

            {/* Sidebar menu for small screens */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'} z-10`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="" />
                        <p>Geri</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to="/">ANASAYFA</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to="urunler">ÜRÜNLER</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to="hakkimizda">HAKKIMIZDA</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to="iletisim">İLETİŞİM</NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navbar;