import { createContext, useContext, useState, useEffect } from 'react';
import { MOVIES, TV_SHOWS } from '../data/mockData';

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem('adminMovies');
    return saved ? JSON.parse(saved) : MOVIES;
  });

  const [tvShows, setTvShows] = useState(() => {
    const saved = localStorage.getItem('adminTvShows');
    return saved ? JSON.parse(saved) : TV_SHOWS;
  });

  useEffect(() => {
    localStorage.setItem('adminMovies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('adminTvShows', JSON.stringify(tvShows));
  }, [tvShows]);

  const addMovie = (movie) => {
    const newMovie = {
      ...movie,
      id: Date.now(),
      cast: movie.cast || [],
      genre: movie.genre || []
    };
    setMovies(prev => [...prev, newMovie]);
  };

  const updateMovie = (id, updatedMovie) => {
    setMovies(prev => prev.map(movie => 
      movie.id === id ? { ...movie, ...updatedMovie } : movie
    ));
  };

  const deleteMovie = (id) => {
    setMovies(prev => prev.filter(movie => movie.id !== id));
  };

  const addTvShow = (show) => {
    const newShow = {
      ...show,
      id: Date.now(),
      cast: show.cast || [],
      genre: show.genre || []
    };
    setTvShows(prev => [...prev, newShow]);
  };

  const updateTvShow = (id, updatedShow) => {
    setTvShows(prev => prev.map(show => 
      show.id === id ? { ...show, ...updatedShow } : show
    ));
  };

  const deleteTvShow = (id) => {
    setTvShows(prev => prev.filter(show => show.id !== id));
  };

  const value = {
    movies,
    tvShows,
    addMovie,
    updateMovie,
    deleteMovie,
    addTvShow,
    updateTvShow,
    deleteTvShow
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};