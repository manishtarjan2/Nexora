'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Library as LibraryIcon, Play, Heart, Clock3, Download, FolderOpen } from 'lucide-react';

const tabs = [
  { label: 'All', icon: <FolderOpen className="w-4 h-4" /> },
  { label: 'Liked', icon: <Heart className="w-4 h-4" /> },
  { label: 'Watch Later', icon: <Clock3 className="w-4 h-4" /> },
  { label: 'Downloads', icon: <Download className="w-4 h-4" /> },
];

const libraryItems = [
  { id: 1, title: 'Cosmic Voyage', type: 'Movie', added: 'Added 2 days ago', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80' },
  { id: 2, title: 'Mirzapur S3', type: 'Series', added: 'Added 1 week ago', image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=400&q=80' },
  { id: 3, title: 'Music Festival 2024', type: 'Live', added: 'Added 3 days ago', image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&q=80' },
  { id: 4, title: 'The Summit', type: 'Documentary', added: 'Added 5 days ago', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80' },
  { id: 5, title: 'Urban Stories', type: 'Movie', added: 'Added 2 weeks ago', image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=80' },
  { id: 6, title: 'Digital Dreams', type: 'Movie', added: 'Added 1 month ago', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80' },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full text-white px-6 pt-4 pb-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <LibraryIcon className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold">Your Library</h1>
        </div>
        <p className="text-sm text-gray-400">All your saved content in one place</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-white/[0.04] pb-3">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              i === activeTab
                ? 'bg-purple-500/15 text-purple-300'
                : 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {libraryItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#14151D] border border-white/[0.04] mb-2">
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="200px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-white/80 bg-white/10 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-[9px] font-bold text-white px-1.5 py-[2px] rounded uppercase">
                {item.type}
              </div>
            </div>
            <h3 className="font-semibold text-[12px] text-gray-100 group-hover:text-purple-300 transition-colors truncate">{item.title}</h3>
            <p className="text-[10px] text-gray-500">{item.added}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
