import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time subscription channels
  useEffect(() => {
    // Subscribe to real-time changes for movies
    const moviesChannel = supabase
      .channel('movies-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'movies_sf2024' },
        (payload) => {
          console.log('Movie change detected:', payload);
          handleMovieRealTimeUpdate(payload);
        }
      )
      .subscribe();

    // Subscribe to real-time changes for TV shows
    const tvShowsChannel = supabase
      .channel('tv-shows-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tv_shows_sf2024' },
        (payload) => {
          console.log('TV Show change detected:', payload);
          handleTvShowRealTimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(moviesChannel);
      supabase.removeChannel(tvShowsChannel);
    };
  }, []);

  // Handle real-time movie updates
  const handleMovieRealTimeUpdate = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
      case 'INSERT':
        const newMovie = formatMovieFromDB(newRecord);
        setMovies(prev => {
          const exists = prev.find(m => m.id === newMovie.id);
          if (!exists) {
            return [newMovie, ...prev];
          }
          return prev;
        });
        break;
      
      case 'UPDATE':
        const updatedMovie = formatMovieFromDB(newRecord);
        setMovies(prev => prev.map(movie => 
          movie.id === updatedMovie.id ? updatedMovie : movie
        ));
        break;
      
      case 'DELETE':
        setMovies(prev => prev.filter(movie => movie.id !== oldRecord.id));
        break;
    }
  };

  // Handle real-time TV show updates
  const handleTvShowRealTimeUpdate = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
      case 'INSERT':
        const newShow = formatTvShowFromDB(newRecord);
        setTvShows(prev => {
          const exists = prev.find(s => s.id === newShow.id);
          if (!exists) {
            return [newShow, ...prev];
          }
          return prev;
        });
        break;
      
      case 'UPDATE':
        const updatedShow = formatTvShowFromDB(newRecord);
        setTvShows(prev => prev.map(show => 
          show.id === updatedShow.id ? updatedShow : show
        ));
        break;
      
      case 'DELETE':
        setTvShows(prev => prev.filter(show => show.id !== oldRecord.id));
        break;
    }
  };

  // Format movie data from database
  const formatMovieFromDB = (movieData) => ({
    id: movieData.id,
    title: movieData.title_ar || movieData.title,
    titleEn: movieData.title,
    description: movieData.description_ar || movieData.description,
    descriptionEn: movieData.description,
    image: movieData.image,
    banner: movieData.banner,
    videoUrl: movieData.video_url,
    year: movieData.year,
    rating: parseFloat(movieData.rating || 0),
    genre: Array.isArray(movieData.genre) ? movieData.genre : [],
    maturityRating: movieData.maturity_rating,
    director: movieData.director_ar || movieData.director,
    directorEn: movieData.director,
    cast: Array.isArray(movieData.cast) ? movieData.cast : [],
    duration: movieData.duration
  });

  // Format TV show data from database
  const formatTvShowFromDB = (showData) => ({
    id: showData.id,
    title: showData.title_ar || showData.title,
    titleEn: showData.title,
    description: showData.description_ar || showData.description,
    descriptionEn: showData.description,
    image: showData.image,
    banner: showData.banner,
    videoUrl: showData.video_url,
    year: showData.year,
    rating: parseFloat(showData.rating || 0),
    genre: Array.isArray(showData.genre) ? showData.genre : [],
    maturityRating: showData.maturity_rating,
    creator: showData.creator_ar || showData.creator,
    creatorEn: showData.creator,
    cast: Array.isArray(showData.cast) ? showData.cast : [],
    seasons: showData.seasons
  });

  // Initialize database and load data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await createTables();
      await Promise.all([loadMovies(), loadTvShows()]);
      setLoading(false);
    };
    
    initializeData();
  }, []);

  // Create tables if they don't exist
  const createTables = async () => {
    try {
      // إنشاء جدول الأفلام
      const { error: moviesTableError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS movies_sf2024 (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            title_ar TEXT,
            description TEXT,
            description_ar TEXT,
            image TEXT,
            banner TEXT,
            video_url TEXT,
            year INTEGER,
            rating DECIMAL(3,1),
            genre TEXT[],
            maturity_rating TEXT,
            director TEXT,
            director_ar TEXT,
            cast TEXT[],
            duration TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
          
          ALTER TABLE movies_sf2024 ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY IF NOT EXISTS "Allow all operations on movies" ON movies_sf2024 
          FOR ALL USING (true) WITH CHECK (true);
        `
      });

      // إنشاء جدول المسلسلات
      const { error: tvShowsTableError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS tv_shows_sf2024 (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            title_ar TEXT,
            description TEXT,
            description_ar TEXT,
            image TEXT,
            banner TEXT,
            video_url TEXT,
            year INTEGER,
            rating DECIMAL(3,1),
            genre TEXT[],
            maturity_rating TEXT,
            creator TEXT,
            creator_ar TEXT,
            cast TEXT[],
            seasons INTEGER,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
          
          ALTER TABLE tv_shows_sf2024 ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY IF NOT EXISTS "Allow all operations on tv_shows" ON tv_shows_sf2024 
          FOR ALL USING (true) WITH CHECK (true);
        `
      });

    } catch (error) {
      console.log('Tables creation handled gracefully:', error.message);
      // محاولة إنشاء الجداول مباشرة
      try {
        await supabase.from('movies_sf2024').select('id').limit(1);
      } catch {
        console.log('Movies table does not exist, will use default data');
      }
    }
  };

  // Load movies from database
  const loadMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies_sf2024')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error && !error.message.includes('does not exist')) {
        console.error('Error loading movies:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const formattedMovies = data.map(formatMovieFromDB);
        setMovies(formattedMovies);
      } else {
        // بيانات افتراضية عربية
        setMovies([
          {
            id: 1,
            title: "العراب",
            titleEn: "The Godfather",
            image: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            banner: "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
            genre: ["جريمة", "دراما"],
            year: 1972,
            rating: 9.2,
            duration: "2س 55د",
            description: "بطريرك عجوز لسلالة إجرامية منظمة ينقل السيطرة على إمبراطوريته السرية إلى ابنه المتردد في ملحمة عن الأسرة والسلطة والعنف.",
            director: "فرانسيس فورد كوبولا",
            maturityRating: "R",
            cast: ["مارلون براندو", "آل باتشينو", "جيمس كان"],
            videoUrl: ""
          },
          {
            id: 2,
            title: "فارس الظلام",
            titleEn: "The Dark Knight",
            image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            banner: "https://image.tmdb.org/t/p/original/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
            genre: ["أكشن", "جريمة", "دراما"],
            year: 2008,
            rating: 9.0,
            duration: "2س 32د",
            description: "عندما يعيث الجوكر الفوضى في شوارع جوثام، يجب على باتمان أن يقبل واحدة من أعظم التحديات النفسية والجسدية للقتال ضد الظلم.",
            director: "كريستوفر نولان",
            maturityRating: "PG-13",
            cast: ["كريستيان بيل", "هيث ليدجر", "آرون إيكهارت"],
            videoUrl: ""
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading movies:', error);
      // بيانات افتراضية في حالة الخطأ
      setMovies([
        {
          id: 1,
          title: "العراب",
          titleEn: "The Godfather",
          image: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
          banner: "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
          genre: ["جريمة", "دراما"],
          year: 1972,
          rating: 9.2,
          duration: "2س 55د",
          description: "بطريرك عجوز لسلالة إجرامية منظمة ينقل السيطرة على إمبراطوريته السرية إلى ابنه المتردد.",
          director: "فرانسيس فورد كوبولا",
          maturityRating: "R",
          cast: ["مارلون براندو", "آل باتشينو", "جيمس كان"],
          videoUrl: ""
        }
      ]);
    }
  };

  // Load TV shows from database
  const loadTvShows = async () => {
    try {
      const { data, error } = await supabase
        .from('tv_shows_sf2024')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error && !error.message.includes('does not exist')) {
        console.error('Error loading TV shows:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const formattedShows = data.map(formatTvShowFromDB);
        setTvShows(formattedShows);
      } else {
        // بيانات افتراضية عربية
        setTvShows([
          {
            id: 1,
            title: "بريكنغ باد",
            titleEn: "Breaking Bad",
            image: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
            banner: "https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
            genre: ["جريمة", "دراما", "إثارة"],
            year: 2008,
            rating: 9.5,
            seasons: 5,
            description: "أستاذ كيمياء في المدرسة الثانوية يتم تشخيصه بسرطان الرئة غير القابل للعلاج ويتجه لتصنيع المخدرات مع طالب سابق لتأمين مستقبل عائلته المالي.",
            creator: "فينس جيليجان",
            maturityRating: "TV-MA",
            cast: ["برايان كرانستون", "آرون بول", "آنا جن"],
            videoUrl: ""
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading TV shows:', error);
      // بيانات افتراضية في حالة الخطأ
      setTvShows([
        {
          id: 1,
          title: "بريكنغ باد",
          titleEn: "Breaking Bad",
          image: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
          banner: "https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
          genre: ["جريمة", "دراما", "إثارة"],
          year: 2008,
          rating: 9.5,
          seasons: 5,
          description: "أستاذ كيمياء في المدرسة الثانوية يتم تشخيصه بسرطان الرئة غير القابل للعلاج ويتجه لتصنيع المخدرات.",
          creator: "فينس جيليجان",
          maturityRating: "TV-MA",
          cast: ["برايان كرانستون", "آرون بول", "آنا جن"],
          videoUrl: ""
        }
      ]);
    }
  };

  // Add movie with real-time sync
  const addMovie = async (movie) => {
    try {
      const movieData = {
        title: movie.titleEn || movie.title,
        title_ar: movie.title,
        description: movie.descriptionEn || movie.description,
        description_ar: movie.description,
        image: movie.image,
        banner: movie.banner,
        video_url: movie.videoUrl,
        year: movie.year,
        rating: movie.rating,
        genre: movie.genre,
        maturity_rating: movie.maturityRating,
        director: movie.directorEn || movie.director,
        director_ar: movie.director,
        cast: movie.cast,
        duration: movie.duration
      };

      const { data, error } = await supabase
        .from('movies_sf2024')
        .insert([movieData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        // إضافة محلية في حالة فشل قاعدة البيانات
        const newMovie = {
          id: Date.now(),
          ...movie
        };
        setMovies(prev => [newMovie, ...prev]);
        return newMovie;
      }

      console.log('Movie added successfully:', data);
      return data;
    } catch (error) {
      console.error('Error adding movie:', error);
      // إضافة محلية في حالة الخطأ
      const newMovie = {
        id: Date.now(),
        ...movie
      };
      setMovies(prev => [newMovie, ...prev]);
      return newMovie;
    }
  };

  // Update movie with real-time sync
  const updateMovie = async (id, updatedMovie) => {
    try {
      const movieData = {
        title: updatedMovie.titleEn || updatedMovie.title,
        title_ar: updatedMovie.title,
        description: updatedMovie.descriptionEn || updatedMovie.description,
        description_ar: updatedMovie.description,
        image: updatedMovie.image,
        banner: updatedMovie.banner,
        video_url: updatedMovie.videoUrl,
        year: updatedMovie.year,
        rating: updatedMovie.rating,
        genre: updatedMovie.genre,
        maturity_rating: updatedMovie.maturityRating,
        director: updatedMovie.directorEn || updatedMovie.director,
        director_ar: updatedMovie.director,
        cast: updatedMovie.cast,
        duration: updatedMovie.duration,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('movies_sf2024')
        .update(movieData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        // تحديث محلي في حالة فشل قاعدة البيانات
        setMovies(prev => prev.map(movie => 
          movie.id === id ? { ...movie, ...updatedMovie } : movie
        ));
        return updatedMovie;
      }

      console.log('Movie updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating movie:', error);
      // تحديث محلي في حالة الخطأ
      setMovies(prev => prev.map(movie => 
        movie.id === id ? { ...movie, ...updatedMovie } : movie
      ));
      return updatedMovie;
    }
  };

  // Delete movie with real-time sync
  const deleteMovie = async (id) => {
    try {
      const { error } = await supabase
        .from('movies_sf2024')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Database error:', error);
      }

      // حذف محلي في جميع الحالات
      setMovies(prev => prev.filter(movie => movie.id !== id));
      console.log('Movie deleted successfully');
    } catch (error) {
      console.error('Error deleting movie:', error);
      // حذف محلي في حالة الخطأ
      setMovies(prev => prev.filter(movie => movie.id !== id));
    }
  };

  // Add TV show with real-time sync
  const addTvShow = async (show) => {
    try {
      const showData = {
        title: show.titleEn || show.title,
        title_ar: show.title,
        description: show.descriptionEn || show.description,
        description_ar: show.description,
        image: show.image,
        banner: show.banner,
        video_url: show.videoUrl,
        year: show.year,
        rating: show.rating,
        genre: show.genre,
        maturity_rating: show.maturityRating,
        creator: show.creatorEn || show.creator,
        creator_ar: show.creator,
        cast: show.cast,
        seasons: show.seasons
      };

      const { data, error } = await supabase
        .from('tv_shows_sf2024')
        .insert([showData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        // إضافة محلية في حالة فشل قاعدة البيانات
        const newShow = {
          id: Date.now(),
          ...show
        };
        setTvShows(prev => [newShow, ...prev]);
        return newShow;
      }

      console.log('TV show added successfully:', data);
      return data;
    } catch (error) {
      console.error('Error adding TV show:', error);
      // إضافة محلية في حالة الخطأ
      const newShow = {
        id: Date.now(),
        ...show
      };
      setTvShows(prev => [newShow, ...prev]);
      return newShow;
    }
  };

  // Update TV show with real-time sync
  const updateTvShow = async (id, updatedShow) => {
    try {
      const showData = {
        title: updatedShow.titleEn || updatedShow.title,
        title_ar: updatedShow.title,
        description: updatedShow.descriptionEn || updatedShow.description,
        description_ar: updatedShow.description,
        image: updatedShow.image,
        banner: updatedShow.banner,
        video_url: updatedShow.videoUrl,
        year: updatedShow.year,
        rating: updatedShow.rating,
        genre: updatedShow.genre,
        maturity_rating: updatedShow.maturityRating,
        creator: updatedShow.creatorEn || updatedShow.creator,
        creator_ar: updatedShow.creator,
        cast: updatedShow.cast,
        seasons: updatedShow.seasons,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('tv_shows_sf2024')
        .update(showData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        // تحديث محلي في حالة فشل قاعدة البيانات
        setTvShows(prev => prev.map(show => 
          show.id === id ? { ...show, ...updatedShow } : show
        ));
        return updatedShow;
      }

      console.log('TV show updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating TV show:', error);
      // تحديث محلي في حالة الخطأ
      setTvShows(prev => prev.map(show => 
        show.id === id ? { ...show, ...updatedShow } : show
      ));
      return updatedShow;
    }
  };

  // Delete TV show with real-time sync
  const deleteTvShow = async (id) => {
    try {
      const { error } = await supabase
        .from('tv_shows_sf2024')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Database error:', error);
      }

      // حذف محلي في جميع الحالات
      setTvShows(prev => prev.filter(show => show.id !== id));
      console.log('TV show deleted successfully');
    } catch (error) {
      console.error('Error deleting TV show:', error);
      // حذف محلي في حالة الخطأ
      setTvShows(prev => prev.filter(show => show.id !== id));
    }
  };

  // Force refresh data (for manual sync)
  const refreshData = async () => {
    setLoading(true);
    await Promise.all([loadMovies(), loadTvShows()]);
    setLoading(false);
  };

  const value = {
    movies,
    tvShows,
    loading,
    addMovie,
    updateMovie,
    deleteMovie,
    addTvShow,
    updateTvShow,
    deleteTvShow,
    refreshData
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};