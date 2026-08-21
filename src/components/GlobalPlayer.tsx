'use client';

import React, { useEffect, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { X, Maximize2, GripHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function GlobalPlayer() {
  const { activeVideo, isMinimized, closePlayer } = usePlayer();
  const router = useRouter();
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!activeVideo || isMinimized) return;

    const updateRect = () => {
      const placeholder = document.getElementById('watch-player-placeholder');
      if (placeholder) {
        const r = placeholder.getBoundingClientRect();
        setRect({ 
          top: r.top + window.scrollY, 
          left: r.left + window.scrollX, 
          width: r.width, 
          height: r.height 
        });
      }
    };

    // Initial and periodic update to handle layout shifts (like theater mode toggling)
    updateRect();
    const interval = setInterval(updateRect, 250);
    window.addEventListener('resize', updateRect);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateRect);
    };
  }, [activeVideo, isMinimized]);

  if (!activeVideo) return null;

  // Determine styles based on state
  const style: React.CSSProperties = isMinimized 
    ? { position: 'fixed', bottom: '1rem', right: '1rem', width: '350px', height: '197px', zIndex: 9999, top: 'auto', left: 'auto' }
    : { position: 'absolute', top: rect.top, left: rect.left, width: rect.width, height: rect.height, zIndex: 40 };

  return (
    <motion.div 
      drag={isMinimized}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      className={`bg-black overflow-hidden ${(!isDragging && isMinimized) ? 'transition-all duration-500' : ''} ${isMinimized ? 'rounded-xl shadow-2xl border border-white/[0.1] cursor-move' : 'rounded-xl'}`}
      style={style}
    >
      {isMinimized && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-black/70 border-b border-white/[0.05] z-50">
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <GripHorizontal className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs font-bold text-gray-300 truncate">{activeVideo.title}</span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <button onClick={() => router.push(`/watch/${activeVideo.id}`)} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors cursor-pointer" onPointerDownCapture={(e) => e.stopPropagation()}>
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={closePlayer} className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors cursor-pointer" onPointerDownCapture={(e) => e.stopPropagation()}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className={`w-full h-full relative ${isMinimized ? 'mt-8' : ''}`} onPointerDownCapture={isMinimized ? undefined : (e) => e.stopPropagation()}>
        {activeVideo.isLocal ? (
          <video src={activeVideo.url} controls autoPlay className="w-full h-full object-contain" />
        ) : (
          <iframe 
            src={activeVideo.url} 
            allow="autoplay; encrypted-media; fullscreen" 
            className={`w-full h-full border-0 ${isDragging ? 'pointer-events-none' : ''}`}
            allowFullScreen
          />
        )}
        
        {isMinimized && !isDragging && (
          <div className="absolute inset-0 z-10" onClick={() => router.push(`/watch/${activeVideo.id}`)} />
        )}
      </div>
    </motion.div>
  );
}
