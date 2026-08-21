/* eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ThumbsUp, MessageSquare, Share2, MoreHorizontal, MonitorPlay } from 'lucide-react';
import Image from 'next/image';
import { usePlayer, VideoMeta } from '@/context/PlayerContext';

import { motion } from 'framer-motion';

export default function WatchPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { activeVideo, setActiveVideo, setMinimized } = usePlayer();
  
  const [theaterMode, setTheaterMode] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const [loading, setLoading] = useState(!activeVideo || activeVideo.id !== id);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
        // Call the AI Recommendation endpoint with the current video as history
        const res = await fetch(`${API_URL}/api/videos/recommended`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ history: [id], limit: 8 })
        });
        if (res.ok) {
          const json = await res.json();
          setSuggestions(json.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    };
    fetchSuggestions();
  }, [id]);

  useEffect(() => {
    // If the active video is already the one we want, just maximize it.
    if (activeVideo && activeVideo.id === id) {
      setMinimized(false);
      setLoading(false);
      return;
    }

    const fetchVideo = async () => {
      try {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${API_URL}/api/videos/${id}`);
        if (!res.ok) throw new Error('Video not found');
        const json = await res.json();
        
        const videoData: VideoMeta = {
          id: json.data.id,
          title: json.data.title,
          author: json.data.author || 'Creator',
          url: json.data.url,
          isLocal: json.data.isLocal,
          views: json.data.views,
          description: json.data.description,
        };
        
        setActiveVideo(videoData);
        setMinimized(false);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVideo();
  }, [id, activeVideo, setActiveVideo, setMinimized]);

  if (loading) {
    return (
      <div className="w-full h-[100dvh] bg-[#0A0B10] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || (!activeVideo && !loading)) {
    return (
      <div className="w-full h-[100dvh] bg-[#0A0B10] flex flex-col items-center justify-center text-white gap-4">
        <h1 className="text-2xl font-bold">Video not found</h1>
        <button onClick={() => router.back()} className="px-6 py-2 bg-purple-600 rounded-full font-semibold hover:bg-purple-700">
          Go Back
        </button>
      </div>
    );
  }

  // We know activeVideo is present here.
  const video = activeVideo!;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#0A0B10] text-white flex flex-col items-center">
      
      {/* TOP SECTION: Player Container */}
      <div className={`w-full transition-all duration-500 flex flex-col items-center ${theaterMode ? 'bg-black px-0 pt-0 pb-6' : 'max-w-[1800px] px-4 lg:px-6 lg:pl-8 pt-4 lg:pt-6'}`}>
        <div className={`w-full ${theaterMode ? 'max-w-[1800px] px-4 lg:px-8' : ''}`}>
          <button onClick={() => router.back()} className={`flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-max ${theaterMode ? 'mt-4 mb-4' : 'mb-4 -mt-2 lg:mt-0'}`}>
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Video Player Placeholder with Ambient Glow */}
        <div 
          id="watch-player-placeholder" 
          className={`w-full mx-auto bg-black/10 aspect-video relative border border-white/[0.05] transition-all duration-500 shadow-[0_0_100px_rgba(168,85,247,0.12)] ${theaterMode ? 'max-w-[1800px] max-h-[85vh]' : 'rounded-xl max-h-[75vh]'}`} 
        />
      </div>

      {/* BOTTOM SECTION: Info & Suggestions */}
      <div className={`w-full max-w-[1800px] flex flex-col lg:flex-row transition-all duration-300 ${theaterMode ? 'px-4 lg:px-8' : 'px-0'}`}>
        
        {/* LEFT COLUMN: Details */}
        <div className={`w-full ${theaterMode ? 'lg:flex-[3] xl:flex-[4] pr-0 lg:pr-8' : 'lg:flex-[3] xl:flex-[4] p-4 lg:p-6 lg:pl-8 pt-2'} flex flex-col gap-4`}>
          
          {/* Video Info */}
          <div className="flex flex-col gap-3 mt-2">
            <h1 className="text-[22px] md:text-2xl font-bold leading-tight">{video.title}</h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Channel Info */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-purple-600 overflow-hidden flex-shrink-0">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`} alt={video.author} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[15px]">{video.author}</span>
                  <span className="text-[12px] text-gray-400">100K subscribers</span>
                </div>
                <button className="ml-4 px-4 py-1.5 bg-white text-black rounded-full font-bold text-[13px] hover:bg-gray-200 transition-colors">
                  Subscribe
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-white/[0.08] rounded-full overflow-hidden">
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/[0.1] transition-colors">
                    <ThumbsUp className="w-[18px] h-[18px]" />
                    <span className="text-[13px] font-semibold">12K</span>
                  </button>
                  <div className="w-[1px] h-5 bg-white/20" />
                  <button className="flex items-center px-4 py-2 hover:bg-white/[0.1] transition-colors">
                    <ThumbsUp className="w-[18px] h-[18px] rotate-180" />
                  </button>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] rounded-full transition-colors">
                  <Share2 className="w-[18px] h-[18px]" />
                  <span className="text-[13px] font-semibold hidden sm:inline">Share</span>
                </button>

                <button 
                  onClick={() => setTheaterMode(!theaterMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${theaterMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-white/[0.08] hover:bg-white/[0.12] text-white'}`}
                  title="Theater Mode"
                >
                  <MonitorPlay className="w-[18px] h-[18px]" />
                  <span className="text-[13px] font-semibold hidden sm:inline">{theaterMode ? 'Standard' : 'Theater'}</span>
                </button>
                
                <button className="w-9 h-9 flex items-center justify-center bg-white/[0.08] hover:bg-white/[0.12] rounded-full transition-colors">
                  <MoreHorizontal className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Description Box */}
          <div 
            onClick={() => setDescExpanded(!descExpanded)}
            className={`w-full bg-white/[0.04] hover:bg-white/[0.06] transition-colors rounded-xl p-4 mt-2 border border-white/[0.02] cursor-pointer relative ${descExpanded ? 'pb-10' : ''}`}
          >
            <div className="flex gap-4 text-[13px] font-semibold text-gray-200 mb-2">
              <span>{video.views?.toLocaleString() || '1.2M'} views</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className={`relative ${descExpanded ? '' : 'line-clamp-2'}`}>
              <p className="text-[14px] text-gray-300 leading-relaxed whitespace-pre-line">
                {video.description || "Enjoy this video playing in the background globally!\n\nThis is a high quality video fetched dynamically. Leave a like and subscribe for more content."}
              </p>
            </div>
            <button className="font-bold text-[13px] text-white mt-2 flex items-center gap-1 hover:text-purple-400">
              {descExpanded ? 'Show less' : '...more'}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Up Next */}
        <div className={`w-full ${theaterMode ? 'lg:flex-[1] xl:flex-[1.5]' : 'lg:flex-[1] xl:flex-[1.5] p-4 lg:p-6 lg:pl-0'} flex flex-col gap-4 mt-4 lg:mt-0`}>
          <h3 className="font-bold text-lg px-2 lg:px-0">Up Next</h3>
          
          <div className="flex flex-col gap-3 px-2 lg:px-0">
            {loadingSuggestions ? (
               Array.from({ length: 6 }).map((_, i) => (
                 <div key={i} className="flex gap-3 animate-pulse">
                   <div className="w-[160px] h-[90px] rounded-lg bg-white/[0.04] flex-shrink-0 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                   </div>
                   <div className="flex flex-col gap-2 py-0.5 flex-1">
                     <div className="h-4 bg-white/[0.06] rounded w-full" />
                     <div className="h-3 bg-white/[0.04] rounded w-2/3 mt-1" />
                   </div>
                 </div>
               ))
            ) : suggestions.length > 0 ? (
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-3">
                {suggestions.map((suggestion: any, i: number) => (
                  <motion.div 
                    key={`${suggestion.id}-${i}`} 
                    variants={itemVariants}
                    onClick={() => router.push(`/watch/${suggestion.id}`)}
                    className="flex gap-3 cursor-pointer group"
                  >
                    <div className="w-[160px] h-[90px] rounded-lg bg-[#14151D] flex-shrink-0 relative overflow-hidden group-hover:ring-2 ring-purple-500/50 transition-all shadow-lg border border-white/[0.04]">
                      {suggestion.image && (
                        <Image 
                          src={suggestion.image.replace('w=320', 'w=720').replace('w=600', 'w=720')} 
                          alt={suggestion.title} 
                          fill 
                          className="object-cover" 
                          sizes="160px"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
                        {Math.floor(Math.random() * 10) + 1}:{(Math.floor(Math.random() * 50) + 10).toString().padStart(2, '0')}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 py-0.5 min-w-0">
                      <h4 className="text-[14px] font-semibold leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors text-gray-100">
                        {suggestion.title}
                      </h4>
                      <span className="text-[12px] text-gray-400 mt-0.5 truncate">{suggestion.genre || 'Creator'}</span>
                      <span className="text-[11px] text-gray-500">{Math.floor(Math.random() * 900) + 10}K views • {Math.floor(Math.random() * 5) + 1} days ago</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-gray-400 text-sm">No suggestions available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
