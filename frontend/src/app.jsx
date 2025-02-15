import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Collection from './pages/Urunler';
import About from './pages/Hakkimizda';
import Contact from './pages/İletisim';
import Product from './pages/Product';
import Cart from './pages/Sepet';
import Login from './pages/Giris';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';
import PlaceOrder from './pages/Siparis';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Odeme from './pages/Odeme';
import GizlilikSozlesmesi from './pages/gizlilik-sozlesmesi';
import MesafeliSatisSozlesmesi from './pages/mesafeli-satis-sozlesmesi';
import TeslimatVeIade from './pages/teslimat-ve-iade-sartlari';
import ResetPassword from './pages/ResetPassword';
import WhatsAppButton from './components/WhatsAppButton';

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const location = useLocation();

  // WhatsAppButton'ın gösterilmeyeceği sayfalar
  const hiddenPages = [
    '/sepet',
    '/siparis',
    '/odeme',
  ];

  // Dinamik rotalar için kontrol (örneğin, /product/:slug)
  const isProductPage = location.pathname.startsWith('/product/');

  // Eğer mevcut sayfa hiddenPages listesinde veya bir ürün sayfası ise WhatsAppButton'ı gizle
  const showWhatsAppButton = !hiddenPages.includes(location.pathname) && !isProductPage;

  return (
    <div className='px-4 dm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer
        autoClose={1000}
        limit={5}
        hideProgressBar
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <Navbar />
      <SearchBar />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/urunler' element={<Collection />} />
        <Route path='/hakkimizda' element={<About />} />
        <Route path='/iletisim' element={<Contact />} />
        <Route path='/product/:slug' element={<Product />} />
        <Route path='/sepet' element={<Cart />} />
        <Route path='/giris' element={<Login />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path='/siparis' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path="/odeme" element={<Odeme />} />
        <Route path="/gizlilik-sozlesmesi" element={<GizlilikSozlesmesi />} />
        <Route path="/mesafeli-satis-sozlesmesi" element={<MesafeliSatisSozlesmesi />} />
        <Route path="/teslimat-ve-iade-sartlari" element={<TeslimatVeIade />} />
      </Routes>
      <Footer />
      {showWhatsAppButton && <WhatsAppButton />} {/* Koşula göre WhatsAppButton'ı göster veya gizle */}
    </div>
  );
};

export default App;