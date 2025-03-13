import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = '₺';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const generateCartItemKey = (item) => {
    return `${item.id}-${item.selectedSize.label}-${item.selectedPrintingOption}-${item.selectedCoverOption}`;
  };
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    try {
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.error("Cart verisi bozuk, varsayılan değer kullanılıyor.");
      return {}; // Bozuk veriyi temizle
    }
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Kategoriler için state
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu için state

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [userDetails, setUserDetails] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {
      firstName: '',
      lastName: '',
      email: '',
      addressInput: '',
      city: '',
      district: '',
      phone: '',
    };
  });

  const navigate = useNavigate();

  // LocalStorage'a cartItems, userDetails ve token'ı kaydet
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(userDetails));
  }, [userDetails]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Kategorileri çek
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error("Kategoriler yüklenemedi");
      }
    } catch (error) {
      toast.error("Kategoriler yüklenirken hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  // Ürünleri çek
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || "No products found");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Kullanıcının sepetini çek
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Kullanıcı bilgilerini güncelle
  const updateUserDetails = (updatedInfo) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      ...updatedInfo,
    }));
  };

  // Sepete ürün ekle
  const addToCart = async (item) => {
    const { id, quantity, selectedSize, selectedPrintingOption, selectedCoverOption, totalPrice, image, selectedQuantity } = item;
  
    if (quantity <= 0) {
      toast.error("Lütfen geçerli bir miktar girin.");
      return;
    }
  
    const itemKey = generateCartItemKey(item); // Benzersiz anahtar oluştur
  
    let cartData = structuredClone(cartItems);
  
    if (cartData[itemKey]) {
      // Eğer ürün sepette varsa, miktarı güncelle
      cartData[itemKey].quantity += quantity;
    } else {
      // Eğer ürün sepette yoksa, yeni bir ürün ekle
      cartData[itemKey] = {
        quantity,
        selectedQuantity,
        selectedSize,
        selectedPrintingOption,
        selectedCoverOption,
        totalPrice,
        image,
      };
    }
  
    setCartItems(cartData);
  
    if (token) {
      try {
        await axios.post(
          backendUrl + '/api/cart/add',
          { itemKey, quantity, selectedSize, selectedPrintingOption, selectedQuantity, selectedCoverOption, totalPrice, image },
          { headers: { token } }
        );
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  // Sepetteki ürün miktarını güncelle
  const updateQuantity = async (itemKey, quantity) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemKey]) {
      cartData[itemKey].quantity = quantity;
      setCartItems(cartData);
  
      if (token) {
        try {
          await axios.post(
            backendUrl + '/api/cart/update',
            { itemKey, quantity },
            { headers: { token } }
          );
        } catch (error) {
          toast.error(error.message);
        }
      }
    }
  };
  
  const getCartAmount = () => {
    let totalAmount = 0;
  
    for (const itemKey in cartItems) {
      const item = cartItems[itemKey];
      if (item.quantity > 0) {
        totalAmount += item.totalPrice * item.quantity;
      }
    }
  
    return {
      subtotal: totalAmount,
      total: totalAmount,
    };
  };

  // Sepetteki ürün sayısını hesapla
  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId].quantity > 0) {
        totalCount += cartItems[itemId].quantity;
      }
    }
    return totalCount;
  };

  // Çıkış yap
  const logout = () => {
    localStorage.removeItem('cart');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCartItems({});
    setUserDetails({
      firstName: '',
      lastName: '',
      email: '',
      addressInput: '',
      city: '',
      district: '',
      phone: '',
    });
    setToken(null);
    navigate('/');
  };

  // İlk yüklemede kategorileri ve ürünleri çek
  useEffect(() => {
    fetchCategories();
    getProductsData();
  }, []);

  // Token değiştiğinde kullanıcının sepetini çek
  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
      getUserCart(localStorage.getItem('token'));
    }
  }, [token]);

  // Context değerleri
  const value = {
    products,
    categories,
    isLoading,
    currency,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    updateUserDetails,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    userDetails,
    setUserDetails,
    setCartItems,
    logout,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;