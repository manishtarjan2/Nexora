'use client';

import React from 'react';
import { Search, Bell, Menu, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#0A0B10]/95 backdrop-blur-md w-full py-4 px-4 md:px-6 flex items-center justify-between gap-4">
      
      {/* Mobile Logo & Menu (Hidden on md+) */}
      <div className="md:hidden flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M7 6L21 26H25L11 6H7Z" fill="url(#header_grad)" />
              <path d="M7 26V6H11V26H7Z" fill="#8B5CF6" />
              <path d="M21 26V6H25V26H21Z" fill="#EC4899" />
              <defs>
                <linearGradient id="header_grad" x1="16" y1="6" x2="16" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366F1" />
                  <stop offset="1" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-base font-bold tracking-[0.15em] text-white">NEXORA</span>
        </Link>
      </div>

      {/* Centered Search Bar */}
      <div className="flex-1 flex justify-end md:justify-center max-w-[560px] ml-auto">
        <div className="relative w-full max-w-[560px] hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-500" />
          <input
            type="text"
            placeholder="Search for movies, shows, creators..."
            className="w-full bg-[#14151D] border border-white/[0.06] rounded-full py-[10px] pl-11 pr-12 text-[13px] focus:outline-none focus:border-purple-500/40 transition-all text-white placeholder-gray-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                window.location.href = `/search?q=${encodeURIComponent(e.currentTarget.value.trim())}`;
              }
            }}
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/10 transition-colors flex items-center justify-center">
            <Search className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        {/* Mobile Search Icon */}
        <button className="md:hidden w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center text-gray-400">
          <Search className="w-5 h-5" />
        </button>
      </div>
      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Create Button */}
        <Link
          href="/upload"
          className="flex items-center gap-2 px-5 py-[9px] rounded-full border border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06] transition-colors text-[13px] font-semibold"
        >
          <svg className="w-[18px] h-[18px] text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Create
        </Link>

        {/* Notification Bell */}
        <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all">
          <Bell className="w-[20px] h-[20px]" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0A0B10]"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 cursor-pointer hover:bg-white/[0.04] py-1.5 px-2 rounded-full transition-colors">
          <div className="w-[34px] h-[34px] rounded-full overflow-hidden ring-2 ring-white/10">
            <img
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80"
              alt="Manish"
              className="object-cover w-full h-full"
            />
          </div>
          <span className="text-[13px] font-semibold text-gray-200 hidden lg:block">Manish</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
        </div>
      </div>
    </header>
  );
}
