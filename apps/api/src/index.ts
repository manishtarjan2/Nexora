import express from 'express';
import cors from 'cors';
import * as Minio from 'minio';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/nexora_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(cors());
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
    const shorts = await prisma.video.findMany({
      where: { type: 'SHORT' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    });

    if (shorts.length > 0) {
      return res.json({
        data: shorts.map(s => ({
          id: s.id,
          title: s.title,
          url: s.url,
          author: s.author.username,
          likes: s.views, // Mocking likes as views for now
        })),
        next_cursor: "encoded_cursor_string_here",
      });
    }
  } catch (error) {
    console.warn("DB connection failed or empty, falling back to mock Shorts");
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

// Home Page Premium Feed
app.get('/api/videos/home', async (req, res) => {
  // We'll return structured data for the premium UI
  const trending = [
    { id: 1, title: "Kalki 2898 AD", genre: "Sci-Fi • 2024", badge: "4K", badgeColor: "bg-yellow-600", image: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=600&q=80" },
    { id: 2, title: "Mirzapur S3", genre: "Crime • Thriller", badge: "NEW EPISODES", badgeColor: "bg-red-600", image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=600&q=80" },
    { id: 3, title: "A Dead Silence", genre: "Horror • 2024", badge: "4K", badgeColor: "bg-yellow-600", image: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=600&q=80" },
    { id: 4, title: "The Last Orbit", genre: "Sci-Fi • 2024", badge: "NEW", badgeColor: "bg-pink-600", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80" },
    { id: 5, title: "Colors of India", genre: "Documentary", badge: "4K", badgeColor: "bg-yellow-600", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80" },
    { id: 6, title: "Chasing Dreams", genre: "Drama • 2024", badge: "NEW EPISODES", badgeColor: "bg-red-600", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80" }
  ];

  const continueWatching = [
    { id: 101, title: "Interstellar", time: "2h 49m left", progress: 30, image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80" },
    { id: 102, title: "Money Heist S1 E5", time: "24m left", progress: 75, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=600&q=80" },
    { id: 103, title: "The Dark Knight", time: "1h 32m left", progress: 45, image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&q=80" },
    { id: 104, title: "Inception", time: "1h 14m left", progress: 60, image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&q=80" },
    { id: 105, title: "Game of Thrones S1 E3", time: "18m left", progress: 90, image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=600&q=80" }
  ];

  const creators = [
    { id: 201, name: "CarryMinati", subs: "32.4M Subscribers", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" },
    { id: 202, name: "Tech Burner", subs: "11.2M Subscribers", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80" },
    { id: 203, name: "BB Ki Vines", subs: "19M Subscribers", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&q=80" },
    { id: 204, name: "Sandeep Maheshwari", subs: "27.6M Subscribers", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
    { id: 205, name: "Flying Beast", subs: "7.8M Subscribers", image: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=200&q=80" },
    { id: 206, name: "Mumbiker Nikhil", subs: "4.1M Subscribers", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" }
  ];

  // In a real app, this would be fetched from Postgres, e.g.:
  // const trendingVideos = await prisma.video.findMany({ ... })

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  res.json({
    data: {
      trending,
      continueWatching,
      creators
    }
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Nexora API Gateway running on port ${PORT}`);
});
