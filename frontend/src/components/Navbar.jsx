import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { IoIosArrowDown, IoIosArrowForward, IoIosClose } from "react-icons/io";
import { GrSearch } from "react-icons/gr";
import { FiShoppingCart, FiUser, FiMenu } from "react-icons/fi";
import ProfileDropdown from "./ProfileDropdown"; // ProfileDropdown'ı import ediyoruz

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const searchRef = useRef(null);
  const categoriesRef = useRef(null); // Kategoriler menüsü için ref ekliyoruz
  const navigate = useNavigate();

  const {
    getCartCount,
    token,
    setToken,
    setCartItems,
    products,
    categories,
    getCartAmount,
    currency,
  } = useContext(ShopContext);

  const cartTotal = getCartAmount().total;

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/giris");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Arama sonuçları için dışarı tıklama kontrolü
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }

      // Kategoriler menüsü için dışarı tıklama kontrolü
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target)
      ) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
    } else {
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredProducts);
      setShowSearchResults(true);
    }
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
    setSearchQuery("");
    setShowSearchResults(false);
    setIsCategoriesOpen(false);
    setExpandedCategory(null);
    setExpandedMenu(null);
    setVisible(false);
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleCategoryClick = (categoryId, subCategory) => {
    navigate(`/urunler?category=${categoryId}&subCategory=${subCategory}`);
    setIsCategoriesOpen(false);
    setExpandedCategory(null);
    setExpandedMenu(null);
    setVisible(false);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleMenu = (menuName) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  return (
    <>
      {/* Ana Navbar */}
      <div className="bg-white sticky top-0 z-50">
        <div className="container mx-auto ">
          {/* Üst Kısım */}
          <div className="flex items-center justify-between py-4">
            {/* Logo ve Mobil Menü */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setVisible(true)}
                className="lg:hidden text-gray-700 hover:text-orange-500"
              >
                <FiMenu size={24} />
              </button>
              <Link to="/">
                <img src={assets.Cupify_logo} className="w-32" alt="logo" />
              </Link>
            </div>

            {/* Arama Çubuğu - Masaüstü */}
            <div className="hidden lg:block w-1/3 mx-4">
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 pr-10"
                />
                <GrSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-orange-500" />
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg py-2 z-50 max-h-96 overflow-y-auto">
                    {searchResults.map((product, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          handleProductClick(generateSlug(product.name))
                        }
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <img
                          src={
                            product.images?.[0] || "/assets/default-image.jpg"
                          }
                          className="w-10 h-10 object-cover rounded-sm"
                          alt={product.name}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-black">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {product.description.substring(0, 50)}
                            {product.description.length > 50 ? "..." : ""}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-orange-500">
                          {product.price.toFixed(2)}
                          {currency}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Kullanıcı ve Sepet */}
            <div className="flex items-center gap-4">
              {/* Eski kullanıcı butonu yerine ProfileDropdown ekliyoruz */}
              <div className="hidden md:flex items-center gap-1">
                <ProfileDropdown token={token} logout={logout} />
              </div>

              <Link
                to="/sepet"
                className="relative flex items-center gap-1 hover:text-orange-500"
              >
                <FiShoppingCart size={22} />
                <span className="hidden md:inline"></span>
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-orange-500 text-white text-xs rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Alt Kısım - Kategoriler ve Navigasyon */}
          <div className="border-t border-gray-200 py-3 hidden lg:flex items-center justify-between">
             {/* Kategoriler */}
            <div className="relative" ref={categoriesRef}> {/* Buraya ref ekledik */}
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-2 text-gray-700 rounded-md px-6 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300"
              >
                <FiMenu size={18} />
                <span>Tüm Kategoriler</span>
                {isCategoriesOpen ? (
                  <IoIosArrowDown className="text-[16px]" />
                ) : (
                  <IoIosArrowForward className="text-[16px]" />
                )}
              </button>

              {isCategoriesOpen && (
                <div className="absolute top-full left-0 w-[800px] bg-white border border-gray-300 z-50">
                  <div className="flex">
                    {/* Ana Kategoriler - Sol Taraf */}
                    <div className="w-1/2 border-r border-gray-200">
                      {categories.map((category) => (
                        <div
                          key={category._id}
                          className={`px-4 py-3 cursor-pointer flex items-center justify-between ${
                            expandedCategory === category._id
                              ? "bg-gray-50 text-orange-500"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => toggleCategory(category._id)}
                        >
                          <span>{category.name}</span>
                          <IoIosArrowForward className="text-gray-400" />
                        </div>
                      ))}
                    </div>

                    {/* Alt Kategoriler - Sağ Taraf */}
                    {/* Alt Kategoriler - Sağ Taraf */}
{expandedCategory !== null && (
  <div className="w-1/2 p-4">
    <h3 className="font-medium text-lg mb-3 text-gray-800 border-b pb-2">
      {categories.find((cat) => cat._id === expandedCategory)?.name}
    </h3>
    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
      {categories
        .find((cat) => cat._id === expandedCategory)
        ?.subCategories?.map((subCategory, index) => (
          <div
            key={index}
            className="text-gray-700 hover:text-orange-500 cursor-pointer py-2 px-2 hover:bg-gray-50 rounded"
            onClick={() => handleCategoryClick(expandedCategory, subCategory)}
          >
            {subCategory}
          </div>
        ))}
    </div>
  </div>
)}
                  </div>
                </div>
              )}
            </div>

            {/* Navigasyon Linkleri */}
            <nav className="flex gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `py-2 px-1 font-medium ${
                    isActive
                      ? "text-orange-500 border-b border-orange-500"
                      : "text-gray-700 hover:text-orange-500"
                  }`
                }
              >
                Anasayfa
              </NavLink>
              <NavLink
                to="/urunler"
                className={({ isActive }) =>
                  `py-2 px-1 font-medium ${
                    isActive
                      ? "text-orange-500 border-b border-orange-500"
                      : "text-gray-700 hover:text-orange-500"
                  }`
                }
              >
                Ürünler
              </NavLink>

              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  `py-2 px-1 font-medium ${
                    isActive
                      ? "text-orange-500 border-b border-orange-500"
                      : "text-gray-700 hover:text-orange-500"
                  }`
                }
              >
                Blog
              </NavLink>
              <NavLink
                to="/iletisim"
                className={({ isActive }) =>
                  `py-2 px-1 font-medium ${
                    isActive
                      ? "text-orange-500 border-b border-orange-500"
                      : "text-gray-700 hover:text-orange-500"
                  }`
                }
              >
                İletişim
              </NavLink>
              <NavLink
                to="/hakkimizda"
                className={({ isActive }) =>
                  `py-2 px-1 font-medium ${
                    isActive
                      ? "text-orange-500 border-b border-orange-500"
                      : "text-gray-700 hover:text-orange-500"
                  }`
                }
              >
                Hakkımızda
              </NavLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Arama Çubuğu - Mobil */}
      <div className="lg:hidden bg-white py-2 px-4 border-b">
        <div className="relative" ref={searchRef}>
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 pr-10"
          />
          <GrSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-orange-500" />
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg py-2 z-50 max-h-96 overflow-y-auto">
              {searchResults.map((product, index) => (
                <div
                  key={index}
                  onClick={() => handleProductClick(generateSlug(product.name))}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={product.images?.[0] || "/assets/default-image.jpg"}
                    className="w-10 h-10 object-cover rounded-sm"
                    alt={product.name}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {product.description.substring(0, 50)}
                      {product.description.length > 50 ? "..." : ""}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-orange-500">
                    {product.price.toFixed(2)}
                    {currency}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobil Menü */}
      <div
        className={`fixed inset-0 bg-white z-50 transform ${
          visible ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <Link to="/" onClick={() => setVisible(false)}>
              <img src={assets.Cupify_logo} className="w-28" alt="logo" />
            </Link>
            <button onClick={() => setVisible(false)} className="text-gray-700">
              <IoIosClose size={30} />
            </button>
          </div>

          <div className="space-y-1">
            <NavLink
              to="/"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `block py-3 px-2 font-medium ${
                  isActive
                    ? "text-orange-500 bg-orange-50 rounded"
                    : "text-gray-700 hover:text-orange-500"
                }`
              }
            >
              Anasayfa
            </NavLink>

            {/* Mobil Kategori Menüsü */}
            <div>
              <div
                onClick={() => toggleMenu("kategoriler")}
                className="flex items-center justify-between py-3 px-2 font-medium text-gray-700 hover:text-orange-500 cursor-pointer"
              >
                <span>Kategoriler</span>
                {expandedMenu === "kategoriler" ? (
                  <IoIosArrowDown className="text-gray-500" />
                ) : (
                  <IoIosArrowForward className="text-gray-500" />
                )}
              </div>
              {expandedMenu === "kategoriler" && (
                <div className="ml-2 mt-1 space-y-1">
                  {categories.map((category) => (
                    <div key={category._id}>
                      <div
                        onClick={() => toggleCategory(category._id)}
                        className="flex items-center justify-between py-2 px-2 text-gray-700 hover:text-orange-500 cursor-pointer"
                      >
                        <span>{category.name}</span>
                        {expandedCategory === category._id ? (
                          <IoIosArrowDown className="text-gray-400" />
                        ) : (
                          <IoIosArrowForward className="text-gray-400" />
                        )}
                      </div>
                      {expandedCategory === category._id && (
                        <div className="ml-4 space-y-1">
                          {category.subCategories?.map((subCategory, index) => (
                            <div
                              key={index}
                              className="block py-1 px-2 text-gray-600 hover:text-orange-500 cursor-pointer"
                              onClick={() =>
                                handleCategoryClick(category._id, subCategory)
                              }
                            >
                              {subCategory}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to="/urunler"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `block py-3 px-2 font-medium ${
                  isActive
                    ? "text-orange-500 bg-orange-50 rounded"
                    : "text-gray-700 hover:text-orange-500"
                }`
              }
            >
              Ürünler
            </NavLink>

            <NavLink
              to="/blog"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `block py-3 px-2 font-medium ${
                  isActive
                    ? "text-orange-500 bg-orange-50 rounded"
                    : "text-gray-700 hover:text-orange-500"
                }`
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/iletisim"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `block py-3 px-2 font-medium ${
                  isActive
                    ? "text-orange-500 bg-orange-50 rounded"
                    : "text-gray-700 hover:text-orange-500"
                }`
              }
            >
              İletişim
            </NavLink>
            <NavLink
              to="/hakkimizda"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `block py-3 px-2 font-medium ${
                  isActive
                    ? "text-orange-500 bg-orange-50 rounded"
                    : "text-gray-700 hover:text-orange-500"
                }`
              }
            >
              Hakkımızda
            </NavLink>
          </div>

          <div className="mt-8 pt-4 border-t">
            {token ? (
              <>
                <Link
                  to="/hesabim"
                  onClick={() => setVisible(false)}
                  className="flex items-center gap-2 py-2 px-2 text-gray-700 hover:text-orange-500"
                >
                  <FiUser size={18} />
                  <span>Hesabım</span>
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setVisible(false)}
                  className="flex items-center gap-2 py-2 px-2 text-gray-700 hover:text-orange-500"
                >
                  <span>Siparişlerim</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setVisible(false);
                  }}
                  className="flex items-center gap-2 py-2 px-2 text-gray-700 hover:text-orange-500 w-full text-left"
                >
                  <span>Çıkış Yap</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/giris"
                  onClick={() => setVisible(false)}
                  className="block py-2 px-4 bg-orange-500 text-white text-center rounded-lg hover:bg-orange-600"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/kayit"
                  onClick={() => setVisible(false)}
                  className="block py-2 px-4 border border-orange-500 text-orange-500 text-center rounded-lg hover:bg-orange-50"
                >
                  Üye Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
