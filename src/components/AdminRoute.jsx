import { useAdmin } from '../context/AdminContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { adminUser } = useAdmin();
  
  return adminUser ? children : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;