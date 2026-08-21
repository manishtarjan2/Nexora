'use client';

import React, { useEffect, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { X, Maximize2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GlobalPlayer() {
  const { activeVideo, isMinimized, closePlayer } = usePlayer();
  const router = useRouter();
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!activeVideo || isMinimized) return;

    const updateRect = () => {
      const placeholder = document.getElementById('watch-player-placeholder');
      if (placeholder) {
        const r = placeholder.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
    };

    // Initial and periodic update to handle layout shifts
    updateRect();
    const interval = setInterval(updateRect, 100);
    window.addEventListener('resize', updateRect);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateRect);
    };
  }, [activeVideo, isMinimized]);

  if (!activeVideo) return null;

  // Determine styles based on state
  const style: React.CSSProperties = isMinimized 
    ? { bottom: '1rem', right: '1rem', width: '350px', height: '197px', zIndex: 9999 }
    : { top: rect.top, left: rect.left, width: rect.width, height: rect.height, zIndex: 40 };

  return (
    <div 
      className={`fixed bg-black overflow-hidden transition-all duration-300 ${isMinimized ? 'rounded-xl shadow-2xl border border-white/[0.1]' : 'rounded-xl'}`}
      style={style}
    >
      {isMinimized && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-black/70 border-b border-white/[0.05] z-50">
          <span className="text-xs font-bold text-gray-300 truncate pr-2">{activeVideo.title}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => router.push(`/watch/${activeVideo.id}`)} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={closePlayer} className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className={`w-full h-full relative ${isMinimized ? 'mt-8' : ''}`}>
        {activeVideo.isLocal ? (
          <video src={activeVideo.url} controls autoPlay className="w-full h-full object-contain" />
        ) : (
          <iframe 
            src={activeVideo.url} 
            allow="autoplay; encrypted-media; fullscreen" 
            className="w-full h-full border-0"
            allowFullScreen
          />
        )}
        
        {isMinimized && (
          <div className="absolute inset-0 z-10 cursor-pointer" onClick={() => router.push(`/watch/${activeVideo.id}`)} />
        )}
      </div>
    </div>
  );
}
