'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export interface VideoMeta {
  id: string;
  title: string;
  author: string;
  url: string;
  isLocal: boolean;
  views?: number;
}

interface PlayerContextType {
  activeVideo: VideoMeta | null;
  setActiveVideo: (video: VideoMeta | null) => void;
  isMinimized: boolean;
  setMinimized: (val: boolean) => void;
  closePlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [activeVideo, setActiveVideo] = useState<VideoMeta | null>(null);
  const [isMinimized, setMinimized] = useState(false);
  const pathname = usePathname();

  // Automatically minimize the player if the user navigates away from the watch page
  useEffect(() => {
    if (activeVideo) {
      if (!pathname.startsWith(`/watch/`)) {
        setMinimized(true);
      } else {
        setMinimized(false);
      }
    }
  }, [pathname, activeVideo]);

  const closePlayer = () => {
    setActiveVideo(null);
    setMinimized(false);
  };

  return (
    <PlayerContext.Provider value={{ activeVideo, setActiveVideo, isMinimized, setMinimized, closePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
