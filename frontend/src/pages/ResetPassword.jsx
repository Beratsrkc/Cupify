import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom'; // useSearchParams ekleyin
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const ResetPassword = () => {
    const [searchParams] = useSearchParams(); // Query string'den token'ı al
    const token = searchParams.get('token'); // token parametresini al
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { backendUrl } = useContext(ShopContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Şifreler eşleşmiyor!');
            return;
        }

        try {
            const response = await axios.post(backendUrl + '/api/user/reset-password', {
                token,
                newPassword,
                confirmPassword,
            });


            if (response.data.success) {
                toast.success('Şifreniz başarıyla güncellendi!');
                navigate('/giris');
            }
        } catch (error) {
            console.error('Şifre Güncelleme Hatası:', error); // Hata logu
            console.error('Hata Detayları:', error.response?.data || error.message); // Hata detaylarını logla
            toast.error(error.response?.data?.message || 'Bir hata oluştu!');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='text-3xl'>Şifre Yenileme</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            <input
                type="password"
                placeholder="Yeni Şifre"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className='w-full px-3 py-2 border border-gray-800'
                required
            />
            <input
                type="password"
                placeholder="Şifre Tekrar"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full px-3 py-2 border border-gray-800'
                required
            />
            <button className='bg-black text-white font-light px-8 py-2 mt-4 w-full'>
                Şifreyi Güncelle
            </button>
        </form>
    );
};

export default ResetPassword;