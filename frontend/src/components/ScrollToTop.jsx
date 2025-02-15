import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Sayfanın en üstüne kaydır
  }, [location.pathname]); // location.pathname değiştiğinde tetikle

  return null; // Bu bileşen bir şey render etmez
};

export default ScrollToTop;