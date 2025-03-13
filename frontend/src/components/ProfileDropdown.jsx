import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const ProfileDropdown = ({ token, logout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

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
        <div className='relative' ref={dropdownRef}>
            {/* Profil Butonu */}
            <img
                onClick={() => {
                    console.log("Profil ikonuna tıklandı");
                    if (!token) {
                        console.log("Token yok, giriş sayfasına yönlendiriliyor");
                        navigate('/giris');
                    } else {
                        console.log("Dropdown açılıyor/kapanıyor");
                        setIsDropdownOpen(!isDropdownOpen);
                    }
                }}
                src={assets.profile_icon}
                className='w-5 cursor-pointer'
                alt="profil"
            />

            {/* Dropdown Menü */}
            {token && isDropdownOpen && (
                <div className='absolute right-0 pt-4 z-30'>
                    <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                        <p className='text-black'>Profil</p>
                        <p
                            onClick={(e) => {
                                e.stopPropagation(); // Olay yayılımını durdur
                                navigate('/orders');
                                setIsDropdownOpen(false); // Dropdown'u kapat
                            }}
                            className='cursor-pointer hover:text-black'
                        >
                            Siparişler
                        </p>
                        <p
                            onClick={(e) => {
                                e.stopPropagation(); // Olay yayılımını durdur
                                logout();
                                setIsDropdownOpen(false); // Dropdown'u kapat
                            }}
                            className='cursor-pointer hover:text-black'
                        >
                            Çıkış
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;