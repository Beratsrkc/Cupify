import React, { useState } from 'react'
import Navbar from './compoments/Navbar'
import Slidebar from './compoments/Slidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './compoments/Login'
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react'
import AddImage from './pages/AddImage'
import BlogManagement from './pages/BlogManagement'


export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '₺';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Slidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/add-image" element={<AddImage token={token} />} /> 
                <Route path="/blogs" element={<BlogManagement token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;