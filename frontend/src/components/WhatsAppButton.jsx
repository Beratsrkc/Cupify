// components/WhatsAppButton.js
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // WhatsApp ikonu için react-icons kullanıyoruz

const WhatsAppButton = () => {
  const phoneNumber = '+905318364465'; // WhatsApp'a yönlendirilecek telefon numarası
  const message = 'Merhaba, Cupify.com.tr sitesinden ulaşıyorum.'; // Otomatik gönderilecek mesaj

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#25D366',
        color: 'white',
        borderRadius: '50%',
        padding: '15px',
        cursor: 'pointer',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
      }}
      onClick={handleClick}
    >
      <FaWhatsapp size={30} />
    </div>
  );
};

export default WhatsAppButton;