import { drizzle } from 'drizzle-orm/mysql2';
import { storeItems } from './drizzle/schema.ts';

const db = drizzle(process.env.DATABASE_URL);

const packs = [
  {
    name: 'Starters Pack',
    category: 'packs',
    description: 'Perfect starting point with essential items, basic clothing, and foundational accessories',
    price: 300,
    thumbnailUrl: '/starter-pack.png',
    thumbnailKey: 'packs/starter-pack.png'
  },
  {
    name: 'Fantasy Pack',
    category: 'packs',
    description: 'Complete fantasy-themed bundle with magical items, mystical clothing, and enchanted accessories',
    price: 500,
    thumbnailUrl: '/fantasy-pack.png',
    thumbnailKey: 'packs/fantasy-pack.png'
  },
  {
    name: 'Sci-Fi Pack',
    category: 'packs',
    description: 'Futuristic collection featuring cybernetic enhancements, neon clothing, and high-tech gear',
    price: 500,
    thumbnailUrl: '/scifi-pack.png',
    thumbnailKey: 'packs/scifi-pack.png'
  },

];

console.log('Seeding pack items...');

for (const pack of packs) {
  await db.insert(storeItems).values(pack);
  console.log(`✓ Added ${pack.name}`);
}

console.log('Pack items seeded successfully!');
process.exit(0);
