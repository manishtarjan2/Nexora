'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Film, Star, Clock } from 'lucide-react';

const genres = ['All', 'Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Documentary'];

const movies = [
  { id: 1, title: 'Kalki 2898 AD', year: '2024', genre: 'Sci-Fi', duration: '2h 45m', rating: 4.8, image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&q=80' },
  { id: 2, title: 'A Dead Silence', year: '2024', genre: 'Horror', duration: '1h 52m', rating: 4.3, image: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=400&q=80' },
  { id: 3, title: 'Interstellar', year: '2014', genre: 'Sci-Fi', duration: '2h 49m', rating: 4.9, image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80' },
  { id: 4, title: 'The Dark Knight', year: '2008', genre: 'Action', duration: '2h 32m', rating: 4.9, image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80' },
  { id: 5, title: 'Inception', year: '2010', genre: 'Sci-Fi', duration: '2h 28m', rating: 4.8, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&q=80' },
  { id: 6, title: 'Colors of India', year: '2024', genre: 'Documentary', duration: '1h 35m', rating: 4.5, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80' },
  { id: 7, title: 'Chasing Dreams', year: '2024', genre: 'Drama', duration: '2h 10m', rating: 4.2, image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80' },
  { id: 8, title: 'The Last Orbit', year: '2024', genre: 'Sci-Fi', duration: '1h 58m', rating: 4.6, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80' },
];

export default function MoviesPage() {
  const [activeGenre, setActiveGenre] = useState(0);

  return (
    <div className="w-full text-white px-6 pt-4 pb-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Film className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold">Movies</h1>
        </div>
        <p className="text-sm text-gray-400">Browse our collection of blockbuster films</p>
      </div>

      {/* Genre Filter */}
      <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-hide">
        {genres.map((genre, i) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(i)}
            className={`whitespace-nowrap px-5 py-[7px] rounded-full text-[13px] font-semibold transition-all border ${
              i === activeGenre
                ? 'bg-purple-500/20 border-purple-500/60 text-purple-200'
                : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:bg-white/[0.06]'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {movies.map((movie, i) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#14151D] border border-white/[0.04] mb-2.5">
              <Image src={movie.image} alt={movie.title} fill className="object-cover" sizes="300px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-white/80 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
              <div className="absolute top-2.5 right-2.5 bg-yellow-600 text-white text-[9px] font-black px-1.5 py-[3px] rounded-[4px] uppercase">
                {movie.genre}
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-[11px] font-semibold">{movie.rating}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-[11px] text-gray-300">{movie.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-[13px] text-gray-100 group-hover:text-purple-300 transition-colors">{movie.title}</h3>
            <p className="text-[11px] text-gray-500">{movie.genre} • {movie.year}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
