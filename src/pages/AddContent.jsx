import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSave, FaArrowLeft, FaPlay, FaImage, FaVideo } from 'react-icons/fa';
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
    titleEn: '',
    description: '',
    descriptionEn: '',
    image: '',
    banner: '',
    videoUrl: '',
    year: new Date().getFullYear(),
    rating: 0,
    genre: [],
    maturityRating: 'PG-13',
    director: '',
    directorEn: '',
    creator: '',
    creatorEn: '',
    cast: [],
    duration: '',
    seasons: 1
  });

  const [newGenre, setNewGenre] = useState('');
  const [newCast, setNewCast] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing && existingContent) {
      setFormData({
        title: existingContent.title || '',
        titleEn: existingContent.titleEn || '',
        description: existingContent.description || '',
        descriptionEn: existingContent.descriptionEn || '',
        image: existingContent.image || '',
        banner: existingContent.banner || '',
        videoUrl: existingContent.videoUrl || '',
        year: existingContent.year || new Date().getFullYear(),
        rating: existingContent.rating || 0,
        genre: existingContent.genre || [],
        maturityRating: existingContent.maturityRating || 'PG-13',
        director: existingContent.director || '',
        directorEn: existingContent.directorEn || '',
        creator: existingContent.creator || '',
        creatorEn: existingContent.creatorEn || '',
        cast: existingContent.cast || [],
        duration: existingContent.duration || '',
        seasons: existingContent.seasons || 1
      });
    }
  }, [isEditing, existingContent]);

  const genres = [
    'أكشن', 'مغامرة', 'كوميديا', 'جريمة', 'دراما', 'فانتازيا', 'رعب', 'غموض', 'رومانسية', 
    'خيال علمي', 'إثارة', 'أنيميشن', 'وثائقي', 'عائلي', 'موسيقي', 'ويسترن', 'سيرة ذاتية', 'تاريخي'
  ];

  const maturityRatings = [
    { value: 'G', label: 'G - للجميع' },
    { value: 'PG', label: 'PG - بإرشاد الوالدين' },
    { value: 'PG-13', label: 'PG-13 - أكبر من 13' },
    { value: 'R', label: 'R - مقيد' },
    { value: 'NC-17', label: 'NC-17 - أكبر من 17' },
    { value: 'TV-Y', label: 'TV-Y - للأطفال' },
    { value: 'TV-Y7', label: 'TV-Y7 - أكبر من 7' },
    { value: 'TV-G', label: 'TV-G - للجميع' },
    { value: 'TV-PG', label: 'TV-PG - بإرشاد الوالدين' },
    { value: 'TV-14', label: 'TV-14 - أكبر من 14' },
    { value: 'TV-MA', label: 'TV-MA - للبالغين فقط' }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const contentData = {
      ...formData,
      rating: parseFloat(formData.rating),
      year: parseInt(formData.year),
      seasons: type === 'tvshow' ? parseInt(formData.seasons) : undefined
    };

    try {
      if (isEditing) {
        if (type === 'movie') {
          await updateMovie(parseInt(id), contentData);
        } else {
          await updateTvShow(parseInt(id), contentData);
        }
      } else {
        if (type === 'movie') {
          await addMovie(contentData);
        } else {
          await addTvShow(contentData);
        }
      }
      
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error saving content:', error);
      // المتابعة إلى لوحة التحكم حتى لو كان هناك خطأ
      navigate('/admin/dashboard');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <motion.button
            onClick={() => navigate('/admin/dashboard')}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="ml-6 p-3 glass-effect text-white rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            <FaArrowLeft />
          </motion.button>
          <div>
            <h1 className="text-4xl font-bold text-white arabic-title">
              {isEditing ? 'تعديل' : 'إضافة'} {type === 'movie' ? 'فيلم' : 'مسلسل'} {isEditing ? 'جديد' : ''}
            </h1>
            <p className="text-gray-400 arabic-text mt-2">
              املأ النموذج التالي لإضافة محتوى جديد إلى المنصة
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* المعلومات الأساسية */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-white arabic-text">العنوان بالعربية</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 arabic-text"
                    placeholder="أدخل العنوان بالعربية"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-white arabic-text">العنوان بالإنجليزية</label>
                  <input
                    type="text"
                    name="titleEn"
                    value={formData.titleEn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter English title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-white arabic-text">السنة</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1900"
                    max="2030"
                    className="w-full px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-white arabic-text">التقييم (0-10)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-white arabic-text">تصنيف المحتوى</label>
                  <select
                    name="maturityRating"
                    value={formData.maturityRating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 arabic-text"
                  >
                    {maturityRatings.map((rating) => (
                      <option key={rating.value} value={rating.value} className="bg-gray-800">
                        {rating.label}
                      </option>
                    ))}
                  </select>
                </div>

                {type === 'movie' ? (
                  <div>
                    <label className="block text-sm font-medium mb-3 text-white arabic-text">المدة</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="مثال: 2س 30د"
                      className="w-full px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 arabic-text"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-3 text-white arabic-text">عدد المواسم</label>
                    <input
                      type="number"
                      name="seasons"
                      value={formData.seasons}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* الوصف */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium mb-3 text-white arabic-text">الوصف بالعربية</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 arabic-text"
                  placeholder="أدخل وصف المحتوى بالعربية"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-white arabic-text">الوصف بالإنجليزية</label>
                <textarea
                  name="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter English description"
                />
              </div>
            </div>

            {/* الصور والفيديو */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-white arabic-text flex items-center">
                  <FaImage className="ml-2" />
                  رابط صورة الملصق
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/poster.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-white arabic-text flex items-center">
                  <FaImage className="ml-2" />
                  رابط صورة البانر
                </label>
                <input
                  type="url"
                  name="banner"
                  value={formData.banner}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/banner.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-white arabic-text flex items-center">
                  <FaVideo className="ml-2" />
                  رابط الفيديو (MP4)
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-sm text-gray-400 mt-2 arabic-text">
                  رابط مباشر لملف MP4 لتشغيل الفيديو. سيتم حفظ المحتوى في قاعدة البيانات.
                </p>
              </div>
            </div>

            {/* المخرج/المنتج */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium mb-3 text-white arabic-text">
                  {type === 'movie' ? 'المخرج بالعربية' : 'المنتج بالعربية'}
                </label>
                <input
                  type="text"
                  name={type === 'movie' ? 'director' : 'creator'}
                  value={type === 'movie' ? formData.director : formData.creator}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 arabic-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-white arabic-text">
                  {type === 'movie' ? 'المخرج بالإنجليزية' : 'المنتج بالإنجليزية'}
                </label>
                <input
                  type="text"
                  name={type === 'movie' ? 'directorEn' : 'creatorEn'}
                  value={type === 'movie' ? formData.directorEn : formData.creatorEn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* الأنواع */}
            <div>
              <label className="block text-sm font-medium mb-3 text-white arabic-text">الأنواع</label>
              <div className="flex flex-wrap gap-3 mb-4">
                {formData.genre.map((genre) => (
                  <motion.span
                    key={genre}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm flex items-center arabic-text"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => removeGenre(genre)}
                      className="mr-2 text-white hover:text-red-300 transition-colors"
                    >
                      ×
                    </button>
                  </motion.span>
                ))}
              </div>
              <div className="flex gap-3">
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="flex-1 px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 arabic-text"
                >
                  <option value="">اختر نوع</option>
                  {genres.filter(g => !formData.genre.includes(g)).map((genre) => (
                    <option key={genre} value={genre} className="bg-gray-800">{genre}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => addGenre(newGenre)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 arabic-text"
                >
                  إضافة
                </button>
              </div>
            </div>

            {/* طاقم التمثيل */}
            <div>
              <label className="block text-sm font-medium mb-3 text-white arabic-text">طاقم التمثيل</label>
              <div className="flex flex-wrap gap-3 mb-4">
                {formData.cast.map((actor) => (
                  <motion.span
                    key={actor}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-2 bg-gray-700/50 text-white rounded-full text-sm flex items-center arabic-text"
                  >
                    {actor}
                    <button
                      type="button"
                      onClick={() => removeCastMember(actor)}
                      className="mr-2 text-white hover:text-red-300 transition-colors"
                    >
                      ×
                    </button>
                  </motion.span>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newCast}
                  onChange={(e) => setNewCast(e.target.value)}
                  placeholder="أدخل اسم الممثل"
                  className="flex-1 px-4 py-3 glass-effect text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 arabic-text"
                />
                <button
                  type="button"
                  onClick={addCastMember}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 arabic-text"
                >
                  إضافة
                </button>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex justify-end space-x-4 space-x-reverse pt-8 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-8 py-3 glass-effect text-white rounded-xl hover:bg-white/20 transition-all duration-300 arabic-text"
              >
                إلغاء
              </button>
              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 space-x-reverse px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <FaSync className="animate-spin" />
                    <span className="arabic-text">جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span className="arabic-text">
                      {isEditing ? 'تحديث' : 'حفظ'} {type === 'movie' ? 'الفيلم' : 'المسلسل'}
                    </span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddContent;