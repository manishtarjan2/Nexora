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
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="min-w-[185px] w-[185px] flex flex-col gap-2.5">
              <div className="relative aspect-[3/4] rounded-xl bg-white/[0.04] animate-pulse overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
              <div className="h-3.5 bg-white/[0.06] rounded animate-pulse w-[80%]" />
              <div className="h-3 bg-white/[0.04] rounded animate-pulse w-[55%]" />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-gray-400 mt-10">No videos found matching your query.</div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {results.map((item) => (
            <Link key={item.id} href={`/watch/${item.id}`}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="min-w-[185px] w-[185px] flex flex-col gap-2 group cursor-pointer">
                <div className="relative aspect-[3/4] rounded-xl bg-[#14151D] border border-white/[0.04] overflow-hidden shadow-lg">
                  {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" sizes="185px" />}
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
                <div className="px-0.5">
                  <h3 className="font-semibold text-[13px] text-gray-100 group-hover:text-purple-300 transition-colors truncate">{item.title}</h3>
                  <p className="text-[11px] text-gray-500 font-medium">{item.genre}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
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
