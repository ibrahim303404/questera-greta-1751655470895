import { useState, useMemo } from 'react';
import MovieHero from '../components/MovieHero';
import FilterBar from '../components/FilterBar';
import ContentGrid from '../components/ContentGrid';
import { useContent } from '../context/ContentContext';

const Movies = () => {
  const { movies } = useContent();
  const [filters, setFilters] = useState({
    genres: [],
    year: [1900, 2024],
    rating: 0
  });
  const [sortBy, setSortBy] = useState('latest');

  const filteredMovies = useMemo(() => {
    let result = movies.filter(movie => 
      (filters.genres.length === 0 || filters.genres.some(g => movie.genre.includes(g))) &&
      movie.year >= filters.year[0] && 
      movie.year <= filters.year[1] &&
      movie.rating >= filters.rating
    );

    switch (sortBy) {
      case 'rating':
        return result.sort((a, b) => b.rating - a.rating);
      case 'title':
        return result.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return result.sort((a, b) => b.year - a.year);
    }
  }, [movies, filters, sortBy]);

  return (
    <main className="bg-dark">
      <MovieHero />
      <div className="mt-8">
        <FilterBar onFilterChange={setFilters} onSortChange={setSortBy} />
        <div className="mt-8">
          <ContentGrid items={filteredMovies} type="movies" />
        </div>
      </div>
    </main>
  );
};

export default Movies;