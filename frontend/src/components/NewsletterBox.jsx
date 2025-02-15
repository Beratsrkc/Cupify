import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const NewsletterBox = () => {
    const navigate = useNavigate();

    const onSubscribeHandler = () => {
        navigate('/giris'); 
    }

    return (
        <div className='text-center'>
            <p className='text-2xl font-medium text-gray-800'>Kampanyalardan Ve Yeni Ürünlerden Haberdar Olun!</p>
            <p className='text-gray-400 mt-3'>
                Yeni ürünler, özel indirimler ve kampanyalardan haberdar olmak için hemen üye olun. Fırsatları kaçırmayın!
            </p>
            <button 
                onClick={onSubscribeHandler} 
                className='bg-black text-white text-xs px-10 py-4 mt-6 hover:bg-gray-800 transition-colors'
            >
                KAYIT OL
            </button>
        </div>
    );
}

export default NewsletterBox;