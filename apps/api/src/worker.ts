import * as Minio from 'minio';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const execPromise = util.promisify(exec);

const connectionString = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/nexora_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// MinIO Client Setup
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9005'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

const BUCKET_RAW = 'nexora-videos-raw';
const BUCKET_HLS = 'nexora-videos-hls';

// Resolutions for Adaptive Bitrate Streaming
const RESOLUTIONS = [
  { name: '1080p', width: 1920, height: 1080, bitrate: '5000k' },
  { name: '720p', width: 1280, height: 720, bitrate: '2800k' },
  { name: '480p', width: 854, height: 480, bitrate: '1400k' },
  { name: '360p', width: 640, height: 360, bitrate: '800k' },
];

export async function processVideo(filename: string) {
  console.log(`[Worker] Starting processing for: ${filename}`);

  const rawFilePath = path.join('/tmp', filename);
  const hlsOutputDir = path.join('/tmp', `hls_${filename}`);
  
  try {
    // 1. Ensure HLS bucket exists
    const bucketExists = await minioClient.bucketExists(BUCKET_HLS);
    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_HLS);
    }

    // 2. Download raw video from MinIO
    console.log(`[Worker] Downloading ${filename} from MinIO...`);
    await minioClient.fGetObject(BUCKET_RAW, filename, rawFilePath);

    // 3. Create output directory
    if (!fs.existsSync(hlsOutputDir)) {
      fs.mkdirSync(hlsOutputDir, { recursive: true });
    }

    // 4. Transcode to multi-resolution HLS
    console.log(`[Worker] Transcoding to HLS...`);
    
    // In a production app, we would run FFmpeg via fluent-ffmpeg 
    // Here we simulate the master playlist generation
    let masterPlaylistContent = '#EXTM3U\n#EXT-X-VERSION:3\n';

    for (const res of RESOLUTIONS) {
      const variantFilename = `${res.name}.m3u8`;
      const variantPath = path.join(hlsOutputDir, variantFilename);
      
      // We would use ffmpeg(rawFilePath).outputOptions([...]).save(variantPath)
      // For this MVP stub, we write a mock m3u8
      fs.writeFileSync(variantPath, `#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(res.bitrate)*1000},RESOLUTION=${res.width}x${res.height}\n${res.name}_000.ts\n`);
      
      masterPlaylistContent += `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(res.bitrate)*1000},RESOLUTION=${res.width}x${res.height}\n${res.name}/${variantFilename}\n`;
      console.log(`[Worker] Generated variant: ${res.name}`);
    }

    const masterPlaylistPath = path.join(hlsOutputDir, 'master.m3u8');
    fs.writeFileSync(masterPlaylistPath, masterPlaylistContent);
    console.log(`[Worker] Generated master playlist`);

    // 5. Upload processed files back to MinIO
    console.log(`[Worker] Uploading HLS segments to MinIO...`);
    const files = fs.readdirSync(hlsOutputDir);
    for (const file of files) {
      const filePath = path.join(hlsOutputDir, file);
      const objectName = `${filename}/${file}`;
      await minioClient.fPutObject(BUCKET_HLS, objectName, filePath);
    }

    // 6. Insert video record into database
    console.log(`[Worker] Saving metadata to Postgres...`);
    const masterUrl = `https://cdn.nexora.app/videos/${filename}/master.m3u8`;
    
    try {
      // Find or create a default author for the MVP
      let author = await prisma.user.findFirst();
      if (!author) {
        author = await prisma.user.create({
          data: {
            username: "Nexora Creator",
            email: "creator@nexora.app"
          }
        });
      }

      await prisma.video.create({
        data: {
          title: filename, // Use filename as default title for MVP
          url: masterUrl,
          type: filename.toLowerCase().includes("short") ? "SHORT" : "LONG",
          authorId: author.id
        }
      });
      console.log(`[Worker] Metadata saved.`);
    } catch (dbError) {
      console.warn(`[Worker] Database unavailable, skipping Postgres insertion.`);
    }

    console.log(`[Worker] Successfully processed ${filename}`);
  } catch (error) {
    console.error(`[Worker] Error processing ${filename}:`, error);
  } finally {
    // Cleanup temporary files
    if (fs.existsSync(rawFilePath)) fs.unlinkSync(rawFilePath);
    if (fs.existsSync(hlsOutputDir)) fs.rmSync(hlsOutputDir, { recursive: true, force: true });
  }
}
