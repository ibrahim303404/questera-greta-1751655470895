import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSave, FaArrowLeft, FaPlay } from 'react-icons/fa';
import { useContent } from '../context/ContentContext';

const AddContent = ({ type = 'movie' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addMovie, addTvShow, updateMovie, updateTvShow, movies, tvShows } = useContent();
  
  const isEditing = !!id;
  const existingContent = isEditing 
    ? (type === 'movie' ? movies.find(m => m.id === parseInt(id)) : tvShows.find(s => s.id === parseInt(id)))
    : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    banner: '',
    videoUrl: '',
    year: new Date().getFullYear(),
    rating: 0,
    genre: [],
    maturityRating: 'PG-13',
    director: '',
    creator: '',
    cast: [],
    duration: '',
    seasons: 1
  });

  const [newGenre, setNewGenre] = useState('');
  const [newCast, setNewCast] = useState('');

  useEffect(() => {
    if (isEditing && existingContent) {
      setFormData({
        title: existingContent.title || '',
        description: existingContent.description || '',
        image: existingContent.image || '',
        banner: existingContent.banner || '',
        videoUrl: existingContent.videoUrl || '',
        year: existingContent.year || new Date().getFullYear(),
        rating: existingContent.rating || 0,
        genre: existingContent.genre || [],
        maturityRating: existingContent.maturityRating || 'PG-13',
        director: existingContent.director || '',
        creator: existingContent.creator || '',
        cast: existingContent.cast || [],
        duration: existingContent.duration || '',
        seasons: existingContent.seasons || 1
      });
    }
  }, [isEditing, existingContent]);

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror',
    'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Documentary',
    'Family', 'Musical', 'Western', 'Biography', 'History'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addGenre = (genre) => {
    if (genre && !formData.genre.includes(genre)) {
      setFormData(prev => ({
        ...prev,
        genre: [...prev.genre, genre]
      }));
    }
    setNewGenre('');
  };

  const removeGenre = (genreToRemove) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.filter(g => g !== genreToRemove)
    }));
  };

  const addCastMember = () => {
    if (newCast.trim() && !formData.cast.includes(newCast.trim())) {
      setFormData(prev => ({
        ...prev,
        cast: [...prev.cast, newCast.trim()]
      }));
      setNewCast('');
    }
  };

  const removeCastMember = (castToRemove) => {
    setFormData(prev => ({
      ...prev,
      cast: prev.cast.filter(c => c !== castToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const contentData = {
      ...formData,
      rating: parseFloat(formData.rating),
      year: parseInt(formData.year),
      seasons: type === 'tvshow' ? parseInt(formData.seasons) : undefined
    };

    if (isEditing) {
      if (type === 'movie') {
        updateMovie(parseInt(id), contentData);
      } else {
        updateTvShow(parseInt(id), contentData);
      }
    } else {
      if (type === 'movie') {
        addMovie(contentData);
      } else {
        addTvShow(contentData);
      }
    }
    
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="mr-4 p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold text-white">
            {isEditing ? 'Edit' : 'Add New'} {type === 'movie' ? 'Movie' : 'TV Show'}
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-850 rounded-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1900"
                  max="2030"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Poster Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Banner Image URL</label>
                <input
                  type="url"
                  name="banner"
                  value={formData.banner}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Video URL Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                <FaPlay className="inline mr-2" />
                Video URL (MP4 Link)
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/video.mp4"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-sm text-gray-400 mt-1">
                Direct link to MP4 file for video playback
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Rating (0-10)</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  step="0.1"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Maturity Rating</label>
                <select
                  name="maturityRating"
                  value={formData.maturityRating}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="G">G</option>
                  <option value="PG">PG</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R</option>
                  <option value="NC-17">NC-17</option>
                  <option value="TV-Y">TV-Y</option>
                  <option value="TV-Y7">TV-Y7</option>
                  <option value="TV-G">TV-G</option>
                  <option value="TV-PG">TV-PG</option>
                  <option value="TV-14">TV-14</option>
                  <option value="TV-MA">TV-MA</option>
                </select>
              </div>

              {type === 'movie' ? (
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 2h 30min"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Seasons</label>
                  <input
                    type="number"
                    name="seasons"
                    value={formData.seasons}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                {type === 'movie' ? 'Director' : 'Creator'}
              </label>
              <input
                type="text"
                name={type === 'movie' ? 'director' : 'creator'}
                value={type === 'movie' ? formData.director : formData.creator}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Genres */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Genres</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.genre.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-primary text-white rounded-full text-sm flex items-center"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => removeGenre(genre)}
                      className="ml-2 text-white hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a genre</option>
                  {genres.filter(g => !formData.genre.includes(g)).map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => addGenre(newGenre)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Cast */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Cast</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.cast.map((actor) => (
                  <span
                    key={actor}
                    className="px-3 py-1 bg-gray-600 text-white rounded-full text-sm flex items-center"
                  >
                    {actor}
                    <button
                      type="button"
                      onClick={() => removeCastMember(actor)}
                      className="ml-2 text-white hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCast}
                  onChange={(e) => setNewCast(e.target.value)}
                  placeholder="Enter actor name"
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={addCastMember}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <FaSave />
                <span>{isEditing ? 'Update' : 'Save'} {type === 'movie' ? 'Movie' : 'TV Show'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddContent;