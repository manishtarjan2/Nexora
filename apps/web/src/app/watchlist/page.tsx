'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Bookmark, Play, Plus, Trash2 } from 'lucide-react';

const watchlistItems = [
  { id: 1, title: 'Kalki 2898 AD', genre: 'Sci-Fi • 2024', duration: '2h 45m', image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&q=80' },
  { id: 2, title: 'Mirzapur S3', genre: 'Crime • Thriller', duration: '8 Episodes', image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=400&q=80' },
  { id: 3, title: 'Interstellar', genre: 'Sci-Fi • 2014', duration: '2h 49m', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80' },
  { id: 4, title: 'The Dark Knight', genre: 'Action • 2008', duration: '2h 32m', image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80' },
  { id: 5, title: 'Ocean Deep', genre: 'Adventure • 2024', duration: '1h 55m', image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80' },
];

export default function WatchlistPage() {
  return (
    <div className="w-full text-white px-6 pt-4 pb-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bookmark className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold">Watchlist</h1>
        </div>
        <p className="text-sm text-gray-400">{watchlistItems.length} items saved to watch later</p>
      </div>

      <div className="flex flex-col gap-3">
        {watchlistItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 bg-[#14151D] border border-white/[0.04] rounded-xl p-3 group hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <div className="relative w-[120px] h-[70px] rounded-lg overflow-hidden flex-shrink-0">
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="120px" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-6 h-6 fill-white text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[14px] text-gray-100 group-hover:text-purple-300 transition-colors truncate">{item.title}</h3>
              <p className="text-[12px] text-gray-500">{item.genre}</p>
              <p className="text-[11px] text-gray-600 mt-0.5">{item.duration}</p>
            </div>
            <button className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
