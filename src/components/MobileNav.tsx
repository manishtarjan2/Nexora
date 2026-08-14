'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Plus, PlaySquare, Library } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', path: '/', icon: <Home className="w-6 h-6" /> },
    { label: 'Explore', path: '/explore', icon: <Compass className="w-6 h-6" /> },
    { label: 'Upload', path: '/upload', icon: <Plus className="w-6 h-6" />, isAction: true },
    { label: 'Shorts', path: '/shorts', icon: <PlaySquare className="w-6 h-6" /> },
    { label: 'Library', path: '/library', icon: <Library className="w-6 h-6" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0E0F15]/90 backdrop-blur-lg border-t border-white/[0.04] pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          if (item.isAction) {
            return (
              <Link key={item.path} href={item.path} className="flex flex-col items-center justify-center relative -top-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  {item.icon}
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className={isActive ? 'text-purple-400' : ''}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-purple-400' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
