import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
import axios from 'axios';

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import StepIndicator from '../components/StepIndicator ';

const PlaceOrder = () => {
  const { setUserDetails, cartItems, currency, getCartAmount } = useContext(ShopContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [city, setCity] = useState('');
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState('');
  const [phone, setPhone] = useState('+90');
  const [error, setError] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const navigate = useNavigate();

  // Use getCartAmount to calculate totals
  const { subtotal, total } = getCartAmount();
  const vatAmount = subtotal * 0.2; // KDV, subtotal üzerine eklenecek
  const totalWithVAT = subtotal + vatAmount; // KDV dahil toplam

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://turkiyeapi.dev/api/v1/provinces?sort=name');
        setProvinces(response.data.data);
      } catch (error) {
        console.error('API isteğinde bir hata oluştu:', error);
      }
    };

    fetchProvinces();
  }, []);

  const handleCityChange = async (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    setDistrict('');
    setError((prev) => ({ ...prev, city: '' })); // Şehir değiştiğinde hata mesajını temizle

    if (selectedCity) {
      try {
        const response = await axios.get(`https://turkiyeapi.dev/api/v1/provinces?name=${selectedCity}`);
        setDistricts(response.data.data[0]?.districts || []);
      } catch (error) {
        console.error('İlçeler alınırken bir hata oluştu:', error);
        setDistricts([]);
      }
    } else {
      setDistricts([]);
    }
  };

  const validateInputs = () => {
    const errors = {};

    // Hata mesajlarını temizle
    setError({});

    if (!firstName) errors.firstName = 'Adınızı giriniz.';
    if (!lastName) errors.lastName = 'Soyadınızı giriniz.';
    if (!email) {
      errors.email = 'E-posta adresinizi giriniz.';
    } else if (!/^(?!.*[çğıöşüÇĞİÖŞÜ])[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.email = 'Geçerli bir e-posta adresi giriniz.';
    }
    if (!addressInput) errors.addressInput = 'Adresinizi giriniz.';
    if (!city) errors.city = 'İl seçiniz.';
    if (!district) errors.district = 'İlçe seçiniz.';
    if (!phone) {
      errors.phone = 'Telefon numaranızı giriniz.';
    } else if (!/^\+90\d{10}$/.test(phone)) {
      errors.phone = 'Telefon numarası +90 ile başlamalı ve 13 karakter olmalıdır.';
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (validateInputs()) {
      setUserDetails({
        firstName,
        lastName,
        email,
        addressInput,
        city,
        district,
        phone,
      });

      navigate('/odeme');
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value.startsWith('+90') && value.length <= 13) {
      setPhone(value);
      setError((prev) => ({ ...prev, phone: '' })); // Telefon değiştiğinde hata mesajını temizle
    }
  };

  return (
    <>
      <StepIndicator currentStep={1} />
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
        <div className="flex flex-col gap-4 w-full lg:w-3/5 pb-24 sm:pb-0">
          <div className="text-2xl mb-3">
            <Title text1={'ADRES'} text2={'BİLGİLERİ'} />
          </div>

          <div className="flex gap-3">
            <div className="w-full">
              <input
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
                placeholder="Adınız"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setError((prev) => ({ ...prev, firstName: '' })); // Ad değiştiğinde hata mesajını temizle
                }}
              />
              {error.firstName && <p className="text-red-500 text-sm">{error.firstName}</p>}
            </div>
            <div className="w-full">
              <input
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
                placeholder="Soyadınız"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setError((prev) => ({ ...prev, lastName: '' })); // Soyad değiştiğinde hata mesajını temizle
                }}
              />
              {error.lastName && <p className="text-red-500 text-sm">{error.lastName}</p>}
            </div>
          </div>

          <div>
            <input
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError((prev) => ({ ...prev, email: '' })); // Email değiştiğinde hata mesajını temizle
              }}
            />
            {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
          </div>

          <div>
            <input
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
              placeholder="Adres"
              type="text"
              value={addressInput}
              onChange={(e) => {
                setAddressInput(e.target.value);
                setError((prev) => ({ ...prev, addressInput: '' })); // Adres değiştiğinde hata mesajını temizle
              }}
            />
            {error.addressInput && <p className="text-red-500 text-sm">{error.addressInput}</p>}
          </div>

          <div className="flex gap-3">
            <div className="w-full">
              <select
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
                value={city}
                onChange={handleCityChange}
              >
                <option value="">İl Seçin</option>
                {provinces.map((province, index) => (
                  <option key={index} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
              {error.city && <p className="text-red-500 text-sm">{error.city}</p>}
            </div>
            <div className="w-full">
              <select
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setError((prev) => ({ ...prev, district: '' })); // İlçe değiştiğinde hata mesajını temizle
                }}
                disabled={!districts.length}
              >
                <option value="">İlçe Seçin</option>
                {districts.map((dist, index) => (
                  <option key={index} value={dist.name}>
                    {dist.name}
                  </option>
                ))}
              </select>
              {error.district && <p className="text-red-500 text-sm">{error.district}</p>}
            </div>
          </div>

          <div>
            <input
              type="text"
              className="phone-input appearance-none border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none"
              placeholder="Telefon"
              value={phone}
              onChange={handlePhoneChange}
            />
            {error.phone && <p className="text-red-500 text-sm">{error.phone}</p>}
          </div>
        </div>

        <div className="fixed lg:static bottom-0 left-0 w-full bg-white lg:bg-transparent lg:w-1/3 border-t lg:border-t-0 shadow-lg lg:shadow-none">
          <div className="p-4 lg:p-0">
            <div className={`${isDetailsVisible ? 'block' : 'hidden'} lg:block`}>
              <CartTotal
                total={totalWithVAT.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                subtotal={subtotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                vatAmount={vatAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              />
            </div>

            <div className="w-full flex justify-between pt-2">
              <div className="lg:hidden items-center mb-2 w-1/5">
                <div className='flex'>
                  <b className="text-sm font-semibold">Toplam </b>
                  <button
                    onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                    className="text-black"
                  >
                    {isDetailsVisible ? <IoIosArrowDown /> : <IoIosArrowUp />}
                  </button>
                </div>
                <b className="text-sm font-semibold">
                  {currency}{totalWithVAT.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </b>
              </div>
              <button
                className="bg-black text-white text-sm w-1/3 lg:px-2 lg:w-full my-2 lg:my-8 px-8 py-3"
                onClick={handleProceedToPayment}
              >
                Ödeme
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;