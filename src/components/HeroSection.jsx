import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaInfoCircle, FaVolumeUp, FaVolumeMute, FaStar, FaCalendar } from 'react-icons/fa';
import { useContent } from '../context/ContentContext';
import WatchlistButton from './WatchlistButton';

const HeroSection = () => {
  const { movies, tvShows } = useContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const featuredContent = [
    ...movies.slice(0, 3),
    ...tvShows.slice(0, 2)
  ];

  useEffect(() => {
    if (featuredContent.length === 0) return;
    
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prev) => (prev + 1) % featuredContent.length);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isHovered, featuredContent.length]);

  if (featuredContent.length === 0) {
    return (
      <div className="relative min-h-[90vh] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <FaPlay className="text-white text-2xl" />
          </div>
          <p className="text-white text-xl arabic-text">جاري تحميل المحتوى المميز...</p>
        </motion.div>
      </div>
    );
  }

  const content = featuredContent[currentIndex];

  return (
    <div 
      className="relative min-h-[95vh] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* صورة الخلفية */}
          <div className="absolute inset-0">
            <img
              src={content.banner || content.image}
              alt={content.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/30" />
          </div>

          {/* المحتوى */}
          <div className="relative h-full flex items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-4xl text-white"
              >
                {/* العنوان */}
                <motion.h1 
                  className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white arabic-title"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {content.title}
                </motion.h1>

                {/* معلومات المحتوى */}
                <motion.div 
                  className="flex items-center space-x-6 space-x-reverse mb-6 text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-full">
                    <FaStar className="text-white" />
                    <span className="font-bold">{content.rating}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <FaCalendar className="text-white" />
                    <span>{content.year}</span>
                  </div>
                  
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    {content.maturityRating}
                  </span>
                  
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    {content.duration || `${content.seasons} مواسم`}
                  </span>
                </motion.div>

                {/* الأنواع */}
                <motion.div 
                  className="flex items-center space-x-3 space-x-reverse mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {content.genre.map((g, idx) => (
                    <span
                      key={idx}
                      className="text-sm bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 text-white arabic-text"
                    >
                      {g}
                    </span>
                  ))}
                </motion.div>

                {/* الوصف */}
                <motion.p 
                  className="text-xl text-gray-200 mb-10 line-clamp-3 leading-relaxed arabic-body max-w-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {content.description}
                </motion.p>

                {/* الأزرار */}
                <motion.div 
                  className="flex items-center space-x-6 space-x-reverse"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    <FaPlay className="ml-3" />
                    <span className="arabic-text">تشغيل الآن</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold text-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
                  >
                    <FaInfoCircle className="ml-3" />
                    <span className="arabic-text">معلومات أكثر</span>
                  </motion.button>

                  <WatchlistButton content={content} />

                  <motion.button
                    onClick={() => setIsMuted(!isMuted)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
                  >
                    {isMuted ? <FaVolumeMute className="text-white text-xl" /> : <FaVolumeUp className="text-white text-xl" />}
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* مؤشرات التنقل */}
      <div className="absolute bottom-8 right-1/2 translate-x-1/2 flex items-center space-x-4 space-x-reverse z-20">
        {featuredContent.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'w-12 bg-gradient-to-r from-purple-600 to-blue-600' 
                : 'w-2 bg-gray-400/50 hover:bg-gray-400'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>

      {/* شريط التقدم */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        />
      </div>

      {/* تأثير الجسيمات */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;