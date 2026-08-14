'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Users, Eye, Circle } from 'lucide-react';

const liveChannels = [
  { id: 1, title: 'Nexora News Live', category: 'News', viewers: '12.4K', color: 'from-red-600 to-orange-500' },
  { id: 2, title: 'Gaming Marathon - GTA VI', category: 'Gaming', viewers: '45.2K', color: 'from-purple-600 to-blue-500' },
  { id: 3, title: 'Music Festival 2024', category: 'Music', viewers: '8.7K', color: 'from-pink-600 to-rose-500' },
  { id: 4, title: 'Cricket: IND vs AUS', category: 'Sports', viewers: '120K', color: 'from-green-600 to-emerald-500' },
  { id: 5, title: 'Tech Talk with AI', category: 'Technology', viewers: '5.3K', color: 'from-cyan-600 to-blue-500' },
  { id: 6, title: 'Cooking Masterclass', category: 'Lifestyle', viewers: '3.1K', color: 'from-amber-600 to-yellow-500' },
  { id: 7, title: 'Stand-up Comedy Night', category: 'Entertainment', viewers: '15.8K', color: 'from-violet-600 to-purple-500' },
  { id: 8, title: 'Fitness & Yoga Live', category: 'Health', viewers: '2.4K', color: 'from-teal-600 to-green-500' },
];

export default function LiveTVPage() {
  return (
    <div className="w-full text-white px-6 pt-4 pb-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Radio className="w-6 h-6 text-red-400" />
          <h1 className="text-2xl font-bold">Live TV</h1>
          <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded animate-pulse">● LIVE</span>
        </div>
        <p className="text-sm text-gray-400">Watch live streams, events, and broadcasts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {liveChannels.map((channel, i) => (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="group cursor-pointer"
          >
            <div className={`relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br ${channel.color} p-[1px]`}>
              <div className="w-full h-full rounded-xl bg-[#14151D] flex items-center justify-center relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${channel.color} opacity-20`} />
                {/* Animated wave effect */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-4 bg-white/60 rounded-full animate-pulse" />
                    <div className="w-1 h-6 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 h-7 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <div className="w-1 h-4 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <span className="text-[11px] text-white/60 font-medium">{channel.category}</span>
                </div>
                {/* Live badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded text-[9px] font-bold text-white">
                  <Circle className="w-2 h-2 fill-white" />
                  LIVE
                </div>
                {/* Viewers */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white">
                  <Eye className="w-3 h-3" />
                  {channel.viewers}
                </div>
              </div>
            </div>
            <div className="mt-2.5 px-0.5">
              <h3 className="font-semibold text-[13px] text-gray-100 group-hover:text-purple-300 transition-colors truncate">{channel.title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-gray-500">{channel.category}</span>
                <span className="text-[10px] text-gray-600">•</span>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-gray-500" />
                  <span className="text-[11px] text-gray-500">{channel.viewers} watching</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
