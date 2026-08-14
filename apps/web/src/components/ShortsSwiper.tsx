'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShortVideo {
  id: number;
  title: string;
  url: string;
  author: string;
  likes: number;
}

export default function ShortsSwiper() {
  const [shorts, setShorts] = useState<ShortVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        // Fetch from the new Node.js MVP backend running on port 8080
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${API_URL}/api/feed/shorts`);
        if (response.ok) {
          const json = await response.json();
          setShorts(json.data);
        } else {
          console.error('Failed to fetch shorts from Node.js API');
        }
      } catch (err) {
        console.error('Network error fetching shorts:', err);
      }
    };

    fetchShorts();
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    // Calculate which video is currently in view
    const index = Math.round(scrollTop / clientHeight);
    if (index !== currentIndex) {
      setCurrentIndex(index);
      
      // Emit 'impression' event for the newly playing video
      if (shorts[index]) {
        emitEvent(shorts[index].id, 'impression');
      }
    }
  };

  const emitEvent = async (videoId: number, eventType: string, value?: number) => {
    // In production, this would POST to /api/events on the API Gateway
    console.log(`[Telemetry] Emitting event: ${eventType} for video ${videoId}${value ? ` (value: ${value})` : ''}`);
    
    // Example payload:
    // {
    //   user_id: 123,
    //   video_id: videoId,
    //   event_type: eventType,
    //   value: value,
    //   timestamp: Date.now() / 1000
    // }
  };

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="h-[calc(100vh-64px-64px)] md:h-[calc(100vh-64px)] w-full max-w-full md:max-w-md mx-auto snap-y snap-mandatory overflow-y-auto overflow-x-hidden scrollbar-hide bg-black relative md:rounded-3xl border-none md:border md:border-white/10 md:shadow-[0_0_50px_rgba(236,72,153,0.1)] md:my-4"
    >
      {shorts.map((short, index) => {
        // Sliding window logic:
        // N (Playing): index === currentIndex
        // N+1 (Buffered): index === currentIndex + 1
        // N+2 (Prefetched metadata/manifest): index === currentIndex + 2
        
        const isPlaying = index === currentIndex;
        const isBuffered = index === currentIndex + 1;
        const isPrefetched = index === currentIndex + 2;
        
        // Only render components that are within our sliding window to save DOM/memory
        const shouldRender = isPlaying || isBuffered || isPrefetched;

        return (
          <div 
            key={short.id} 
            className="h-full w-full snap-start snap-always relative bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
          >
            {shouldRender ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full relative"
              >
                {/* 
                  In a real implementation using video.js or hls.js:
                  If isPlaying -> play()
                  If isBuffered -> preload="auto", do not play()
                  If isPrefetched -> fetch manifest via XHR but don't attach media source yet
                */}
                
                {/* Mock Video Element */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center">
                  <motion.div
                    animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500 via-transparent to-transparent"
                  />
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 opacity-20">
                    {short.id}
                  </span>
                  
                  {/* Developer Overlay */}
                  <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold tracking-wider ${isPlaying ? "bg-green-500/20 text-green-400 border border-green-500/50" : isBuffered ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50" : "bg-blue-500/20 text-blue-400 border border-blue-500/50"}`}>
                      {isPlaying ? "▶ PLAYING" : isBuffered ? "⏳ BUFFERED" : "⬇ PREFETCHED"}
                    </span>
                  </div>
                </div>

                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

                {/* Info (Title, Author) */}
                <div className="absolute bottom-6 left-4 right-16 flex flex-col gap-2 z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 p-0.5 shadow-lg shadow-pink-500/20">
                      <div className="w-full h-full rounded-full border border-black overflow-hidden bg-gray-800 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">{short.author.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                    <p className="text-white font-bold text-sm drop-shadow-md">@{short.author}</p>
                    <button className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors ml-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                      Follow
                    </button>
                  </div>
                  <h3 className="text-white font-medium text-sm leading-snug drop-shadow-md">{short.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/80 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                      Original Sound - {short.author}
                    </span>
                  </div>
                </div>

                {/* Floating Action Buttons */}
                <div className="absolute right-4 bottom-6 flex flex-col gap-5 items-center z-20">
                  <ActionButton 
                    icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>}
                    label={formatNumber(short.likes)}
                    onClick={() => emitEvent(short.id, 'like')}
                    activeColor="text-pink-500"
                  />
                  <ActionButton 
                    icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>}
                    label={formatNumber(Math.floor(short.likes / 10))}
                    onClick={() => emitEvent(short.id, 'comment')}
                  />
                  <ActionButton 
                    icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 15v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4h-2v4H5v-4H3zm11-6.5V5l7 7-7 7v-3.5c-7 0-11 3.5-11 3.5 1.5-6.5 5.5-10.5 11-10.5z"/></svg>}
                    label="Share"
                    onClick={() => emitEvent(short.id, 'share')}
                  />
                  
                  {/* Spinning Record Icon */}
                  <motion.div 
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="w-10 h-10 rounded-full border-[6px] border-black bg-gradient-to-tr from-gray-800 to-gray-600 shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center mt-2"
                  >
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  </motion.div>
                </div>
              </motion.div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

// Helper Components
function ActionButton({ icon, label, onClick, activeColor = "text-white" }: { icon: React.ReactNode, label: string, onClick: () => void, activeColor?: string }) {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.button 
        whileTap={{ scale: 0.8 }}
        onClick={() => {
          setIsActive(!isActive);
          onClick();
        }}
        className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/5 transition-colors shadow-lg ${isActive ? activeColor : 'text-white hover:bg-white/20'}`}
      >
        {icon}
      </motion.button>
      <span className="text-white font-semibold text-xs drop-shadow-md">{label}</span>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
