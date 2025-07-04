import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBell, FaUser, FaSignOutAlt, FaCog, FaShieldAlt, FaSync, FaPlay, FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useContent } from '../context/ContentContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { currentProfile } = useUser();
  const { refreshData, loading } = useContent();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    setShowProfile(false);
  };

  const handleProfileToggle = () => {
    setShowProfile(!showProfile);
    setShowSearch(false);
  };

  const handleRefreshData = async () => {
    await refreshData();
  };

  const menuItems = [
    { path: '/', label: 'الرئيسية', icon: '🏠' },
    { path: '/movies', label: 'الأفلام', icon: '🎬' },
    { path: '/shows', label: 'المسلسلات', icon: '📺' },
    { path: '/my-list', label: 'قائمتي', icon: '⭐' },
    { path: '/kids', label: 'الأطفال', icon: '🧸' },
  ];

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor: isScrolled ? 'rgba(0,0,0,0.95)' : 'transparent',
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass-effect shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* الشعار */}
          <Link to="/" className="flex-shrink-0 group">
            <motion.div 
              className="flex items-center space-x-3 space-x-reverse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaPlay className="text-white text-xl" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gradient arabic-title">ستريم فليكس</h1>
                <p className="text-xs text-gray-400">منصة المحتوى العربي</p>
              </div>
            </motion.div>
          </Link>

          {/* القائمة الرئيسية */}
          <div className="hidden lg:flex items-center space-x-8 space-x-reverse">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative group px-4 py-2 rounded-xl transition-all duration-300 ${
                  location.pathname === item.path 
                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium arabic-text">{item.label}</span>
                </div>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-xl border border-purple-500/50"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* القسم الأيمن */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* زر التحديث */}
            <motion.button
              onClick={handleRefreshData}
              disabled={loading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-full glass-effect hover:bg-white/20 transition-all duration-300 ${loading ? 'animate-spin' : ''}`}
              title="تحديث المحتوى"
            >
              <FaSync className="h-5 w-5 text-white" />
            </motion.button>

            {/* البحث */}
            <div className="relative">
              <motion.button
                onClick={handleSearchToggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full glass-effect hover:bg-white/20 transition-all duration-300"
              >
                <FaSearch className="h-5 w-5 text-white" />
              </motion.button>
              
              <AnimatePresence>
                {showSearch && (
                  <motion.form
                    initial={{ width: 0, opacity: 0, x: 20 }}
                    animate={{ width: '320px', opacity: 1, x: 0 }}
                    exit={{ width: 0, opacity: 0, x: 20 }}
                    onSubmit={handleSearch}
                    className="absolute left-0 top-full mt-2"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث عن الأفلام والمسلسلات..."
                      className="w-full px-6 py-3 glass-effect rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-right arabic-text text-white placeholder-gray-400"
                      autoFocus
                    />
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* الإشعارات */}
            <motion.button 
              className="p-3 rounded-full glass-effect hover:bg-white/20 transition-all duration-300 relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaBell className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </motion.button>

            {/* رابط الإدارة */}
            <Link
              to="/admin/login"
              className="p-3 rounded-full glass-effect hover:bg-white/20 transition-all duration-300 group"
              title="لوحة الإدارة"
            >
              <FaShieldAlt className="h-5 w-5 text-white group-hover:text-purple-300 transition-colors" />
            </Link>

            {/* قائمة الملف الشخصي */}
            <div className="relative">
              <motion.button
                onClick={handleProfileToggle}
                className="flex items-center space-x-3 space-x-reverse focus:outline-none group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/50 group-hover:border-purple-400 transition-colors">
                  <img
                    src={currentProfile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"}
                    alt="الملف الشخصي"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden md:block text-right">
                  <p className="font-medium text-white arabic-text">{currentProfile?.name || currentUser?.name || 'المستخدم'}</p>
                  <p className="text-sm text-gray-400">عضو مميز</p>
                </div>
              </motion.button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute left-0 top-full mt-2 w-64 glass-effect rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-white/10">
                      <p className="font-medium text-white arabic-text">{currentProfile?.name || currentUser?.name || 'المستخدم'}</p>
                      <p className="text-sm text-gray-400">{currentUser?.email || 'example@email.com'}</p>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/profile/select"
                        className="flex items-center px-4 py-3 text-sm hover:bg-white/10 transition-colors text-right arabic-text"
                      >
                        <FaUser className="ml-3" />
                        تبديل الملف الشخصي
                      </Link>
                      
                      <Link
                        to="/account/settings"
                        className="flex items-center px-4 py-3 text-sm hover:bg-white/10 transition-colors text-right arabic-text"
                      >
                        <FaCog className="ml-3" />
                        إعدادات الحساب
                      </Link>
                      
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-right arabic-text"
                      >
                        <FaSignOutAlt className="ml-3" />
                        تسجيل الخروج
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* القائمة المحمولة */}
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black/50 backdrop-blur-md rounded-xl mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white border border-purple-500/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-xl ml-3">{item.icon}</span>
                <span className="arabic-text">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;