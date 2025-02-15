import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [currentState, setCurrentState] = useState('Giriş Yap');
    const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Hata mesajı state'i

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
          if (isForgotPassword) {
              const lowerCaseEmail = email.toLowerCase();
  
              const response = await axios.post(backendUrl + '/api/user/forgot-password', { email: lowerCaseEmail });
  
              if (response.data.success) {
                  toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!');
                  setIsForgotPassword(false);
              } else {
                  toast.error(response.data.message); 
              }
          } else if (currentState === 'Kayıt Ol') {
              // Kayıt işlemi
              const lowerCaseEmail = email.toLowerCase();
              const response = await axios.post(backendUrl + '/api/user/register', { name, email: lowerCaseEmail, password });
              if (response.data.success) {
                  setToken(response.data.token);
                  localStorage.setItem('token', response.data.token);
              } else {
                  toast.error(response.data.message); // Backend'den gelen hata mesajını göster
              }
          } else {
              // Giriş işlemi
              const lowerCaseEmail = email.toLowerCase(); // E-posta adresini küçük harfe çevir
              const response = await axios.post(backendUrl + '/api/user/login', { email: lowerCaseEmail, password });
  
              if (response.data.success) {
                  setToken(response.data.token);
                  localStorage.setItem('token', response.data.token);
              } else {
                  toast.error(response.data.message); // Backend'den gelen hata mesajını göster
              }
          }
      } catch (error) {
          console.error('Hata Detayları:', error); 
          toast.error('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'); 
      }
  };

    useEffect(() => {
        if (token) navigate('/');
    }, [token, navigate]);

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='text-3xl'>
                    {isForgotPassword ? 'Şifremi Unuttum' : currentState}
                </p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>

            {isForgotPassword ? (
                // Şifremi Unuttum Formu
                <>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className='w-full px-3 py-2 border border-gray-800'
                        placeholder='Email'
                        type="email"
                        required
                    />
                    <button className='bg-black text-white font-light px-8 py-2 mt-4 w-full'>
                        Bağlantı Gönder
                    </button>
                    <p 
                        onClick={() => setIsForgotPassword(false)}
                        className='cursor-pointer text-sm text-gray-600'
                    >
                        Giriş Yap sayfasına dön
                    </p>
                </>
            ) : (
                // Normal Giriş/Kayıt Formu
                <>
                    {currentState === 'Giriş Yap' ? null : (
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className='w-full px-3 py-2 border border-gray-800'
                            placeholder='İsim'
                            type="text"
                            required
                        />
                    )}
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className='w-full px-3 py-2 border border-gray-800'
                        placeholder='Email'
                        type="email"
                        required
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='w-full px-3 py-2 border border-gray-800'
                        placeholder='Şifre'
                        type="password"
                        required
                    />
                    <div className='w-full flex justify-between text-sm mt-[-8px]'>
                        <p 
                            onClick={() => setIsForgotPassword(true)} 
                            className='cursor-pointer'
                        >
                            Şifreni mi unuttun ?
                        </p>
                        {currentState === 'Giriş Yap' ? (
                            <p 
                                onClick={() => setCurrentState('Kayıt Ol')} 
                                className='cursor-pointer'
                            >
                                Hesap oluştur
                            </p>
                        ) : (
                            <p 
                                onClick={() => setCurrentState('Giriş Yap')} 
                                className='cursor-pointer'
                            >
                                Giriş Yap
                            </p>
                        )}
                    </div>
                    <button className='bg-black text-white font-light px-8 py-2 mt-4 w-full'>
                        {currentState === 'Giriş Yap' ? 'Giriş Yap' : 'Kayıt Ol'}
                    </button>
                </>
            )}

            {/* Hata mesajını göster */}
            {errorMessage && (
                <div className="text-red-500 text-sm mt-2">
                    {errorMessage}
                </div>
            )}
        </form>
    );
};

export default Login;