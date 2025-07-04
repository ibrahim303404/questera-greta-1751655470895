import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import { MOVIES, TV_SHOWS } from '../data/mockData';
import ContentGrid from '../components/ContentGrid';

const Search = () => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    genre: [],
    year: [1900, 2024],
    rating: 0
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [suggestions, setSuggestions] = useState([]);

  // Combine movies and TV shows for search
  const allContent = useMemo(() => {
    return [
      ...MOVIES.map(movie => ({ ...movie, type: 'movies' })),
      ...TV_SHOWS.map(show => ({ ...show, type: 'shows' }))
    ];
  }, []);

  // Search results with filtering and sorting
  const searchResults = useMemo(() => {
    if (!query) return [];

    let results = allContent.filter(item => {
      const matchesQuery = 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.cast.some(actor => actor.toLowerCase().includes(query.toLowerCase())) ||
        (item.director && item.director.toLowerCase().includes(query.toLowerCase())) ||
        (item.creator && item.creator.toLowerCase().includes(query.toLowerCase()));

      const matchesType = filters.type === 'all' || item.type === filters.type;
      const matchesGenre = filters.genre.length === 0 || 
        filters.genre.some(g => item.genre.includes(g));
      const matchesYear = item.year >= filters.year[0] && item.year <= filters.year[1];
      const matchesRating = item.rating >= filters.rating;

      return matchesQuery && matchesType && matchesGenre && matchesYear && matchesRating;
    });

    switch (sortBy) {
      case 'rating':
        return results.sort((a, b) => b.rating - a.rating);
      case 'year':
        return results.sort((a, b) => b.year - a.year);
      case 'title':
        return results.sort((a, b) => a.title.localeCompare(b.title));
      default: // relevance - matches in title given priority
        return results.sort((a, b) => {
          const aTitle = a.title.toLowerCase().includes(query.toLowerCase());
          const bTitle = b.title.toLowerCase().includes(query.toLowerCase());
          if (aTitle && !bTitle) return -1;
          if (!aTitle && bTitle) return 1;
          return b.rating - a.rating;
        });
    }
  }, [query, filters, sortBy, allContent]);

  // Generate search suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const newSuggestions = allContent
      .filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.cast.some(actor => actor.toLowerCase().includes(query.toLowerCase()))
      )
      .slice(0, 5)
      .map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        image: item.image,
        year: item.year
      }));

    setSuggestions(newSuggestions);
  }, [query, allContent]);

  return (
    <main className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, actors, directors..."
                className="w-full pl-12 pr-4 py-3 bg-gray-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-light"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-lg transition-colors ${
                showFilters ? 'bg-primary text-white' : 'bg-gray-850 text-gray-400 hover:text-light'
              }`}
            >
              <FaFilter />
            </button>
          </div>

          {/* Search Suggestions */}
          <AnimatePresence>
            {suggestions.length > 0 && query && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-gray-850 rounded-lg shadow-lg overflow-hidden z-50"
              >
                {suggestions.map((suggestion) => (
                  <button
                    key={`${suggestion.type}-${suggestion.id}`}
                    onClick={() => {
                      setQuery(suggestion.title);
                      setSuggestions([]);
                    }}
                    className="flex items-center w-full p-3 hover:bg-gray-700 transition-colors"
                  >
                    <img
                      src={suggestion.image}
                      alt={suggestion.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="ml-3 text-left">
                      <h3 className="font-medium">{suggestion.title}</h3>
                      <p className="text-sm text-gray-400">
                        {suggestion.type === 'movies' ? 'Movie' : 'TV Show'} • {suggestion.year}
                      </p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filters and Sort */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 p-6 bg-gray-850 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Type</h3>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded-md"
                  >
                    <option value="all">All</option>
                    <option value="movies">Movies</option>
                    <option value="shows">TV Shows</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded-md"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating</option>
                    <option value="year">Release Year</option>
                    <option value="title">Title</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Minimum Rating</h3>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.rating}
                    onChange={(e) => setFilters({ ...filters, rating: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>0</span>
                    <span>{filters.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Year Range</h3>
                  <input
                    type="range"
                    min="1900"
                    max="2024"
                    value={filters.year[1]}
                    onChange={(e) => setFilters({ ...filters, year: [1900, parseInt(e.target.value)] })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>1900</span>
                    <span>{filters.year[1]}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        {query ? (
          searchResults.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Search Results ({searchResults.length})
              </h2>
              <ContentGrid items={searchResults} type="search" />
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">No results found</h2>
              <p className="text-gray-400">
                Try adjusting your search or filters to find what you're looking for
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Start your search</h2>
            <p className="text-gray-400">
              Search for movies, TV shows, actors, or directors
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Search;