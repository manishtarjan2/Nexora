'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Flame, Sparkles, Star } from 'lucide-react';

const exploreCategories = [
  { label: 'All', active: true },
  { label: 'Trending', active: false },
  { label: 'New Releases', active: false },
  { label: 'Most Watched', active: false },
  { label: 'Top Rated', active: false },
];

const exploreItems = [
  { id: 1, title: 'Cosmic Voyage', genre: 'Sci-Fi', rating: 4.8, views: '2.1M', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80' },
  { id: 2, title: 'Urban Stories', genre: 'Drama', rating: 4.5, views: '1.8M', image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=80' },
  { id: 3, title: 'Wild Earth', genre: 'Documentary', rating: 4.9, views: '3.2M', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80' },
  { id: 4, title: 'Midnight Run', genre: 'Thriller', rating: 4.3, views: '900K', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80' },
  { id: 5, title: 'Ocean Deep', genre: 'Adventure', rating: 4.7, views: '1.5M', image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80' },
  { id: 6, title: 'City Lights', genre: 'Romance', rating: 4.2, views: '750K', image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&q=80' },
  { id: 7, title: 'The Summit', genre: 'Adventure', rating: 4.6, views: '1.1M', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80' },
  { id: 8, title: 'Digital Dreams', genre: 'Sci-Fi', rating: 4.4, views: '2.5M', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80' },
];

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <div className="w-full text-white px-6 pt-4 pb-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold">Explore</h1>
        </div>
        <p className="text-sm text-gray-400">Discover new content, trending videos, and hidden gems</p>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-hide">
        {exploreCategories.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => setActiveFilter(i)}
            className={`whitespace-nowrap px-5 py-[7px] rounded-full text-[13px] font-semibold transition-all border ${
              i === activeFilter
                ? 'bg-purple-500/20 border-purple-500/60 text-purple-200'
                : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:bg-white/[0.06] hover:text-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {exploreItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#14151D] border border-white/[0.04] mb-2.5">
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="300px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-white/80 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
              {/* Rating badge */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-[11px] text-white font-semibold">{item.rating}</span>
              </div>
              <div className="absolute bottom-3 right-3 text-[10px] text-gray-300 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                {item.views} views
              </div>
            </div>
            <h3 className="font-semibold text-[13px] text-gray-100 group-hover:text-purple-300 transition-colors">{item.title}</h3>
            <p className="text-[11px] text-gray-500">{item.genre}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
