import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { toast } from 'react-toastify';
import { SiTicktick } from "react-icons/si";
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';


import { CiEdit } from "react-icons/ci";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import EditDeliveryInfoDialog from '../components/EditDeliveryInfoDialog';
import StepIndicator from '../components/StepIndicator ';
import CreditCardVisual from '../components/CreditCardVisual';

const Odeme = () => {
    const { products, token, backendUrl, cartItems, setCartItems, userDetails, updateQuantity, getCartAmount, updateUserDetails, currency } =
        useContext(ShopContext);
    const guestToken = import.meta.env.VITE_QUEST_TOKEN;
    const [holderName, setHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardInfo, setCardInfo] = useState(null);
    const [expireMonth, setExpireMonth] = useState('');
    const [expireYear, setExpireYear] = useState('');
    const [cvc, setCvc] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [openLegalSections, setOpenLegalSections] = useState({
        preInformation: false,
        distanceSelling: false,
        privacyPolicy: false,
    });
    const [installmentOptions, setInstallmentOptions] = useState([]);
    const [selectedInstallment, setSelectedInstallment] = useState(1);
    const [isCreditCard, setIsCreditCard] = useState(false);
    const [cardNumberError, setCardNumberError] = useState('');
    const { subtotal, total: singlePaymentTotal } = getCartAmount();
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    const [cvcFocused, setCvcFocused] = useState(false);
    const vatAmount = subtotal * 0.2; // KDV, subtotal üzerine eklenecek
    const totalWithVAT = subtotal + vatAmount; // KDV dahil toplam

    const [selectedInstallmentTotal, setSelectedInstallmentTotal] = useState(totalWithVAT);

    const handleInstallmentSelect = (option) => {
        if (option) {
            setSelectedInstallment(option.installmentNumber);
            setSelectedInstallmentTotal(Number(option.totalPrice));
        } else {
            setSelectedInstallment(1);
            // Taksit seçenekleri yoksa, KDV dahil toplam fiyatı kullan
            setSelectedInstallmentTotal(totalWithVAT);
        }
    };

    const [touched, setTouched] = useState({
        holderName: false,
        cardNumber: false,
        expireMonth: false,
        expireYear: false,
        cvc: false
    });

    const validateHolderName = () => {
        if (!touched.holderName) return '';
        return holderName.trim() === '' ? 'Kart sahibi adı boş bırakılamaz.' : '';
    };

    const validateCardNumber = () => {
        if (!touched.cardNumber) return '';
        const cleaned = cardNumber.replace(/\s/g, '');
        if (cleaned.length < 16) return 'Geçersiz kart numarası (16 haneli olmalı)';
        return '';
    };

    const validateExpireMonth = () => {
        if (!touched.expireMonth) return '';
        const month = parseInt(expireMonth);
        return (month < 1 || month > 12) ? 'Geçersiz ay (1-12 arası)' : '';
    };

    const validateExpireYear = () => {
        if (!touched.expireYear) return '';
        const currentYear = new Date().getFullYear() % 100;
        const year = parseInt(expireYear);
        return (year < currentYear) ? 'Geçersiz yıl' : '';
    };

    const validateCvc = () => {
        if (!touched.cvc) return '';
        return cvc.length < 3 ? 'CVC en az 3 haneli olmalı' : '';
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };



    useEffect(() => {
        const fetchBinDetails = async () => {
            const cleanedCardNumber = cardNumber.replace(/\D/g, '');
            if (cleanedCardNumber.length >= 6) {
                const bin = cleanedCardNumber.substring(0, 6);
                try {
                    const response = await axios.post(
                        `${backendUrl}/api/payment/bin/check`,
                        { binNumber: bin },
                        { headers: { token } }
                    );
    
                    if (response.data.status === 'success') {
                        const isCredit = response.data.cardType === 'CREDIT_CARD';
                        setIsCreditCard(isCredit);
    
                        if (!isCredit) {
                            setInstallmentOptions([]);
                            // Debit kartlarda KDV dahil toplam fiyatı kullan
                            handleInstallmentSelect({
                                installmentNumber: 1,
                                totalPrice: totalWithVAT.toFixed(2)
                            });
                        }
    
                        setCardInfo(response.data);
                    } else {
                        setCardNumberError('Kart bilgisi alınamadı');
                        setCardInfo(null);
                    }
                } catch (err) {
                    console.error('Kart bilgisi alınamadı:', err);
                    setCardNumberError('Kart bilgisi alınırken bir hata oluştu.');
                    setCardInfo(null);
                }
            } else if (cleanedCardNumber.length > 0) {
                setCardNumberError('Geçersiz kart numarası (en az 6 rakam girin)');
                setCardInfo(null);
            } else {
                setCardNumberError('');
                setCardInfo(null);
            }
        }
        fetchBinDetails();
    }, [cardNumber]);

    const getCardLogo = () => {
        if (!cardInfo) return null;

        switch (cardInfo.cardAssociation) {
            case 'VISA':
                return <img src={assets.visa} className="h-6" alt="Visa" />;
            case 'MASTER_CARD':
                return <img src={assets.mastercard} className="h-6" alt="Mastercard" />;
            case 'TROY':
                return <img src={assets.troy} className="h-6" alt="Troy" />;
            case 'AMERICAN_EXPRESS':
                return <img src={assets.amex} className="h-6" alt="AMERICAN_EXPRESS" />;
            default:
                return null;
        }
    };

    useEffect(() => {
        const cleanedCardNumber = cardNumber.replace(/\D/g, '');
        if (cleanedCardNumber.length >= 6) {
            const binNumber = cleanedCardNumber.substring(0, 6);
            getInstallmentOptions(binNumber).then(options => {
                setInstallmentOptions(options);
                if (options.length === 0) {
                    handleInstallmentSelect(null);
                }
            });
        } else {
            setInstallmentOptions([]);
            handleInstallmentSelect(null);
        }
    }, [cardNumber]);
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');

    const getInstallmentOptions = async (binNumber) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/payment/installments`,
                {
                    binNumber,
                    price: totalWithVAT.toFixed(2) // KDV dahil toplam fiyatı gönder
                },
                { headers: { token } }
            );
    
            if (response.data.status === 'success') {
                const options = response.data.installments[0]?.installmentPrices || [];
                if (options.length === 0) {
                    // Taksit seçenekleri yoksa, KDV dahil toplam fiyatı kullan
                    handleInstallmentSelect({
                        installmentNumber: 1,
                        totalPrice: totalWithVAT.toFixed(2)
                    });
                }
                return options;
            } else {
                toast.error('Taksit bilgileri alınamadı');
                // Taksit seçenekleri yoksa, KDV dahil toplam fiyatı kullan
                handleInstallmentSelect({
                    installmentNumber: 1,
                    totalPrice: totalWithVAT.toFixed(2)
                });
                return [];
            }
        } catch (error) {
            console.error('Taksit bilgisi alınamadı:', error);
            toast.error('Taksit bilgileri alınırken bir hata oluştu.');
            // Taksit seçenekleri yoksa, KDV dahil toplam fiyatı kullan
            handleInstallmentSelect({
                installmentNumber: 1,
                totalPrice: totalWithVAT.toFixed(2)
            });
            return [];
        }
    };
    const getBinDetails = async (binNumber) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/payment/bin/check`,
                {
                    binNumber,
                },
                {
                    headers: { token },
                }
            );

            if (response.data.status === 'success') {


                return response.data.binDetails;



            } else {
                console.error('BIN bilgileri alınamadı:', response.data.errorMessage);
                toast.error('Kart bilgileri alınamadı. Lütfen kart numaranızı kontrol edin.');
                return null;
            }
        } catch (error) {
            console.error('Hata:', error.response?.data || error.message);
            toast.error('Kart bilgileri alınırken bir hata oluştu.');
            return null;
        }
    };

    const navigate = useNavigate();

    const clearAllItems = async () => {
        try {
            for (const itemId of Object.keys(cartItems)) {
                await updateQuantity(itemId, 0);
            }
            setCartItems({});
        } catch (error) {
            console.error('Sepet temizleme hatası:', error);
        }
    };

    const handlePayment = async (event) => {
  event.preventDefault();
  
  // Kart bilgilerini doğrula
  if (validateHolderName() || validateCardNumber() || 
      validateExpireMonth() || validateExpireYear() || validateCvc()) {
    toast.error("Lütfen kart bilgilerinizi kontrol edin");
    return;
  }

  const cleanedCardNumber = cardNumber.replace(/\s/g, '');
  
  try {
    // 1. Önce siparişi oluştur
    const orderResponse = await axios.post(`${backendUrl}/api/order`, {
      userId: userDetails._id,
      items: Object.keys(cartItems).map(itemKey => {
        const itemId = itemKey.split('-')[0];
        const product = products.find(p => p._id === itemId);
        return {
          productId: itemId,
          name: product.name,
          price: cartItems[itemKey].totalPrice,
          quantity: cartItems[itemKey].quantity,
          selectedCoverOption: cartItems[itemKey].selectedCoverOption,
          selectedPrintingOption: cartItems[itemKey].selectedPrintingOption,
          selectedSize: cartItems[itemKey].selectedSize?.label
        };
      }),
      amount: selectedInstallmentTotal,
      address: `${userDetails.addressInput}, ${userDetails.city}/${userDetails.district}`,
      name: `${userDetails.firstName} ${userDetails.lastName}`,
      phone: userDetails.phone,
      email: userDetails.email,
      merchant_oid: `ORD${Date.now()}` // Frontend'de oluşturuyoruz
    }, { headers: { token } });

    if (!orderResponse.data.success) {
      throw new Error('Sipariş oluşturulamadı');
    }

    // 2. PayTR ödeme isteğini gönder
    const paymentResponse = await axios.post(`${backendUrl}/api/payment/paytr`, {
      cardHolderName: holderName,
      cardNumber: cleanedCardNumber,
      expireMonth,
      expireYear,
      cvc,
      price: selectedInstallmentTotal,
      userDetails,
      merchant_oid: orderResponse.data.order.merchant_oid, // Siparişten gelen ID
      installmentCount: selectedInstallment,
      basketItems: orderResponse.data.order.items // Sipariş öğeleri
    }, { headers: { token } });

    // 3. Ödeme başarılıysa
    if (paymentResponse.data.status === 'success') {
      await clearAllItems();
      setPaymentSuccess(true);
      
      // Başarılı sayfasına yönlendirme yapabilirsiniz
      // navigate('/payment-success');
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Ödeme işlemi başarısız oldu');
    console.error('Payment error:', error);
  }
};
    const handleSaveDeliveryInfo = (updatedInfo) => {
        updateUserDetails(updatedInfo);
    };

    const toggleLegalSection = (section) => {
        setOpenLegalSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <>
            {!paymentSuccess && <StepIndicator currentStep={2} />}

            <form
                className="flex flex-col lg:flex-row justify-between gap-4  sm:pt-5 min-h-[80vh] "
                onSubmit={handlePayment}
            >
                {paymentSuccess ? (
                    <div className="flex w-full items-center justify-center min-h-screen text-center ">
                        <div className="flex flex-col justify-center items-center p-6 bg-white rounded-lg shadow-lg max-w-md mx-4">
                            <div className="flex justify-center items-center gap-4 mb-6">
                                <motion.div
                                    className="text-green-600"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <SiTicktick className="text-8xl sm:text-9xl" />
                                </motion.div>
                            </div>
                            <motion.h2
                                className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4"
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                Ödeme Başarılı!
                            </motion.h2>
                            <motion.p
                                className="text-gray-600 text-sm sm:text-base mb-6"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                Siparişiniz başarıyla alındı. En kısa sürede kargoya verilecektir.
                            </motion.p>
                            <motion.button
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                onClick={() => navigate('/')}
                            >
                                Ana Sayfaya Dön
                            </motion.button>
                        </div>
                    </div>
                ) : (
                    <>

                        <div className="flex flex-col gap-4 w-full xl:w-2/3 sm:pb-0">
                            <div className='flex justify-between items-center mb-3'>
                                <div className="text-lg  ">
                                    <Title text1={'ÖDEME'} text2={'BİLGİLERİ'} />

                                </div>
                                <div>
                                    <img src={assets.tekparcaLogolar} alt="iyzico icon" className=" w-44 sm:w-56" />
                                </div>
                            </div>

                            {/* Kart Bilgileri ve Görsel */}
                            <div className="flex flex-col lg:flex-row gap-5">
                                {/* Inputlar (lg'de 3/5, küçük ekranlarda tam genişlik) */}
                                <div className="w-full lg:1/2 ">
                                    {/* Kart Sahibi */}
                                    <div>
                                        <input
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${touched.holderName && validateHolderName()
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                                }`}
                                            placeholder="Kart Sahibi"
                                            value={holderName}
                                            onChange={(e) => setHolderName(e.target.value)}
                                            onBlur={() => handleBlur('holderName')}
                                            required
                                        />
                                        {touched.holderName && (
                                            <p className="text-sm text-red-500 mt-1">{validateHolderName()}</p>
                                        )}
                                    </div>

                                    {/* Kart Numarası */}
                                    <div className="relative mt-4">
                                        <input
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${touched.cardNumber && validateCardNumber()
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                                }`}
                                            value={cardNumber}
                                            onChange={(e) => {
                                                const cleaned = e.target.value.replace(/\D/g, '');
                                                const formatted = cleaned.match(/.{1,4}/g)?.join(' ').substr(0, 19) || '';
                                                setCardNumber(formatted);
                                            }}
                                            onBlur={() => handleBlur('cardNumber')}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                        />
                                        {cardInfo && (
                                            <div className="absolute right-3 top-3">
                                                {getCardLogo()}
                                            </div>
                                        )}
                                        {touched.cardNumber && (
                                            <p className="text-sm text-red-500 mt-1">{validateCardNumber()}</p>
                                        )}
                                    </div>

                                    {/* Son Kullanma Tarihi ve CVC */}
                                    <div className="flex gap-3 mt-4">
                                        <div className="flex-1">
                                            <div className="flex gap-2">
                                                <div className="w-1/2">
                                                    <input
                                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${touched.expireMonth && validateExpireMonth()
                                                            ? 'border-red-500 focus:ring-red-500'
                                                            : 'border-gray-300 focus:ring-blue-500'
                                                            }`}
                                                        placeholder="AA"
                                                        value={expireMonth}
                                                        onChange={(e) => {
                                                            const month = e.target.value.replace(/\D/g, '').slice(0, 2);
                                                            setExpireMonth(month);
                                                        }}
                                                        onBlur={() => handleBlur('expireMonth')}
                                                        maxLength={2}
                                                        required
                                                    />
                                                    {touched.expireMonth && (
                                                        <p className="text-sm text-red-500 mt-1">{validateExpireMonth()}</p>
                                                    )}
                                                </div>
                                                <div className="w-1/2">
                                                    <input
                                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${touched.expireYear && validateExpireYear()
                                                            ? 'border-red-500 focus:ring-red-500'
                                                            : 'border-gray-300 focus:ring-blue-500'
                                                            }`}
                                                        placeholder="YY"
                                                        value={expireYear}
                                                        onChange={(e) => {
                                                            const year = e.target.value.replace(/\D/g, '').slice(0, 2);
                                                            setExpireYear(year);
                                                        }}
                                                        onBlur={() => handleBlur('expireYear')}
                                                        maxLength={2}
                                                        required
                                                    />
                                                    {touched.expireYear && (
                                                        <p className="text-sm text-red-500 mt-1">{validateExpireYear()}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* CVC */}
                                        <div className="flex-1">
                                            <input
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${touched.cvc && validateCvc()
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500'
                                                    }`}
                                                placeholder="CVC"
                                                value={cvc}
                                                onChange={(e) => {
                                                    const cvcValue = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                    setCvc(cvcValue);
                                                }}
                                                onBlur={() => handleBlur('cvc')}
                                                maxLength={4}
                                                required
                                            />
                                            {touched.cvc && (
                                                <p className="text-sm text-red-500 mt-1">{validateCvc()}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Kredi Kartı Görseli (lg'de 2/5, küçük ekranlarda tam genişlik) */}
                                <div className="w-full  hidden sm:block xl:2/3  mt-4 lg:mt-0">
                                    <CreditCardVisual
                                        cardNumber={cardNumber}
                                        holderName={holderName}
                                        expireMonth={expireMonth}
                                        expireYear={expireYear}
                                        cvc={cvc}
                                        cvcFocused={cvcFocused}
                                    />
                                </div>
                            </div>

                            {/* Taksit Seçenekleri */}
                            {isCreditCard ? (
                                <>
                                    {cardNumber.replace(/\D/g, '').length < 6 ? (
                                        <div className="text-sm text-red-500">
                                            Lütfen geçerli bir kart numarası girin (en az 6 rakam).
                                        </div>
                                    ) : installmentOptions.length > 0 ? (
                                        <>
                                            <h3 className="text-lg font-semibold mb-2">Taksit Seçenekleri</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {installmentOptions.map((option) => (
    <div
        key={option.installmentNumber}
        className={`p-4 border rounded-lg cursor-pointer ${selectedInstallment === option.installmentNumber
            ? 'bg-blue-50 border-blue-500'
            : 'bg-white border-gray-200 hover:border-blue-500'
            }`}
        onClick={() => {
            setSelectedInstallment(option.installmentNumber);
            setSelectedInstallmentTotal(Number(option.totalPrice));
        }}
    >
        <div className="flex justify-between items-center">
            <span className="font-medium">
                {option.installmentNumber === 1 ? 'Tek Çekim' : `${option.installmentNumber} Taksit`}
            </span>
            <span className="text-sm text-gray-600">
                {option.totalPrice} TL
            </span>
        </div>
        <div className="text-sm text-gray-500 mt-1">
            Aylık: {option.installmentPrice.toFixed(2)} TL
        </div>
    </div>
))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-sm text-gray-500">
                                            Taksit seçenekleri bulunamadı. Varsayılan olarak 1 taksit uygulanacaktır.
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-sm text-gray-500">

                                </div>
                            )}

                            <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-lg font-medium mb-4">Yasal Bildirimler</h3>
                                <div className="space-y-4">
                                    {/* Ön Bilgilendirme Formu */}
                                    <div className="border-b pb-4">
                                        <div
                                            className="flex justify-between items-center cursor-pointer"
                                            onClick={() => toggleLegalSection('preInformation')}
                                        >
                                            <span>Ön Bilgilendirme Formu</span>
                                            {openLegalSections.preInformation ? (
                                                <IoIosArrowUp className="text-xl" />
                                            ) : (
                                                <IoIosArrowDown className="text-xl" />
                                            )}
                                        </div>
                                        {openLegalSections.preInformation && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                transition={{ duration: 0.3 }}
                                                className="mt-2 text-sm text-gray-600 space-y-4"
                                            >
                                                {/* 1. KONU */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">1. KONU</h4>
                                                    <p>
                                                        İşbu Satış Sözleşmesi Ön Bilgi Formu’nun konusu, SATICI' nın, SİPARİŞ VEREN/ALICI' ya satışını yaptığı, aşağıda nitelikleri ve satış fiyatı belirtilen ürün/ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicilerin Korunması Hakkındaki Kanun - Mesafeli Sözleşmeler Yönetmeliği (RG:27.11.2014/29188) hükümleri gereğince tarafların hak ve yükümlülüklerini kapsamaktadır.
                                                    </p>
                                                </div>

                                                {/* 2. SATICI BİLGİLERİ */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">2. SATICI BİLGİLERİ</h4>
                                                    <ul className="list-disc pl-5">
                                                        <li>Ünvanı: ŞİRKET ADI</li>
                                                        <li>Adres: </li>
                                                        <li>Telefon: TELEFON</li>
                                                        <li>Eposta:MAİL</li>
                                                    </ul>
                                                </div>

                                                {/* 3. ALICI BİLGİLERİ (Dinamik Veriler) */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">3. ALICI BİLGİLERİ</h4>
                                                    <ul className="list-disc pl-5">
                                                        <li>Teslim Edilecek Kişi: {userDetails?.firstName} {userDetails?.lastName}</li>
                                                        <li>Teslimat Adresi: {userDetails?.addressInput} {userDetails?.city} / {userDetails?.district}</li>
                                                        <li>Şehir/İlçe: {userDetails?.city} / {userDetails?.district}</li>
                                                        <li>Telefon: {userDetails?.phone}</li>
                                                        <li>Eposta: {userDetails?.email}</li>
                                                    </ul>
                                                </div>

                                                {/* 4. SÖZLEŞME KONUSU ÜRÜN BİLGİLERİ */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">4. SÖZLEŞME KONUSU ÜRÜN/ÜRÜNLER BİLGİLERİ</h4>
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full border-collapse">
                                                            <thead>
                                                                <tr className="bg-gray-100">
                                                                    <th className="border p-2">Ürün Adı</th>
                                                                    <th className="border p-2">Adet</th>
                                                                    <th className="border p-2">Birim Fiyat</th>
                                                                    <th className="border p-2">Toplam</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {Object.keys(cartItems)
                                                                    .filter(itemId => cartItems[itemId] > 0)
                                                                    .map((itemId) => {
                                                                        const product = products.find(p => p._id === itemId);
                                                                        return product && (
                                                                            <tr key={itemId} className="border">
                                                                                <td className="border p-2">{product.name}</td>
                                                                                <td className="border p-2 text-center">{cartItems[itemId]}</td>
                                                                                <td className="border p-2 text-right">{product.price.toFixed(2)} TL</td>
                                                                                <td className="border p-2 text-right">{(product.price * cartItems[itemId]).toFixed(2)} TL</td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="mt-4 text-right">
                                                        <p>KDV (%20): {(subtotal * 0.20).toFixed(2)} TL</p>
                                                        <p className="font-semibold">Genel Toplam: {(subtotal*1.20).toFixed(2)} TL</p>
                                                        <p>Kargo Tutarı: 0,00 TL</p>

                                                        <p>Teslimat Adresi: {userDetails?.addressInput}  <br /> {userDetails?.city} / {userDetails?.district}</p>
                                                        <p>Sipariş Tarihi: {new Date().toLocaleDateString()}</p>
                                                    </div>
                                                </div>

                                                {/* 5. GENEL HÜKÜMLER */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">5. GENEL HÜKÜMLER</h4>

                                                    {/* Buraya 5. maddelerin tam metni eklenebilir */}
                                                    <p className='mb-2'>ALICI, SATICI’ya ait internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup, bilgi sahibi olduğunu, elektronik ortamda gerekli teyidi verdiğini kabul, beyan ve taahhüt eder. ALICININ; Ön Bilgilendirmeyi elektronik ortamda teyit etmesi, mesafeli satış sözleşmesinin kurulmasından evvel, SATICI tarafından ALICI' ya verilmesi gereken adresi, siparişi verilen ürünlere ait temel özellikleri, ürünlerin vergiler dâhil fiyatını, ödeme ve teslimat bilgilerini de doğru ve eksiksiz olarak edindiğini kabul, beyan ve taahhüt eder.</p>

                                                    <p className='mb-2'>Sözleşme konusu her bir ürün, 30 günlük yasal süreyi aşmamak kaydı ile ALICI' nın yerleşim yeri uzaklığına bağlı olarak internet sitesindeki ön bilgiler kısmında belirtilen süre zarfında ALICI veya ALICI’ nın gösterdiği adresteki kişi ve/veya kuruluşa teslim edilir. Bu süre içinde ürünün ALICI’ya teslim edilememesi durumunda, ALICI’nın sözleşmeyi feshetme hakkı saklıdır.</p>

                                                    <p className='mb-2'>SATICI, sözleşme konusu ürünü eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgeleri, kullanım kılavuzları ile teslim etmeyi, her türlü ayıptan arî olarak yasal mevzuat gereklerine sağlam, standartlara uygun bir şekilde işin gereği olan bilgi ve belgeler ile işi doğruluk ve dürüstlük esasları dâhilinde ifa etmeyi, hizmet kalitesini koruyup yükseltmeyi, işin ifası sırasında gerekli dikkat ve özeni göstermeyi, ihtiyat ve öngörü ile hareket etmeyi kabul, beyan ve taahhüt eder.</p>

                                                    <p className='mb-2'>SATICI, sözleşmeden doğan ifa yükümlülüğünün süresi dolmadan ALICI’yı bilgilendirmek ve açıkça onayını almak suretiyle eşit kalite ve fiyatta farklı bir ürün tedarik edebilir.</p>

                                                    <p className='mb-2'>SATICI, sipariş konusu ürün veya hizmetin yerine getirilmesinin imkânsızlaşması halinde sözleşme konusu yükümlülüklerini yerine getiremezse, bu durumu, öğrendiği tarihten itibaren 3 gün içinde yazılı olarak tüketiciye bildireceğini, 14 günlük süre içinde toplam bedeli ALICI’ya iade edeceğini kabul, beyan ve taahhüt eder.</p>

                                                    <p className='mb-2'>ALICI, sözleşme konusu ürünün teslimatı için  Ön Bilgilendirme Formunu elektronik ortamda teyit edeceğini, herhangi bir nedenle sözleşme konusu ürün bedelinin ödenmemesi ve/veya banka kayıtlarında iptal edilmesi halinde, SATICI’ nın sözleşme konusu ürünü teslim yükümlülüğünün sona ereceğini kabul, beyan ve taahhüt eder.</p>

                                                    <p className='mb-2'>ALICI, Sözleşme konusu ürünün ALICI veya ALICI’nın gösterdiği adresteki kişi ve/veya kuruluşa tesliminden sonra ALICI'ya ait kredi kartının yetkisiz kişilerce haksız kullanılması sonucunda sözleşme konusu ürün bedelinin ilgili banka veya finans kuruluşu tarafından SATICI'ya ödenmemesi halinde, ALICI Sözleşme konusu ürünü 3 gün içerisinde nakliye gideri SATICI’ya ait olacak şekilde SATICI’ya iade edeceğini kabul, beyan ve taahhüt eder.</p>

                                                    <p className='mb-2'>SATICI, tarafların iradesi dışında gelişen, önceden öngörülemeyen ve tarafların borçlarını yerine getirmesini engelleyici ve/veya geciktirici hallerin oluşması gibi mücbir sebepler halleri nedeni ile sözleşme konusu ürünü süresi içinde teslim edemez ise, durumu ALICI' ya bildireceğini kabul, beyan ve taahhüt eder. ALICI da siparişin iptal edilmesini, sözleşme konusu ürünün varsa emsali ile değiştirilmesini ve/veya teslimat süresinin engelleyici durumun ortadan kalkmasına kadar ertelenmesini SATICI’ dan talep etme hakkına haizdir.</p>

                                                    <p className='mb-2'>ALICI tarafından siparişin iptal edilmesi halinde ALICI’ nın nakit ile yaptığı ödemelerde, ürün tutarı 14 gün içinde kendisine nakden ve defaten ödenir. ALICI’ nın kredi kartı ile yaptığı ödemelerde ise, ürün tutarı, siparişin ALICI tarafından iptal edilmesinden sonra 14 gün içerisinde ilgili bankaya iade edilir. ALICI, SATICI tarafından kredi kartına iade edilen tutarın banka tarafından ALICI hesabına yansıtılmasına ilişkin ortalama sürecin 2 ile 3 haftayı bulabileceğini, bu tutarın bankaya iadesinden sonra ALICI’ nın hesaplarına yansıması halinin tamamen banka işlem süreci ile ilgili olduğundan, ALICI, olası gecikmeler için SATICI’ yı sorumlu tutamayacağını kabul, beyan ve taahhüt eder.</p>


                                                </div>

                                                {/* 7. CAYMA HAKKI */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">7. CAYMA HAKKI</h4>
                                                    <p class="mb-2">ALICI; mal satışına ilişkin mesafeli sözleşmelerde, ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren 14 (on dört) gün içerisinde, SATICI’ya bildirmek şartıyla hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkını kullanabilir. Hizmet sunumuna ilişkin mesafeli sözleşmelerde ise, bu süre sözleşmenin imzalandığı tarihten itibaren başlar. Cayma hakkı süresi sona ermeden önce, tüketicinin onayı ile hizmetin ifasına başlanan hizmet sözleşmelerinde cayma hakkı kullanılamaz. Cayma hakkının kullanımından kaynaklanan masraflar SATICI’ ya aittir. ALICI, iş bu sözleşmeyi kabul etmekle, cayma hakkı konusunda bilgilendirildiğini peşinen kabul eder.</p>

                                                    <p class="mb-2">Cayma hakkının kullanılması için 14 (ondört) günlük süre içinde SATICI' ya iadeli taahhütlü posta, faks veya eposta ile yazılı bildirimde bulunulması ve ürünün  sözleşmede düzenlenen "Cayma Hakkı Kullanılamayacak Ürünler" hükümleri çerçevesinde kullanılmamış olması şarttır. Bu hakkın kullanılması halinde,</p>

                                                    <p class="mb-2">3. kişiye veya ALICI’ ya teslim edilen ürünün faturası, (İade edilmek istenen ürünün faturası kurumsal ise, geri iade ederken kurumun düzenlemiş olduğu iade faturası ile birlikte gönderilmesi gerekmektedir. Faturası kurumlar adına düzenlenen sipariş iadeleri İADE FATURASI kesilmediği takdirde tamamlanamayacaktır.)</p>

                                                    <p class="mb-2">İade formu,</p>

                                                    <p class="mb-2">İade edilecek ürünlerin kutusu, ambalajı, varsa standart aksesuarları ile birlikte eksiksiz ve hasarsız olarak teslim edilmesi gerekmektedir.</p>

                                                    <p class="mb-2">SATICI, cayma bildiriminin kendisine ulaşmasından itibaren en geç 10 günlük süre içerisinde toplam bedeli ve ALICI’ yı borç altına sokan belgeleri ALICI’ ya iade etmek ve 20 günlük süre içerisinde malı iade almakla yükümlüdür.</p>

                                                    <p class="mb-2">ALICI’ nın kusurundan kaynaklanan bir nedenle malın değerinde bir azalma olursa veya iade imkânsızlaşırsa ALICI kusuru oranında SATICI’ nın zararlarını tazmin etmekle yükümlüdür. Ancak cayma hakkı süresi içinde malın veya ürünün usulüne uygun kullanılmasın sebebiyle meydana gelen değişiklik ve bozulmalardan ALICI sorumlu değildir.</p>

                                                    <p class="mb-2">Cayma hakkının kullanılması nedeniyle SATICI tarafından düzenlenen kampanya limit tutarının altına düşülmesi halinde kampanya kapsamında faydalanılan indirim miktarı iptal edilir.</p>

                                                </div>

                                                {/* SATICI ve ALICI İMZA */}
                                                <div className="flex justify-between mt-8">
                                                    <div>
                                                        <p className="font-semibold">SATICI: ŞİRKET ADI</p>

                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">ALICI: {userDetails?.firstName} {userDetails?.lastName}</p>

                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Mesafeli Satış Sözleşmesi */}
                                    <div className="border-b pb-4">
                                        <div
                                            className="flex justify-between items-center cursor-pointer"
                                            onClick={() => toggleLegalSection('distanceSelling')}
                                        >
                                            <span>Mesafeli Satış Sözleşmesi</span>
                                            {openLegalSections.distanceSelling ? (
                                                <IoIosArrowUp className="text-xl" />
                                            ) : (
                                                <IoIosArrowDown className="text-xl" />
                                            )}
                                        </div>
                                        {openLegalSections.distanceSelling && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                transition={{ duration: 0.3 }}
                                                className="mt-2 text-sm text-gray-600 space-y-4"
                                            >
                                                {/* MADDE 1 - TARAFLAR */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">MADDE 1 - TARAFLAR</h4>

                                                    <div className="mb-4">
                                                        <h5 className="font-medium">SATICI:</h5>
                                                        <ul className="list-disc pl-5">
                                                            <li>Ünvanı:ŞİRKET ADI</li>
                                                            <li>Adres: [Şirket Adresiniz]</li>
                                                            <li>Telefon: TELEFON</li>
                                                            <li>E-mail: MAİL</li>
                                                        </ul>
                                                    </div>

                                                    <div>
                                                        <h5 className="font-medium">ALICI:</h5>
                                                        <ul className="list-disc pl-5">
                                                            <li>Adı/Soyadı: {userDetails?.firstName} {userDetails?.lastName}</li>
                                                            <li>Adres: {userDetails?.addressInput} <br /> {userDetails?.city} / {userDetails?.district}</li>
                                                            <li>Şehir/İlçe: {userDetails?.city} / {userDetails?.district}</li>
                                                            <li>Telefon: {userDetails?.phone}</li>
                                                            <li>E-mail: {userDetails?.email}</li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* MADDE 2 - KONU */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">MADDE 2 - KONU</h4>
                                                    <p>
                                                        İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait [Siteniz.com] internet sitesinden elektronik ortamda siparişini yaptığı aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicilerin Korunması Hakkındaki Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
                                                    </p>
                                                </div>

                                                {/* MADDE 3 - SÖZLEŞME KONUSU ÜRÜN */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">MADDE 3 - SÖZLEŞME KONUSU ÜRÜN</h4>
                                                    <p>Tarih: {new Date().toLocaleDateString()}</p>

                                                    <div className="overflow-x-auto mt-2">
                                                        <table className="w-full border-collapse">
                                                            <thead>
                                                                <tr className="bg-gray-100">
                                                                    <th className="border p-2">Ürün Adı</th>
                                                                    <th className="border p-2">Adet</th>
                                                                    <th className="border p-2">Birim Fiyat</th>
                                                                    <th className="border p-2">Toplam</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {Object.keys(cartItems)
                                                                    .filter(itemId => cartItems[itemId] > 0)
                                                                    .map((itemId) => {
                                                                        const product = products.find(p => p._id === itemId);
                                                                        return product && (
                                                                            <tr key={itemId} className="border">
                                                                                <td className="border p-2">{product.name}</td>
                                                                                <td className="border p-2 text-center">{cartItems[itemId]}</td>
                                                                                <td className="border p-2 text-right">{product.price.toFixed(2)} TL</td>
                                                                                <td className="border p-2 text-right">{(product.price * cartItems[itemId]).toFixed(2)} TL</td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div className="mt-4 text-right">
                                                        <p>KDV (%20): {(subtotal * 0.20).toFixed(2)} TL</p>
                                                        <p className="font-semibold">Genel Toplam: {(subtotal*1.20).toFixed(2)} TL</p>
                                                        <p>Kargo Tutarı: 0,00 TL</p>
                                                        <p>Teslimat Adresi: {userDetails?.addressInput}  <br /> {userDetails?.city} / {userDetails?.district}</p>
                                                    </div>
                                                </div>

                                                {/* MADDE 4 - GENEL HÜKÜMLER */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">MADDE 4 - GENEL HÜKÜMLER</h4>
                                                    <ol className="list-decimal pl-5 space-y-4">
                                                        <p class="mb-2">4.1- ALICI, www.cupify.com.tr internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.</p>

                                                        <p class="mb-2">4.2- Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için ALICI'nın yerleşim yerinin uzaklığına bağlı olarak internet sitesinde ön bilgiler içinde açıklanan süre içinde ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir.</p>

                                                        <p class="mb-2">4.3- Sözleşme konusu ürün, ALICI'dan başka bir kişi/kuruluşa teslim edilecek ise, teslim edilecek kişi/kuruluşun teslimatı kabul etmemesininden SATICI sorumlu tutulamaz.</p>

                                                        <p class="mb-2">4.4- SATICI, sözleşme konusu ürünün sağlam, eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgeleri ve kullanım klavuzları ile teslim edilmesinden sorumludur.</p>

                                                        <p class="mb-2">4.5- Sözleşme konusu ürünün teslimatı için  sözleşmenin imzalı nüshasının SATICI'ya ulaştırılmış olması ve bedelinin ALICI'nın tercih ettiği ödeme şekli ile ödenmiş olması şarttır. Herhangi bir nedenle ürün bedeli ödenmez veya banka kayıtlarında iptal edilir ise, SATICI ürünün teslimi yükümlülüğünden kurtulmuş kabul edilir.</p>

                                                        <p class="mb-2">4.6- Ürünün tesliminden sonra ALICI'ya ait kredi kartının ALICI'nın kusurundan kaynaklanmayan bir şekilde yetkisiz kişilerce haksız veya hukuka aykırı olarak kullanılması nedeni ile ilgili banka veya finans kuruluşun ürün bedelini SATICI'ya ödememesi halinde, ALICI'nın kendisine teslim edilmiş olması kaydıyla ürünün 3 gün içinde SATICI'ya gönderilmesi zorunludur. Bu takdirde nakliye giderleri ALICI'ya aittir.</p>

                                                        <p class="mb-2">4.7- SATICI mücbir sebepler veya nakliyeyi engelleyen hava muhalefeti, ulaşımın kesilmesi gibi olağanüstü durumlar nedeni ile sözleşme konusu ürünü süresi içinde teslim edemez ise, durumu ALICI'ya bildirmekle yükümlüdür. Bu takdirde ALICI siparişin iptal edilmesini, sözleşme konusu ürünün varsa emsali ile değiştirilmesini, ve/veya teslimat süresinin engelleyici durumun ortadan kalkmasına kadar ertelenmesi haklarından birini kullanabilir. ALICI'nın siparişi iptal etmesi halinde ödediği tutar 10 gün içinde kendisine nakten ve defaten ödenir.</p>

                                                        <p class="mb-2">4.8- Garanti belgesi ile satılan ürünlerden olan veya olmayan ürünlerin arızalı veya bozuk olanlar, garanti şartları içinde gerekli onarımın yapılması için SATICI'ya gönderilebilir, bu takdirde kargo giderleri SATICI tarafından karşılanacaktır.</p>

                                                    </ol>
                                                </div>

                                                {/* MADDE 5 - CAYMA HAKKI */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">MADDE 5 - CAYMA HAKKI</h4>
                                                    <p>
                                                        ALICI, sözleşme konusu ürürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren 7 gün içinde cayma hakkına sahiptir. Cayma hakkının kullanılması için bu süre içinde SATICI'ya faks, email veya telefon ile bildirimde bulunulması ve ürünün 6. madde hükümleri çercevesinde kullanılmamış olması şarttır. Bu hakkın kullanılması halinde, 3. kişiye veya ALICI'ya teslim edilen ürünün SATICI'ya gönderildiğine ilişkin kargo teslim tutanağı örneği ile fatura aslının iadesi zorunludur. Bu belgelerin ulaşmasını takip eden 7 gün içinde ürün bedeli ALICI'ya iade edilir. Fatura aslı gönderilmez ise KDV ve varsa sair yasal yükümlülükler iade edilemez. Cayma hakkı nedeni ile iade edilen ürünün kargo bedeli SATICI tarafından karşılanır.
                                                    </p>
                                                </div>

                                                {/* MADDE 6 - CAYMA HAKKI KULLANILAMAYACAK ÜRÜNLER */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">MADDE 6 - CAYMA HAKKI KULLANILAMAYACAK ÜRÜNLER</h4>
                                                    <ul className="list-disc pl-5 space-y-2">
                                                        <li>Kişiye özel üretim ürünler</li>
                                                        <li>Hızlı bozulan ürünler</li>
                                                        <li>Açılmış yazılım ve dijital içerikler</li>
                                                        <li>Kozmetik ürünler</li>
                                                    </ul>
                                                </div>

                                                {/* MADDE 7 - YETKİLİ MAHKEME */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">MADDE 7 - YETKİLİ MAHKEME</h4>
                                                    <p>
                                                        Uyuşmazlıklarda ALICI'nın yerleşim yeri Tüketici Mahkemeleri yetkilidir.
                                                    </p>
                                                </div>

                                                {/* İMZA BÖLÜMÜ */}
                                                <div className="flex justify-between mt-8 border-t pt-4">
                                                    <div>
                                                        <p className="font-semibold">SATICI: ŞİRKET ADI</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">ALICI: {userDetails?.firstName} {userDetails?.lastName}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Üye ve Ziyaretçi Kişisel Veri Aydınlatma Metni */}
                                    <div className="border-b pb-4">
                                        <div
                                            className="flex justify-between items-center cursor-pointer"
                                            onClick={() => toggleLegalSection('privacyPolicy')}
                                        >
                                            <span>Üye ve Ziyaretçi Kişisel Veri Aydınlatma Metni</span>
                                            {openLegalSections.privacyPolicy ? (
                                                <IoIosArrowUp className="text-xl" />
                                            ) : (
                                                <IoIosArrowDown className="text-xl" />
                                            )}
                                        </div>
                                        {openLegalSections.privacyPolicy && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                transition={{ duration: 0.3 }}
                                                className="mt-2 text-sm text-gray-600 space-y-4"
                                            >
                                                {/* Giriş */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">Sayın Müşterilerimiz,</h4>
                                                    <p>
                                                    ŞİRKET ADI ("Şirket") olarak kişisel verilerinizin korunmasına büyük önem veriyoruz.
                                                        6698 sayılı KVKK uyarınca sizleri bilgilendirmek isteriz.
                                                    </p>
                                                </div>

                                                {/* İşlenen Veriler */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">İŞLENEN KİŞİSEL VERİLERİNİZ</h4>
                                                    <ul className="list-disc pl-5 space-y-2">
                                                        <li>Ad Soyad: {userDetails?.firstName} {userDetails?.lastName}</li>
                                                        <li>İletişim: {userDetails?.phone} - {userDetails?.email}</li>
                                                        <li>Teslimat Adresi: {userDetails?.addressInput}  <br /> {userDetails?.city} / {userDetails?.district}</li>

                                                    </ul>
                                                </div>

                                                {/* İşleme Amaçları */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">İŞLEME AMAÇLARI</h4>
                                                    <ul className="list-disc pl-5 space-y-2">
                                                        <li>Siparişlerinizin teslimi</li>
                                                        <li>Yasal yükümlülüklerimizin yerine getirilmesi</li>
                                                        <li>Müşteri hizmetleri yönetimi</li>
                                                    </ul>
                                                </div>

                                                {/* Veri Paylaşımı */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">VERİ PAYLAŞIMI</h4>
                                                    <p className="mb-2">Verileriniz aşağıdaki kuruluşlarla paylaşılabilir:</p>
                                                    <ul className="list-disc pl-5 space-y-2">
                                                        <li>Kargo firmaları</li>
                                                        <li>Ödeme kuruluşları</li>
                                                        <li>Yasal merciler</li>
                                                    </ul>
                                                </div>

                                                {/* Haklarınız */}
                                                <div>
                                                    <h4 className="font-semibold mb-2">HAKLARINIZ</h4>
                                                    <ul className="list-disc pl-5 space-y-2">
                                                        <li>Verilerinize erişim hakkı</li>
                                                        <li>Düzeltme talebi</li>
                                                        <li>Silinme istemi</li>
                                                    </ul>
                                                </div>

                                                {/* İletişim */}
                                                <div className="border-t pt-4">
                                                    <h4 className="font-semibold mb-2">İLETİŞİM</h4>
                                                    <p>Şirket Ünvanı: ŞİRKET ADI</p>
                                                    <p>Adres: [Şirket Adresiniz]</p>
                                                    <p>Telefon: TELEFON</p>
                                                    <p>E-posta: MAİL</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="mt-4 text-sm text-gray-600 text-center">
                                        "ÖDEME" butonuna basmanız halinde,{" "}
                                        <span className="font-semibold">
                                            {selectedInstallment === 1 ? "Tek Çekim" : `${selectedInstallment} Taksit`}
                                        </span>{" "}
                                        ödeme yöntemiyle toplam{" "}
                                        <span className="font-semibold">{selectedInstallmentTotal.toFixed(2)} TL</span> tahsil edilecektir.
                                    </div>
                                </div>

                            </div>
                            <div className='xl:hidden block'>
                                <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <div className='flex justify-between border-b mb-1 pb-1'>
                                        <h3 className="text-lg font-medium mb-1 pb-1 ">Teslimat Bilgileri</h3>
                                        <button onClick={() => setIsEditDialogOpen(true)}>
                                            <CiEdit className='text-xl' />
                                        </button>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="font-medium">Ad Soyad:</span><br />
                                            {userDetails?.firstName} {userDetails?.lastName}
                                        </p>
                                        <p>
                                            <span className="font-medium">Adres:</span><br />
                                            {userDetails?.addressInput}
                                        </p>
                                        <p>
                                            <span className="font-medium">İl/İlçe:</span><br />
                                            {userDetails?.city} / {userDetails?.district}
                                        </p>
                                        <p>
                                            <span className="font-medium">Telefon:</span><br />
                                            {userDetails?.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-medium mb-1 pb-1 border-b">Fatura Bilgileri</h3>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="font-medium">Ad Soyad:</span><br />
                                            {userDetails?.firstName} {userDetails?.lastName}
                                        </p>
                                        <p>
                                            <span className="font-medium">Adres:</span><br />
                                            {userDetails?.addressInput}
                                        </p>
                                        <p>
                                            <span className="font-medium">İl/İlçe:</span><br />
                                            {userDetails?.city} / {userDetails?.district}
                                        </p>
                                        <p>
                                            <span className="font-medium">Telefon:</span><br />
                                            {userDetails?.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
   {/* Sağ Taraf: CartTotal ve Ödeme Butonu */}
   <div className="fixed xl:static bottom-0 left-0 w-full bg-white xl:bg-transparent xl:w-[28%] border-t xl:border-t-0 shadow-lg xl:shadow-none">
                            <div className="p-4 xl:p-0 flex flex-col ">
                                <div className={`${isDetailsVisible ? 'block' : 'hidden'} xl:block`}>
                                <CartTotal
              total={totalWithVAT.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              subtotal={subtotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              vatAmount={vatAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            />
                                </div>
                                <div className="xl:mt-6 xl:p-4 bg-white rounded-lg shadow-sm border-gray-100 py-3 xl:border">
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="preInformationCheckbox"
                                                className="form-checkbox h-4 w-4 text-black transition duration-150 ease-in-out"
                                                required
                                            />
                                            <label htmlFor="preInformationCheckbox" className="ml-2 text-xs sm:text-sm">
                                                Ön bilgilendirme formunu ve mesafeli satış sözleşmesini kabul ediyorum.
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="privacyPolicyCheckbox"
                                                className="form-checkbox h-4 w-4 text-black transition duration-150 ease-in-out"
                                                required
                                            />
                                            <label htmlFor="privacyPolicyCheckbox" className="ml-2 text-xs sm:text-sm">
                                                Kişisel verilerin işlenmesine ilişkin Aydınlatma Metnini okudum.
                                            </label>
                                        </div>
                                    </div>
                                </div>





                            </div>


                            <div className="w-full flex justify-between px-4">
                                {/* Toplam Fiyat (Sadece Mobilde ve Detaylar Kapalıyken Gösterilir) */}
                                {(
                                <div className="xl:hidden items-center mb-2 w-1/5">
                                <div className='flex'>
                                    <b className="text-sm font-semibold">Toplam </b>
                                    <button
                                        onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                                        className="text-black"
                                    >
                                        {isDetailsVisible ? <IoIosArrowDown /> : <IoIosArrowUp />}
                                    </button>
                                </div>
                                {/* Taksit seçenekleri yoksa KDV dahil toplam fiyatı göster */}
                                <b className="text-sm font-semibold">
                                    {currency}{selectedInstallmentTotal.toFixed(2)}
                                </b>
                            </div>
                                )}
                                <button
                                    type='submit'
                                    className="bg-black text-white text-sm w-1/3 sm:px-2 xl:w-full my-2 xl:my-8 px-8 py-3"
                                >
                                    ÖDEME
                                </button>
                            </div>


                            {/* Teslimat ve Fatura Bilgileri */}
                            <div className='xl:block hidden'>
                                <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <div className='flex justify-between border-b mb-1 pb-1'>
                                        <h3 className="text-lg font-medium mb-1 pb-1 ">Teslimat Bilgileri</h3>
                                        <button onClick={() => setIsEditDialogOpen(true)}>
                                            <CiEdit className='text-xl' />
                                        </button>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="font-medium">Ad Soyad:</span><br />
                                            {userDetails?.firstName} {userDetails?.lastName}
                                        </p>
                                        <p>
                                            <span className="font-medium">Adres:</span><br />
                                            {userDetails?.addressInput}
                                        </p>
                                        <p>
                                            <span className="font-medium">İl/İlçe:</span><br />
                                            {userDetails?.city} / {userDetails?.district}
                                        </p>
                                        <p>
                                            <span className="font-medium">Telefon:</span><br />
                                            {userDetails?.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-medium mb-1 pb-1 border-b">Fatura Bilgileri</h3>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="font-medium">Ad Soyad:</span><br />
                                            {userDetails?.firstName} {userDetails?.lastName}
                                        </p>
                                        <p>
                                            <span className="font-medium">Adres:</span><br />
                                            {userDetails?.addressInput}
                                        </p>
                                        <p>
                                            <span className="font-medium">İl/İlçe:</span><br />
                                            {userDetails?.city} / {userDetails?.district}
                                        </p>
                                        <p>
                                            <span className="font-medium">Telefon:</span><br />
                                            {userDetails?.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                )
                }

                {/* Dialog bileşeni */}
                <EditDeliveryInfoDialog
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    userDetails={userDetails}
                    onSave={handleSaveDeliveryInfo}
                />
            </form >
        </>
    );
};

export default Odeme;