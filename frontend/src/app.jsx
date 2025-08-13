import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Frontend Importları
import Home from '@/pages/Home';
import Collection from '@/pages/Urunler';
import About from '@/pages/Hakkimizda';
import Contact from '@/pages/İletisim';
import Product from '@/pages/Product';
import Cart from '@/pages/Sepet';
import Login from '@/pages/Giris';
import Orders from '@/pages/Orders';
import Navbar from '@/components/Navbar';
import PlaceOrder from '@/pages/Siparis';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import Odeme from '@/pages/Odeme';
import GizlilikSozlesmesi from '@/pages/gizlilik-sozlesmesi';
import MesafeliSatisSozlesmesi from '@/pages/mesafeli-satis-sozlesmesi';
import TeslimatVeIade from '@/pages/teslimat-ve-iade-sartlari';
import ResetPassword from '@/pages/ResetPassword';
import WhatsAppButton from '@/components/WhatsAppButton';
import BlogDetail from '@/pages/BlogDetail';
import BlogPage from '@/pages/BlogPage';

// Admin Importları
import AdminNavbar from '@admin/components/Navbar';
import AdminSlidebar from '@admin/components/Slidebar';
import AdminLogin from '@admin/components/Login';
import AdminRoutes from '@admin/routes';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  const hiddenPages = ['/sepet', '/siparis', '/odeme'];
  const isProductPage = location.pathname.startsWith('/product/');
  const showWhatsAppButton = !hiddenPages.includes(location.pathname) && !isProductPage;

  return (
    <div>
      <ScrollToTop />
      <ToastContainer autoClose={1000} limit={5} hideProgressBar newestOnTop theme="light" />

      <Routes>
        {/* Admin Panel */}
        <Route
          path="/admin/*"
          element={
            token === '' ? (
              <AdminLogin setToken={setToken} />
            ) : (
              <>
                <AdminNavbar setToken={setToken} />
                <hr />
                <div className="flex w-full">
                  <AdminSlidebar />
                  <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
                    <AdminRoutes token={token} />
                  </div>
                </div>
              </>
            )
          }
        />

        {/* Normal Site */}
        <Route path="/iletisim" element={<Contact />} />
        <Route
          path="*"
          element={
            <div>
              <div className="container mx-auto px-4">
                <Navbar />
                <SearchBar />
              </div>

              <div className="container mx-auto px-4">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/urunler" element={<Collection />} />
                  <Route path="/hakkimizda" element={<About />} />
                  <Route path="/product/:slug" element={<Product />} />
                  <Route path="/sepet" element={<Cart />} />
                  <Route path="/giris" element={<Login />} />
                  <Route path="/ResetPassword" element={<ResetPassword />} />
                  <Route path="/siparis" element={<PlaceOrder />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/odeme" element={<Odeme />} />
                  <Route path="/gizlilik-sozlesmesi" element={<GizlilikSozlesmesi />} />
                  <Route path="/mesafeli-satis-sozlesmesi" element={<MesafeliSatisSozlesmesi />} />
                  <Route path="/teslimat-ve-iade-sartlari" element={<TeslimatVeIade />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                </Routes>
              </div>

              <div className="container mx-auto px-4">
                <Footer />
              </div>

              {showWhatsAppButton && <WhatsAppButton />}
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;