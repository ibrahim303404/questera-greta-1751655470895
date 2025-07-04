import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('adminAuth');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('adminAuth', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('adminAuth');
    }
  }, [adminUser]);

  const adminLogin = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check admin credentials
      if (username === 'admin' && password === '606707606') {
        const adminData = {
          id: 'admin',
          username: 'admin',
          role: 'administrator',
          loginTime: new Date().toISOString()
        };
        setAdminUser(adminData);
        navigate('/admin/dashboard');
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    navigate('/admin/login');
  };

  const value = {
    adminUser,
    loading,
    error,
    adminLogin,
    adminLogout
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};