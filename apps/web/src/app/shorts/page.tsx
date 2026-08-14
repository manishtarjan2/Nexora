import React from 'react';
import ShortsSwiper from '@/components/ShortsSwiper';

export default function ShortsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-pink-500 selection:text-white flex flex-col">
      {/* Minimal Header for Shorts */}
      <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight drop-shadow-md">Nexora Shorts</span>
          </div>
          <button className="text-white hover:text-pink-400 drop-shadow-md transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </div>
      </header>

      {/* Main Swiper */}
      <main className="flex-1 bg-black pt-16">
        <ShortsSwiper />
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 z-50 w-full bg-black/90 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-md mx-auto h-16 flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-white">
            <span className="text-xs font-bold">Shorts</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
            <span className="text-xs font-medium">Upload</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
