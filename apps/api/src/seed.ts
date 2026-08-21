import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://user:password@localhost:5433/nexora_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding SQLite database...");
  
  const user = await prisma.user.upsert({
    where: { email: 'mock1@nexora.app' },
    update: {},
    create: {
      username: 'mock_user1',
      email: 'mock1@nexora.app',
    },
  });

  const videos = [
    {
      title: 'Kalki 2898 AD (SQLite Seed)',
      url: 'https://cdn.nexora.app/shorts/1_master.m3u8',
      type: 'LONG',
      views: 100,
      authorId: user.id
    },
    {
      title: 'Short Video 1 (SQLite Seed)',
      url: 'https://cdn.nexora.app/shorts/2_master.m3u8',
      type: 'SHORT',
      views: 500,
      authorId: user.id
    }
  ];

  for (const video of videos) {
    await prisma.video.create({
      data: video
    });
  }
  
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
