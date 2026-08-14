'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Play, Trash2 } from 'lucide-react';

const historyItems = [
  { id: 1, title: 'Interstellar', watched: '2 hours ago', progress: 65, image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80' },
  { id: 2, title: 'Mirzapur S3 E5', watched: 'Yesterday', progress: 100, image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=400&q=80' },
  { id: 3, title: 'Money Heist S1 E5', watched: 'Yesterday', progress: 75, image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80' },
  { id: 4, title: 'The Dark Knight', watched: '3 days ago', progress: 100, image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80' },
  { id: 5, title: 'Inception', watched: '1 week ago', progress: 40, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&q=80' },
  { id: 6, title: 'Kalki 2898 AD', watched: '2 weeks ago', progress: 100, image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&q=80' },
];

export default function HistoryPage() {
  return (
    <div className="w-full text-white px-6 pt-4 pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold">History</h1>
          </div>
          <p className="text-sm text-gray-400">Your recently watched content</p>
        </div>
        <button className="text-[12px] text-red-400 hover:text-red-300 font-semibold transition-colors">
          Clear All
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {historyItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 bg-[#14151D] border border-white/[0.04] rounded-xl p-3 group hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <div className="relative w-[140px] h-[80px] rounded-lg overflow-hidden flex-shrink-0">
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="140px" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-6 h-6 fill-white text-white" />
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-800">
                <div className="h-full bg-purple-500" style={{ width: `${item.progress}%` }} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[14px] text-gray-100 group-hover:text-purple-300 transition-colors truncate">{item.title}</h3>
              <p className="text-[12px] text-gray-500 mt-0.5">{item.watched}</p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                {item.progress === 100 ? 'Completed' : `${item.progress}% watched`}
              </p>
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
