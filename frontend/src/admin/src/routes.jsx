import { Routes, Route } from 'react-router-dom';
import AdminAdd from '@admin/pages/Add';
import AdminList from '@admin/pages/List';
import AdminOrders from '@admin/pages/Orders';
import AdminAddImage from '@admin/pages/AddImage';
import AdminBlogManagement from '@admin/pages/BlogManagement';

export default function AdminRoutes({ token }) {
  return (
    <Routes>
      <Route path="add" element={<AdminAdd token={token} />} />
      <Route path="list" element={<AdminList token={token} />} />
      <Route path="orders" element={<AdminOrders token={token} />} />
      <Route path="add-image" element={<AdminAddImage token={token} />} />
      <Route path="blogs" element={<AdminBlogManagement token={token} />}/>
    </Routes>
  );
}