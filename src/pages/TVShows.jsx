import { useState, useMemo } from 'react';
import TVShowHero from '../components/TVShowHero';
import FilterBar from '../components/FilterBar';
import ContentGrid from '../components/ContentGrid';
import { useContent } from '../context/ContentContext';

const TVShows = () => {
  const { tvShows } = useContent();
  const [filters, setFilters] = useState({
    genres: [],
    year: [1900, 2024],
    rating: 0
  });
  const [sortBy, setSortBy] = useState('latest');

  const filteredShows = useMemo(() => {
    let result = tvShows.filter(show => 
      (filters.genres.length === 0 || filters.genres.some(g => show.genre.includes(g))) &&
      show.year >= filters.year[0] && 
      show.year <= filters.year[1] &&
      show.rating >= filters.rating
    );

    switch (sortBy) {
      case 'rating':
        return result.sort((a, b) => b.rating - a.rating);
      case 'title':
        return result.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return result.sort((a, b) => b.year - a.year);
    }
  }, [tvShows, filters, sortBy]);

  return (
    <main className="bg-dark">
      <TVShowHero />
      <div className="mt-8">
        <FilterBar onFilterChange={setFilters} onSortChange={setSortBy} />
        <div className="mt-8">
          <ContentGrid items={filteredShows} type="shows" />
        </div>
      </div>
    </main>
  );
};

export default TVShows;