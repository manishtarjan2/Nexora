'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function WatchPage() {
  const params = useParams();
  const videoId = params.id;

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex justify-center py-8 px-4 xl:px-12">
      <div className="w-full max-w-[1800px] flex flex-col lg:flex-row gap-8">
        
        {/* Left Column (Main Video & Info) */}
        <div className="flex-1 lg:w-2/3 xl:w-3/4 flex flex-col gap-6">
          {/* Cinematic Player Wrapper */}
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(236,72,153,0.1)] border border-white/5">
            {/* Mock Player UI */}
            <div className="absolute inset-0 flex flex-col">
              <div className="flex-1 flex items-center justify-center relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                {/* Simulated ambient light effect behind the player */}
                <div className="absolute inset-20 bg-gradient-to-tr from-pink-500/20 to-violet-500/20 blur-3xl rounded-full"></div>
                
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform z-20 shadow-lg border border-white/30">
                  <svg className="w-10 h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>

              {/* Player Controls Mock */}
              <div className="h-16 px-6 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between z-20">
                <div className="flex items-center gap-4">
                  <svg className="w-6 h-6 text-white cursor-pointer hover:text-pink-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  <svg className="w-6 h-6 text-white cursor-pointer hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                  <span className="text-sm font-mono text-gray-300">01:23 / 10:42</span>
                </div>
                <div className="w-1/2 h-1.5 bg-white/20 rounded-full cursor-pointer relative">
                  <div className="absolute top-0 left-0 h-full w-1/4 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
                </div>
                <div className="flex items-center gap-4">
                  <svg className="w-6 h-6 text-white cursor-pointer hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <svg className="w-6 h-6 text-white cursor-pointer hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Video Metadata */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Building a Highly Scalable Video Streaming Platform from Scratch
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 py-2">
              {/* Channel Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 border-2 border-white/10 flex items-center justify-center">
                  <span className="text-lg font-bold">N</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg hover:text-pink-400 transition-colors cursor-pointer">Nexora Engineering</h3>
                  <p className="text-sm text-gray-400">1.2M subscribers</p>
                </div>
                <button className="ml-4 px-6 py-2.5 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors">
                  Subscribe
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white/10 rounded-full border border-white/5">
                  <button className="flex items-center gap-2 px-5 py-2.5 hover:bg-white/10 rounded-l-full transition-colors border-r border-white/10">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                    <span className="font-bold">124K</span>
                  </button>
                  <button className="flex items-center px-4 py-2.5 hover:bg-white/10 rounded-r-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg>
                  </button>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/5 font-bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                  Share
                </button>
              </div>
            </div>

            {/* Description Box */}
            <div className="w-full bg-white/5 rounded-2xl p-5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex gap-4 text-sm font-bold text-white mb-2">
                <span>1,245,678 views</span>
                <span>Premiered Aug 14, 2026</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                In this video, we dive deep into the architecture of Nexora. We build out the Node.js API Gateway, explore how FFmpeg is orchestrated for adaptive bitrate streaming via HLS, and test out our brand new Next.js cinematic web player!
                <br /><br />
                #SystemDesign #Nodejs #Nextjs
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (Recommendations) */}
        <div className="flex-1 lg:w-1/3 xl:w-1/4 flex flex-col gap-4">
          <div className="flex gap-2 mb-2">
            <button className="px-4 py-1.5 rounded-full bg-white text-black text-sm font-bold">All</button>
            <button className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors">From Nexora</button>
            <button className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors">Similar</button>
          </div>

          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex gap-3 group cursor-pointer">
              <div className="relative w-40 aspect-video rounded-xl bg-gray-800 overflow-hidden flex-shrink-0">
                <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white z-20">
                  15:20
                </div>
                <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-violet-500/20 group-hover:scale-105 transition-transform duration-300"></div>
              </div>
              <div className="flex flex-col pt-1 overflow-hidden">
                <h4 className="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-pink-400 transition-colors">
                  Scaling Node.js to Millions of Concurrent Uploads - Part {i}
                </h4>
                <span className="text-xs text-gray-400 mt-1 hover:text-white transition-colors">System Design Channel</span>
                <span className="text-xs text-gray-400">45K views • 3 days ago</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
