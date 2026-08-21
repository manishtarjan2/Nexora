/* eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ThumbsUp, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { usePlayer, VideoMeta } from '@/context/PlayerContext';

export default function WatchPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { activeVideo, setActiveVideo, setMinimized } = usePlayer();
  
  const [loading, setLoading] = useState(!activeVideo || activeVideo.id !== id);
  const [error, setError] = useState('');

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

  return (
    <div className="w-full min-h-[100dvh] bg-[#0A0B10] text-white flex flex-col lg:flex-row">
      {/* LEFT COLUMN: Player & Details */}
      <div className="w-full lg:flex-[3] xl:flex-[4] p-4 lg:p-6 lg:pl-8 flex flex-col gap-4">
        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-max -mt-2 lg:mt-0 mb-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Video Player Placeholder (GlobalPlayer overlays exactly here) */}
        <div id="watch-player-placeholder" className="w-full bg-black/10 rounded-xl aspect-video relative shadow-2xl border border-white/[0.05]" />

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
            <div className="flex items-center gap-2">
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
                <span className="text-[13px] font-semibold">Share</span>
              </button>
              
              <button className="w-9 h-9 flex items-center justify-center bg-white/[0.08] hover:bg-white/[0.12] rounded-full transition-colors">
                <MoreHorizontal className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Description Box */}
        <div className="w-full bg-white/[0.04] hover:bg-white/[0.06] transition-colors rounded-xl p-4 mt-2 border border-white/[0.02]">
          <div className="flex gap-4 text-[13px] font-semibold text-gray-200 mb-2">
            <span>{video.views?.toLocaleString() || '1.2M'} views</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <p className="text-[14px] text-gray-300 leading-relaxed whitespace-pre-line">
            Enjoy this video playing in the background globally!
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Up Next */}
      <div className="w-full lg:flex-[1] xl:flex-[1.5] p-4 lg:p-6 lg:pl-0 flex flex-col gap-4">
        <h3 className="font-bold text-lg">Up Next</h3>
        
        {/* Placeholder for related videos */}
        <div className="flex flex-col gap-3">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="flex gap-3 cursor-pointer group">
              <div className="w-[160px] h-[90px] rounded-lg bg-[#14151D] flex-shrink-0 relative overflow-hidden group-hover:ring-2 ring-purple-500/50 transition-all">
                <Image src={`https://images.unsplash.com/photo-${1618519764620 + i}?w=320&q=80`} alt="Thumbnail" fill className="object-cover" />
                <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[10px] font-bold">
                  12:34
                </div>
              </div>
              <div className="flex flex-col gap-1 py-0.5">
                <h4 className="text-[14px] font-semibold leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors">
                  Next amazing video you should watch {i}
                </h4>
                <span className="text-[12px] text-gray-400 mt-0.5">Awesome Creator</span>
                <span className="text-[11px] text-gray-500">450K views • 2 days ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
