import express from 'express';
import cors from 'cors';
import * as Minio from 'minio';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import ytSearch from 'yt-search';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/nexora_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Strict CORS
const allowedOrigins = ['http://localhost:3000', process.env.FRONTEND_URL || 'https://nexora-education-nine.vercel.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// MinIO Client Setup
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9005'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'Nexora API (Node.js)' });
});

// Reusable Fallback Data (prevents empty screens during YouTube rate limits)
const fallbackVideos = [
  { id: "RIBXvLvRAVE", title: "Kalki 2898 AD - Official Trailer", genre: "Movie • 2024", badge: "4K", badgeColor: "bg-yellow-600", image: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=720&q=80" },
  { id: "agMZc3TsOBM", title: "Latest Hit Song 2024 - Official Music Video", genre: "Music • 2024", badge: "NEW", badgeColor: "bg-red-600", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=720&q=80" },
  { id: "5PrUH-0opKk", title: "Money Heist: Berlin - Episode 1", genre: "Series • Netflix", badge: "HD", badgeColor: "bg-purple-600", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=720&q=80" },
  { id: "8jsqPKuTkrs", title: "Top 50 Pop Hits of the Week", genre: "Music Playlist", badge: "TRENDING", badgeColor: "bg-blue-600", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=720&q=80" },
  { id: "D1mZpTVIBGA", title: "The Dark Knight - 4K Remaster", genre: "Movie • Action", badge: "4K", badgeColor: "bg-yellow-600", image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=720&q=80" },
  { id: "BU6_n7y7AHg", title: "Relaxing Lofi Hip Hop Radio", genre: "Music • Live", badge: "LIVE", badgeColor: "bg-red-600", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=720&q=80" },
  { id: "k3AqQzW3cGI", title: "Top 10 Upcoming Movies 2025", genre: "Entertainment", badge: "HD", badgeColor: "bg-gray-600", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=720&q=80" },
  { id: "n_VrRuNkbrE", title: "Chill Vibes - Acoustic Covers", genre: "Music", badge: "HD", badgeColor: "bg-blue-600", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=720&q=80" },
  { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", genre: "Music • Classic", badge: "4K", badgeColor: "bg-yellow-600", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=720&q=80" },
  { id: "jNQXAC9IVRw", title: "Me at the zoo", genre: "Entertainment", badge: "HD", badgeColor: "bg-gray-600", image: "https://images.unsplash.com/photo-1580234797602-22c3734a625e?w=720&q=80" }
];

// Generate MinIO Presigned URL for direct client uploads
app.get('/api/videos/upload-url', async (req, res) => {
  try {
    const filename = req.query.filename as string;
    if (!filename) {
      return res.status(400).json({ error: 'filename query parameter is required' });
    }

    const bucketName = 'nexora-videos-raw';
    
    // Ensure bucket exists
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName);
    }

    // Generate presigned URL valid for 1 hour (3600 seconds)
    const presignedUrl = await minioClient.presignedPutObject(bucketName, filename, 3600);
    
    res.json({
      uploadUrl: presignedUrl,
      filename: filename
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
});

// Shorts Feed MVP
app.get('/api/feed/shorts', async (req, res) => {
  try {
    // 1. Try fetching from local database first
    const dbShorts = await prisma.video.findMany({
      where: { type: 'SHORT' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    });

    if (dbShorts.length > 0) {
      return res.json({
        data: dbShorts.map(s => ({
          id: s.id,
          title: s.title,
          url: s.url,
          author: s.author.username,
          likes: s.views, // Mocking likes as views
        })),
        next_cursor: "encoded_cursor_string_here",
      });
    }
  } catch (error) {
    console.warn("DB query for Shorts failed, falling back to YouTube", error);
  }

  // 2. Fall back to YouTube via yt-search
  try {
    const searchResults = await ytSearch('youtube shorts');
    const videos = searchResults.videos.slice(0, 5);

    const formattedShorts = videos.map((item, index) => ({
      id: item.videoId || `short_${index}`,
      title: item.title || 'YouTube Short',
      url: `https://www.youtube.com/embed/${item.videoId}`,
      author: item.author?.name || 'Unknown Creator',
      likes: item.views || Math.floor(Math.random() * 100000),
    }));

    if (formattedShorts.length > 0) {
      return res.json({
        data: formattedShorts,
        next_cursor: "encoded_cursor_string_here",
      });
    }
  } catch (error) {
    console.warn("ytSearch failed for Shorts, falling back to mock", error);
  }

  // Fallback Mock Data
  const mockShorts = [
    {
      id: "insta_1",
      title: "Instagram Reel",
      url: "/shorts/insta.mp4",
      author: "instagram_creator",
      likes: 45600,
    }
  ];
  for (let i = 1; i <= 4; i++) {
    mockShorts.push({
      id: i.toString(),
      title: `Short Video ${i} (Node.js MVP)`,
      url: `https://cdn.nexora.app/shorts/${i}_master.m3u8`,
      author: `creator_${i}`,
      likes: i * 1234,
    });
  }
  
  res.json({
    data: mockShorts,
    next_cursor: "encoded_cursor_string_here",
  });
});

// Simple in-memory cache for ultra-fast, reliable responses
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

async function getCachedOrFetch(key: string, fetchFn: () => Promise<any>): Promise<any> {
  const cached = cache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }
  
  try {
    const data = await fetchFn();
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    if (cached) {
      console.warn(`Fetch failed for ${key}, returning stale cache.`);
      return cached.data; // Serve stale cache if fetch fails (increases reliability)
    }
    throw error;
  }
}

// Recommendation Endpoint (Proxy to AI Service)
app.post('/api/videos/recommended', async (req, res) => {
  const { history = [], limit = 10 } = req.body;
  try {
    // Call the Python AI service
    const aiResponse = await fetch('http://localhost:8000/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_history_video_ids: history, limit })
    });
    
    if (!aiResponse.ok) throw new Error('AI Service failed');
    
    const aiData = await aiResponse.json();
    const rankedVideos = aiData.recommendations || [];
    
    // Fetch full video details from Postgres for the returned IDs
    const videoIds = rankedVideos.map((r: any) => r.video_id);
    
    let dbVideos: any[] = [];
    if (videoIds.length > 0) {
      dbVideos = await prisma.video.findMany({
        where: { id: { in: videoIds } },
        include: { author: true }
      });
    }
    
    // Format and preserve ranking order
    const formattedResults = [];
    for (const rank of rankedVideos) {
      const v = dbVideos.find(db => db.id === rank.video_id);
      if (v) {
        formattedResults.push({
          id: v.id,
          title: v.title,
          genre: v.author?.username || "Creator",
          badge: "RECOMMENDED",
          badgeColor: "bg-purple-600",
          image: v.thumbnailUrl || "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=600&q=80",
          aiScore: rank.score
        });
      }
    }
    
    // If we didn't get enough from the AI or DB, pad with fallbacks
    if (formattedResults.length < limit) {
      const remaining = limit - formattedResults.length;
      const fallbacks = fallbackVideos.slice(0, remaining).map(f => ({
         ...f, badge: "RECOMMENDED", badgeColor: "bg-purple-600"
      }));
      formattedResults.push(...fallbacks);
    }
    
    res.json({ data: formattedResults });
  } catch (error) {
    console.warn("Recommendation engine failed, returning fallback trending", error);
    // Fallback if Python service is down
    const fallbacks = fallbackVideos.slice(0, limit).map(f => ({
       ...f, badge: "TRENDING", badgeColor: "bg-blue-600"
    }));
    res.json({ data: fallbacks });
  }
});

// Home Page Premium Feed
app.get('/api/videos/home', async (req, res) => {
  try {
    const data = await getCachedOrFetch('home_feed', async () => {
      let trending: any[] = [];
      let dbTrending: any[] = [];
      
      try {
        dbTrending = await prisma.video.findMany({
          where: { type: 'LONG' },
          take: 6,
          orderBy: { views: 'desc' },
          include: { author: true }
        });
      } catch (err) {
        console.warn("DB query for Trending failed", err);
      }

      if (dbTrending.length >= 6) {
        trending = dbTrending.map((item) => ({
          id: item.id,
          title: item.title,
          genre: item.author.username || "Creator",
          badge: "LOCAL", 
          badgeColor: "bg-green-600", 
          image: item.thumbnailUrl || "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=600&q=80"
        }));
      } else {
        // Fall back to YouTube via yt-search
        const searchResults = await ytSearch('trending movies and series 2024');
        const videos = searchResults.videos.slice(0, 6);

        trending = videos.map((item) => ({
          id: item.videoId,
          title: item.title || "Trending Video",
          genre: item.author?.name || "Entertainment",
          badge: "YOUTUBE", 
          badgeColor: "bg-red-600", 
          image: item.thumbnail || "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=600&q=80"
        }));
      }

      const continueWatching = [
        { id: "RIBXvLvRAVE", title: "Interstellar", time: "2h 49m left", progress: 30, image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80" },
        { id: "5PrUH-0opKk", title: "Money Heist S1 E5", time: "24m left", progress: 75, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=600&q=80" },
        { id: "D1mZpTVIBGA", title: "The Dark Knight", time: "1h 32m left", progress: 45, image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&q=80" },
        { id: "dQw4w9WgXcQ", title: "Inception", time: "1h 14m left", progress: 60, image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&q=80" },
        { id: "jNQXAC9IVRw", title: "Game of Thrones S1 E3", time: "18m left", progress: 90, image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=600&q=80" }
      ];

      const creators = [
        { id: 201, name: "CarryMinati", subs: "32.4M Subscribers", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" },
        { id: 202, name: "Tech Burner", subs: "11.2M Subscribers", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80" },
        { id: 203, name: "BB Ki Vines", subs: "19M Subscribers", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&q=80" }
      ];

      return { trending, continueWatching, creators };
    });

    res.json({ data: data });
  } catch (error) {
    console.error("Home feed fetch failed:", error);
    // Comprehensive fallback data if YouTube blocks IP (302)
    const fallbackContinueWatching = [
      { id: "RIBXvLvRAVE", title: "Interstellar", time: "2h 49m left", progress: 30, image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=720&q=80" },
      { id: "5PrUH-0opKk", title: "Money Heist S1 E5", time: "24m left", progress: 75, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=720&q=80" },
      { id: "D1mZpTVIBGA", title: "The Dark Knight", time: "1h 32m left", progress: 45, image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=720&q=80" },
      { id: "dQw4w9WgXcQ", title: "Inception", time: "1h 14m left", progress: 60, image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=720&q=80" }
    ];

    const fallbackCreators = [
      { id: 201, name: "CarryMinati", subs: "32.4M Subscribers", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" },
      { id: 202, name: "Tech Burner", subs: "11.2M Subscribers", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80" },
      { id: 203, name: "BB Ki Vines", subs: "19M Subscribers", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&q=80" },
      { id: 204, name: "MrBeast", subs: "200M Subscribers", image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=200&q=80" },
      { id: 205, name: "T-Series", subs: "250M Subscribers", image: "https://images.unsplash.com/photo-1516280440502-a2a3e0b8a1c9?w=200&q=80" }
    ];

    res.json({
      data: {
        trending: fallbackVideos,
        continueWatching: fallbackContinueWatching, 
        creators: fallbackCreators
      }
    });
  }
});

// Search Endpoint
app.get('/api/videos/search', async (req, res) => {
  const query = req.query.q as string || '';
  if (!query) return res.json({ data: [] });

  let results: any[] = [];
  try {
    // 1. Try local DB
    const dbResults = await prisma.video.findMany({
      where: { title: { contains: query, mode: 'insensitive' } },
      take: 25,
      include: { author: true }
    });
    if (dbResults.length > 0) {
      results = dbResults.map(item => ({
        id: item.id,
        title: item.title,
        genre: item.author?.username || "Creator",
        badge: "LOCAL",
        badgeColor: "bg-green-600",
        image: item.thumbnailUrl || "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=600&q=80"
      }));
    }
  } catch (err) {
    console.warn("DB search failed", err);
  }

  // 2. Fallback to YouTube
  if (results.length === 0) {
    try {
      const searchResults = await ytSearch(query);
      results = searchResults.videos.slice(0, 25).map(item => ({
        id: item.videoId,
        title: item.title,
        genre: item.author?.name || "YouTube",
        badge: "YOUTUBE",
        badgeColor: "bg-red-600",
        image: item.thumbnail
      }));
    } catch (err) {
      console.warn("ytSearch failed for search endpoint, using fallback data", err);
      // Precise code: DRY fallback data to prevent empty states
      results = fallbackVideos.filter(v => 
        v.title.toLowerCase().includes(query.toLowerCase()) || 
        v.genre.toLowerCase().includes(query.toLowerCase())
      );
      if (results.length === 0) results = fallbackVideos; // Give them something if no exact match
    }
  }

  res.json({ data: results });
});

// Related Videos Endpoint
app.get('/api/videos/:id/related', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getCachedOrFetch(`related_${id}`, async () => {
      let results: any[] = [];
      // If local DB ID
      if (id.length > 20 && id.includes('-')) {
        const dbResults = await prisma.video.findMany({
          where: { type: 'LONG', NOT: { id } },
          take: 12,
          orderBy: { views: 'desc' },
          include: { author: true }
        });
        results = dbResults.map((item) => ({
          id: item.id,
          title: item.title,
          genre: item.author?.username || "Creator",
          badge: "LOCAL", 
          badgeColor: "bg-green-600", 
          image: item.thumbnailUrl || "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=600&q=80"
        }));
      }
      
      // Fallback to youtube for YouTube IDs
      if (results.length === 0) {
        let searchQuery = 'trending movies 2024';
        try {
           const ytVideo = await ytSearch({ videoId: id });
           if (ytVideo && ytVideo.title) {
              searchQuery = ytVideo.title.split(' ').slice(0, 3).join(' '); // Use first 3 words of video title for related
           }
        } catch(e) {}
        
        const searchResults = await ytSearch(searchQuery);
        // exclude the current video if it appears in search
        results = searchResults.videos.filter(v => v.videoId !== id).slice(0, 12).map((item) => ({
          id: item.videoId,
          title: item.title,
          genre: item.author?.name || "YouTube",
          badge: "YOUTUBE", 
          badgeColor: "bg-red-600", 
          image: item.thumbnail || "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=600&q=80"
        }));
      }
      return results;
    });
    res.json({ data });
  } catch (err) {
    console.warn("Related videos fetch failed, returning fallback data");
    res.json({ data: fallbackVideos.filter(v => v.id !== id).slice(0, 12) });
  }
});

// Video Details Endpoint
app.get('/api/videos/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if it's a UUID (local DB)
    if (id.length > 20 && id.includes('-')) {
      const dbVideo = await prisma.video.findUnique({
        where: { id },
        include: { author: true }
      });
      if (dbVideo) {
        return res.json({
          data: {
            id: dbVideo.id,
            title: dbVideo.title,
            description: dbVideo.description || "No description provided.",
            url: dbVideo.url, // URL could be minio, local, etc
            author: dbVideo.author.username,
            views: dbVideo.views,
            isLocal: true,
            createdAt: dbVideo.createdAt
          }
        });
      }
    }
  } catch (err) {
    console.warn("DB fetch failed for id", id, err);
  }

  // Fallback to YouTube if not local or not found
  try {
    const ytVideo = await ytSearch({ videoId: id });
    if (ytVideo) {
      return res.json({
        data: {
          id: ytVideo.videoId,
          title: ytVideo.title,
          description: ytVideo.description,
          url: `https://www.youtube.com/embed/${ytVideo.videoId}?autoplay=1`,
          author: ytVideo.author?.name,
          views: ytVideo.views,
          isLocal: false,
          createdAt: ytVideo.uploadDate || new Date()
        }
      });
    }
  } catch (err) {
    console.warn("ytSearch fallback failed for id", id, err);
  }

  // If we reach here and the ID looks like a YouTube ID (length ~11), provide a hardcoded fallback
  // so the player iframe can still load in the browser even if the Node server can't scrape YouTube metadata.
  if (id.length === 11) {
    return res.json({
      data: {
        id: id,
        title: "YouTube Video",
        description: "Metadata could not be fetched, but you can still watch the video.",
        url: `https://www.youtube.com/embed/${id}?autoplay=1`,
        author: "YouTube Creator",
        views: 1000000,
        isLocal: false,
        createdAt: new Date()
      }
    });
  }

  res.status(404).json({ error: "Video not found" });
});

// Start the server
const PORT = parseInt(process.env.PORT || '8080', 10);
app.listen(PORT, () => {
  console.log(`🚀 Nexora API Gateway running on port ${PORT}`);
});
