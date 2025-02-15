import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = '₺';

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [products, setProducts] = useState([]);
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

  const updateUserDetails = (updatedInfo) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      ...updatedInfo,
    }));
  };

  const addToCart = async (itemId, quantity = 1) => {
    if (quantity <= 0) {
      toast.error("Lütfen geçerli bir miktar girin.");
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += quantity;
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + '/api/cart/add',
          { itemId, quantity },
          { headers: { token } }
        );
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        totalCount += cartItems[itemId];
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/update', { itemId, quantity }, { headers: { token } });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
  
    for (const itemId in cartItems) {
      let itemInfo = products.find((product) => product._id === itemId);
      if (cartItems[itemId] > 0 && itemInfo) {
        // Use newprice if it exists and is greater than 0, otherwise use price
        const price = itemInfo.newprice > 0 ? itemInfo.newprice : itemInfo.price || 0;
        const quantity = cartItems[itemId] || 0;
  
        if (!isNaN(price) && !isNaN(quantity)) {
          totalAmount += price * quantity;
        } else {
          console.error(`Invalid price or quantity for Item ID: ${itemId}`);
        }
      }
    }
  
  
    return {
      subtotal: totalAmount,
      total: totalAmount,
    };
  };

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

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
      getUserCart(localStorage.getItem('token'));
    }
  }, [token]);

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

  const value = {
    products,
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