import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [currentState, setCurrentState] = useState('Giriş Yap');
    const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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
                const lowerCaseEmail = email.toLowerCase();
                const response = await axios.post(backendUrl + '/api/user/register', { name, email: lowerCaseEmail, password });

                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                } else {
                    toast.error(response.data.message);
                }
            } else {
                const lowerCaseEmail = email.toLowerCase();
                const response = await axios.post(backendUrl + '/api/user/login', { email: lowerCaseEmail, password });

                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                } else {
                    toast.error(response.data.message);
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
        <section className="mt-12 sm:mt-20  flex items-center justify-center p-4">
            <div className="w-full max-w-md border bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isForgotPassword ? 'Şifremi Unuttum' : currentState}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {isForgotPassword
                            ? 'Şifrenizi sıfırlamak için e-posta adresinizi girin.'
                            : currentState === 'Giriş Yap'
                            ? 'Hesabınıza erişmek için giriş yapın.'
                            : 'Yeni bir hesap oluşturun.'}
                    </p>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-6">
                    {isForgotPassword ? (
                        // Şifremi Unuttum Formu
                        <>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg "
                                    placeholder="Email adresinizi girin"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-orangeBrand text-white py-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                            >
                                Bağlantı Gönder
                            </button>
                            <p
                                onClick={() => setIsForgotPassword(false)}
                                className="text-sm text-center text-gray-900 hover:underline cursor-pointer"
                            >
                                Giriş Yap sayfasına dön
                            </p>
                        </>
                    ) : (
                        // Normal Giriş/Kayıt Formu
                        <>
                            {currentState === 'Kayıt Ol' && (
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        İsim
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg "
                                        placeholder="İsminizi girin"
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg "
                                    placeholder="Email adresinizi girin"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Şifre
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg "
                                    placeholder="Şifrenizi girin"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <p
                                    onClick={() => setIsForgotPassword(true)}
                                    className="text-sm text-gray-800 hover:underline cursor-pointer"
                                >
                                    Şifreni mi unuttun?
                                </p>
                                {currentState === 'Giriş Yap' ? (
                                    <p
                                        onClick={() => setCurrentState('Kayıt Ol')}
                                        className="text-sm text-gray-800 hover:underline cursor-pointer"
                                    >
                                        Hesap oluştur
                                    </p>
                                ) : (
                                    <p
                                        onClick={() => setCurrentState('Giriş Yap')}
                                        className="text-sm text-gray-800 hover:underline cursor-pointer"
                                    >
                                        Giriş Yap
                                    </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-orangeBrand text-white py-2 rounded-lg hover:bg-red-700 "
                            >
                                {currentState === 'Giriş Yap' ? 'Giriş Yap' : 'Kayıt Ol'}
                            </button>
                        </>
                    )}
                </form>

                {/* Hata mesajını göster */}
                {errorMessage && (
                    <div className="mt-4 text-center text-sm text-red-600">
                        {errorMessage}
                    </div>
                )}
            </div>
            <ToastContainer />
        </section>
    );
};

export default Login;