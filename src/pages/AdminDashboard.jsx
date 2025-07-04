import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilm, FaTv, FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaUsers, FaChartLine, FaCog, FaSync, FaPlay, FaEye, FaDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useContent } from '../context/ContentContext';

const AdminDashboard = () => {
  const { adminUser, adminLogout } = useAdmin();
  const { movies, tvShows, deleteMovie, deleteTvShow, refreshData, loading } = useContent();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [loginSettings, setLoginSettings] = useState(() => {
    const saved = localStorage.getItem('adminLoginSettings');
    return saved ? JSON.parse(saved) : {
      rememberLogin: true,
      autoLogout: false,
      sessionTimeout: 60
    };
  });

  const stats = [
    { title: 'إجمالي الأفلام', value: movies.length, icon: FaFilm, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/10' },
    { title: 'إجمالي المسلسلات', value: tvShows.length, icon: FaTv, color: 'from-green-500 to-green-600', bgColor: 'bg-green-500/10' },
    { title: 'إجمالي المحتوى', value: movies.length + tvShows.length, icon: FaChartLine, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-500/10' },
    { title: 'المشاهدات اليوم', value: '1.2M', icon: FaEye, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-500/10' }
  ];

  const handleDeleteMovie = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الفيلم؟')) {
      deleteMovie(id);
    }
  };

  const handleDeleteTvShow = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المسلسل؟')) {
      deleteTvShow(id);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleSettingsChange = (key, value) => {
    const newSettings = { ...loginSettings, [key]: value };
    setLoginSettings(newSettings);
    localStorage.setItem('adminLoginSettings', JSON.stringify(newSettings));
  };

  const clearLoginData = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع بيانات تسجيل الدخول؟')) {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminLoginSettings');
      adminLogout();
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'نظرة عامة', icon: FaChartLine },
    { id: 'movies', label: 'الأفلام', icon: FaFilm },
    { id: 'tvshows', label: 'المسلسلات', icon: FaTv },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* الرأس */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <FaPlay className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient arabic-title">لوحة إدارة ستريم فليكس</h1>
                <span className="text-sm text-gray-400 arabic-text">
                  مرحباً، {adminUser?.username}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <motion.button
                onClick={handleRefresh}
                disabled={refreshing}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 glass-effect rounded-xl hover:bg-white/20 transition-all duration-300 ${refreshing ? 'animate-spin' : ''}`}
                title="تحديث البيانات"
              >
                <FaSync className="text-white" />
              </motion.button>
              
              <motion.button
                onClick={() => setShowSettings(!showSettings)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 glass-effect rounded-xl hover:bg-white/20 transition-all duration-300"
                title="الإعدادات"
              >
                <FaCog className="text-white" />
              </motion.button>
              
              <motion.button
                onClick={adminLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg"
              >
                <FaSignOutAlt />
                <span className="arabic-text">تسجيل الخروج</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* نافذة الإعدادات */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl w-full max-w-lg p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white arabic-title">إعدادات المدير</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <span className="text-white text-xl">✕</span>
              </button>
            </div>

            <div className="space-y-8">
              {/* إعدادات تسجيل الدخول */}
              <div>
                <h3 className="text-lg font-medium mb-6 text-white arabic-title">إعدادات تسجيل الدخول</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white arabic-text">تذكر تسجيل الدخول</span>
                    <input
                      type="checkbox"
                      checked={loginSettings.rememberLogin}
                      onChange={(e) => handleSettingsChange('rememberLogin', e.target.checked)}
                      className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white arabic-text">تسجيل خروج تلقائي</span>
                    <input
                      type="checkbox"
                      checked={loginSettings.autoLogout}
                      onChange={(e) => handleSettingsChange('autoLogout', e.target.checked)}
                      className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
                    />
                  </div>
                  
                  {loginSettings.autoLogout && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white arabic-text">
                        انتهاء الجلسة (دقائق)
                      </label>
                      <input
                        type="number"
                        value={loginSettings.sessionTimeout}
                        onChange={(e) => handleSettingsChange('sessionTimeout', parseInt(e.target.value))}
                        min="5"
                        max="480"
                        className="w-full px-4 py-3 glass-effect rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* معلومات الجلسة */}
              <div>
                <h3 className="text-lg font-medium mb-6 text-white arabic-title">معلومات الجلسة</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <p><span className="text-white arabic-text">مسجل الدخول باسم:</span> {adminUser?.username}</p>
                  <p><span className="text-white arabic-text">وقت تسجيل الدخول:</span> {new Date(adminUser?.loginTime).toLocaleDateString('ar')}</p>
                </div>
              </div>

              {/* الإجراءات */}
              <div className="flex justify-between pt-6 border-t border-white/10">
                <button
                  onClick={clearLoginData}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors arabic-text"
                >
                  حذف بيانات تسجيل الدخول
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-3 glass-effect text-white rounded-xl hover:bg-white/20 transition-colors arabic-text"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="flex">
        {/* الشريط الجانبي */}
        <aside className="w-80 glass-effect min-h-screen border-l border-white/10">
          <nav className="mt-8">
            <div className="px-6 space-y-3">
              {sidebarItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center px-6 py-4 text-right rounded-xl transition-all duration-300 ${
                    activeTab === item.id 
                      ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white border border-purple-500/30' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <item.icon className="ml-4 text-xl" />
                  <span className="arabic-text font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </nav>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 p-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-bold text-white arabic-title">نظرة عامة على اللوحة</h2>
                {loading && (
                  <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
                    <FaSync className="animate-spin" />
                    <span className="arabic-text">جاري المزامنة...</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="glass-effect rounded-2xl p-6 card-hover"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${stat.color}`}>
                        <stat.icon className="text-white text-2xl" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-300 arabic-text mb-2">{stat.title}</h3>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div 
                  className="glass-effect rounded-2xl p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-semibold mb-6 text-white arabic-title">أحدث الأفلام</h3>
                  <div className="space-y-4">
                    {movies.slice(-5).map((movie) => (
                      <div key={movie.id} className="flex items-center space-x-4 space-x-reverse p-3 rounded-xl hover:bg-white/5 transition-colors">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-16 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 text-right">
                          <p className="font-medium text-white arabic-text">{movie.title}</p>
                          <p className="text-sm text-gray-400 arabic-text">{movie.year} • {movie.rating}/10</p>
                          {movie.videoUrl && (
                            <div className="flex items-center text-xs text-green-400 mt-1">
                              <FaPlay className="ml-1" />
                              <span className="arabic-text">فيديو متاح</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="glass-effect rounded-2xl p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xl font-semibold mb-6 text-white arabic-title">أحدث المسلسلات</h3>
                  <div className="space-y-4">
                    {tvShows.slice(-5).map((show) => (
                      <div key={show.id} className="flex items-center space-x-4 space-x-reverse p-3 rounded-xl hover:bg-white/5 transition-colors">
                        <img
                          src={show.image}
                          alt={show.title}
                          className="w-16 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 text-right">
                          <p className="font-medium text-white arabic-text">{show.title}</p>
                          <p className="text-sm text-gray-400 arabic-text">{show.year} • {show.seasons} مواسم</p>
                          {show.videoUrl && (
                            <div className="flex items-center text-xs text-green-400 mt-1">
                              <FaPlay className="ml-1" />
                              <span className="arabic-text">فيديو متاح</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'movies' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-bold text-white arabic-title">إدارة الأفلام</h2>
                <Link
                  to="/admin/add-movie"
                  className="btn-primary flex items-center space-x-2 space-x-reverse"
                >
                  <FaPlus />
                  <span className="arabic-text">إضافة فيلم</span>
                </Link>
              </div>

              <div className="glass-effect rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-gradient-to-r from-purple-600/20 to-blue-600/20">
                      <tr>
                        <th className="px-6 py-4 text-white arabic-text font-bold">الملصق</th>
                        <th className="px-6 py-4 text-white arabic-text font-bold">العنوان</th>
                        <th className="px-6 py-4 text-white arabic-text font-bold">السنة</th>
                        <th className="px-6 py-4 text-white arabic-text font-bold">التقييم</th>
                        <th className="px-6 py-4 text-white arabic-text font-bold">الفيديو</th>
                        <th className="px-6 py-4 text-white arabic-text font-bold">النوع</th>
                        <th className="px-6 py-4 text-white arabic-text font-bold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {movies.map((movie) => (
                        <motion.tr 
                          key={movie.id} 
                          className="hover:bg-white/5 transition-colors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <td className="px-6 py-4">
                            <img
                              src={movie.image}
                              alt={movie.title}
                              className="w-16 h-20 object-cover rounded-lg"
                            />
                          </td>
                          <td className="px-6 py-4 text-white arabic-text font-medium">{movie.title}</td>
                          <td className="px-6 py-4 text-white">{movie.year}</td>
                          <td className="px-6 py-4 text-white">{movie.rating}</td>
                          <td className="px-6 py-4">
                            {movie.videoUrl ? (
                              <span className="text-green-400 text-sm flex items-center">
                                <FaPlay className="ml-1" />
                                <span className="arabic-text">متاح</span>
                              </span>
                            ) : (
                              <span className="text-red-400 text-sm flex items-center">
                                <span className="arabic-text">غير متاح</span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-white arabic-text">{movie.genre.join('، ')}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2 space-x-reverse">
                              <Link
                                to={`/admin/edit-movie/${movie.id}`}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                onClick={() => handleDeleteMovie(movie.id)}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tvshows' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-bold text-white arabic-title">إدارة المسلسلات</h2>
                <Link
                  to="/admin/add-tvshow"
                  className="btn-primary flex items-center space-x-2 space-x-reverse"
                >
                  <FaPlus />
                  <span className="arabic-text">إضافة مسلسل</span>
                </Link>
              </div>

              <div className="glass-effect rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-gradient-to-r from-purple-600/20 to-blue-600/20">
                      <tr>
                        <th className="px-6 py-4 text-white arabic-text font-bold">الملصق</th>
                        <th className="px-6 py-4 text-white arabic-text font-bold">العنوان</th>
                        <th className="px-6 py-4 text-white arabic-text font-bold">السنة</th>
                        <th className="px-6 py-4 text-white arabic-text font-bold">المواسم</th>
                        <th className="px-6 py-4 text-white arabic-text font-bold">التقييم</th>
                        <th className="px-6 py-4 text-white arabic-text font-bold">الفيديو</th>
                        <th className="px-6 py-4 text-white arabic-text font-bold">النوع</th>
                        <th className="px-6 py-4 text-white arabic-text font-bold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {tvShows.map((show) => (
                        <motion.tr 
                          key={show.id} 
                          className="hover:bg-white/5 transition-colors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <td className="px-6 py-4">
                            <img
                              src={show.image}
                              alt={show.title}
                              className="w-16 h-20 object-cover rounded-lg"
                            />
                          </td>
                          <td className="px-6 py-4 text-white arabic-text font-medium">{show.title}</td>
                          <td className="px-6 py-4 text-white">{show.year}</td>
                          <td className="px-6 py-4 text-white">{show.seasons}</td>
                          <td className="px-6 py-4 text-white">{show.rating}</td>
                          <td className="px-6 py-4">
                            {show.videoUrl ? (
                              <span className="text-green-400 text-sm flex items-center">
                                <FaPlay className="ml-1" />
                                <span className="arabic-text">متاح</span>
                              </span>
                            ) : (
                              <span className="text-red-400 text-sm flex items-center">
                                <span className="arabic-text">غير متاح</span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-white arabic-text">{show.genre.join('، ')}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2 space-x-reverse">
                              <Link
                                to={`/admin/edit-tvshow/${show.id}`}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                onClick={() => handleDeleteTvShow(show.id)}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;