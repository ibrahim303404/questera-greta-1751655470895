import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import ContentRow from '../components/ContentRow';
import { FaPlay, FaInfo, FaFire, FaStar, FaClock, FaTrophy, FaGlobe, FaHeart } from 'react-icons/fa';
import { useContent } from '../context/ContentContext';

const Home = () => {
  const { movies, tvShows } = useContent();

  // دمج وترتيب للمحتوى الشائع
  const trendingContent = [...movies, ...tvShows]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  // المحتوى الحائز على جوائز
  const awardWinning = [...movies, ...tvShows]
    .filter(item => item.rating >= 8.5)
    .slice(0, 10);

  // الإصدارات الجديدة
  const newReleases = [...movies, ...tvShows]
    .sort((a, b) => b.year - a.year)
    .slice(0, 10);

  // الشائع في المنطقة
  const popularInRegion = [...movies, ...tvShows]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  const sections = [
    {
      title: "متابعة المشاهدة",
      icon: FaClock,
      items: movies.slice(0, 10).map(movie => ({...movie, progress: Math.floor(Math.random() * 100)})),
      gradient: "from-blue-600 to-purple-600"
    },
    {
      title: "الأكثر مشاهدة الآن",
      icon: FaFire,
      items: trendingContent,
      gradient: "from-red-600 to-orange-600"
    },
    {
      title: "الحائز على جوائز",
      icon: FaTrophy,
      items: awardWinning,
      gradient: "from-yellow-600 to-amber-600"
    },
    {
      title: "الإصدارات الجديدة",
      icon: FaStar,
      items: newReleases,
      gradient: "from-green-600 to-emerald-600"
    },
    {
      title: "الشائع في المنطقة",
      icon: FaGlobe,
      items: popularInRegion,
      gradient: "from-indigo-600 to-blue-600"
    },
    {
      title: "أفضل المسلسلات",
      icon: FaHeart,
      items: tvShows,
      gradient: "from-pink-600 to-rose-600"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <HeroSection />
      
      {/* أقسام المحتوى المميزة */}
      <div className="relative pb-12 mt-16">
        <div className="max-w-[1800px] mx-auto space-y-16 px-4 sm:px-6 lg:px-8">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <div className="flex items-center mb-8 group">
                <motion.div 
                  className={`p-3 rounded-xl bg-gradient-to-r ${section.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <section.icon className="text-white text-xl" />
                </motion.div>
                <div className="mr-4">
                  <h2 className="text-3xl font-bold text-white arabic-title bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {section.title}
                  </h2>
                  <div className={`h-1 w-24 bg-gradient-to-r ${section.gradient} rounded-full mt-2`}></div>
                </div>
                <motion.div 
                  className="mr-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ x: -5 }}
                >
                  <button className="text-gray-400 hover:text-white transition-colors arabic-text">
                    عرض الكل ←
                  </button>
                </motion.div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                <ContentRow items={section.items} type="movies" />
              </div>
            </motion.section>
          ))}
        </div>
      </div>

      {/* قسم الميزات الخاصة */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white arabic-title mb-4">
              لماذا ستريم فليكس؟
            </h2>
            <p className="text-xl text-gray-300 arabic-text max-w-3xl mx-auto">
              استمتع بتجربة مشاهدة لا مثيل لها مع أحدث التقنيات وأفضل المحتوى العربي والعالمي
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "🎬", title: "محتوى حصري", desc: "أفلام ومسلسلات حصرية لا تجدها في أي مكان آخر" },
              { icon: "📱", title: "متعدد الأجهزة", desc: "شاهد على جهازك المفضل في أي وقت ومن أي مكان" },
              { icon: "🌟", title: "جودة عالية", desc: "استمتع بجودة 4K و HDR لتجربة بصرية مذهلة" },
              { icon: "👨‍👩‍👧‍👦", title: "للعائلة", desc: "محتوى آمن ومناسب لجميع أفراد العائلة" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-3xl group-hover:shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white arabic-title mb-3">{feature.title}</h3>
                <p className="text-gray-400 arabic-text leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default Home;