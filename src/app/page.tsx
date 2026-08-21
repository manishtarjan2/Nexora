/* eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Plus, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [data, setData] = useState<any>({ trending: [], continueWatching: [], creators: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
        
        // Use a mock anonymous history for personalization MVP
        const mockHistory = ["RIBXvLvRAVE", "agMZc3TsOBM"];
        
        // 1. Fetch generic home feed (continue watching, creators)
        const homeRes = await fetch(`${API_URL}/api/videos/home`);
        const homeJson = await homeRes.json();
        const homeData = homeJson.data || {};
        
        // 2. Fetch personalized recommendations
        const recRes = await fetch(`${API_URL}/api/videos/recommended`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ history: mockHistory, limit: 6 })
        });
        const recJson = await recRes.json();
        
        // Combine them
        setData({
          trending: recJson.data || homeData.trending || [],
          continueWatching: homeData.continueWatching || [],
          creators: homeData.creators || []
        });
      } catch (err) {
        console.error('Failed to fetch feed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const [activeCategory, setActiveCategory] = useState(0);
  const categories = ['For You', 'Trending', 'Movies', 'Web Series', 'Live', 'Music', 'Gaming', 'News'];

  return (
    <div className="w-full text-white px-2 md:px-4 pt-4 pb-10">

      {/* ══════════════ HERO BANNER ══════════════ */}
      <div className="relative w-full h-[420px] rounded-2xl overflow-hidden mb-8 border border-white/[0.04]">
        <Image
          src="/hero_bg.jpg"
          alt="Beyond the Horizon"
          fill
          className="object-cover object-top"
          priority
        />
        {/* Left shadow gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        {/* Bottom fade to background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-transparent to-transparent" />

        {/* NEXORA ORIGINAL Badge */}
        <div className="absolute top-7 left-8 flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
              <path d="M7 6L21 26H25L11 6H7Z" fill="url(#hero_grad)" />
              <path d="M7 26V6H11V26H7Z" fill="#8B5CF6" />
              <path d="M21 26V6H25V26H21Z" fill="#EC4899" />
              <defs>
                <linearGradient id="hero_grad" x1="16" y1="6" x2="16" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366F1" />
                  <stop offset="1" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-[12px] font-bold tracking-[0.2em] text-gray-300 uppercase">Nexora Original</span>
        </div>

        {/* Title and CTA */}
        <div className="absolute bottom-14 left-8 max-w-xl">
          <h1 className="text-[72px] font-black leading-[0.85] tracking-tight drop-shadow-2xl mb-1">BEYOND</h1>
          <h2 className="text-[30px] font-black tracking-[0.4em] text-gray-300 drop-shadow-lg mb-3">THE HORIZON</h2>
          <p className="text-[15px] text-gray-300/90 mb-6 max-w-md leading-relaxed">When your limits end, the real journey begins.</p>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-7 py-[11px] rounded-xl font-bold text-[14px] hover:scale-[1.03] transition-transform shadow-[0_4px_25px_rgba(168,85,247,0.4)]">
              <Play className="w-[18px] h-[18px] fill-white" />
              Watch Now
            </button>
            <button className="flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-md border border-white/[0.15] text-white px-7 py-[11px] rounded-xl font-bold text-[14px] hover:scale-[1.03] transition-all">
              <Plus className="w-[18px] h-[18px]" />
              Add to Watchlist
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-5 right-8 flex gap-1.5 items-center">
          <div className="w-6 h-[6px] rounded-full bg-purple-500"></div>
          <div className="w-[6px] h-[6px] rounded-full bg-white/25"></div>
          <div className="w-[6px] h-[6px] rounded-full bg-white/25"></div>
          <div className="w-[6px] h-[6px] rounded-full bg-white/25"></div>
          <div className="w-[6px] h-[6px] rounded-full bg-white/25"></div>
        </div>
      </div>

      {/* ══════════════ CATEGORY PILLS ══════════════ */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-8">
        {categories.map((cat, i) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(i)}
            className={`whitespace-nowrap px-5 py-[7px] rounded-full text-[13px] font-semibold transition-all border ${
              i === activeCategory
                ? 'bg-purple-500/20 border-purple-500/60 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:bg-white/[0.06] hover:text-gray-200 hover:border-white/[0.12]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ══════════════ TRENDING NOW ══════════════ */}
      <Section title="Trending Now">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-full flex flex-col gap-2.5">
                <div className="relative aspect-video rounded-xl bg-white/[0.04] animate-pulse overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                </div>
                <div className="h-3.5 bg-white/[0.06] rounded animate-pulse w-[80%]" />
                <div className="h-3 bg-white/[0.04] rounded animate-pulse w-[55%]" />
              </div>
            ))
          ) : (
            data.trending.map((item: any) => (
              <TrendingCard key={item.id} id={item.id} title={item.title} genre={item.genre} badge={item.badge} badgeColor={item.badgeColor} image={item.image} />
            ))
          )}
        </div>
      </Section>

      {/* ══════════════ CONTINUE WATCHING ══════════════ */}
      <Section title="Continue Watching">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full rounded-xl border border-white/[0.04] bg-[#14151D] overflow-hidden flex flex-col">
                <div className="aspect-video bg-white/[0.04] animate-pulse relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                </div>
                <div className="p-3 relative">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-800" />
                  <div className="h-3.5 bg-white/[0.06] rounded animate-pulse w-[60%]" />
                </div>
              </div>
            ))
          ) : (
            data.continueWatching.map((item: any) => (
              <ContinueCard key={item.id} id={item.id} title={item.title} time={item.time} progress={item.progress} image={item.image} />
            ))
          )}
        </div>
      </Section>

      {/* ══════════════ TOP CREATORS ══════════════ */}
      <Section title="Top Creators">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 items-center">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/[0.04] animate-pulse flex-shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                </div>
                <div className="flex flex-col gap-1.5 min-w-[100px]">
                  <div className="h-3.5 bg-white/[0.06] rounded animate-pulse w-full" />
                  <div className="h-3 bg-white/[0.04] rounded animate-pulse w-[70%]" />
                </div>
              </div>
            ))
          ) : (
            data.creators.map((item: any) => (
              <CreatorCard key={item.id} name={item.name} subs={item.subs} image={item.image} />
            ))
          )}
        </div>
      </Section>

    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUBCOMPONENTS
   ═══════════════════════════════════════════════════ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[17px] font-bold text-white">{title}</h2>
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

function TrendingCard({ id, title, genre, badge, badgeColor = 'bg-yellow-600', image }: { id: string | number; title: string; genre: string; badge: string; badgeColor?: string; image: string }) {
  return (
    <Link href={`/watch/${id}`}>
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="w-full flex flex-col gap-2 group cursor-pointer">
        <div className="relative aspect-video rounded-xl bg-[#14151D] border border-white/[0.04] overflow-hidden shadow-lg">
          {image && <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          {/* Badge */}
          <div className={`absolute top-2.5 right-2.5 ${badgeColor} text-white text-[9px] font-black px-1.5 py-[3px] rounded-[4px] uppercase leading-none tracking-wide`}>
            {badge}
          </div>
          {/* Hover play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 backdrop-blur-[2px]">
            <div className="w-11 h-11 rounded-full border-2 border-white/80 flex items-center justify-center bg-white/10 backdrop-blur-sm">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </div>
        </div>
        <div className="px-0.5">
          <h3 className="font-semibold text-[13px] text-gray-100 group-hover:text-purple-300 transition-colors truncate">{title}</h3>
          <p className="text-[11px] text-gray-500 font-medium">{genre}</p>
        </div>
      </motion.div>
    </Link>
  );
}

function ContinueCard({ id, title, time, progress, image }: { id: string | number; title: string; time: string; progress: number; image: string }) {
  return (
    <Link href={`/watch/${id}`}>
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="w-full relative rounded-xl border border-white/[0.06] overflow-hidden cursor-pointer group shadow-lg">
        <div className="aspect-video bg-[#14151D] relative">
          {image && <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </div>
          </div>
          {/* Time left badge */}
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-gray-200 font-medium">
            {time}
          </div>
        </div>
        {/* Progress + Title */}
        <div className="bg-[#14151D] px-3 py-2.5 relative">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-800">
            <div className="h-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)] transition-all" style={{ width: `${progress}%` }}></div>
          </div>
          <h3 className="font-semibold text-[13px] text-gray-100 truncate">{title}</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">{time}</p>
        </div>
      </motion.div>
    </Link>
  );
}

function CreatorCard({ name, subs, image }: { name: string; subs: string; image: string }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer group flex-shrink-0">
      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-[2px] group-hover:scale-105 transition-transform">
        <div className="w-full h-full rounded-full border-2 border-[#0A0B10] bg-[#14151D] relative overflow-hidden">
          {image ? (
            <Image src={image} alt={name} fill className="object-cover" sizes="56px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-lg font-bold text-white/40">{name.charAt(0)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col min-w-0">
        <h4 className="font-semibold text-[13px] text-gray-200 group-hover:text-purple-300 transition-colors truncate">{name}</h4>
        <p className="text-[11px] text-gray-500">{subs}</p>
      </div>
    </div>
  );
}

