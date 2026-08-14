'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Tv, Star } from 'lucide-react';

const seriesData = [
  { id: 1, title: 'Mirzapur', seasons: 3, genre: 'Crime • Thriller', rating: 4.7, status: 'Completed', image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=400&q=80' },
  { id: 2, title: 'Money Heist', seasons: 5, genre: 'Crime • Drama', rating: 4.8, status: 'Completed', image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80' },
  { id: 3, title: 'Game of Thrones', seasons: 8, genre: 'Fantasy • Drama', rating: 4.6, status: 'Completed', image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=400&q=80' },
  { id: 4, title: 'Stranger Things', seasons: 4, genre: 'Sci-Fi • Horror', rating: 4.7, status: 'Ongoing', image: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=400&q=80' },
  { id: 5, title: 'Breaking Bad', seasons: 5, genre: 'Crime • Drama', rating: 4.9, status: 'Completed', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80' },
  { id: 6, title: 'The Witcher', seasons: 3, genre: 'Fantasy • Action', rating: 4.3, status: 'Ongoing', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80' },
];

export default function SeriesPage() {
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'completed'>('all');
  const filtered = filter === 'all' ? seriesData : seriesData.filter(s => s.status.toLowerCase() === filter);

  return (
    <div className="w-full text-white px-6 pt-4 pb-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Tv className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold">Series</h1>
        </div>
        <p className="text-sm text-gray-400">Binge-worthy web series and TV shows</p>
      </div>

      <div className="flex gap-3 mb-8">
        {(['all', 'ongoing', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`capitalize px-5 py-[7px] rounded-full text-[13px] font-semibold transition-all border ${
              filter === f
                ? 'bg-purple-500/20 border-purple-500/60 text-purple-200'
                : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:bg-white/[0.06]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((series, i) => (
          <motion.div
            key={series.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.02 }}
            className="group cursor-pointer flex bg-[#14151D] border border-white/[0.04] rounded-xl overflow-hidden"
          >
            <div className="relative w-[140px] min-h-[180px] flex-shrink-0">
              <Image src={series.image} alt={series.title} fill className="object-cover" sizes="140px" />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-bold px-1.5 py-[2px] rounded uppercase ${series.status === 'Ongoing' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                    {series.status}
                  </span>
                </div>
                <h3 className="font-bold text-[15px] text-gray-100 group-hover:text-purple-300 transition-colors mb-1">{series.title}</h3>
                <p className="text-[12px] text-gray-500 mb-2">{series.genre}</p>
                <p className="text-[12px] text-gray-400">{series.seasons} Seasons</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-[12px] font-semibold text-gray-200">{series.rating}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/40 transition-colors">
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
