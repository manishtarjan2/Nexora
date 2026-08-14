'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home, Compass, Film, Tv, Radio,
  Crown, Bookmark, Clock, Library, Settings,
  Heart, Clock3, Map, Zap, Plus
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', path: '/', icon: <Home className="w-[18px] h-[18px]" /> },
    { label: 'Explore', path: '/explore', icon: <Compass className="w-[18px] h-[18px]" /> },
    { label: 'Movies', path: '/movies', icon: <Film className="w-[18px] h-[18px]" /> },
    { label: 'Series', path: '/series', icon: <Tv className="w-[18px] h-[18px]" /> },
    { label: 'Live TV', path: '/live', icon: <Radio className="w-[18px] h-[18px]" />, badge: 'LIVE' },
    { label: 'Premium', path: '/premium', icon: <Crown className="w-[18px] h-[18px]" /> },
    { label: 'Watchlist', path: '/watchlist', icon: <Bookmark className="w-[18px] h-[18px]" /> },
    { label: 'History', path: '/history', icon: <Clock className="w-[18px] h-[18px]" /> },
    { label: 'Your Library', path: '/library', icon: <Library className="w-[18px] h-[18px]" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-[18px] h-[18px]" /> },
  ];

  const playlists = [
    { label: 'Favorites', count: 24, icon: <Heart className="w-4 h-4 text-white" />, bgColor: 'bg-pink-600' },
    { label: 'Watch Later', count: 12, icon: <Clock3 className="w-4 h-4 text-white" />, bgColor: 'bg-blue-600' },
    { label: 'Travel Vlogs', count: 18, icon: <Map className="w-4 h-4 text-white" />, bgColor: 'bg-orange-500' },
    { label: 'Motivation', count: 15, icon: <Zap className="w-4 h-4 text-white" />, bgColor: 'bg-green-600' },
  ];

  return (
    <aside className="w-[240px] min-w-[240px] hidden md:flex flex-col h-screen bg-[#0E0F15] border-r border-white/[0.04] sticky top-0 z-50 overflow-y-auto scrollbar-hide">

      {/* Logo */}
      <div className="px-6 pt-6 pb-8 flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center">
          <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
            <path d="M7 6L21 26H25L11 6H7Z" fill="url(#sidebar_grad)" />
            <path d="M7 26V6H11V26H7Z" fill="#8B5CF6" />
            <path d="M21 26V6H25V26H21Z" fill="#EC4899" />
            <defs>
              <linearGradient id="sidebar_grad" x1="16" y1="6" x2="16" y2="26" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="text-lg font-bold tracking-[0.15em] text-white">NEXORA</span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className="relative block"
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-purple-500/[0.12] rounded-xl border border-purple-500/[0.15]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
                className={`relative z-10 flex items-center justify-between px-4 py-[10px] rounded-xl transition-colors duration-200 ${
                  isActive
                    ? 'text-purple-300'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {item.icon}
                  <span className="font-medium text-[13px]">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-[4px] uppercase tracking-wider leading-none">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}

        {/* Playlists Divider */}
        <div className="mt-6 mb-3 mx-4 border-t border-white/[0.05]" />

        {/* Playlists Header */}
        <div className="px-4 mb-2 flex items-center justify-between">
          <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">Your Playlists</h4>
          <button className="w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Playlist Items */}
        <div className="flex flex-col gap-0.5">
          {playlists.map((pl) => (
            <Link key={pl.label} href="#" className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/[0.04] transition-colors group">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${pl.bgColor} flex-shrink-0`}>
                {pl.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-medium text-gray-300 group-hover:text-white transition-colors truncate">{pl.label}</span>
                <span className="text-[11px] text-gray-500">{pl.count} videos</span>
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Go Premium Banner */}
      <div className="mx-3 mb-4 mt-4">
        <div className="bg-[#16171F] border border-white/[0.05] rounded-2xl p-5 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-transparent to-pink-600/5 pointer-events-none" />
          <Crown className="w-9 h-9 text-yellow-400 mb-3 drop-shadow-[0_0_12px_rgba(250,204,21,0.4)] relative z-10" />
          <h4 className="text-white font-bold text-[15px] mb-1 relative z-10">Go Premium</h4>
          <p className="text-gray-400 text-[11px] mb-4 relative z-10 leading-relaxed">Ad-free, 4K quality, downloads</p>
          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-[13px] font-bold shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.5)] transition-shadow relative z-10">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
