import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Slidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/admin/add">
          <img className='w-5 h-5' src={assets.add_icon} alt="add" />
          <p className='hidden md:block'>Ürün Ekle</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/admin/list">
          <img className='w-5 h-5' src={assets.order_icon} alt="list" />
          <p className='hidden md:block'>Ürünleri Listele</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/admin/orders">
          <img className='w-5 h-5' src={assets.order_icon} alt="orders" />
          <p className='hidden md:block'>Siparişler</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/admin/add-image">
          <img className='w-5 h-5' src={assets.add_icon} alt="add-image" />
          <p className='hidden md:block'>Referans Ekle</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/admin/blogs">
          <img className='w-5 h-5' src={assets.add_icon} alt="blogs" />
          <p className='hidden md:block'>Blog Yönetimi</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Slidebar;