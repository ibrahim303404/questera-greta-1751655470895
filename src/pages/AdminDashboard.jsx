import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilm, FaTv, FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaUsers, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useContent } from '../context/ContentContext';

const AdminDashboard = () => {
  const { adminLogout } = useAdmin();
  const { movies, tvShows, deleteMovie, deleteTvShow } = useContent();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Total Movies',
      value: movies.length,
      icon: FaFilm,
      color: 'text-blue-500'
    },
    {
      title: 'Total TV Shows',
      value: tvShows.length,
      icon: FaTv,
      color: 'text-green-500'
    },
    {
      title: 'Total Content',
      value: movies.length + tvShows.length,
      icon: FaChartLine,
      color: 'text-purple-500'
    }
  ];

  const handleDeleteMovie = (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      deleteMovie(id);
    }
  };

  const handleDeleteTvShow = (id) => {
    if (window.confirm('Are you sure you want to delete this TV show?')) {
      deleteTvShow(id);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-gray-850 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">StreamFlix Admin</h1>
            </div>
            <button
              onClick={adminLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-850 min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                  activeTab === 'overview' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FaChartLine className="mr-3" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('movies')}
                className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                  activeTab === 'movies' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FaFilm className="mr-3" />
                Movies
              </button>
              <button
                onClick={() => setActiveTab('tvshows')}
                className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                  activeTab === 'tvshows' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FaTv className="mr-3" />
                TV Shows
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white">Dashboard Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-850 rounded-lg p-6"
                  >
                    <div className="flex items-center">
                      <stat.icon className={`text-3xl ${stat.color} mr-4`} />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-850 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-white">Recent Movies</h3>
                  <div className="space-y-3">
                    {movies.slice(-5).map((movie) => (
                      <div key={movie.id} className="flex items-center space-x-3">
                        <img src={movie.image} alt={movie.title} className="w-12 h-16 object-cover rounded" />
                        <div>
                          <p className="font-medium text-white">{movie.title}</p>
                          <p className="text-sm text-gray-400">{movie.year} • {movie.rating}/10</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-850 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-white">Recent TV Shows</h3>
                  <div className="space-y-3">
                    {tvShows.slice(-5).map((show) => (
                      <div key={show.id} className="flex items-center space-x-3">
                        <img src={show.image} alt={show.title} className="w-12 h-16 object-cover rounded" />
                        <div>
                          <p className="font-medium text-white">{show.title}</p>
                          <p className="text-sm text-gray-400">{show.year} • {show.seasons} seasons</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'movies' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Movies Management</h2>
                <Link
                  to="/admin/add-movie"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <FaPlus />
                  <span>Add Movie</span>
                </Link>
              </div>

              <div className="bg-gray-850 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-white">Poster</th>
                        <th className="px-6 py-3 text-left text-white">Title</th>
                        <th className="px-6 py-3 text-left text-white">Year</th>
                        <th className="px-6 py-3 text-left text-white">Rating</th>
                        <th className="px-6 py-3 text-left text-white">Genre</th>
                        <th className="px-6 py-3 text-left text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {movies.map((movie) => (
                        <tr key={movie.id} className="hover:bg-gray-800">
                          <td className="px-6 py-4">
                            <img src={movie.image} alt={movie.title} className="w-12 h-16 object-cover rounded" />
                          </td>
                          <td className="px-6 py-4 text-white">{movie.title}</td>
                          <td className="px-6 py-4 text-white">{movie.year}</td>
                          <td className="px-6 py-4 text-white">{movie.rating}</td>
                          <td className="px-6 py-4 text-white">{movie.genre.join(', ')}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleDeleteMovie(movie.id)}
                                className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
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
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">TV Shows Management</h2>
                <Link
                  to="/admin/add-tvshow"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <FaPlus />
                  <span>Add TV Show</span>
                </Link>
              </div>

              <div className="bg-gray-850 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-white">Poster</th>
                        <th className="px-6 py-3 text-left text-white">Title</th>
                        <th className="px-6 py-3 text-left text-white">Year</th>
                        <th className="px-6 py-3 text-left text-white">Seasons</th>
                        <th className="px-6 py-3 text-left text-white">Rating</th>
                        <th className="px-6 py-3 text-left text-white">Genre</th>
                        <th className="px-6 py-3 text-left text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {tvShows.map((show) => (
                        <tr key={show.id} className="hover:bg-gray-800">
                          <td className="px-6 py-4">
                            <img src={show.image} alt={show.title} className="w-12 h-16 object-cover rounded" />
                          </td>
                          <td className="px-6 py-4 text-white">{show.title}</td>
                          <td className="px-6 py-4 text-white">{show.year}</td>
                          <td className="px-6 py-4 text-white">{show.seasons}</td>
                          <td className="px-6 py-4 text-white">{show.rating}</td>
                          <td className="px-6 py-4 text-white">{show.genre.join(', ')}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleDeleteTvShow(show.id)}
                                className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
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