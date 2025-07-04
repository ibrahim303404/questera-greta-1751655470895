import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import ContentRow from '../components/ContentRow';
import { FaPlay, FaInfo, FaFire, FaStar, FaClock, FaTrophy, FaGlobe } from 'react-icons/fa';
import { useContent } from '../context/ContentContext';

const Home = () => {
  const { movies, tvShows } = useContent();

  // Combine and sort for trending
  const trendingContent = [...movies, ...tvShows]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  // Get award-winning content
  const awardWinning = [...movies, ...tvShows]
    .filter(item => item.rating >= 8.5)
    .slice(0, 10);

  // Get new releases
  const newReleases = [...movies, ...tvShows]
    .sort((a, b) => b.year - a.year)
    .slice(0, 10);

  // Get popular in your region
  const popularInRegion = [...movies, ...tvShows]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark via-dark to-dark">
      <HeroSection />

      {/* Featured Categories */}
      <div className="relative pb-12 mt-16">
        <div className="max-w-[1800px] mx-auto space-y-16 px-4 sm:px-6 lg:px-8">
          {/* Continue Watching */}
          <section>
            <div className="flex items-center mb-6">
              <FaClock className="text-white mr-2 text-2xl" />
              <h2 className="text-2xl font-semibold text-white">
                Continue Watching
              </h2>
            </div>
            <ContentRow
              items={movies.slice(0, 10).map(movie => ({
                ...movie,
                progress: Math.floor(Math.random() * 100)
              }))}
              type="movies"
            />
          </section>

          {/* Trending Now */}
          <section>
            <div className="flex items-center mb-6">
              <FaFire className="text-white mr-2 text-2xl" />
              <h2 className="text-2xl font-semibold text-white">
                Trending Now
              </h2>
            </div>
            <ContentRow items={trendingContent} type="movies" />
          </section>

          {/* Award-Winning */}
          <section>
            <div className="flex items-center mb-6">
              <FaTrophy className="text-white mr-2 text-2xl" />
              <h2 className="text-2xl font-semibold text-white">
                Award-Winning Titles
              </h2>
            </div>
            <ContentRow items={awardWinning} type="movies" />
          </section>

          {/* New Releases */}
          <section>
            <div className="flex items-center mb-6">
              <FaStar className="text-white mr-2 text-2xl" />
              <h2 className="text-2xl font-semibold text-white">
                New Releases
              </h2>
            </div>
            <ContentRow items={newReleases} type="movies" />
          </section>

          {/* Popular in Your Region */}
          <section>
            <div className="flex items-center mb-6">
              <FaGlobe className="text-white mr-2 text-2xl" />
              <h2 className="text-2xl font-semibold text-white">
                Popular in Your Region
              </h2>
            </div>
            <ContentRow items={popularInRegion} type="movies" />
          </section>

          {/* Top TV Shows */}
          <section>
            <div className="flex items-center mb-6">
              <FaStar className="text-white mr-2 text-2xl" />
              <h2 className="text-2xl font-semibold text-white">
                Top TV Shows
              </h2>
            </div>
            <ContentRow items={tvShows} type="shows" />
          </section>
        </div>
      </div>
    </main>
  );
};

export default Home;