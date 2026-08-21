/* eslint-disable */
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${API_URL}/api/videos/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const json = await response.json();
          setResults(json.data || []);
        }
      } catch (err) {
        console.error('Failed to search videos:', err);
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="w-full text-white px-6 pt-4 pb-10">
      <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>
      
      {loading ? (
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="min-w-[280px] w-[280px] sm:w-[320px] sm:min-w-[320px] flex flex-col gap-3">
              <div className="relative aspect-video rounded-xl bg-white/[0.04] animate-pulse overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
              <div className="px-1 flex flex-col gap-2">
                <div className="h-4 bg-white/[0.06] rounded animate-pulse w-[90%]" />
                <div className="h-3 bg-white/[0.04] rounded animate-pulse w-[60%]" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-gray-400 mt-10">No videos found matching your query.</div>
      ) : (
        <motion.div 
          className="flex flex-wrap gap-4"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {results.map((item) => (
            <Link key={item.id} href={`/watch/${item.id}`}>
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
                }}
                whileHover={{ y: -4 }} 
                transition={{ duration: 0.2 }} 
                className={`flex flex-col gap-2 group cursor-pointer ${item.badge === 'YOUTUBE' ? 'min-w-[280px] w-[280px] sm:w-[320px] sm:min-w-[320px]' : 'min-w-[185px] w-[185px]'}`}
              >
                <div className={`relative ${item.badge === 'YOUTUBE' ? 'aspect-video' : 'aspect-[3/4]'} rounded-xl bg-[#14151D] border border-white/[0.04] overflow-hidden shadow-lg`}>
                  {item.image && <Image src={item.image.replace('w=600', 'w=720')} alt={item.title} fill className="object-cover" sizes={item.badge === 'YOUTUBE' ? '320px' : '185px'} />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className={`absolute top-2.5 right-2.5 ${item.badgeColor || 'bg-blue-600'} text-white text-[9px] font-black px-1.5 py-[3px] rounded-[4px] uppercase leading-none tracking-wide`}>
                    {item.badge}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 backdrop-blur-[2px]">
                    <div className="w-11 h-11 rounded-full border-2 border-white/80 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="px-0.5 mt-1">
                  <h3 className={`font-semibold text-gray-100 group-hover:text-purple-300 transition-colors ${item.badge === 'YOUTUBE' ? 'text-[15px] line-clamp-2 leading-snug' : 'text-[13px] truncate'}`}>{item.title}</h3>
                  <p className="text-[12px] text-gray-400 font-medium mt-0.5">{item.genre}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}

